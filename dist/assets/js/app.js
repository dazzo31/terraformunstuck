import {triageQuestions,triageResult,exerciseFeedback,analysisResults} from './views/guidance.js?v=0.2.1';
import {checkAnswer} from './exercises.js?v=0.2.1';
import {lessons,recipes,workflows,commands,sources} from './content.js?v=0.2.1';
import {analyse,samples,MAX_INPUT} from './analyser.js?v=0.2.1';
import {e,escapeHTML,notFound,workflowCard,pageHead} from './ui.js?v=0.2.1';
import {home,reference,about} from './views/pages.js?v=0.2.1';
import {learn,lesson,simulationOutput} from './views/learning.js?v=0.2.1';
import {fix,recipe,filteredProblems} from './views/troubleshooting.js?v=0.2.1';
import {workflow} from './views/workflow.js?v=0.2.1';
export {escapeHTML} from './ui.js?v=0.2.1';

const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];
const readPref=(key,fallback)=>{try{return localStorage.getItem(key)??fallback;}catch{return fallback;}};
const writePref=(key,value)=>{try{localStorage.setItem(key,value);return true;}catch{return false;/* Preferences remain usable for this tab. */}};
let completed;try{completed=JSON.parse(readPref('tfu-progress','[]'));if(!Array.isArray(completed))completed=[];}catch{completed=[];}
completed=completed.filter(id=>lessons.some(x=>x.id===id));
let mode=readPref('tfu-mode','guided')==='advanced'?'advanced':'guided';
let theme=readPref('tfu-theme','light')==='dark'?'dark':'light';
let activeFilter='all';
let currentRoute='';
const draft={text:'',phase:'unknown',execution:'unknown',backend:'unknown',provider:'unknown',shell:'unknown'};
const triage={phase:'unknown',symptom:'unknown',owner:'unknown'};
const answers={};
let searchOpener=null;
const main=$('#main');
const toast=message=>{const node=$('#toast');node.textContent=message;node.classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>{node.classList.remove('visible');node.textContent='';},2500);};
function render({focus=false}={}){
 const raw=location.hash.slice(1)||'home';
 let route;try{route=decodeURIComponent(raw);}catch{route='not-found';}
 const [type,id]=route.split('/');
 const views={home:()=>home({completed}),learn:()=>learn({completed}),fix:()=>fix({draft,activeFilter,triage}),workflows:()=>pageHead('WORKFLOWS / ONE TASK AT A TIME','Turn understanding into a next step.','Practical sequences with prerequisites, effects and a clear finish line.')+`<div class="cards">${workflows.map(workflowCard).join('')}</div>`,reference,about};
 main.innerHTML=type==='lesson'?lesson(id,{completed,answers}):type==='recipe'?recipe(id,{context:draft}):type==='workflow'?workflow(id):!id&&views[type]?views[type]():notFound();
 const nav=type==='lesson'?'learn':type==='recipe'?'fix':type==='workflow'?'workflows':type;
 $$('[data-nav]').forEach(a=>{const active=a.dataset.nav===nav;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 const title=type==='lesson'?lessons.find(x=>x.id===id)?.title:type==='recipe'?recipes.find(x=>x.id===id)?.title:type==='workflow'?workflows.find(x=>x.id===id)?.title:({home:'Learn, understand, troubleshoot',learn:'Learn Terraform',fix:'Fix a problem',workflows:'Workflows',reference:'Reference',about:'About & privacy'}[type]);
 document.title=(title??'Topic not found')+' — Terraform Unstuck';
 if(type==='fix')for(const key of ['phase','execution','backend','provider','shell'])$(`#context-${key}`).value=draft[key];
 if(route!==currentRoute){window.scrollTo(0,0);if(focus)main.focus({preventScroll:true});}
 currentRoute=route;
}
function applyPreferences(){document.documentElement.dataset.mode=mode;document.documentElement.dataset.theme=theme;$('#guided-mode').setAttribute('aria-pressed',String(mode==='guided'));$('#advanced-mode').setAttribute('aria-pressed',String(mode==='advanced'));$('#theme-toggle').setAttribute('aria-label',`Switch to ${theme==='light'?'dark':'light'} theme`);}
const searchable=[...lessons.map(x=>({...x,route:'lesson/'+x.id,type:'Lesson'})),...recipes.map(x=>({...x,route:'recipe/'+x.id,type:'Problem'})),...workflows.map(x=>({...x,route:'workflow/'+x.id,type:'Workflow'})),...commands.map(x=>({title:x.name,summary:x.purpose,route:'reference',type:'Command'}))];
function search(query){const terms=query.trim().toLowerCase().split(/\s+/).filter(Boolean);return searchable.filter(x=>terms.every(t=>[x.title,x.summary,...(x.aliases??[])].join(' ').toLowerCase().includes(t))).slice(0,10);}
function showResults(){const q=$('#global-search').value;const results=search(q);$('#search-results').innerHTML=results.length?results.map(x=>`<a class="search-result" href="#${x.route}"><b>${e(x.title)}</b> <span class="pill">${x.type}</span><small>${e(x.summary)}</small></a>`).join(''):'<p class="small" style="padding:20px 0">No matching topics yet. Try a shorter task or browse <a href="#fix">all problems</a>.</p>';}
function openSearch(opener=document.activeElement){const d=$('#search-dialog');if(!d.open){searchOpener=opener;d.showModal();}showResults();$('#global-search').focus();}
function runAnalysis(){
 draft.text=$('#error-input').value;
 const result=analyse(draft.text);const node=$('#analysis-results');
 node.innerHTML=analysisResults(result,draft,recipes);
 const summary=result.status==='matched'?`${result.matches.length} relevant guide${result.matches.length===1?'':'s'} found. First: ${recipes.find(x=>x.id===result.matches[0].id)?.title}.`:({empty:'Paste an error or choose a sample.',unknown:'No supported error pattern recognised. Use guided troubleshooting or inspect the original command.', 'too-large':'Input exceeds 50,000 characters. Use a shorter sanitised excerpt.'}[result.status]);
 $('#analysis-status').textContent=summary;
}
async function copyText(text){try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(text);toast('Copied to clipboard');}catch{toast('Clipboard unavailable. Select and copy the text manually.');}}
document.addEventListener('click',event=>{
 const el=event.target.closest('button,a');if(!el)return;
 if(el.matches('[data-open-search],#search-toggle'))openSearch(el);
 if(el.id==='search-close')$('#search-dialog').close();
 if(el.closest('#search-results')&&el.tagName==='A'){searchOpener=null;$('#search-dialog').close();}
 if(el.id==='theme-toggle'){theme=theme==='light'?'dark':'light';writePref('tfu-theme',theme);applyPreferences();}
 if(el.id==='guided-mode'||el.id==='advanced-mode'){mode=el.id==='guided-mode'?'guided':'advanced';writePref('tfu-mode',mode);applyPreferences();toast(mode==='advanced'?'Advanced context is now available in the guides.':'Guided explanations selected.');}
 if(el.hasAttribute('data-copy'))copyText($('code',el.closest('.command')).textContent);
 if(el.hasAttribute('data-share')){const url=new URL(location.href);url.search='';copyText(url.href);}
 if(el.dataset.complete){const id=el.dataset.complete;if(!completed.includes(id)&&!(answers[id]?.checked&&checkAnswer(id,answers[id]?.value)?.correct))return;if(!completed.includes(id))completed.push(id);const saved=writePref('tfu-progress',JSON.stringify(completed));el.textContent='✓ Marked complete';toast(saved?'Lesson marked complete in this browser':'Lesson complete for this visit. Browser storage is unavailable.');}
 if(el.dataset.scenario){$$('[data-scenario]').forEach(b=>b.setAttribute('aria-pressed',String(b===el)));$('#sim-output').innerHTML=simulationOutput(el.dataset.scenario);}
 if(el.dataset.sample){draft.text=samples[el.dataset.sample]??'';$('#error-input').value=draft.text;runAnalysis();}
 if(el.id==='analyse')runAnalysis();
 if(el.id==='clear-input'){draft.text='';draft.phase=draft.execution=draft.backend=draft.provider=draft.shell='unknown';$('#error-input').value='';$('#analysis-results').replaceChildren();$('#analysis-status').textContent='Input, context and guidance cleared.';for(const key of ['phase','execution','backend','provider','shell'])$(`#context-${key}`).value='unknown';$('#error-input').focus();toast('Input, context and diagnosis cleared');}
 if(el.dataset.checkExercise){
   const id=el.dataset.checkExercise;const result=checkAnswer(id,answers[id]?.value);
   if(!result){$('#exercise-feedback').textContent='Choose an answer first.';return;}
   answers[id].checked=true;
   $('#exercise-feedback').innerHTML=exerciseFeedback(result);
   const complete=$(`[data-complete="${id}"]`);if(complete)complete.disabled=!result.correct&&!completed.includes(id);
 }
 if(el.dataset.filter){activeFilter=el.dataset.filter;$$('[data-filter]').forEach(b=>{b.classList.toggle('active',b===el);b.setAttribute('aria-pressed',String(b===el));});$('#problem-list').innerHTML=filteredProblems(activeFilter);}
 if(el.id==='reset-preferences'){for(const key of ['tfu-theme','tfu-mode','tfu-progress'])try{localStorage.removeItem(key);}catch{}theme='light';mode='guided';completed=[];for(const key of Object.keys(answers))delete answers[key];applyPreferences();toast('Saved preferences and lesson progress reset');}
});
document.addEventListener('input',event=>{if(event.target.id==='global-search')showResults();if(event.target.id==='error-input'){draft.text=event.target.value;$('#analysis-results').replaceChildren();$('#analysis-status').textContent='Input changed. Run analysis to refresh guidance.';}});
document.addEventListener('change',event=>{
 if(event.target.id.startsWith('context-')){draft[event.target.id.slice(8)]=event.target.value;$('#analysis-results').replaceChildren();$('#analysis-status').textContent='Context changed. Run analysis to refresh guidance.';}
 if(event.target.dataset.exercise){
   const id=event.target.dataset.exercise;answers[id]={value:Number(event.target.value),checked:false};
   $('#exercise-feedback').replaceChildren();const complete=$(`[data-complete="${id}"]`);if(complete)complete.disabled=!completed.includes(id);
 }
 if(event.target.id==='triage-phase'){triage.phase=event.target.value;triage.symptom=triage.owner='unknown';$('#triage-questions').innerHTML=triageQuestions(triage);}
 if(event.target.id==='triage-symptom'){triage.symptom=event.target.value;triage.owner='unknown';$('#triage-questions').innerHTML=triageQuestions(triage);$('#triage-symptom')?.focus();}
 if(event.target.id==='triage-owner'){triage.owner=event.target.value;$('#triage-result').innerHTML=triageResult(triage);}
 if(event.target.id==='lock-owner'){const advice={unknown:'Identify the owner and check the execution queue. Do not remove a lock whose ownership is uncertain.',active:'Wait or coordinate with the active run’s owner. Do not force-unlock it or disable locking.',abandoned:'Confirm the exact backend, state context and lock identity with the state owner. Follow that backend’s documented abandoned-lock procedure, then review a fresh normal plan.'};$('#lock-advice').replaceChildren();const p=document.createElement('p');p.textContent=advice[event.target.value];$('#lock-advice').append(p);}
});
$('#global-search').addEventListener('keydown',event=>{if(event.key==='Enter'){const first=$('.search-result');if(first){first.click();}}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&$('#search-dialog').open){event.preventDefault();$('#search-dialog').close();return;}if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();openSearch();}else if(event.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(event.target.tagName)&&!event.target.isContentEditable){event.preventDefault();openSearch();}});
$('#search-dialog').addEventListener('click',event=>{if(event.target===$('#search-dialog')){const r=event.target.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.target.close();}});
$('#search-dialog').addEventListener('close',()=>{if(searchOpener?.isConnected)searchOpener.focus({preventScroll:true});searchOpener=null;});
window.addEventListener('hashchange',()=>render({focus:true}));
applyPreferences();render();
