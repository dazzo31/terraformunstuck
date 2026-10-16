# Execution tracker

Version 0.2.1 candidate — 16 October 2026.

| Task | Status | Evidence / limits |
| --- | --- | --- |
| Public GitHub Pages foundation | Published | Version 0.2.0 passed publication and public page/asset checks |
| Guided learning | Implemented | Eight practical tasks and understanding checks; explicit completion follows feedback; legacy progress retained |
| Guided troubleshooting | Implemented | Phase → symptom → ownership → next check → canonical recipe; unknown branches preserve uncertainty |
| Diagnostic ranking | Implemented | Specific constraint diagnostics precede related generic messages; independent errors remain visible |
| Provider/backend contexts | Implemented | Separate provider, backend, execution and shell checks with official sources; no live integration certification |
| Rendering maintainability | Implemented | Shared UI and separate page/guidance view modules; content JSON Schema validates canonical data |
| Local tests | Passed | 49 unit/schema/rendering tests and runtime JS syntax checks |
| Terraform examples | Passed | Real disposable local execution with Terraform 1.4.7 and 1.14.0; no cloud resource or external provider |
| Browser / accessibility / privacy gate | Passed on candidate | 30 project/test combinations across Chromium desktop/mobile and Firefox; both-theme axe scans; screenshots inspected; see docs/VERIFICATION.md |
| Publication gate | Implemented | All Checks jobs must pass for the exact main commit before Pages deployment; post-deploy public asset checks |
| WebKit, narrow-screen and accessible interaction extension | CI verification pending | Six projects / 90 combinations; named landmarks, progress/status semantics, modal focus, reduced motion and blocked storage |
| Manual accessibility and physical devices | Outstanding | Automated accessibility-tree/interaction checks supplement, but do not replace, actual screen-reader and physical-device tests |
| Broader provider/backend recipes | Future expansion | Context guidance is included; complete migration/recovery procedures require separate versioned validation |
| Branch protection | Not verified | Workflow gates are implemented; repository administrative policy is not claimed |

Release process: promote the verified candidate to main, require the same checks there and verify the public page/assets after publication. Future enhancements such as bookmarks, a glossary and a plan JSON explorer are not part of this release.
