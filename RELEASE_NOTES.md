# Release Notes — HVAC Project Catcher Plus (v1.3.0)

**Release date:** November 2026
**Developer:** [Goanarchy (@goanarchy1)](https://x.com/goanarchy1)
**Target:** HVAC contractors in New Jersey (US)
**Runtime:** local-first vanilla HTML/CSS/JS (no build, no server)

---

## Highlights in v1.3.0

### 1. Maintenance plans now load the quoted equipment automatically

The maintenance plan is no longer typed from scratch when the project already quotes equipment.

- When the project scope includes maintenance, every equipment line in the quote appears in the maintenance plan automatically.
- Equipment labels and quantities are copied from the quote, so the plan always starts from the offer.
- A **“from quote”** badge marks auto-loaded lines; manual service lines are marked **“manual”**.
- **Quantity sync:** if the quoted quantity changes, the maintenance quantity follows — unless you deliberately edited the maintenance quantity, in which case your value is preserved.
- **Label sync:** renaming equipment in the quote updates the maintenance label unless you renamed the maintenance line yourself.
- **Visits, price per visit, and materials per visit are never overwritten.** They are your commercial decisions and stay exactly as edited.
- Deleting a quoted equipment line removes its automatic maintenance line. Deleting the maintenance line on purpose records the source line as dismissed so it is not re-added on every render.
- **🔄 Resync from quote** reloads all quoted equipment, clears dismissals, and rebuilds the plan from the current offer.
- Visit presets (**2 · semiannual / 4 · quarterly / 12 · monthly**) set the frequency for every plan line in one click.

This follows the pattern used by leading field-service tools: the service plan is tied to the customer/location equipment, visits are generated from a frequency, and each visit carries a price and a parts allowance.

### 2. Maintenance-only projects

- The New Project modal now includes a **Maintenance-only project** checkbox.
- Maintenance-only projects use a simplified wizard: **Scope → Maintenance → Summary**.
- Installation demands are skipped in the completeness checklist (suppliers, equipment, materials, freight/lift, labor). The maintenance plan check, client data, system description, terms, and commercial checks still apply.
- The summary hides the **Materials / RFQ** action, and the client PDF hides the equipment-brands section, since there is no install scope.
- Manual maintenance lines remain available for equipment that is not part of a quoted install.

### 3. Professional visual pass

- **Next is now the obvious primary action:** larger gradient button, elevated shadow, hover lift, and an arrow that slides on hover. It is used on every wizard step, including the launch modal footer.
- **Stronger titles:** larger, heavier page titles, section headings with a glowing accent bar, and a cleaner header separator.
- **More depth:** cards, the project sidebar, the step rail, stat tiles, tables, and modals now use layered shadows and subtle inset highlights in both dark and light themes.
- **Maintenance workspace:** dedicated gradient hero with coverage chips, plan stats tiles (equipment covered, plan lines, plan sell, parts cost), clearer table rows, source badges, and better empty states.
- **Redesigned welcome screen:** full-width hero with logo, product title, tagline, capability chips, a welcome line, and a two-column action grid with Create quote spanning the width.

### 4. Consistency and safety

- Maintenance totals continue to flow into `S.calc`, the summary, the checklist, and the PDF.
- Sync is called after quote line add/update/delete/duplicate, catalog adds, scope changes, and maintenance actions, so totals never drift from the offer.
- Existing `localStorage` data migrates in place; new `maintenance.dismissed` and source fields are created as needed.
- ES/EN strings, dark default, NJ 6.625% tax as a percentage, stable typing/focus, and the rule that the client PDF never lists detailed materials are all preserved.

---

## Previous release — v1.2.0

### Project creation and runtime stability

- Fixed `ReferenceError: U is not defined` in `js/store.js` (`var U = P.util`).
- Fixed translation shadowing in `js/app.js` (click handler element renamed `t` → `btn`).
- Hardened **Create project**: trimmed inputs, required project/client validation, safe construction, save, modal close, navigation, and error toast.

### Maintenance, company and suppliers

- Maintenance stage inserted before Summary when scope includes maintenance; totals feed calc, summary, checklist, and PDF.
- **Company page:** guidance, explicit save, local logo upload/preview/remove, URL logo, NJ compliance guidance.
- **Supplier modal:** aligned fields, dedicated notes, no fabricated email addresses.

### Catalog, pricing and deals

- Materials regrouped by function; added HVAC plumbing/PVC and central-duct/mini-split materials.
- Brand-separated equipment with logo fallbacks.
- Catalog filters by selected suppliers, side-by-side comparison, locked supplier on catalog lines.
- **Update prices** reviews stale items; prices remain reference-only.
- Deals screen redesigned with discount, old/new price, savings, and validity.
- **Find at another supplier** constrained to selected suppliers.

### Online, PDF and UX

- Online/offline indicator, live logo loading with fallback, JSON-from-URL with CORS errors handled.
- Client PDF includes company identity, client, scope, equipment/brands, lead times, payment schedule, warranty, inclusions/exclusions, totals/taxes, and maintenance; it excludes the detailed material list.
- Full ES/EN switching, dark default, percentage tax display, stable typing/focus.
- **Cargar/Guardar (Load/Save)** for JSON/CSV/backup/URL.

---

## Upgrade notes

- The app keeps using `localStorage` key `pcp_state_v1_v1`; existing data migrates automatically.
- Maintenance lines created in v1.2 keep working as manual lines. Quote equipment is added as new auto lines when the project scope includes maintenance.
- If a previous session stored invalid state, the app falls back to a clean state. Keep a JSON backup before switching versions.
- Hard-refresh (`Ctrl+F5`) after updating files so the new scripts and CSS load.

---

## Verification

- `node --check` passes for `js/data.js`, `js/i18n.js`, `js/store.js`, `js/ui.js`, and `js/app.js`.
- Node smoke test confirms: auto-load from quoted equipment, quantity sync only when unedited, edit preservation, dismiss/resync behavior, maintenance-only checklist exclusions, and maintenance totals.
- Manual QA checklist available at [`docs/QA_CHECKLIST.md`](./docs/QA_CHECKLIST.md).

---

## Known limitations

- No automatic supplier price scraping (browser CORS/anti-bot); prices are references until confirmed.
- Live JSON import requires a CORS-enabled URL.
- PDF typography/styling depends on the browser's print engine.
- Data is local to the browser profile; use JSON backups to move or preserve it.

---

## License

MIT © 2026 Goanarchy. See [`LICENSE`](./LICENSE).
