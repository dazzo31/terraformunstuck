# Source inventory

Reviewed 16 October 2026. Sources guide the educational content; they are not evidence of live Terraform execution or a tested version compatibility matrix.

- https://developer.hashicorp.com/terraform/cli/commands/init
- https://developer.hashicorp.com/terraform/cli/commands/validate
- https://developer.hashicorp.com/terraform/cli/commands/plan
- https://developer.hashicorp.com/terraform/cli/commands/apply
- https://developer.hashicorp.com/terraform/language/state
- https://developer.hashicorp.com/terraform/language/state/locking
- https://developer.hashicorp.com/terraform/language/resources/terraform-data
- https://developer.hashicorp.com/terraform/language/import
- https://developer.hashicorp.com/terraform/language/modules/develop/refactoring
- https://developer.hashicorp.com/terraform/language/values/variables

Additional official reference links are included in the content module; provider-specific recipes require their own review before publication. Each lesson/recipe/workflow names its primary official source. Future maintenance should replace broad version descriptions with an explicit validated compatibility matrix.

GitUnstuck README and source structure informed the product plan. All application source, CSS and brand SVG in this implementation are newly written. No external fonts, image downloads or copied brand assets are used.

## Version 0.2 context guidance

Reviewed 16 October 2026. These are identity/context checks, not live cloud validation or a provider-version support matrix:

- https://developer.hashicorp.com/terraform/language/backend/s3
- https://developer.hashicorp.com/terraform/language/backend/azurerm
- https://developer.hashicorp.com/terraform/language/backend/local
- https://developer.hashicorp.com/terraform/cloud-docs/workspaces
- https://registry.terraform.io/providers/hashicorp/aws/latest/docs#authentication-and-configuration
- https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/service_principal_oidc
- https://docs.cloud.google.com/docs/terraform/authentication
- https://docs.cloud.google.com/docs/authentication/application-default-credentials

Local practice checks use official Terraform releases 1.4.7 and 1.14.0. The workspace downloads were verified against their official SHA256SUMS manifests. This validates the built-in local examples only; it does not certify all versions or cloud providers.

Accessibility behaviour reviewed against primary guidance on 16 October 2026:

- https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- https://playwright.dev/docs/emulation
- https://playwright.dev/docs/aria-snapshots

WebKit on a Linux runner and emulated iPhone settings are not the same as testing Safari on an actual Apple device.

## Saved-plan recovery — reviewed 16 October 2026

- https://developer.hashicorp.com/terraform/cli/commands/apply — saved-plan execution and its approval semantics.
- https://developer.hashicorp.com/terraform/cli/commands/plan — saved artifact contents, sensitive values and regeneration.

Exact stale-state and different-lineage diagnostics are verified against executable Terraform 1.4.7 and 1.14.0 in the local-backend CI lab. No provider or remote-backend compatibility is inferred.

## Module-move practice — reviewed 16 October 2026

- https://developer.hashicorp.com/terraform/language/modules/develop/refactoring — module scope and upgrade history.
- https://developer.hashicorp.com/terraform/language/block/moved — address mapping.
- https://developer.hashicorp.com/terraform/language/block/module — module calls and outputs.
- https://developer.hashicorp.com/terraform/language/resources/terraform-data — built-in local practice resource.

The runnable fixture targets Terraform 1.4+ and is checked on 1.4.7 and 1.14.0. This does not validate cloud resources, provider changes or cross-state migration.

## Audit corrections — 16 October 2026

The installation recipe now links to https://developer.hashicorp.com/terraform/install and the version command to https://developer.hashicorp.com/terraform/cli/commands/version, replacing unrelated init links. Both official references were opened and reviewed during the audit. No new Terraform compatibility claim is introduced.

## Variable-file practice — reviewed 16 October 2026

- https://developer.hashicorp.com/terraform/language/values/variables — root inputs, custom variable files, precedence, child-module differences and sensitive-value limits.
- https://developer.hashicorp.com/terraform/cli/commands/plan — input selection and non-applying plan behavior.
- https://developer.hashicorp.com/terraform/language/resources/terraform-data — built-in local resource.

The shared fixture uses Terraform 1.4+ syntax. Local executable checks target 1.4.7 and 1.14.0; candidate results are recorded in the execution tracker. The sample uses non-secret values and is a local CLI workflow, not an HCP Terraform or cloud provider procedure.
