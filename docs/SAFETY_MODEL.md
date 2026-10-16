# Behaviour and data boundaries

The application is an educational static site. It has no Terraform runner, provider credentials, server API or account connections. Diagnostic text remains in a module-scoped in-memory draft. It is never added to storage, URL parameters or share links. Only fixed preference keys tfu-theme, tfu-mode and tfu-progress may persist.

All content interpolated from user input is HTML-escaped; other user-dependent text uses textContent. The analyser is pure and has a 50,000-character limit. Matches provide evidence and guide IDs, never an infrastructure-safety verdict. Unknown and several simultaneous matches are valid results.

Lock recovery requires identifying owner and context. Active and unknown owners stop before unlock. The abandoned branch points to an exact backend-specific procedure; no generic unlock command is emitted.

The simulator uses fixed fictional observations. It deliberately explains that real provider schemas control update versus replacement behaviour.

Privacy checks include source constraints and, when browser tooling is available, a unique-marker network/storage check. Static checks do not substitute for a complete runtime network/privacy audit.
