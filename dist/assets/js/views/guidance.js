import {e,command} from '../ui.js?v=0.4.1';
import {symptoms,nextCheck} from '../triage.js?v=0.4.1';
import {exercises,checkAnswer} from '../exercises.js?v=0.4.1';
import {providers,backends,contextGuidance} from '../context.js?v=0.4.1';

export function triagePanel(state={}) {
  return `<section class="triage-panel" aria-labelledby="triage-title"><div class="section-heading"><div><span class="eyebrow">NO ERROR TEXT? START HERE</span><h2 id="triage-title">Work through the problem</h2><p>A few questions to choose a useful first check. Unknown is a valid answer.</p></div></div><label for="triage-phase">Which command or phase failed?</label><select id="triage-phase">${[['unknown','I do not know yet'],['setup','Install or start Terraform'],['init','Initialise (init)'],['validate','Check configuration (validate)'],['plan','Preview changes (plan)'],['apply','Carry out changes (apply)'],['ci','A CI pipeline']].map(([id,label])=>`<option value="${id}" ${state.phase===id?'selected':''}>${label}</option>`).join('')}</select><div id="triage-questions">${triageQuestions(state)}</div><p class="small muted">Answers stay in tab memory. No infrastructure is inspected or changed.</p></section>`;
}
export function triageQuestions(state={}) {
  const choices=symptoms[state.phase]??[];
  return `${choices.length?`<label for="triage-symptom">Which symptom is closest?</label><select id="triage-symptom"><option value="unknown">None of these / I am not sure</option>${choices.map(([id,label])=>`<option value="${id}" ${state.symptom===id?'selected':''}>${e(label)}</option>`).join('')}</select>`:''}${state.symptom==='state-locked'?`<label for="triage-owner">Who owns the lock?</label><select id="triage-owner">${[['unknown','I do not know yet'],['active','A run is still active'],['abandoned','The run is confirmed abandoned']].map(([id,label])=>`<option value="${id}" ${state.owner===id?'selected':''}>${label}</option>`).join('')}</select>`:''}<div id="triage-result" role="status" aria-label="Troubleshooting next check" aria-live="polite" aria-atomic="true">${triageResult(state)}</div>`;
}
export function triageResult(state) {
  const result=nextCheck(state);
  return `<div class="callout ${state.symptom==='unexpected-destroy'||state.symptom==='replacement'?'warning':''}"><strong>Your next check</strong><p>${e(result.message)}</p>${result.id?`<a class="button small" href="#recipe/${result.id}">Open the matching guide →</a>`:''}</div>`;
}
export function contextControls(draft={}) {
  const control=(key,label,entries)=>`<label for="context-${key}">${label}</label><select id="context-${key}">${entries.map(([id,title])=>`<option value="${id}" ${draft[key]===id?'selected':''}>${e(title)}</option>`).join('')}</select>`;
  return `<div class="context-grid">${[
    control('phase','Failing phase',[['unknown','Unknown'],['init','Initialise'],['validate','Validate'],['plan','Plan'],['apply','Apply'],['ci','CI pipeline']]),
    control('provider','Resource provider',Object.entries(providers).map(([id,x])=>[id,x.title])),
    control('backend','State backend',Object.entries(backends).map(([id,x])=>[id,x.title])),
    control('execution','Execution environment',[['unknown','Unknown'],['local','Local terminal'],['ci','CI pipeline'],['hcp','HCP Terraform']]),
    control('shell','Shell',[['unknown','Unknown'],['bash','Bash'],['powershell','PowerShell']])
  ].map(html=>`<div>${html}</div>`).join('')}</div>`;
}
export function renderContext(draft={}) {
  return `<section class="context-guidance"><h3>Checks for your selected context</h3><p class="small">Provider access and backend access can use different identities. These checks do not confirm either identity. Sources reviewed 16 October 2026; select documentation for your installed provider and Terraform versions.</p>${contextGuidance(draft).map(s=>`<div class="context-section"><h4>${e(s.title)}</h4><ul>${s.checks.map(x=>`<li>${e(x)}</li>`).join('')}</ul>${s.url?`<a class="text-link" href="${e(s.url)}" target="_blank" rel="noopener noreferrer">Official ${e(s.kind)} documentation ↗</a>`:''}</div>`).join('')}</section>`;
}
export function exercisePanel(id,answer={}) {
  const x=exercises[id];if(!x)return '';
  const result=answer.checked?checkAnswer(id,answer.value):null;
  return `<section class="exercise-panel" aria-labelledby="exercise-heading"><span class="eyebrow">PRACTISE THE IDEA</span><h2 id="exercise-heading">Put this lesson to work</h2><p>${e(x.task)}</p>${x.route?`<a class="text-link" href="#${x.route}">Open the practical guide →</a>`:''}<fieldset><legend>${e(x.question)}</legend>${x.options.map((option,i)=>`<label class="answer-option"><input type="radio" name="exercise-${id}" data-exercise="${id}" value="${i}" ${answer.value===i?'checked':''}> <span>${e(option)}</span></label>`).join('')}</fieldset><button data-check-exercise="${id}">Check my understanding</button><div id="exercise-feedback" role="status" aria-label="Understanding feedback" aria-live="polite" aria-atomic="true">${result?exerciseFeedback(result):''}</div><p class="small muted">This checks one idea, not completion of the hands-on task. Run commands only in your own dedicated practice directory.</p></section>`;
}
export function exerciseFeedback(result) {
  return `<div class="callout ${result.correct?'success':''}"><strong>${result.correct?'That’s right.':'Have another look.'}</strong><p>${e(result.explanation)}</p></div>`;
}
export function analysisResults(result,draft,recipes) {
  const messages={empty:'Paste an error or try one of the sample buttons.',unknown:'No supported error pattern was recognised. This does not establish that the operation succeeded. Use the questions above or check the complete diagnostic and command.','too-large':'This input exceeds the 50,000-character limit. Use a shorter sanitised excerpt around the error.'};
  if(result.status!=='matched')return `<div class="callout"><strong>${result.status==='unknown'?'No confident match yet':'Check the input'}</strong><p>${e(messages[result.status])}</p></div>${renderContext(draft)}`;
  return `<div class="callout"><strong>${result.matches.length} relevant guide${result.matches.length===1?'':'s'} found</strong><p>More specific matches appear first. These are diagnostic pointers, not confirmed causes.</p></div>${result.matches.map(m=>{
    const r=recipes.find(x=>x.id===m.id);
    return `<div class="result-card"><span class="pill">${m.relationship==='related'?'RELATED GENERIC MESSAGE':'MATCHED DIAGNOSTIC'}</span><h3>${e(r.title)}</h3><blockquote>${e(m.evidence)}</blockquote><p>${e(m.reason)}</p><p>${e(r.meaning)}</p>${draft.phase!=='unknown'&&draft.phase!==r.phase?`<p>Selected phase: ${e(draft.phase)}. Check the actual service and command; the guide’s usual phase is ${e(r.phase)}.</p>`:''}<p><strong>Check first:</strong> ${e(r.checks[0])}</p><a class="button small" href="#recipe/${r.id}">Work through this guide →</a></div>`;
  }).join('')}${renderContext(draft)}`;
}
