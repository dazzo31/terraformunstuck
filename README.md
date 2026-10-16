# Terraform Unstuck

A visual Terraform learning guide and practical troubleshooting companion.

**Understand the plan. Find the problem. Choose your next step.**

This early implementation includes eight lessons, 16 troubleshooting recipes, five workflows, a four-scenario plan simulator, search, guided/advanced explanations and a local error analyser with 12 matching rules.

## Run locally

No build or package installation is needed. Use an HTTP server so browser ES modules load correctly:

```sh
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080. On Windows with Python launcher installed, use `py -m http.server 8080 --directory dist`.

## Verify

Node.js 22 or later is required for development checks; CI uses Node 24. There are no npm dependencies to install.

```sh
npm run check
```

The tests cover diagnostic fixtures, input handling, content integrity, simulation semantics and static application constraints. See docs/EXECUTION_TRACKER.md for browser and Terraform-execution verification status.

## Deploy to GitHub Pages

Repository: https://github.com/dazzo31/terraformunstuck. The source is ready for GitHub Pages deployment.

1. In repository Settings → Pages, choose GitHub Actions as the source.
2. Run the **Deploy GitHub Pages** workflow manually. Checks must pass before deployment.

The workflow is deliberately manual for this initial release. Branch protection, Pages availability and environment settings must be configured in the destination repository. An owner-private working version is also hosted at https://terraformunstuck.divinelemon32.chatgpt.site. GitHub contains the portable source; hosted Site identity and Git metadata are excluded.

## Privacy and limitations

The application does not connect to providers, execute Terraform or send pasted error input to any service. Only theme, mode and user-marked lesson progress are saved in browser storage. Input drafts remain in memory until Clear, reload or close. Hosting still serves assets and enforces access controls.

Matches are diagnostic pointers, not confirmed root causes. Simulated output is illustrative. The local practice example uses Terraform 1.4+ built-in terraform_data and has no cloud resource. No live cloud examples have been executed. This is version 0.1.0, not a completed 1.0 release or accessibility certification.

## Project structure

- `dist/` — complete static website, deployed as-is
- `dist/assets/js/content.js` — canonical lessons, recipes, workflows and sources
- `dist/assets/js/analyser.js` — pure matching engine and synthetic samples
- `dist/assets/js/model.js` — teaching scenarios
- `dist/assets/js/app.js` — routing, rendering and interactions
- `docs/` — product scope, contributor rules, source inventory and tracker
- `tests/` — dependency-free Node regression checks

## Contributing

Read CONTRIBUTING.md and AGENTS.md. Technical guidance needs official sources, version context, expected results and a stop condition. Never submit real credentials or state files as fixtures.

## Credits and licence

Inspired by the visual learning and troubleshooting approach of [GitUnstuck](https://github.com/dazzo31/gitunstuck). This implementation uses new code and independent branding; no GitUnstuck source or brand asset was copied.

MIT licence. Terraform is a HashiCorp product; this independent project is not affiliated with HashiCorp or IBM.
