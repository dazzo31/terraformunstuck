import {sources} from './content.js?v=0.4.0';
export const escapeHTML = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const e=escapeHTML;
export const sourceLink=key=>`<a href="${sources[key]??sources.plan}" target="_blank" rel="noopener noreferrer">Official documentation ↗</a>`;
export const command=(text,effect,language='Terminal')=>`<div class="command"><div class="command-head"><span>${e(language)} · ${e(effect)}</span><button type="button" data-copy>Copy</button></div><pre><code>${e(text)}</code></pre></div>`;
export const breadcrumb=(parent,label)=>`<div class="breadcrumb"><a href="#home">Home</a> / <a href="#${parent}">${label}</a></div>`;
export const pageHead=(eyebrow,title,description)=>`<div class="page-head"><div class="eyebrow">${eyebrow}</div><h1 id="page-heading">${title}</h1><p>${description}</p></div>`;
export const lessonCard=(l,completed=[])=>`<a class="card" href="#lesson/${l.id}"><span class="card-number">${String(l.number).padStart(2,'0')} / ${e(l.label)}</span><h3>${e(l.title)}</h3><p>${e(l.summary)}</p><span class="text-link">${completed.includes(l.id)?'✓ Revisit lesson':'Start lesson'} <span aria-hidden="true">→</span> <span class="reading-time">· ${l.time}</span></span></a>`;
export const problemCard=r=>`<a class="problem-card" href="#recipe/${r.id}"><span class="problem-icon" aria-hidden="true">${e(r.icon)}</span><div><h3>${e(r.title)}</h3><p>${e(r.summary)}</p></div><span class="arrow" aria-hidden="true">↗</span></a>`;
export const workflowCard=w=>`<a class="card" href="#workflow/${w.id}"><span class="pill">${e(w.level)}</span><h3>${e(w.title)}</h3><p>${e(w.summary)}</p><span class="text-link">Follow the workflow →</span></a>`;


export function notFound(){return pageHead('PAGE NOT FOUND','Let’s get you back on track.','This topic link does not match a page in this version.')+'<a class="button primary" href="#home">Go home →</a> <button class="button" data-open-search>Search the guide</button>';}
