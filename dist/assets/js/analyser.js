export const MAX_INPUT = 50000;
export function normalise(text) {
  return String(text).replace(/\x1b\][^\x07]*(?:\x07|\x1b\\)/g,'').replace(/\x1b\[[0-?]*[ -/]*[@-~]/g,'').replace(/\r\n?/g,'\n').replace(/^\s*[│] ?/gm,'');
}
export const rules = [
 {id:'not-found',pattern:/(?:terraform:\s*command not found|terraform[^\n]*(?:is not recognized|is not recognised)|the term ['"]?terraform['"]? is not recognized)/i},
 {id:'provider-version',pattern:/(?:no available releases match the given constraints|locked provider[^\n]*does not match|inconsistent dependency lock file)/i},
 {id:'provider-download',pattern:/(?:error:\s*failed to install provider|error:\s*failed to query available provider packages)/i},
 {id:'backend-init',pattern:/(?:error:\s*backend initialization required|error:\s*backend configuration changed)/i},
 {id:'authentication',pattern:/(?:error:[^\n]*(?:no valid credential sources|unauthorized|accessdenied|expiredtoken|authentication)|NoCredentialProviders|failed to refresh cached credentials)/i},
 {id:'invalid-input',pattern:/error:\s*(?:unsupported argument|missing required argument|no value for required variable|invalid value for input variable)/i},
 {id:'state-locked',pattern:/error:\s*(?:error acquiring the state lock|failed to acquire[^\n]*lock)/i},
 {id:'replacement',pattern:/(?:^|\n)\s*#\s+[^\n]+(?:must be replaced|will be replaced)/i},
 {id:'already-exists',pattern:/(?:error:[^\n]*(?:already exists|alreadyexists)|a resource with the id[^\n]*already exists)/i},
 {id:'dependency-cycle',pattern:/error:\s*cycle:/i},
 {id:'unknown-instances',pattern:/error:\s*invalid (?:for_each|count) argument/i},
 {id:'ci-exit-code',pattern:/terraform plan[^\n]*-detailed-exitcode[\s\S]{0,180}?(?:exit(?:ed with)? (?:code |status )?2|exitcode[=: ]+2)/i}
];
export function analyse(raw) {
 if (String(raw).length>MAX_INPUT) return {status:'too-large',matches:[]};
 const text=normalise(raw).trim();
 if (!text) return {status:'empty',matches:[]};
 const priorities={'provider-version':200,'provider-download':40};
 const matches=rules.flatMap(rule=>{
   const match=text.match(rule.pattern);
   return match?[{id:rule.id,evidence:match[0].trim(),priority:priorities[rule.id]??100}]:[];
 }).sort((a,b)=>b.priority-a.priority);
 for(const match of matches){
   match.relationship=match.id==='provider-download'&&matches.some(x=>x.id==='provider-version')&&/query available/.test(match.evidence)?'related':'independent';
   match.reason=match.relationship==='related'?'This generic provider lookup message may be explained by the more specific version-constraint diagnostic.':'This rule matched the displayed diagnostic text; confirm it against the original operation.';
 }
 return {status:matches.length?'matched':'unknown',matches};
}
export const samples = {
 lock:'Error: Error acquiring the state lock\n\nLock Info:\n  ID:        example-lock-id\n  Operation: OperationTypeApply\n  Who:       example-ci-runner\n\nTerraform acquires a state lock to protect the state from being written by multiple users.',
 provider:'Error: Failed to install provider\nCould not connect to the provider registry. Check your network or configured provider mirror.',
 variable:'Error: No value for required variable\nThe root module input variable "environment" is not set, and has no default value.',
 cycle:'Error: Cycle: terraform_data.first, terraform_data.second',
 unknown:'A colleague changed something yesterday. I am not sure what happened.'
};
