# Implementation audit — 16 October 2026

The core learning and troubleshooting product is implemented and publicly deployed. The audit found defects that the previous passing suite did not detect; those required correction. This is a scoped implementation review, not certification that all possible Terraform guidance, browser behavior or security properties are correct.

## Baseline evidence

- Audited main: `11ac7ba5623124566064c66e4d3987efb1c86c16` (version 0.4.0).
- All 50 tracked source files matched the GitHub tree by Git blob SHA.
- Exact-main [Checks 38947558927](https://github.com/dazzo31/terraformunstuck/actions/runs/38947558927) and [Pages 38948012484](https://github.com/dazzo31/terraformunstuck/actions/runs/38948012484) succeeded.
- Independent public HTTP check: root returned 200; all 18 files under dist matched the repository bytes. The earlier 404 is not present in this snapshot.
- Fresh baseline local run: 52 unit/schema/render tests passed, plus runtime syntax checks.

## Findings and corrections

| Finding | Impact | Correction |
| --- | --- | --- |
| Skip link changed the hash to `#main` | Keyboard users could lose their topic and reach a fallback page | Focus main without changing the route; assert topic and URL stay unchanged |
| Router accepted extra segments and prototype property names; `#fix/extra` accessed absent controls | Wrong content or runtime error for malformed links | Allow only canonical routes before rendering or initializing controls |
| Stored progress accepted repeated valid IDs | Progress could exceed the number of lessons | Deduplicate recognised completion IDs |
| Search selection relied on hashchange for focus | Selecting the current topic could leave focus on its opener | Explicitly focus main when choosing a result |
| Reset claimed saved data was cleared even when storage rejected removal | Misleading persistence feedback | Report visit-only reset and failed saved-data removal |
| Deployment smoke checked status for two scripts and only the HTML version | Stale scripts, missing transitive modules or an HTML fallback could pass | Compare every dist file and directory entry point byte-for-byte, with bounded retries and network timeout |
| A successful old main commit remained eligible for deployment | A delayed workflow could publish superseded source | Check current main before deployment starts, alongside existing exact-SHA success gate and serialized deployment |
| Ajv 8.17.1 development dependency had a moderate advisory | Dependency hygiene; affected `$data` option is not enabled and Ajv is not shipped | Pin 8.20.0; fresh npm audit reports zero known advisories |
| Installation and version references pointed to init | Readers reached an unrelated command reference | Use the official install and version pages |
| Tracker mixed current and historical test counts | Release evidence was ambiguous | Label historical evidence and link this current audit |

Dependency advisory: [GHSA-2g4f-4pwh-qvx6](https://github.com/advisories/GHSA-2g4f-4pwh-qvx6). The clean registry scan is point-in-time evidence, not proof of absence of vulnerabilities. No runtime dependencies were introduced.

## Original plan reconciliation

| Scope | Audited status |
| --- | --- |
| Public repository, MIT license, Pages, contribution/security guidance and issue templates | Present; live site and deployed bytes verified |
| Eight lessons, practical tasks, understanding checks, guided/advanced mode, themes, simulator | Implemented; fixture simulation explicitly distinguished from Terraform execution |
| Sixteen P0 recipes plus saved-plan and module-move P1 guides | All 18 implemented with canonical links, verification and stop conditions |
| Roughly 10–12 initial diagnostic patterns | 13 implemented; evidence, ambiguity, unknown input and size limits checked |
| Daily workflows | Six implemented: start, review plan, change resource, import, rename/refactor and child-module move; variables are covered in a lesson/local fixture, not a dedicated workflow |
| Separate provider, backend, execution and shell context | Implemented as guidance, not live integrations; no Terraform-version selector was implemented |
| Search, deep links, copy/share, privacy boundaries | Implemented; regression coverage expanded in this audit |
| M4 / complete 1.0 acceptance | Not complete: manual assistive-technology/device checks and broader source/example validation remain; current release is 0.4.1 |
| M5 and remaining P1 guides | Future work: full backend migration, lost-state recovery, removed-provider migration, API limits/timeouts, deeper cloud-specific procedures |
| Original proposed layout and recipe metadata | Deliberately simplified: canonical content module and shared renderers. Recipe fields/command cards do not implement every proposed metadata field or the nine-part layout verbatim |
| Maintenance and presentation | Quarterly reviews were proposed, not scheduled. README lacks a product screenshot; no claim that every plan presentation detail is finished |

## Verification of corrections

The test-only baseline [run 38956106819](https://github.com/dazzo31/terraformunstuck/actions/runs/38956106819), commit `3309cfdc27cfe592c487d9d3e4167a10084f395d`, preserved the published runtime: its existing 102 browser combinations passed, while all five new interaction regressions failed on all six projects (30 failures). This reproduces the defects and demonstrates why the earlier green suite was insufficient. The corrected runtime candidate `5289d98a991b967098633c2da561638444eb02ab` passed [Checks 38956451023](https://github.com/dazzo31/terraformunstuck/actions/runs/38956451023): all 138 browser combinations (23 tests across six projects), all 55 local checks and both Terraform versions. The additional clipboard/share regression passed on every project. Local syntax and all 55 unit/schema/render/publication tests pass. The publication verifier rejects stale bytes, HTML fallbacks, 404 responses and exhausted network retries, and accepts eventual exact matches. The dependency scan reports zero known vulnerabilities after the update.

## Limits and remaining checks

- Browser projects use Chromium, Firefox and WebKit plus emulation. They do not establish physical iPhone/Android or actual Safari/assistive-technology compatibility.
- Axe scans cover specified core journeys and new guide pages, not a complete manual WCAG audit of every page/state.
- Privacy evidence combines source review with synthetic-marker browser requests/storage/URL/DOM tests. Clipboard regression uses a stub to verify the intended payload, not every operating system's permissions behavior.
- Terraform CI exercises disposable local state and the built-in resource on 1.4.7 and 1.14.0. It does not validate cloud providers, remote backend recovery, cross-state migrations, all Terraform 1.x releases or OpenTofu.
- Source-link corrections were reviewed against official documentation. There is no exhaustive revalidation of every external documentation page or platform-specific shell command in this audit.
- Branch protection, private vulnerability reporting and administrative Pages settings could not be verified through available repository access. Successful deployment proves the public serving path, not those policies.
- The deployment guard checks main at the start; it is not a transactional freeze of the branch. Post-deployment verification reports a failure but does not automatically roll back an already published deployment.

Release publication: the corrected candidate is ready for promotion. Exact-main Checks and the strengthened public byte-verification gate must pass before declaring 0.4.1 published. Their results are retained in GitHub Actions.
