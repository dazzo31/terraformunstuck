# Contributing

Read AGENTS.md and the product/content specifications. Describe the user problem and expected outcome before making a bounded change. Keep content in the canonical content module; link to it rather than duplicating command advice.

Use synthetic fixtures only. Include positive, negative and ambiguous examples for new diagnoses. A pattern must lead to an existing recipe; unrecognised and conflicting results remain valid.

Run npm run check. Inspect the affected journey on desktop, narrow mobile and keyboard navigation when browser tooling is available. Record exactly what was verified. Update docs/EXECUTION_TRACKER.md.

For documentation corrections, include an official source and the relevant version. Do not add routine state rewrites, unconditional unlocks or destructive workarounds.

Version 0.2 uses pinned development-only dependencies: run `npm ci --ignore-scripts` first. Browser and local Terraform jobs are required before publication; unit checks alone are insufficient. See docs/VERIFICATION.md for the commands, recorded versions and remaining manual checks. Preserve in-memory-only diagnostic and exercise input, independent provider/backend context, and the exact-commit publication gate.
