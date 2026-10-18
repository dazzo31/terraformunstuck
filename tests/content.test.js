import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {lessons,recipes,workflows,commands,sources} from '../dist/assets/js/content.js';
import {rules} from '../dist/assets/js/analyser.js';
import {getScenario,scenarios} from '../dist/assets/js/model.js';
test('content has unique stable IDs and complete recipe safety fields',()=>{
 for(const collection of [lessons,recipes,workflows]){
  assert.equal(new Set(collection.map(x=>x.id)).size,collection.length);
  for(const x of collection){assert.match(x.id,/^[a-z0-9-]+$/);assert.ok(x.title&&x.summary&&x.reviewed);assert.ok(sources[x.source]);}
 }
 for(const r of recipes){for(const key of ['symptom','meaning','verify','stop','version'])assert.ok(r[key]?.length>15,`${r.id}: ${key}`);assert.ok(r.checks.length>=3);assert.ok(r.resolution.length>=2);}
});
test('every diagnostic targets an existing recipe',()=>{for(const r of rules)assert.ok(recipes.some(x=>x.id===r.id),r.id);});
test('lesson cross-links resolve to implemented workflows or recipes',()=>{for(const l of lessons.filter(x=>x.link)){const [type,id]=l.link.split('/');assert.ok((type==='workflow'?workflows:recipes).some(x=>x.id===id),l.link);}});
test('source references only use authoritative Terraform documentation',()=>{for(const u of Object.values(sources))assert.equal(new URL(u).hostname,'developer.hashicorp.com');for(const c of commands)assert.ok(sources[c.source]);});
test('simulator distinguishes edits, drift and broken address continuity',()=>{assert.match(getScenario('edit').summary,/1 to change/);assert.match(getScenario('drift').actual,/manual/);assert.match(getScenario('rename').summary,/1 to destroy/);assert.equal(getScenario('missing'),scenarios.aligned);});
test('static page loads only local assets',async()=>{const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');for(const [,url] of html.matchAll(/<(?:link|script|img|source)\b[^>]*(?:src|href)="([^"]+)"/g)){if(url.startsWith('#'))continue;assert.ok(!/^(?:https?:)?\/\//.test(url));await stat(new URL('../dist/'+url,import.meta.url));}for(const [,url] of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)){if(url.startsWith('#')||/^(?:https?:)?\/\//.test(url))continue;await stat(new URL('../dist/'+url,import.meta.url));}assert.match(html,/lang="en"/);assert.match(html,/id="main"/);assert.match(html,/Skip to content/);});
test('runtime modules contain no network calls or raw-input storage',async()=>{
 const dir=new URL('../dist/assets/js/',import.meta.url);
 async function files(url){const result=[];for(const ent of await readdir(url,{withFileTypes:true})){const u=new URL(ent.name+(ent.isDirectory()?'/':''),url);if(ent.isDirectory())result.push(...await files(u));else if(ent.name.endsWith('.js'))result.push(u);}return result;}
 for(const url of await files(dir)){const text=await readFile(url,'utf8');assert.doesNotMatch(text,/\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon)\s*\(/);assert.doesNotMatch(text,/writePref\([^\n]*(?:draft|evidence|query)/);}
 const app=await readFile(new URL('app.js',dir),'utf8');assert.match(app,/url\.search=''/);
});
test('CSS does not fetch external fonts or services',async()=>{const dir=new URL('../dist/assets/css/',import.meta.url);for(const f of await readdir(dir)){const text=await readFile(new URL(f,dir),'utf8');assert.doesNotMatch(text,/(?:https?:)?\/\//);}});
test('practice and prerequisite links resolve to canonical workflows',()=>{for(const r of recipes.filter(x=>x.workflow))assert.ok(workflows.some(w=>w.id===r.workflow),r.id);for(const w of workflows.filter(x=>x.prerequisite))assert.ok(workflows.some(p=>p.id===w.prerequisite&&p.id!==w.id),w.id);});
