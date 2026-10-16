# Terraform Unstuck contributor instructions

Read docs/PRODUCT_SPEC.md, docs/CONTENT_GUIDE.md and docs/EXECUTION_TRACKER.md before changing behaviour. Build one complete user journey at a time.

- This is a static educational site. No cloud access or Terraform execution in the application.
- Runtime assets remain dependency-free and local. Keep content, diagnosis rules and rendering separate.
- Preserve the Learn and Fix entry points and title/content alignment.
- Pasted errors stay in memory. Never store them, send them over the network, or put them in URLs or reports.
- Treat all input as untrusted. Escape text at every HTML boundary.
- Do not turn pattern matches into claims of confirmed cause or infrastructure safety.
- No generic rollback claims or default force-unlock, state rewrite, destroy, -target or -auto-approve recovery.
- Source technical recommendations from version-appropriate official documentation; record review dates and limitations.
- Validate with npm run check. Browser QA is required before claiming visual/accessibility verification. Record unavailable checks honestly.
- GitHub Pages serves dist/ using the manual workflow. Preserve its check-before-deploy gate. Do not add private Site identity or credentials to this portable repository.
- Update execution status and evidence after a meaningful milestone. Do not label the project production-ready on test counts alone.
