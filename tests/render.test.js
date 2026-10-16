// DOM-free rendering checks. These do not substitute for browser/layout QA.
import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons,recipes,workflows} from '../dist/assets/js/content.js';
const nodes=new Map();
function node(key){if(!nodes.has(key))nodes.set(key,{innerHTML:'',textContent:'',value:'',dataset:{},attributes:{},classList:{toggle(){},add(){},remove(){}},setAttribute(k,v){this.attributes[k]=v;},removeAttribute(k){delete this.attributes[k];},addEventListener(){},focus(){},replaceChildren(){this.innerHTML='';},append(){},showModal(){this.open=true;},close(){this.open=false;}});return nodes.get(key);}
const nav=['home','learn','fix','workflows','reference'].map(id=>Object.assign(node('nav-'+id),{dataset:{nav:id}}));
const listeners={};
globalThis.document={documentElement:{dataset:{}},querySelector:node,querySelectorAll:selector=>selector==='[data-nav]'?nav:[],addEventListener(type,fn){listeners[type]=fn;},createElement:tag=>node('created-'+tag)};
globalThis.location={hash:'#home',href:'https://example.test/'};
globalThis.localStorage={getItem(){return null;},setItem(){},removeItem(){}};
globalThis.window={scrollTo(){},addEventListener(type,fn){listeners['window-'+type]=fn;}};
const {escapeHTML}=await import('../dist/assets/js/app.js');
function render(route){location.hash='#'+route;listeners['window-hashchange']();return node('#main').innerHTML;}
const routes=['home','learn','fix','workflows','reference','about',...lessons.map(x=>'lesson/'+x.id),...recipes.map(x=>'recipe/'+x.id),...workflows.map(x=>'workflow/'+x.id)];
test('all implemented routes render a single meaningful page heading',()=>{for(const route of routes){const html=render(route);assert.equal((html.match(/<h1>/g)||[]).length,1,route);assert.doesNotMatch(html,/>undefined<|Topic not found/,route);assert.ok(html.length>1000,route);}});
test('all rendered internal topic links resolve to known routes',()=>{for(const route of routes){for(const [,target] of render(route).matchAll(/href="#([^"]+)"/g))assert.ok(routes.includes(target),`${route} -> ${target}`);}});
test('unknown and malformed routes render a useful fallback',()=>{for(const route of ['lesson/missing','recipe/missing','workflow/missing','learn/not-a-page','%ZZ'])assert.match(render(route),/Let’s get you back on track/);});
test('unsafe text is escaped at the rendering boundary',()=>{assert.equal(escapeHTML('<img src=x onerror="alert(1)">&\''),'&lt;img src=x onerror=&quot;alert(1)&quot;&gt;&amp;&#39;');});
test('Escape explicitly closes search before the native search-input default',()=>{const dialog=node('#search-dialog');dialog.open=true;let prevented=false;listeners.keydown({key:'Escape',target:{tagName:'INPUT'},preventDefault(){prevented=true;}});assert.equal(dialog.open,false);assert.ok(prevented);});
test('a pasted marker survives internal navigation only in memory and stays escaped',()=>{
 render('fix');const marker='<script>private-marker-123</script>';
 listeners.input({target:{id:'error-input',value:marker}});
 render('learn');const html=render('fix');assert.match(html,/&lt;script&gt;private-marker-123&lt;\/script&gt;/);assert.doesNotMatch(html,/<script>private-marker/);
 const hrefs=[...html.matchAll(/href="([^"]+)"/g)].map(x=>x[1]);assert.ok(hrefs.every(x=>!x.includes('private-marker')));
});
test('each recipe visibly presents verification and a stop condition',()=>{for(const r of recipes){const html=render('recipe/'+r.id);assert.match(html,/How to verify/);assert.match(html,/When to stop/);assert.ok(html.includes(escapeHTML(r.verify)));assert.ok(html.includes(escapeHTML(r.stop)));}});
test('each workflow visibly explains prerequisites, completion and stopping',()=>{for(const w of workflows){const html=render('workflow/'+w.id);assert.match(html,/Before you start/);assert.match(html,/Finished when/);assert.match(html,/Stop condition/);}});
