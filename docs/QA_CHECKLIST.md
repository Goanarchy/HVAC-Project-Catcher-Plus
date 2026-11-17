# QA Checklist — HVAC Project Catcher Plus v1.3

Run these checks after any change and before publishing. Test in a fresh browser profile when possible, and also with existing `localStorage` data.

## 1. Boot & navigation

- [ ] `start.bat` opens the app; `index.html` also works by double-click.
- [ ] No console errors on first load.
- [ ] All sidebar routes open: Inicio, Presupuestos, Catálogo, Ofertas, Proveedores, Empresa.
- [ ] Hash routes survive refresh (`#/project/{id}/{step}`).
- [ ] Connection indicator reflects online/offline state.
- [ ] Welcome/launch modal shows the hero, logo, title, tagline, chips, welcome line, and 2-column action grid.
- [ ] Welcome modal closes with ✕, **Comenzar**, backdrop click, and Esc, and does not reappear in the same session.

## 2. Create project (critical)

- [ ] From Home, Projects, and the welcome modal, **Create project** opens the modal.
- [ ] Empty project/client shows a validation toast and focuses the missing field.
- [ ] Valid input creates the project, closes the modal, and opens step 1.
- [ ] Project number looks like `PC-2026-001` and increments.
- [ ] No `U is not defined`, `t is not a function`, or `Could not create project` errors.
- [ ] The project appears in the projects list and survives refresh.
- [ ] **Maintenance-only project** checkbox creates a project with scope `['maint']` and no install scope.

## 3. Wizard

- [ ] Standard projects show all 8 steps and render without overlap or overflow.
- [ ] Text inputs, selects, numbers, and dates are editable and keep focus while typing.
- [ ] Totals update without rebuilding the focused field.
- [ ] Scope toggles (A/C, heat, maintenance, etc.) update the step list.
- [ ] Maintenance appears before Summary only when scope includes maintenance.
- [ ] With scope exactly **maintenance**, the wizard shows only **Scope → Maintenance → Summary**.
- [ ] Scope step shows the maintenance-only explanation notice when applicable.
- [ ] **Next** is clearly the primary action on every step (large gradient button, visible arrow, hover lift).
- [ ] Next/Back navigation preserves data and never skips or repeats a step.

## 4. Maintenance — auto-load from quote

- [ ] With scope including maintenance, quoting equipment automatically creates maintenance lines.
- [ ] Auto lines show the **from quote** badge and copy the quoted brand/model and quantity.
- [ ] Changing the quoted quantity updates the maintenance quantity when the maintenance quantity was not edited.
- [ ] Editing the maintenance quantity, then changing the quote quantity, preserves the manual maintenance quantity.
- [ ] Changing the equipment label updates the maintenance label unless the maintenance label was renamed.
- [ ] Visits, price per visit, and materials per visit are never overwritten by sync.
- [ ] Deleting the maintenance line records it as dismissed and it is not re-added on the next render.
- [ ] **🔄 Resync from quote** clears dismissals and reloads all quoted equipment.
- [ ] Adding, updating, duplicating, or deleting quote equipment keeps the plan in sync.
- [ ] Deleting quoted equipment removes its auto maintenance line.
- [ ] Visit presets **2 / 4 / 12** update every line's visits.
- [ ] Manual **Add line** still works for services without quoted equipment.
- [ ] Plan stats (equipment covered, plan lines, plan sell, parts cost) match the rows and totals.

## 5. Maintenance — totals and maintenance-only

- [ ] Maintenance sell and materials cost appear in `S.calc`, the summary, and the sidebar.
- [ ] Clearing maintenance removes its cost from totals.
- [ ] Contract months and notes persist after refresh.
- [ ] Maintenance-only checklist skips suppliers, equipment, materials, freight/lift, and labor checks.
- [ ] Maintenance-only checklist still requires client data, system description, delivery/payment terms, and a valid plan line.
- [ ] Maintenance-only Summary hides **Materials / RFQ**.
- [ ] Maintenance-only PDF hides the equipment-brands section and still shows the maintenance plan and totals.

