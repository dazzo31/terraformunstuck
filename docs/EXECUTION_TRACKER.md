# Execution tracker

Version 0.2.0 candidate — 16 October 2026.

| Task | Status | Evidence / limits |
| --- | --- | --- |
| Public GitHub Pages foundation | Previously published | The 0.1 site deployed successfully; stale disabled-Pages status is superseded |
| Guided learning | Implemented | Eight practical tasks and understanding checks; explicit completion follows feedback; legacy progress retained |
| Guided troubleshooting | Implemented | Phase → symptom → ownership → next check → canonical recipe; unknown branches preserve uncertainty |
| Diagnostic ranking | Implemented | Specific constraint diagnostics precede related generic messages; independent errors remain visible |
| Provider/backend contexts | Implemented | Separate provider, backend, execution and shell checks with official sources; no live integration certification |
| Rendering maintainability | Implemented | Shared UI and separate page/guidance view modules; content JSON Schema validates canonical data |
| Local tests | Passed | 48 unit/schema/rendering tests and runtime JS syntax checks |
| Terraform examples | Passed | Real disposable local execution with Terraform 1.4.7 and 1.14.0; no cloud resource or external provider |
| Browser / accessibility / privacy gate | Implemented; CI execution pending | 30 project/test combinations; see docs/VERIFICATION.md |
| Publication gate | Implemented | All Checks jobs must pass for the exact main commit before Pages deployment; post-deploy public asset checks |
| Manual accessibility and physical devices | Outstanding | No screen-reader or physical-device certification claimed |
| Broader provider/backend recipes | Future expansion | Context guidance is included; complete migration/recovery procedures require separate versioned validation |
| Branch protection | Not verified | Workflow gates are implemented; repository administrative policy is not claimed |

Immediate next action: run the candidate through hosted browser checks, fix any observed issues, then publish the verified commit. Future enhancements such as bookmarks, a glossary and a plan JSON explorer are not part of this release.
