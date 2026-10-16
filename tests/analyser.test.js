import test from 'node:test';
import assert from 'node:assert/strict';
import {analyse,normalise,MAX_INPUT,rules,samples} from '../dist/assets/js/analyser.js';
const has=(text,id)=>analyse(text).matches.some(m=>m.id===id);
const fixtures=[
 ['not-found','terraform: command not found'],
 ['provider-version','Error: Failed to query available provider packages\nno available releases match the given constraints'],
 ['provider-download','Error: Failed to install provider\nregistry connection failed'],
 ['backend-init','Error: Backend initialization required, please run "terraform init"'],
 ['authentication','Error: No valid credential sources found'],
 ['invalid-input','Error: Invalid value for input variable'],
 ['state-locked','Error: Error acquiring the state lock'],
 ['replacement','# aws_instance.example must be replaced'],
 ['already-exists','Error: A resource already exists with that name'],
 ['dependency-cycle','Error: Cycle: module.one, module.two'],
 ['unknown-instances','Error: Invalid for_each argument'],
 ['saved-plan','Error: Saved plan is stale'],
 ['ci-exit-code','terraform plan -detailed-exitcode\nProcess exited with code 2']
];
for(const [id,text] of fixtures)test(`diagnoses ${id} and ANSI/CRLF variant`,()=>{assert.ok(has(text,id));assert.ok(has('\x1b[31m'+text.replace(/\n/g,'\r\n')+'\x1b[0m',id));});
test('every implemented rule has a positive fixture',()=>assert.deepEqual(new Set(fixtures.map(x=>x[0])),new Set(rules.map(x=>x.id))));
test('negative and informational output does not become a diagnosis',()=>{
 for(const text of ['No state lock error occurred.','There is no dependency cycle.','No changes. Your infrastructure matches the configuration.','Plan: 0 to add, 0 to change, 0 to destroy.','Example discussion: use force-unlock carefully.','<script>alert(1)</script>','exit code 2','terraform plan\nexit code 2'])assert.equal(analyse(text).status,'unknown',text);
});
test('empty and oversized inputs have explicit outcomes',()=>{assert.equal(analyse(' \n ').status,'empty');assert.equal(analyse('x'.repeat(MAX_INPUT+1)).status,'too-large');assert.equal(analyse('x'.repeat(MAX_INPUT)).status,'unknown');});
test('two independent errors preserve both possible diagnoses',()=>{const ids=analyse(samples.lock+'\n'+samples.variable).matches.map(x=>x.id);assert.deepEqual(ids,['invalid-input','state-locked']);});
test('overlapping provider symptoms retain both guides',()=>assert.equal(analyse(fixtures[1][1]).matches.length,2));
test('an incomplete error remains unrecognised',()=>assert.equal(analyse('Error: Invalid for_').status,'unknown'));
test('normalisation strips terminal controls and standardises line endings',()=>assert.equal(normalise('\x1b]0;title\x07\x1b[32mline\r\nnext\rthird\x1b[0m'),'line\nnext\nthird'));
test('evidence is bounded to the matched diagnostic',()=>{const r=analyse('private preamble\n'+samples.lock+'\nprivate tail');assert.equal(r.matches[0].evidence,'Error: Error acquiring the state lock');});
test('all advertised samples are recognised except deliberate unknown',()=>{for(const [key,value] of Object.entries(samples))assert.equal(analyse(value).status,key==='unknown'?'unknown':'matched');});

test('saved-plan matching distinguishes explicit rejection from narrative and unrelated errors',()=>{
 assert.ok(has('│ Error: Saved plan does not match the given state','saved-plan'));
 for(const text of ['Saved plan is stale','No error: Saved plan is stale','Error: Saved plan is stale? No, it is current.','Error: Failed to read plan file','Error: Incompatible plan file'])assert.ok(!has(text,'saved-plan'),text);
});