## 6. Suppliers & catalog

- [ ] Select one/multiple suppliers in step 2; catalog filters accordingly.
- [ ] Comparison appears when two selected suppliers offer the same product.
- [ ] Catalog-linked line supplier is locked.
- [ ] Non-selected-supplier line shows red warning and **Find at another supplier**.
- [ ] Replacement search only shows selected suppliers.
- [ ] Catalog filters/search reset and work in both languages.
- [ ] Material subgroups (including plumbing/PVC) filter correctly.

## 7. Prices, deals & RFQ

- [ ] **Update prices** lists stale items, opens the portal link, and saves cost/date.
- [ ] Manual line saves price, includes, source, link, and promo.
- [ ] Deals cards show discount, old price, new price, savings, and validity.
- [ ] RFQ only generates recipients with configured emails.
- [ ] RFQ draft opens in the mail client with the expected content.

## 8. Totals, tax & payment

- [ ] Tax field displays `6.625` and state stores `0.06625`.
- [ ] All stage subtotals add up to the summary.
- [ ] Discount percentage and fixed amount apply correctly.
- [ ] Deposit percentage produces the same schedule in UI and PDF.
- [ ] Payment method/terms match the schedule and printed proposal.
- [ ] Changing mode (ST-8, repair, materials, custom) changes tax as expected.
- [ ] Currency formatting is USD with two decimals where appropriate.

## 9. Company & logo

- [ ] Company data saves explicitly and persists after refresh.
- [ ] Local logo upload shows a preview, saves, and survives refresh.
- [ ] Remove logo restores the fallback.
- [ ] Live logo URL works online and falls back offline.
- [ ] Compliance guidance (HIC, Master HVACR, insurance) is visible and readable.

## 10. PDF / print

- [ ] PDF opens from the Summary step.
- [ ] PDF excludes the detailed material list.
- [ ] PDF includes company info/logo, client, scope, equipment/brands, lead times, payment schedule, warranty, inclusions/exclusions, totals, taxes.
- [ ] Maintenance appears when applicable.
- [ ] Maintenance-only PDF omits the equipment-brands block.
- [ ] Brand logos are legible or fall back gracefully.
- [ ] No clipped text, broken tables, or blank pages.

## 11. Language & theme

- [ ] Every visible label switches ES → EN with no Spanish leakage.
- [ ] Modal titles, buttons, help text, empty states, and toasts translate.
- [ ] Dates/numbers remain sensible in both languages.
- [ ] Dark mode is default and persists.
- [ ] Light mode is fully legible; no invisible text or low-contrast controls.
- [ ] `v1.3 · HVAC · NJ` branding is correct (no USD in that line).
- [ ] Next button and maintenance hero look correct in both themes.

## 12. Data & backups

- [ ] **Save JSON** downloads a valid backup.
- [ ] **Load JSON** restores company, suppliers, catalog, and projects.
- [ ] Invalid JSON shows a clear error and does not destroy current data.
- [ ] **Load JSON from URL** works with a CORS-enabled source; fails gracefully otherwise.
- [ ] Catalog CSV load updates prices/source/date.
- [ ] Legacy/migrated state loads without errors, including maintenance data without `dismissed`/source fields.
- [ ] Clearing site data starts a clean app.

## 13. Offline & responsive

- [ ] Disconnect network: app still loads, edits, calculates, and prints.
- [ ] Online/offline indicator updates.
- [ ] Remote logos fall back.
- [ ] At 1366×768, 1920×1080, and a narrow window, no horizontal scrolling or overlapping controls.
- [ ] Modals fit the viewport and scroll internally when needed.
- [ ] Maintenance hero stacks cleanly and the plan table remains usable on a narrow window.

## 14. Syntax gate

```bash
node --check js/data.js
node --check js/i18n.js
node --check js/store.js
node --check js/ui.js
node --check js/app.js
```
