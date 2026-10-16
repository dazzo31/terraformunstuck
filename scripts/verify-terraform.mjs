import {execFileSync} from 'node:child_process';
import {mkdtemp,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import assert from 'node:assert/strict';
import {analyse} from '../dist/assets/js/analyser.js';
import {lessons} from '../dist/assets/js/content.js';
const binary=process.env.TERRAFORM_BIN??'terraform';
const cwd=await mkdtemp(join(tmpdir(),'terraformunstuck-lab-'));
const env={...process.env,TF_IN_AUTOMATION:'1',CHECKPOINT_DISABLE:'1'};
function tf(args){return execFileSync(binary,args,{cwd,env,encoding:'utf8',stdio:['ignore','pipe','pipe']});}
function json(args){return JSON.parse(tf(args));}
try {
 console.log('Validating local practice examples with',json(['version','-json']).terraform_version);
 const rejectPlan=(file,diagnostic)=>{
  const before=json(['state','pull']);let failure;
  try{tf(['apply','-input=false','-no-color',file]);}catch(err){failure=err;}
  assert.ok(failure,'Saved plan unexpectedly applied');assert.equal(failure.status,1);
  const output=String(failure.stderr)+String(failure.stdout);
  assert.ok(output.includes(diagnostic),output);assert.equal(analyse(output).matches[0]?.id,'saved-plan');
  assert.deepEqual(json(['state','pull']),before,'Rejected plan must not change local state');
 };
 const initial=lessons.find(x=>x.id==='desired-state').example+'\n';
 await writeFile(join(cwd,'main.tf'),initial);
 tf(['init','-input=false','-no-color']);tf(['fmt','-check']);tf(['validate','-no-color']);
 tf(['plan','-input=false','-out=initial.plan','-no-color']);
 const create=json(['show','-json','initial.plan']);assert.deepEqual(create.resource_changes[0].change.actions,['create']);
 // Automated approval is deliberately confined to this disposable, built-in-only
 // local example. It is not website recovery advice and creates no cloud object.
 tf(['apply','-input=false','-no-color','initial.plan']);
 assert.equal(json(['output','-json','message']),'Hello, Terraform');
 tf(['plan','-input=false','-detailed-exitcode','-no-color']);
 const changed=initial.replace('input = "Hello, Terraform"','input = "Hello again"');
 await writeFile(join(cwd,'main.tf'),changed);
 tf(['plan','-input=false','-out=update.plan','-no-color']);
 const update=json(['show','-json','update.plan']);assert.deepEqual(update.resource_changes[0].change.actions,['update']);
 assert.equal(update.resource_changes[0].change.after.input,'Hello again');
 // Two reviewed proposals share a state snapshot; applying one invalidates the other.
 tf(['plan','-input=false','-out=sibling.plan','-no-color']);
 tf(['apply','-input=false','-no-color','update.plan']);
 rejectPlan('sibling.plan','Saved plan is stale');
 tf(['plan','-input=false','-out=fresh.plan','-no-color']);
 assert.ok(json(['show','-json','fresh.plan']).resource_changes.every(x=>x.change.actions.every(a=>a==='no-op')));
 // A separate CLI workspace creates a genuine distinct lineage without editing state.
 tf(['workspace','new','independent']);
 tf(['plan','-input=false','-out=independent.plan','-no-color']);
 tf(['apply','-input=false','-no-color','independent.plan']);
 rejectPlan('fresh.plan','Saved plan does not match the given state');
 tf(['workspace','select','default']);
 await writeFile(join(cwd,'main.tf'),initial+'\noutput "invalid" {\n  value = var.missing\n}\n');
 let invalid;try{tf(['validate','-json']);throw Error('Invalid example unexpectedly validated');}catch(err){if(err.stdout)invalid=JSON.parse(err.stdout);else throw err;}
 assert.equal(invalid.valid,false);assert.ok(invalid.diagnostics.some(x=>/undeclared input variable/i.test(x.summary)));
 await writeFile(join(cwd,'main.tf'),changed.replace('"terraform_data" "message"','"terraform_data" "greeting"').replace('terraform_data.message.output','terraform_data.greeting.output')+'\nmoved {\n  from = terraform_data.message\n  to   = terraform_data.greeting\n}\n');
 tf(['fmt','-check']);tf(['validate','-no-color']);tf(['plan','-input=false','-out=rename.plan','-no-color']);
 const rename=json(['show','-json','rename.plan']);const move=rename.resource_changes.find(x=>x.address==='terraform_data.greeting');
 assert.equal(move.previous_address,'terraform_data.message');assert.deepEqual(move.change.actions,['no-op']);
 // Variables example is independent: validate it in the same disposable location
 // after removing the first configuration. No plan/apply with prior state follows.
 await writeFile(join(cwd,'main.tf'),lessons.find(x=>x.id==='variables-values').example+'\n');
 tf(['fmt','-check']);tf(['validate','-no-color']);
 console.log('PASS: create plan, local apply/output, empty plan, update, invalid reference, address move, variables example, stale-plan rejection, different-lineage rejection and fresh-plan recovery. No cloud provider used.');
} finally {await rm(cwd,{recursive:true,force:true});}
