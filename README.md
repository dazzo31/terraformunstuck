# Terraform Unstuck • Visual Learning Guide & Practical Troubleshooting Companion

> **Live Application:** [dazzo31.github.io/terraformunstuck](https://dazzo31.github.io/terraformunstuck/)  
> **Tagline:** *Understand the plan. Find the problem. Choose your next step.*  
> **Build & Quality:** [![Checks](https://github.com/dazzo31/terraformunstuck/actions/workflows/checks.yml/badge.svg)](https://github.com/dazzo31/terraformunstuck/actions/workflows/checks.yml) [![Pages](https://github.com/dazzo31/terraformunstuck/actions/workflows/pages.yml/badge.svg)](https://github.com/dazzo31/terraformunstuck/actions/workflows/pages.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
> **Sponsor:** [![GitHub Sponsors](https://img.shields.io/badge/Sponsor-GitHub%20Sponsors-ea4aaa?style=flat&logo=githubsponsors&logoColor=white)](https://github.com/sponsors/dazzo31) [![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-dazzo31-orange?style=flat&logo=buymeacoffee&logoColor=white)](https://buymeacoffee.com/dazzo31)

**Terraform Unstuck** is a free, visual learning and troubleshooting companion designed to help engineers, practitioners, and learners understand Terraform plans, diagnose cryptic errors, and choose safe, deliberate next steps without risking unexpected infrastructure destruction.

---

## 🌟 Why Terraform Unstuck?

Terraform is powerful, but when things go wrong—a locked state, an unexpected deletion, a provider conflict, or an API timeout—the feedback can feel terrifying. Terraform Unstuck gives you a calm, structured mental model and concrete, verified diagnostic steps:

- 🧠 **Four-Zone Mental Model**: Understand the critical relationship between **Desired Configuration**, **Recorded State**, **Actual Infrastructure**, and the **Proposed Plan**. See why state is neither a backup nor a magic undo button.
- 🚨 **Zero-Panic Guided Troubleshooting**: 22 full recipes covering real-world errors across Setup, Initialisation, Validation, Planning, Apply, and CI/CD. Every recipe provides *What you are seeing*, *What it means*, *Check first*, *Verification*, and *When to stop*.
- 🔍 **Private Local Error Analyser**: Paste sanitised error logs into a 100% client-side deterministic matcher. Fast regex-driven pattern matching with ranked diagnostics, related generic message labeling, and zero data leakage.
- 🛠️ **Real Hands-On Practice**: Practice tricky refactors like moving resources into child modules (`moved` blocks) using the built-in `terraform_data` resource—completely locally without cloud accounts or credentials.
- 🎭 **Dual Experience Modes**: Switch seamlessly between **Guided Mode** (plain-English explanations and bounded actions) and **Advanced Mode** (graph dependencies, module addresses, provider aliases, and automation nuances).
- 🌓 **Accessible & Responsive**: Fully supports dark and light themes, keyboard-driven navigation, accessible dialogs, and mobile viewports.

---

## 🧭 Core Feature Tour

### 1. 📚 Guided Learning Path
Eight modular, bite-sized lessons designed to demystify infrastructure as code:
1. **Desired State**: How declarative configuration differs from imperative scripts.
2. **Resources & Providers**: Managing services, data sources, and provider dependencies.
3. **The Mental Model**: Interactive simulation of edits, external drift, and address renaming.
4. **Command Lifecycle**: What `init`, `fmt`, `validate`, `plan`, and `apply` actually do.
5. **Variables, Locals & Outputs**: Interface boundaries and sensitive value handling.
6. **Reading a Plan**: Dissecting additions, in-place updates, deletions, and dangerous replacements.
7. **Modules & Stable Addresses**: Preserving object identity across refactors with `count` and `for_each`.
8. **Backends & Team Collaboration**: State locking, concurrency safety, and workspace boundaries.

### 2. ⚡ Comprehensive Troubleshooting Backlog (22 Recipes)
- **Setup & Init**: Missing CLI on PATH, provider download failures, provider version lockfile conflicts, backend initialisation requirements, backend migrations (`TF-019`), and removed provider cleanup (`TF-021`).
- **Validation**: Invalid variables or arguments, circular dependency cycles.
- **Planning**: State lock contention (active vs. abandoned lock recovery), unexpected resource deletion, forced replacement attributes, external drift reconciliation, empty plan triage, unknown `for_each`/`count` keys, and root-to-child module moves.
- **Apply & Recovery**: Stale saved plans and mismatched state lineages, partial apply recovery, resource already exists / import adoption, API rate limiting and timeouts (`TF-022`), and lost/damaged state disaster recovery (`TF-020`).
- **CI / Automation**: Detailed exit codes handling (`terraform plan -detailed-exitcode` code 2 vs 1), local vs. pipeline credential boundaries.

### 3. 🛡️ Absolute Privacy & Zero Telemetry
- **100% Client-Side Execution**: All error matching and diagnostic evaluation happen entirely in browser tab memory.
- **Zero Network Transmission**: Pasted errors, configuration snippets, and credentials are never transmitted over the network.
- **Zero Telemetry**: No third-party trackers, no analytics scripts, no external fonts.
- **Clean Persistence**: Only theme preference, explanation mode, and explicitly completed lesson IDs persist in browser localStorage.

---

## 💻 Run Locally

No compilation, node daemon, or build pipeline is required. The site runs directly in modern browsers using native ES modules.

Serve the `dist/` directory with any static HTTP server:

```sh
# Using Python 3 (macOS / Linux)
python3 -m http.server 8080 --directory dist

# Using Python launcher (Windows)
py -m http.server 8080 --directory dist
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🧪 Development & Quality Assurance

Node.js 22+ (CI runs on Node 24) is used for development linting, schema validation, and accessibility tests:

```sh
# Install development dependencies
npm ci --ignore-scripts

# Run local syntax, schema, rendering, and diagnostic checks (55 tests)
npm run check
```

### End-to-End Browser & Accessibility Suite
To run the automated Playwright test suite across Chromium, Firefox, WebKit, and mobile viewports:

```sh
npx playwright install --with-deps chromium firefox webkit
npm run test:browser
```

### Local Terraform Verification
To verify the practice examples against actual Terraform binaries (runs in disposable local directories with `terraform_data`):

```sh
npm run test:terraform
```

---

## 🚢 Deployment

The public site is automatically tested and deployed to GitHub Pages via GitHub Actions:
- **Checks Workflow**: Validates unit/schema tests, multi-browser Playwright matrix, accessibility scans (axe-core), and real Terraform integration runs on commit to `main`.
- **Pages Publication**: Publishes `dist/` to [dazzo31.github.io/terraformunstuck](https://dazzo31.github.io/terraformunstuck/) with strict byte-for-byte asset verification.

---

## 💖 Sponsorship & Community Support

Terraform Unstuck is an independent open-source project developed and maintained by **[@dazzo31](https://github.com/dazzo31)**. If this tool helped you recover from a Terraform issue or saved your team hours of downtime, consider supporting its ongoing maintenance:

- 💖 **[Sponsor on GitHub](https://github.com/sponsors/dazzo31)**
- ☕ **[Buy Me A Coffee](https://buymeacoffee.com/dazzo31)**

Contributions, bug reports, and diagnostic pattern additions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md) before submitting pull requests.

---

## 📜 Credits and Licence

Inspired by [GitUnstuck](https://github.com/dazzo31/gitunstuck). This implementation is built from scratch with independent branding and dedicated Terraform architecture.

Released under the **[MIT Licence](LICENSE)**.

*Disclaimer: Terraform is a registered trademark of HashiCorp / IBM. Terraform Unstuck is an independent community resource and is not affiliated with, endorsed by, or sponsored by HashiCorp or IBM.*
