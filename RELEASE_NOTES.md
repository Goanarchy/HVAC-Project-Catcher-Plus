# Release Notes — HVAC Project Catcher Plus (v1.2.0)

**Release date:** November 2026
**Developer:** [Goanarchy (@goanarchy1)](https://x.com/goanarchy1)
**Target:** HVAC contractors in New Jersey (US)
**Runtime:** local-first vanilla HTML/CSS/JS (no build, no server)

---

## Highlights in v1.2.0

### 1. Project creation and runtime stability fixed

- Fixed a critical `ReferenceError: U is not defined` crash triggered by creating a project:
  - `js/store.js` used `U.num` / `U.pct` in `buildSchedule`, `syncPayment`, and the checklist without defining `U`.
  - Added `var U = P.util;` immediately after the utility object.
- Fixed translation shadowing in `js/app.js`: the global click handler named its DOM element `t`, overwriting the i18n helper `t(key)`.
  - Renamed the element reference to `btn` and normalized its uses.
- Hardened **Create project**: trimmed inputs, required project/client validation, safe project construction, save, modal close, navigation to step 1, and a clear error toast if anything fails.
- Repaired the `input` / `change` / `focusout` / backdrop handlers after the element-variable rename, restoring bindings, catalog filters, JSON/CSV import, and company logo upload.
- Verified with `node --check` on all five scripts and a Node smoke test of `S.newProject()` (ID, `PC-YYYY-NNN`, 30/35/35 schedule).

### 2. Maintenance stage integrated end-to-end

- The wizard inserts a **Maintenance** step before the summary whenever the scope includes maintenance.
- Maintenance captures equipment/type, quantity, visits, price per visit, materials per visit, contract months, and notes.
- Maintenance totals feed `S.calc`, the summary cards, the completeness checklist, and the client PDF.
- The payment schedule and payment method now match between the UI and the printed proposal.

### 3. Company, compliance and supplier setup reworked

- **Company page:** clearer guidance, explicit **Save** action, local logo upload with preview/remove, live logo URL support, and NJ compliance guidance (HIC `13VH…`, Master HVACR, insurance).
- **Supplier modal:** aligned labels/placeholders/help, dedicated notes area, removed corrupt symbols, and clearer email/portal fields.
- **RFQ safety:** emails are only used when configured; the app never fabricates supplier addresses.

### 4. Catalog, materials and pricing rules

- Regrouped material subcategories by function instead of store, enabling mixed-supplier estimates:
  - plumbing/drains (PVC and condensate), copper/line sets, ductwork/grilles, electrical, controls/thermostats, insulation, refrigerants/consumables, supports/hardware, filtration/IAQ, civil/pads, safety/PPE, misc.
- Added **Fontanería** (HVAC plumbing) including PVC pipe/fittings and condensate components.
- Added practical materials for **central ducted systems** (R-8 flex duct, collars, boots, grilles, dampers, plenum, canvas connector, duct wrap) and **mini-split installs** (line sets, cover kits, pads, wall brackets, 14/4 cable, sleeves, sealant, surge protection).
- Brand-separated equipment with real logo sources and offline fallbacks.
- Catalog filters by project suppliers and supports side-by-side comparison when alternatives exist.
- Manual/catalog lines store price, price date, source, link, and promo. **Update prices** reviews stale items and records the confirmed cost/date.
- Prices remain **reference-only**; no automatic scraping.
- **Deals** screen redesigned: larger cards, discount badge, highlighted current price, strikethrough original price, savings pill, stats, and validity notice.

### 5. Supplier consistency and replacement flow

- Catalog-linked lines (`catalogId`) are locked to the supplier that offers the item.
- Lines from suppliers not selected in step 2 are flagged in red with an explanation.
- **"Find at another supplier"** searches alternatives constrained to the project's selected suppliers.

### 6. Online capabilities with graceful offline behavior

- Connection indicator in the sidebar with online/offline notifications.
- Live brand/supplier logos with automatic fallback to local initials/wordmarks.
- **Load JSON from URL** for CORS-permitted live backups.
- Clear failure messages for network/CORS issues; all local features continue offline.

### 7. Client proposal PDF aligned with the quote

The client PDF now includes:

- Company identity, logo, license/insurance data when configured.
- Client/project details and scope overview.
- Equipment and brands with legible logos.
- Delivery/execution times and equipment lead time.
- Payment method/schedule, warranty, and terms coordinated with the UI.
- Inclusions/exclusions with enough room for real text.
- Totals, discounts, taxes (NJ 6.625%), and acceptance conditions.
- Maintenance as part of scope and totals when applicable.

The PDF **does not** include the detailed internal material list.

### 8. Bilingual UI, theme and freshness pass

- Full ES/EN switching for labels, help text, modals, catalog controls, company/supplier pages, and print output; removed Spanish-only leakage in English mode.
- Dark theme remains the default with a persistent light/dark toggle.
- Fixed garbled headers/symbols/mojibake, spelling, titles, and double-escaped labels (e.g. catalog title).
- Branding simplified to **`v1.2 · HVAC · NJ`**; removed the old hero sentence and USD from the brand line.
- Wider catalog/picker search fields, aligned forms, no overlaps/overflow, legible SVG logo.
- Editable fields are visibly marked; typing/focus remains stable while totals update.
- **Import/Export** renamed to **Cargar/Guardar** (**Load/Save**) with minimalist icons, including JSON, CSV, backup, and URL areas.
- Tax rate displayed as a **percentage** while stored as a decimal; all sums and formulas reviewed.

---

## Upgrade notes

- The app keeps using `localStorage` key `pcp_state_v1_v1`; existing data is migrated automatically.
- If a previous session stored invalid state, the app falls back to a clean state. Keep a JSON backup before switching versions.
- Clear the browser cache or hard-refresh (`Ctrl+F5`) after updating files so the new scripts load.

---

## Verification

- `node --check` passes for `js/data.js`, `js/i18n.js`, `js/store.js`, `js/ui.js`, and `js/app.js`.
- Project creation verified in a Node simulation (ID, number, client, 30/35/35 schedule).
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
