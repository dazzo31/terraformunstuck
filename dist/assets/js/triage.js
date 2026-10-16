// Decisions are local, deterministic pointers. They never authorise a change.
export const symptoms = {
  setup: [['not-found','Terraform is not found']],
  init: [['provider-download','A provider cannot download'],['provider-version','Provider versions conflict'],['backend-init','The backend needs initialisation'],['authentication','A service rejects credentials']],
  validate: [['invalid-input','An argument or variable is invalid'],['dependency-cycle','There is a dependency cycle']],
  plan: [['state-locked','The state is locked'],['unexpected-destroy','There is an unexpected deletion'],['replacement','A resource must be replaced'],['unknown-instances','Instance keys are unknown'],['drift','Something changed outside Terraform'],['no-changes','I expected changes but the plan is empty'],['authentication','A service rejects credentials']],
  apply: [['partial-apply','The operation failed after some changes'],['already-exists','A resource already exists'],['authentication','A service rejects credentials']],
  ci: [['ci-exit-code','The plan returned exit code 2'],['authentication','Credentials work locally but fail in CI'],['state-locked','The state is locked']]
};
export function nextCheck({phase='unknown',symptom='unknown',owner='unknown'}={}) {
  const choices=symptoms[phase]??[];
  if(!choices.some(([id])=>id===symptom))return {id:null,message:'Choose the failing command and closest symptom. If neither is known, inspect the original run output before changing configuration or state.'};
  if(symptom==='state-locked') {
    const messages={active:'Another run is active: wait or coordinate with its owner. Do not remove its lock.',unknown:'The owner is unknown: identify the backend, state context and active execution queue before changing any lock.',abandoned:'A run is confirmed abandoned: verify the exact backend and lock identity with the state owner, then use its documented recovery procedure.'};
    return {id:symptom,message:messages[owner]??messages.unknown};
  }
  const messages={
    'unexpected-destroy':'Do not apply yet. Check the target context, affected addresses and missing configuration before deciding whether deletion is intended.',
    replacement:'Read the replacement reason and inspect changed attributes or addresses before approval.',
    'partial-apply':'First identify which changes completed and whether any remote operation is still running. A failed apply is not a transaction rollback.',
    'already-exists':'Confirm the existing object’s identity and current owner before considering import.',
    'ci-exit-code':'Confirm -detailed-exitcode is present. Only then does 2 mean a successful plan with proposed changes.',
    authentication:'Identify whether the failing credentials belong to the provider, state backend or execution platform.'
  };
  return {id:symptom,message:messages[symptom]??'Start with the checks in this guide. Match the full diagnostic and intended context before choosing a resolution.'};
}
