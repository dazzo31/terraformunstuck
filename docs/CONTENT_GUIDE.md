# Content guide

Every recipe needs a unique stable ID, accurate title/summary, phase, symptom, explanation, prerequisite checks, resolution branches, verification, stop condition, official source, review date and version context. Commands show their effect; templates explicitly identify placeholders and must not imply they are runnable.

Lessons require a plain-English explanation, precise definition, example, misconception and next step. Advanced context supplements the same lesson. Workflows require prerequisites and ordered steps tied to a concrete completion outcome.

Do not call Terraform state a backup of actual data. Do not claim configuration reversal or state restoration provides universal rollback. Partial apply must be treated as partial real changes. No generic force-unlock, state deletion, state push, targeting or auto-approval remedies.

Source command semantics from official HashiCorp documentation and provider/backend specifics from their official docs. Record reviewed versions. The current lessons cover Terraform 1.x concepts; local terraform_data examples require 1.4+, moved blocks 1.1+, and configuration-driven import blocks 1.5+. Later syntax is not assumed available across all 1.x versions.

Do not pad coverage with identical advice under unrelated titles. Each problem starts with its own evidence and branches. Uncertainty is useful and should be explicit.
