# Next Version Roadmap — HVAC Project Catcher Plus

This roadmap prioritizes reliability, quoting depth, and day-to-day speed for NJ HVAC contractors after v1.2.0.

---

## v1.3 — Reliability & Estimating Depth

- **Automated smoke tests:** headless browser checks for create project, wizard navigation, maintenance totals, save/load, and PDF generation.
- **Price freshness dashboard:** one view of catalog items with stale `priceDate`, missing source links, or expired promos across all projects.
- **Supplier price sheet import:** paste/upload a supplier CSV or quote text, map columns, and update multiple costs with confirmation dates.
- **Line-level audit trail:** record who/when changed a unit cost, sell price, discount, or tax mode inside a project.
- **Template projects:** save a scope/equipment/material/labor package as a reusable template for common installs (ducted split, mini-split, RTU replacement, maintenance plan).
- **Better comparison:** normalize units and quantities automatically when comparing supplier alternatives (e.g., per box vs. per piece).

---

## v1.4 — Client Experience & Documents

- **Proposal variants:** concise one-page summary, detailed proposal, and optional maintenance agreement as separate PDF presets.
- **Branded PDF themes:** upload a cover image and choose accent/typography presets per company.
- **Optional equipment options:** present good/better/best packages with per-option totals and client selection.
- **Digital acceptance block:** signature/date lines, acceptance instructions, and a checklist of required attachments.
- **Spanish/English document pairs:** generate both language versions of the same proposal without re-entering data.
- **Print-safe logo embedding:** cache remote brand logos locally so PDFs remain consistent offline.

---

## v1.5 — Local Data Maturity

- **IndexedDB storage option:** move large states and embedded images beyond the `localStorage` size limit while keeping a JSON export/import path.
- **Versioned backups:** keep the last N automatic snapshots with restore points.
- **Project archiving/search:** filter by status, client, system type, supplier, date range, and margin band.
- **Data integrity checker:** validate references between lines, suppliers, catalog IDs, selected suppliers, and calculated totals before export.
- **Optional encrypted backup:** password-protected JSON export for sharing between PCs.

---

## v2.0 — Optional Sync & Team Workflows

- **Optional backend (Node + SQLite/Postgres):** multi-user projects, shared catalog, and server-side PDF generation, while preserving the offline-first mode.
- **Role permissions:** owner, estimator, reviewer, and read-only client-link roles.
- **Client portal link:** expiring read-only proposal link with approval tracking.
- **Supplier portal integrations:** where APIs or export feeds are available; no scraping.
- **Audit & compliance reports:** HIC/license/insurance expiration reminders and per-job document checklists.
- **Accessibility and performance audit:** keyboard navigation, screen-reader labels, contrast, and large-project rendering benchmarks.

---

## Continuous improvements

- Keep ES/EN parity for every new string.
- Keep dark/light token parity in `styles.css`.
- Never store tax as a percentage value; always decimal internally.
- Whenever a project's payment or maintenance data changes, verify the PDF and schedule stay synchronized.
