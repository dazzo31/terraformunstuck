# Behaviour and data boundaries

The application is an educational static site. It has no Terraform runner, provider credentials, server API or account connections. Diagnostic text remains in a module-scoped in-memory draft. It is never added to storage, URL parameters or share links. Only fixed preference keys tfu-theme, tfu-mode and tfu-progress may persist.

All content interpolated from user input is HTML-escaped; other user-dependent text uses textContent. The analyser is pure and has a 50,000-character limit. Matches provide evidence and guide IDs, never an infrastructure-safety verdict. Unknown and several simultaneous matches are valid results.

Lock recovery requires identifying owner and context. Active and unknown owners stop before unlock. The abandoned branch points to an exact backend-specific procedure; no generic unlock command is emitted.

The simulator uses fixed fictional observations. It deliberately explains that real provider schemas control update versus replacement behaviour.

Privacy checks include source constraints and, when browser tooling is available, a unique-marker network/storage check. Static checks do not substitute for a complete runtime network/privacy audit.

## Version 0.2 verification

Guided troubleshooting state, context and exercise answers remain in memory; only explicit lesson completion IDs persist. A correct understanding check gates new completion but is not evidence of executing the practical task. More specific diagnostics rank first; related generic messages stay visible. Provider and backend identities remain independent.

The hosted browser suite now checks the synthetic marker against runtime requests, browser storage, URLs and executable DOM. Both themes are scanned with axe on core routes. These checks supplement manual screenshot review; no screen-reader or live cloud certification is claimed.
