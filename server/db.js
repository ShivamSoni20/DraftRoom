import { createClient } from '@libsql/client';
import { mkdirSync } from 'node:fs';
export const users = [
 {id:'alice',name:'Alice Chen',email:'alice@draftroom.demo',initials:'AC',color:'green'},
 {id:'bob',name:'Bob Williams',email:'bob@draftroom.demo',initials:'BW',color:'blue'},
 {id:'charlie',name:'Charlie Davis',email:'charlie@draftroom.demo',initials:'CD',color:'pink'}
];
export function database(url) {
 if (!url && !process.env.TURSO_DATABASE_URL) {
  if(process.env.VERCEL) throw new Error('Configure TURSO_DATABASE_URL and TURSO_AUTH_TOKEN before deploying.');
  mkdirSync('data',{recursive:true});
 }
 return createClient({url:url || process.env.TURSO_DATABASE_URL || 'file:data/draftroom.db',authToken:process.env.TURSO_AUTH_TOKEN});
}
export async function initialize(db) {
 await db.batch([
  'CREATE TABLE IF NOT EXISTS documents (id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, title TEXT NOT NULL, content TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)',
  'CREATE TABLE IF NOT EXISTS shares (document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE, user_id TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN (\'viewer\',\'editor\')), PRIMARY KEY(document_id,user_id))',
  'CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL)'
 ],'write');
 const now=new Date().toISOString();
 await db.batch([
  {sql:"INSERT OR IGNORE INTO documents (id,owner_id,title,content,created_at,updated_at) SELECT 'welcome','alice','A little room for big ideas',?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM metadata WHERE key='seeded')",args:['<h1>A little room for big ideas</h1><p>Welcome to <strong>Draftroom</strong>. A calm, shared space to turn a first thought into something worth sharing.</p><h2>Make yourself at home</h2><ul><li>Give this document a new title.</li><li>Try a heading, a list, or a little emphasis.</li><li>Share your draft with a teammate.</li></ul><p>Good work starts with a first draft.</p>',now,now]},
  {sql:"INSERT OR IGNORE INTO documents (id,owner_id,title,content,created_at,updated_at) SELECT 'brief','bob','The next chapter — project brief',?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM metadata WHERE key='seeded')",args:['<h1>The next chapter</h1><p>A shared brief for a more thoughtful team workspace.</p><h2>Our goal</h2><p>Make it easier to move from scattered thoughts to shared understanding.</p><ol><li>Start with the essential workflow.</li><li>Make saving dependable.</li><li>Keep sharing simple and intentional.</li></ol>',now,now]},
  {sql:"INSERT OR IGNORE INTO shares SELECT 'brief','alice','editor' WHERE NOT EXISTS (SELECT 1 FROM metadata WHERE key='seeded')",args:[]},
  "INSERT OR IGNORE INTO metadata VALUES ('seeded','1')"
 ],'write');
}
