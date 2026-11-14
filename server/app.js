import express from 'express';
import sanitize from 'sanitize-html';
import { marked } from 'marked';
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { database, initialize, users } from './db.js';

const clean=html=>sanitize(html,{allowedTags:['p','br','strong','em','u','s','h1','h2','h3','ul','ol','li','blockquote','pre','code','hr'],allowedAttributes:{}});
class HttpError extends Error { constructor(status,message){super(message);this.status=status;} }
const fail=(status,message)=>{throw new HttpError(status,message);};
export function createApp(db) {
 const app=express(); let ready;
 app.disable('x-powered-by');
 app.use((req,res,next)=>{res.set({'X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin','Cache-Control':'no-store'});next();});
 app.use(express.json({limit:'2mb'}));
 app.use('/api',async(req,res,next)=>{try {ready ||= initialize(db).catch(e=>{ready=null;throw e;});await ready;next();}catch(e){next(e);}});
 app.get('/api/users',(req,res)=>res.json(users));
 app.use('/api',(req,res,next)=>{req.user=users.find(u=>u.id===req.headers['x-demo-user']);if(!req.user)return res.status(401).json({error:'Select a demo account to continue.'});next();});
 const query=async(sql,args=[])=>db.execute({sql,args});
 async function access(req,action='read') {
  const doc=(await query('SELECT d.*,s.role AS shared_role FROM documents d LEFT JOIN shares s ON s.document_id=d.id AND s.user_id=? WHERE d.id=?',[req.user.id,req.params.id])).rows[0];
  if(!doc || (doc.owner_id!==req.user.id&&!doc.shared_role)) fail(404,'Document not found or access was removed.');
  doc.role=doc.owner_id===req.user.id?'owner':doc.shared_role;
  if(action==='owner'&&doc.role!=='owner') fail(403,'Only the owner can manage this document.');
  if(action==='edit'&&doc.role==='viewer') fail(403,'You have view-only access to this document.');
  return doc;
 }
 const present=d=>({...d,revision:Number(d.revision),owner:users.find(u=>u.id===d.owner_id)});
 app.get('/api/documents',async(req,res)=>{
  const {rows}=await query('SELECT d.*,CASE WHEN d.owner_id=? THEN \'owner\' ELSE s.role END AS role FROM documents d LEFT JOIN shares s ON s.document_id=d.id AND s.user_id=? WHERE d.owner_id=? OR s.user_id=? ORDER BY d.updated_at DESC',[req.user.id,req.user.id,req.user.id,req.user.id]);
  res.json(rows.map(d=>{const p=present(d);delete p.content;return p;}));
 });
 function title(value) {if(typeof value!=='string'||!value.trim()||value.trim().length>120)fail(400,'Use a title between 1 and 120 characters.');return value.trim();}
 async function insert(owner,name,content='') {const id=randomUUID(),now=new Date().toISOString();await query('INSERT INTO documents (id,owner_id,title,content,created_at,updated_at) VALUES (?,?,?,?,?,?)',[id,owner,title(name),clean(content),now,now]);return {id};}
 app.post('/api/documents',async(req,res)=>res.status(201).json(await insert(req.user.id,req.body.title||'Untitled document')));
 app.post('/api/import',async(req,res)=>{
  const {filename,text}=req.body;
  if(typeof filename!=='string'||! /\.(txt|md)$/i.test(filename))fail(400,'Choose a .txt or .md file.');
  if(typeof text!=='string'||Buffer.byteLength(text,'utf8')>102400)fail(400,'Files must be text and no larger than 100 KB.');
  if(!text.trim()||text.includes('\u0000'))fail(400,'Choose a non-empty UTF-8 text file.');
  const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  const content=/\.md$/i.test(filename)?marked.parse(text):text.split(/\r?\n/).map(s=>`<p>${escape(s)||'<br>'}</p>`).join('');
  res.status(201).json(await insert(req.user.id,filename.replace(/\.(txt|md)$/i,'').slice(0,120),content));
 });
 app.get('/api/documents/:id',async(req,res)=>res.json(present(await access(req))));
 app.patch('/api/documents/:id',async(req,res)=>{
  const d=await access(req,'edit');const {revision,content}=req.body;
  if(!Number.isInteger(revision))fail(400,'A document revision is required.');
  if(typeof content!=='string'||Buffer.byteLength(content)>500000)fail(400,'Document content must be under 500 KB.');
  const result=await query('UPDATE documents SET title=?,content=?,revision=revision+1,updated_at=? WHERE id=? AND revision=?',[title(req.body.title),clean(content),new Date().toISOString(),d.id,revision]);
  if(!result.rowsAffected)fail(409,'This document changed in another window. Copy your unsaved text, then reload the latest version.');
  res.json(present(await access(req)));
 });
 app.get('/api/documents/:id/shares',async(req,res)=>{await access(req);const {rows}=await query('SELECT user_id,role FROM shares WHERE document_id=?',[req.params.id]);res.json(rows.map(s=>({...s,user:users.find(u=>u.id===s.user_id)})));});
 app.put('/api/documents/:id/shares',async(req,res)=>{
  const d=await access(req,'owner');const {userId,role}=req.body;
  if(!users.some(u=>u.id===userId)||userId===d.owner_id)fail(400,'Choose a teammate other than the owner.');
  if(!['viewer','editor'].includes(role))fail(400,'Choose viewer or editor access.');
  await query('INSERT INTO shares VALUES (?,?,?) ON CONFLICT(document_id,user_id) DO UPDATE SET role=excluded.role',[d.id,userId,role]);res.json({ok:true});
 });
 app.delete('/api/documents/:id/shares/:userId',async(req,res)=>{await access(req,'owner');await query('DELETE FROM shares WHERE document_id=? AND user_id=?',[req.params.id,req.params.userId]);res.json({ok:true});});
 app.delete('/api/documents/:id',async(req,res)=>{await access(req,'owner');await db.batch([{sql:'DELETE FROM shares WHERE document_id=?',args:[req.params.id]},{sql:'DELETE FROM documents WHERE id=?',args:[req.params.id]}],'write');res.json({ok:true});});
 app.use('/api',(req,res)=>res.status(404).json({error:'API route not found.'}));
 app.use(express.static(resolve('dist')));
 app.get('/{*path}',(req,res)=>res.sendFile(resolve('dist/index.html')));
 app.use((err,req,res,next)=>{if(!err.status)console.error(err.message);res.status(err.status||500).json({error:err.status?err.message:'The server could not complete this request. Please try again.'});});
 return app;
}
let instance;
export default function handler(req,res){try {instance ||= createApp(database());return instance(req,res);}catch(e){console.error(e.message);res.status(503).json({error:'Database is not configured. See the deployment instructions.'});}}
