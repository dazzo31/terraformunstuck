import test from 'node:test';
import assert from 'node:assert/strict';
import {nextCheck,symptoms} from '../dist/assets/js/triage.js';
import {exercises,checkAnswer} from '../dist/assets/js/exercises.js';
import {lessons,recipes} from '../dist/assets/js/content.js';
import {contextGuidance,providers,backends} from '../dist/assets/js/context.js';
import {analysisResults,exercisePanel} from '../dist/assets/js/views/guidance.js';
import {analyse} from '../dist/assets/js/analyser.js';

test('all decision branches lead to real recipes',()=>{for(const [phase,choices] of Object.entries(symptoms))for(const [symptom] of choices){const r=nextCheck({phase,symptom});assert.ok(recipes.some(x=>x.id===r.id));assert.ok(r.message.length>30);}});
test('unknown and contradictory phase/symptom choices do not recommend a change',()=>{assert.equal(nextCheck().id,null);assert.equal(nextCheck({phase:'setup',symptom:'unexpected-destroy'}).id,null);});
test('lock decisions preserve active and unknown-owner stop conditions',()=>{
 assert.match(nextCheck({phase:'plan',symptom:'state-locked',owner:'active'}).message,/Do not remove/);
 assert.match(nextCheck({phase:'plan',symptom:'state-locked',owner:'unknown'}).message,/before changing any lock/);
 assert.match(nextCheck({phase:'plan',symptom:'state-locked',owner:'abandoned'}).message,/exact backend and lock identity/);
});
test('every lesson has a misconception check with a valid answer and task',()=>{for(const l of lessons){const x=exercises[l.id];assert.ok(x.task.length>40);assert.equal(x.options.length,3);assert.ok(checkAnswer(l.id,x.correct).correct);assert.equal(checkAnswer(l.id,(x.correct+1)%3).correct,false);assert.equal(checkAnswer(l.id,-1),null);assert.equal(checkAnswer(l.id,undefined),null);}});
test('unanswered and incorrect exercises remain visible with feedback',()=>{assert.match(exercisePanel('read-plan'),/Check my understanding/);assert.match(exercisePanel('read-plan',{value:0,checked:true}),/Have another look/);assert.match(exercisePanel('read-plan',{value:2,checked:true}),/That’s right/);});
test('resource provider and backend are independently selected',()=>{
 const sections=contextGuidance({provider:'azure',backend:'s3'});
 assert.equal(sections[0].title,'AzureRM provider');assert.equal(sections[1].title,'S3 backend');
 assert.ok(contextGuidance({provider:'invalid',backend:'invalid'}).every(x=>x.title.endsWith('unknown')));
 for(const x of [...Object.values(providers),...Object.values(backends)]){assert.ok(x.checks.length);assert.ok(['developer.hashicorp.com','registry.terraform.io'].includes(new URL(x.url).hostname));}
});
test('specific provider version diagnostics rank above the related lookup message',()=>{
 const r=analyse('Error: Failed to query available provider packages\nno available releases match the given constraints');
 assert.equal(r.matches[0].id,'provider-version');assert.equal(r.matches[1].relationship,'related');
 const html=analysisResults(r,{phase:'unknown'},recipes);assert.ok(html.indexOf('Provider versions cannot be resolved')<html.indexOf('init cannot download a provider'));assert.match(html,/RELATED GENERIC MESSAGE/);
});
test('independent provider installation error is not hidden by a version diagnostic',()=>{const r=analyse('Error: Failed to install provider\nno available releases match the given constraints');assert.equal(r.matches.find(x=>x.id==='provider-download').relationship,'independent');});
test('Terraform box-drawing gutters normalise to recognisable diagnostics',()=>{assert.equal(analyse('╷\n│ Error: Error acquiring the state lock\n│\n╵').matches[0].id,'state-locked');});
test('matching evidence cannot insert executable markup',()=>{const html=analysisResults({status:'matched',matches:[{id:'state-locked',evidence:'<img src=x onerror=alert(1)>',reason:'<script>bad</script>',relationship:'independent'}]},{phase:'unknown'},recipes);assert.doesNotMatch(html,/<img|<script/);assert.match(html,/&lt;img/);});
