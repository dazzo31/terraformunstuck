# Product specification — 0.1.0

Terraform Unstuck helps people learn Terraform and select appropriate next checks when it fails. Learn and Fix a Problem are equally prominent entry points. A daily workflow is a complete sequence with prerequisites, effects, verification and a stop condition.

Navigation: Home, Learn, Fix a Problem, Workflows, Reference. Stable hashes identify lessons, recipes and workflows. Global search indexes the same canonical content used by navigation and diagnostics.

Guided mode keeps explanations focused; Advanced reveals deeper context without changing location or losing user input. Both retain material consequences. The simulator is labelled as a teaching fixture and must not be confused with real plan analysis.

This initial implementation uses a static dist directory and vanilla ES modules. The single canonical content module is an intentional small-project simplification of the original per-topic content-directory proposal. Content can be split by collection when that improves editing; stable IDs and validation must remain.

Included: eight short lessons, 16 core recipes, five workflows, 12 error patterns, four simulator scenarios, search, themes, local lesson progress, copy and share controls, and unknown-input handling.

Later: deeper provider/backend guidance, formal schema files, browser journey automation, optional plan JSON exploration, offline caching and separately validated OpenTofu support. No provider connectors, automatic apply or AI diagnosis in the current scope.
