# Terraform Unstuck

A visual Terraform learning guide and practical troubleshooting companion.

**[Open the public site](https://dazzo31.github.io/terraformunstuck/)** · Understand the plan. Find the problem. Choose your next step.

## Version 0.4.0

- Eight lessons with practical tasks, understanding checks and explanatory feedback.
- Guided troubleshooting by failing phase, symptom and lock ownership, plus 18 full recipes.
- Thirteen local error patterns, ranked by specificity with related generic diagnostics labelled.
- Module-move guide and a complete local child-module practice workflow, linked from lessons, triage and search.
- Saved-plan recovery through Apply/CI triage, diagnostic matching and search; stale state and wrong-state lineage are distinct branches.
- Independent AWS/Azure/Google provider, local/S3/Azure Storage/HCP backend, execution and shell context.
- Six workflows, four simulated plan scenarios, search, stable topic links, themes and optional local progress.

Passing an understanding check does not prove a hands-on task was performed. Previous self-marked lesson completion remains compatible.

## Run the site

No runtime dependencies or build step are needed. Use an HTTP server for browser ES modules:

```sh
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080. On Windows with Python installed, `py -m http.server 8080 --directory dist` is an alternative.

## Development checks

Node.js 22+ is required; CI uses Node 24. Pinned development dependencies provide JSON Schema validation, Playwright and axe accessibility checks. They are not deployed to visitors.

```sh
npm ci --ignore-scripts
npm run check
```

For browser checks on a suitable development machine or CI runner:

```sh
npx playwright install --with-deps chromium firefox webkit
npm run test:browser
```

The suite serves the site beneath `/terraformunstuck/` to exercise GitHub Pages asset paths. It checks desktop Chromium, Firefox and WebKit, Pixel/iPhone emulation and a 320-pixel mobile viewport; core routes in both themes; keyboard navigation; diagnostics; learning checks; overflow; concise live status messages, modal focus restoration, blocked-storage behaviour, reduced motion, and a synthetic-marker privacy boundary. Automated axe results are not a full accessibility certification or a manual screen-reader audit.

With Terraform installed:

```sh
npm run test:terraform
```

This uses a disposable local directory and the built-in terraform_data resource. It verifies creation, output, convergence, a changed value, an invalid reference a moved address, rejection of stale/wrong-lineage saved plans without state changes, fresh-plan recovery, and a root-to-child-module move that preserves the instance ID and output. The unmapped delete/create counterexample is inspected without applying it. CI pins Terraform 1.4.7 and 1.14.0. No cloud credentials or external providers are used. The disposable automated apply is confined to this test and is not recovery advice for real infrastructure.

## Deployment

GitHub Pages publishes `dist/` after the **Checks** workflow succeeds for that exact source commit on `main`. It includes unit/schema, browser and both local Terraform jobs. A manual deployment also requires a successful Checks run for the selected main commit. Pull-request checks cannot publish the site.

Pages must be enabled with **Settings → Pages → Source: GitHub Actions**. After deployment, a smoke check verifies the public page version and JavaScript assets. The older owner-private working site is a separate deployment; the public GitHub Pages site is canonical.

## Privacy and limits

The application does not connect to cloud accounts, execute Terraform or transmit pasted diagnostics. Error drafts, selected context, troubleshooting answers and practice answers remain in tab memory. Only theme, mode and explicitly marked lesson completion IDs persist in browser storage. Clear removes the diagnostic draft, context and displayed matches. Hosting still receives ordinary asset requests; external documentation links navigate to those services when selected.

Pattern matches are pointers, not confirmed causes. Simulation output is fictional teaching data. Provider/backend guidance identifies context checks rather than a certified cloud integration. See docs/VERIFICATION.md and the latest Actions results for evidence and limits.

## Source layout

- `dist/assets/js/content.js` — canonical lessons, recipes, workflows and core source links
- `dist/assets/js/exercises.js`, `triage.js`, `context.js` — learning and diagnostic decisions
- `dist/assets/js/analyser.js`, `model.js`, `labs.js` — matching engine and simulation fixtures
- `dist/assets/js/views/`, `ui.js` — page renderers and shared escaped markup
- `dist/assets/js/app.js` — routing, in-memory session state and events
- `data/content-schema.json` — checked content structure
- `tests/`, `tests/browser/`, `scripts/` — unit, browser and local Terraform verification
- `docs/` — scope, contributor guidance, sources and execution status

Read CONTRIBUTING.md and AGENTS.md before editing. Use only synthetic diagnostics in fixtures and issues.

## Credits and licence

Inspired by [GitUnstuck](https://github.com/dazzo31/gitunstuck). This implementation uses new code and independent branding. MIT licence. Terraform is a HashiCorp product; this project is not affiliated with HashiCorp or IBM.
