import {execFileSync} from 'node:child_process';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import assert from 'node:assert/strict';
import {variableFiles} from '../dist/assets/js/labs.js';
const cwd=await mkdtemp(join(tmpdir(),'terraformunstuck-variables-'));
const binary=process.env.TERRAFORM_BIN??'terraform';
// Keep inherited input/CLI overrides out of this disposable local fixture.
const env=Object.fromEntries(Object.entries(process.env).filter(([key])=>!/^TF_(VAR_|CLI_ARGS|DATA_DIR$|WORKSPACE$)/.test(key)));
Object.assign(env,{TF_IN_AUTOMATION:'1',CHECKPOINT_DISABLE:'1'});
const tf=(args,extra={})=>execFileSync(binary,args,{cwd,env:{...env,...extra},encoding:'utf8',stdio:['ignore','pipe','pipe']});
const json=(args,extra)=>JSON.parse(tf(args,extra));
const plan=(name,args=[],extra)=>{
 tf(['plan','-input=false','-no-color',`-out=${name}.plan`,...args],extra);
 return json(['show','-json',`${name}.plan`]);
};
const reject=(args,pattern)=>{
 let failure;try{tf(['plan','-input=false','-no-color',...args]);}catch(error){failure=error;}
 assert.ok(failure,'Invalid inputs unexpectedly planned');assert.equal(failure.status,1);
 assert.match(String(failure.stdout)+String(failure.stderr),pattern);
};
try{
 console.log('Validating variable-file workflow with',json(['version','-json']).terraform_version);
 await writeFile(join(cwd,'main.tf'),variableFiles.main);
 await writeFile(join(cwd,'practice.tfvars'),variableFiles.values);
 tf(['init','-input=false','-no-color']);tf(['fmt','-check']);tf(['validate','-no-color']);
 // A custom-named file is not automatically loaded, even though it exists.
 reject([],/No value for required variable/);
 const selected=plan('selected',['-var-file=practice.tfvars']);
 assert.equal(selected.resource_changes.length,1);
 assert.deepEqual(selected.resource_changes[0].change.actions,['create']);
 assert.equal(selected.variables.greeting.value,'Good morning');
 assert.deepEqual(selected.variables.names.value,['Terraform','team']);
 assert.equal(selected.planned_values.outputs.message.value,'Good morning, Terraform and team');
 assert.equal(selected.resource_changes[0].change.after.input,'Good morning, Terraform and team');
 // This saved-plan apply is only for the built-in fixture in a fresh local dir.
 tf(['apply','-input=false','-no-color','selected.plan']);
 assert.equal(json(['output','-json','message']),'Good morning, Terraform and team');
 tf(['plan','-input=false','-detailed-exitcode','-var-file=practice.tfvars','-no-color']);
 const before=json(['state','pull']);
 const defaults=plan('defaults',[],{TF_VAR_greeting:'Environment'});
 assert.deepEqual(defaults.variables.names.value,['Terraform']);
 assert.equal(defaults.resource_changes[0].change.after.input,'Environment, Terraform');
 // Explicit file beats lower-priority environment values.
 const environment=plan('environment',['-var-file=practice.tfvars'],{TF_VAR_greeting:'Environment',TF_VAR_names:'["Environment"]'});
 assert.equal(environment.variables.greeting.value,'Good morning');
 assert.deepEqual(environment.variables.names.value,['Terraform','team']);
 assert.deepEqual(environment.resource_changes[0].change.actions,['no-op']);
 await writeFile(join(cwd,'second.tfvars'),variableFiles.changed);
 const later=plan('later',['-var-file=practice.tfvars','-var-file=second.tfvars']);
 assert.equal(later.variables.greeting.value,'Welcome');
 const reversed=plan('reversed',['-var-file=second.tfvars','-var-file=practice.tfvars']);
 assert.equal(reversed.variables.greeting.value,'Good morning');
 const cli=plan('cli',['-var-file=practice.tfvars','-var=greeting=CLI']);
 assert.equal(cli.variables.greeting.value,'CLI');
 const fileLast=plan('file-last',['-var=greeting=CLI','-var-file=practice.tfvars']);
 assert.equal(fileLast.variables.greeting.value,'Good morning');
 // validate does not exercise caller-supplied variable validation; plan does.
 await writeFile(join(cwd,'invalid.tfvars'),'greeting = "   "\n');
 tf(['validate','-no-color']);reject(['-var-file=invalid.tfvars'],/Use a non-empty greeting/);
 await writeFile(join(cwd,'invalid.tfvars'),'greeting = "Hello"\nnames = { unexpected = "object" }\n');
 reject(['-var-file=invalid.tfvars'],/Invalid value for input variable/);
 await rm(join(cwd,'invalid.tfvars'));
 await writeFile(join(cwd,'practice.tfvars'),variableFiles.changed);
 tf(['fmt','-check']);
 const changed=plan('changed',['-var-file=practice.tfvars']);
 assert.deepEqual(changed.resource_changes[0].change.actions,['update']);
 assert.equal(changed.resource_changes[0].change.after.input,'Welcome, Terraform and team');
 assert.equal(changed.planned_values.outputs.message.value,'Welcome, Terraform and team');
 assert.equal(json(['output','-json','message']),'Good morning, Terraform and team');
 assert.deepEqual(json(['state','pull']),before,'Planning and rejected input must not mutate applied state');
 console.log('PASS: explicit variable file, scalar/list inputs, convergence, missing/invalid values, file/environment/CLI precedence and unapplied change. Local state unchanged by planning; no cloud provider used.');
}finally{await rm(cwd,{recursive:true,force:true});}
