# Product specification — 0.2.0

Terraform Unstuck helps people learn Terraform and select appropriate next checks when it fails. Learn and Fix a Problem are equally prominent entry points. A daily workflow is a complete sequence with prerequisites, effects, verification and a stop condition.

Navigation: Home, Learn, Fix a Problem, Workflows, Reference. Stable hashes identify lessons, recipes and workflows. Global search indexes the same canonical content used by navigation and diagnostics.

Guided mode keeps explanations focused; Advanced reveals deeper context without changing location or losing user input. Both retain material consequences. The simulator is labelled as a teaching fixture and must not be confused with real plan analysis.

This initial implementation uses a static dist directory and vanilla ES modules. The single canonical content module is an intentional small-project simplification of the original per-topic content-directory proposal. Content can be split by collection when that improves editing; stable IDs and validation must remain.

Included: eight short lessons, 16 core recipes, five workflows, 12 error patterns, four simulator scenarios, search, themes, local lesson progress, copy and share controls, and unknown-input handling.

Later: deeper provider/backend guidance, formal schema files, browser journey automation, optional plan JSON exploration, offline caching and separately validated OpenTofu support. No provider connectors, automatic apply or AI diagnosis in the current scope.

## Version 0.2 journeys

Learn → practical task → understanding feedback → explicitly mark complete. Exercises and answers stay in memory; only explicit completion IDs persist. Previous self-marked progress is retained.

Fix → failing phase → closest symptom → relevant ownership question → next check → recipe. Unknown answers stop at evidence gathering. Pasted diagnostics rank specific patterns first and label related generic patterns. Context controls independently select provider, backend, execution and shell; recipe guidance uses the same selections.

Rendering is split into ui.js and views for learning, troubleshooting, workflows, shared guidance and general pages. Content has a checked JSON Schema. No new runtime dependencies are introduced. Development-only dependencies provide schema, browser and accessibility tests.

Publication requires successful unit/schema, browser and local Terraform jobs for the exact main commit. GitHub Pages remains the canonical public deployment.

## Version 0.2.1 accessible interaction

Each route gives its main landmark the page heading as an accessible name. Learning progress exposes current/max values and a human-readable value. Diagnostic updates announce a short summary separately from the evidence region. Search traps focus using the native modal dialog and explicitly restores the opener on dismissal; choosing a topic focuses the destination main landmark. Notification regions remain mounted and clear after display. When browser storage is blocked, progress remains available for the visit and the completion message explains that it was not saved.
