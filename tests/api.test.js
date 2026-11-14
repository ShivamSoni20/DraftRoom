import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import {createClient} from '@libsql/client';
import {createApp} from '../server/app.js';
import {mkdtemp,rm,rmdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const db=createClient({url:'file::memory:'});
const app=createApp(db);
const as=(method,url,user='alice')=>request(app)[method]('/api'+url).set('x-demo-user',user);
let id;
before(async()=>{const r=await as('post','/documents').send({title:'Test document'});assert.equal(r.status,201);id=r.body.id;});
after(()=>db.close());
test('unauthenticated requests are rejected',async()=>{assert.equal((await request(app).get('/api/documents')).status,401);});
test('unshared users cannot read, modify, share, or delete a document',async()=>{for(const [method,suffix] of [['get',''],['patch',''],['put','/shares'],['delete','']])assert.equal((await as(method,'/documents/'+id+suffix,'charlie').send({})).status,404);});
test('owner can grant viewer access; viewer cannot edit, share, or delete',async()=>{
 assert.equal((await as('put','/documents/'+id+'/shares').send({userId:'bob',role:'viewer'})).status,200);
 const d=await as('get','/documents/'+id,'bob');assert.equal(d.status,200);assert.equal(d.body.role,'viewer');
 assert.equal((await as('patch','/documents/'+id,'bob').send({title:'Hijack',content:'<p>x</p>',revision:1})).status,403);
 assert.equal((await as('put','/documents/'+id+'/shares','bob').send({userId:'charlie',role:'editor'})).status,403);
 assert.equal((await as('delete','/documents/'+id,'bob')).status,403);
});
test('editor can save rich text; stale writes are rejected and revocation takes effect',async()=>{
 await as('put','/documents/'+id+'/shares').send({userId:'bob',role:'editor'});
 const d=(await as('get','/documents/'+id,'bob')).body;
 const content='<h1>Heading</h1><p><strong>Bold</strong> <em>Italic</em> <u>Underline</u></p><ul><li>Item</li></ul>';
 const saved=await as('patch','/documents/'+id,'bob').send({title:'Edited title',content,revision:d.revision});assert.equal(saved.status,200);assert.equal(saved.body.content,content);
 assert.equal((await as('get','/documents/'+id)).body.content,content);
 assert.equal((await as('patch','/documents/'+id).send({title:'Stale',content:'',revision:d.revision})).status,409);
 assert.equal((await as('get','/documents/'+id)).body.title,'Edited title');
 await as('delete','/documents/'+id+'/shares/bob');assert.equal((await as('get','/documents/'+id,'bob')).status,404);
});
test('import validates extension, size, empty/binary content, and strips executable markup',async()=>{
 for(const payload of [{filename:'x.exe',text:'bad'},{filename:'x.txt',text:''},{filename:'x.txt',text:'a'.repeat(102401)},{filename:'x.txt',text:'a\u0000b'}])assert.equal((await as('post','/import').send(payload)).status,400);
 const r=await as('post','/import').send({filename:'Imported.md',text:'# Welcome\n\n**Works**\n<script>alert(1)</script>\n<img src=x onerror=alert(1)>'});assert.equal(r.status,201);
 const d=(await as('get','/documents/'+r.body.id)).body;assert.match(d.content,/<h1>Welcome<\/h1>/);assert.match(d.content,/<strong>Works<\/strong>/);assert.doesNotMatch(d.content,/script|onerror|<img/);
 const txt=await as('post','/import').send({filename:'Plain.txt',text:'<b>literal</b>\nnext line'});const plain=(await as('get','/documents/'+txt.body.id)).body;assert.match(plain.content,/&lt;b&gt;literal&lt;\/b&gt;/);
});
test('title and share validation',async()=>{
 assert.equal((await as('patch','/documents/'+id).send({title:' ',content:'',revision:2})).status,400);
 assert.equal((await as('put','/documents/'+id+'/shares').send({userId:'alice',role:'editor'})).status,400);
 assert.equal((await as('put','/documents/'+id+'/shares').send({userId:'bob',role:'admin'})).status,400);
});
test('database data persists across independent application instances',async()=>{const another=createApp(db);const r=await request(another).get('/api/documents/'+id).set('x-demo-user','alice');assert.equal(r.status,200);assert.equal(r.body.title,'Edited title');});
test('documents and shares survive closing and reopening the database file',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'draftroom-test-'));const path=join(dir,'persist.db');let connection=createClient({url:'file:'+path.replaceAll('\\','/')});
 try{
  let application=createApp(connection);let r=await request(application).post('/api/documents').set('x-demo-user','alice').send({title:'Persistent draft'});const key=r.body.id;assert.equal(r.status,201);
  await request(application).put('/api/documents/'+key+'/shares').set('x-demo-user','alice').send({userId:'charlie',role:'viewer'});
  connection.close();connection=createClient({url:'file:'+path.replaceAll('\\','/')});application=createApp(connection);
  r=await request(application).get('/api/documents/'+key).set('x-demo-user','charlie');assert.equal(r.status,200);assert.equal(r.body.title,'Persistent draft');assert.equal(r.body.role,'viewer');
 }finally{
  connection.close();
  // Windows may retain native SQLite file handles until process exit.
  for(const suffix of ['', '-wal','-shm'])await rm(path+suffix,{force:true}).catch(e=>{if(!['EBUSY','EPERM'].includes(e.code))throw e;});
  await rmdir(dir).catch(e=>{if(!['ENOTEMPTY','EBUSY','EPERM'].includes(e.code))throw e;});
 }
});
