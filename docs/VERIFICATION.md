# Verification — version 0.2.0

## Recorded local results (16 October 2026)

- 49 Node unit/schema/rendering tests passed, with JavaScript syntax checks across all runtime modules.
- Official Terraform 1.4.7 and 1.14.0 downloads were checked against their SHA256SUMS manifests.
- Both versions passed the disposable built-in-resource lab: create plan, local apply/output, empty follow-up plan, update plan, invalid variable reference, moved address and variable-example validation.
- Browser test discovery found 30 project/test combinations. Execution is delegated to the GitHub-hosted runner because this workspace has no supported browser-control skill.

## Browser gate

The hosted candidate run passed all 30 browser project/test combinations after fixing Escape dismissal and mobile navigation clipping. Evidence: https://github.com/dazzo31/terraformunstuck/actions/runs/38935536704. Its required jobs cover:

- Desktop Chromium, mobile Chromium emulation and desktop Firefox.
- All topic routes, a single page heading and viewport overflow.
- Automated axe WCAG A/AA checks on eight core routes in light and dark themes.
- Keyboard skip link, search focus and Escape.
- Unknown and active lock ownership; backward navigation preserves answers.
- Wrong/correct understanding feedback and explicit completion persistence.
- Specific-versus-generic diagnostic ranking and independent provider/backend selections.
- A synthetic private marker excluded from request bodies/URLs, browser storage and executable DOM.
- Screenshots and failure traces retained as a seven-day CI artifact. Desktop and mobile homepage screenshots were visually inspected; desktop lesson and mobile triage screenshots were also inspected. Mobile navigation clipping was corrected.

See the current Checks run for exact executed results. Browser emulation does not replace testing on physical phones. Automated axe scanning does not establish complete WCAG conformance. No manual screen-reader, Safari or live cloud integration audit is claimed.

## Publication gate

Only a successful Checks workflow for the exact main commit can publish. Public page/asset smoke checks run after deployment. A failed candidate leaves the previous site deployed.
