import {execFileSync} from 'node:child_process';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import assert from 'node:assert/strict';
import {lessons} from '../dist/assets/js/content.js';
import {moduleMove} from '../dist/assets/js/labs.js';
const cwd=await mkdtemp(join(tmpdir(),'terraformunstuck-module-'));
const binary=process.env.TERRAFORM_BIN??'terraform';
const env={...process.env,TF_IN_AUTOMATION:'1',CHECKPOINT_DISABLE:'1'};
const tf=args=>execFileSync(binary,args,{cwd,env,encoding:'utf8',stdio:['ignore','pipe','pipe']});
const json=args=>JSON.parse(tf(args));
try {
 console.log('Validating module move with',json(['version','-json']).terraform_version);
 await writeFile(join(cwd,'main.tf'),lessons.find(x=>x.id==='desired-state').example+'\n');
 tf(['init','-input=false','-no-color']);tf(['plan','-input=false','-out=initial.plan','-no-color']);
 // Only built-in terraform_data in a disposable local directory is applied here.
 tf(['apply','-input=false','-no-color','initial.plan']);
 const originalId=json(['show','-json']).values.root_module.resources[0].values.id;
 await mkdir(join(cwd,'modules','messages'),{recursive:true});
 await writeFile(join(cwd,'modules','messages','main.tf'),moduleMove.child);
 await writeFile(join(cwd,'main.tf'),moduleMove.root);
 tf(['init','-input=false','-no-color']);tf(['fmt','-check','-recursive']);tf(['validate','-no-color']);
 tf(['plan','-input=false','-out=unmapped.plan','-no-color']);
 const unmapped=json(['show','-json','unmapped.plan']).resource_changes;
 assert.deepEqual(unmapped.find(x=>x.address==='terraform_data.message').change.actions,['delete']);
 assert.deepEqual(unmapped.find(x=>x.address==='module.messages.terraform_data.message').change.actions,['create']);
 // The destructive counterexample is inspected, never applied.
 await writeFile(join(cwd,'main.tf'),moduleMove.root+'\n'+moduleMove.moved);
 tf(['fmt','-check','-recursive']);tf(['validate','-no-color']);tf(['plan','-input=false','-out=mapped.plan','-no-color']);
 const mapped=json(['show','-json','mapped.plan']).resource_changes;
 assert.equal(mapped.length,1);assert.equal(mapped[0].previous_address,'terraform_data.message');
 assert.equal(mapped[0].address,'module.messages.terraform_data.message');assert.deepEqual(mapped[0].change.actions,['no-op']);
 tf(['apply','-input=false','-no-color','mapped.plan']);
 const state=json(['show','-json']).values.root_module;
 assert.ok(!state.resources?.length);assert.equal(state.child_modules[0].resources[0].values.id,originalId);
 assert.equal(json(['output','-json','message']),'Hello, Terraform');
 tf(['plan','-input=false','-detailed-exitcode','-no-color']);
 console.log('PASS: missing move proposes delete/create; mapped module move preserves ID/output and converges. No cloud provider used.');
} finally {await rm(cwd,{recursive:true,force:true});}
