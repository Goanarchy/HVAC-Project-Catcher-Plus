# Project Technical Context — HVAC Project Catcher Plus (v1.2.0)

This document is the technical orientation for maintainers. It describes the runtime architecture, state model, calculation engine, persistence, and the non-obvious constraints of the project.

---

## 1. Runtime & Build Architecture

- **Stack:** vanilla HTML5, CSS3, and ES5-compatible JavaScript. No framework, no bundler, no transpiler, no package dependencies.
- **Entry point:** `index.html`, loaded directly over `file:///` or any static host.
- **Windows launcher:** `start.bat` opens the app in Edge/Chrome app mode and falls back to the default browser.
- **Namespace:** every module attaches to the single global `window.PCP`.
- **Load order (must not change):**
  1. `js/data.js` → `P` constants: catalog, brands, suppliers, NJ defaults, material subgroups.
  2. `js/i18n.js` → `P.i18n`: ES/EN dictionaries, language helpers, SVG logo.
  3. `js/store.js` → `P.store`: state, migration, persistence, calculations, checklist, import/export.
  4. `js/ui.js` → `P.ui`: rendering, wizard, modals, catalog tables, PDF/print.
  5. `js/app.js` → router, event delegation, startup, online status.
- **No server:** there is no API, account system, telemetry, or cloud sync. The app is a single local document plus `localStorage`.

### Why load order matters

`store.js` captures `P.util` as a local `U` reference at module evaluation time (`var U = P.util;`). `ui.js` and `app.js` also capture `P.store`, `P.ui`, and `P.util` at startup. Reordering scripts or lazy-loading them will produce `X is not defined` failures.

---

## 2. State Model

**Storage key:** `pcp_state_v1_v1`
**Format:** a single JSON object serialized by `P.store.save()`.
**Migration:** `P.store.migrate(parsed)` fills missing branches and normalizes legacy shapes. Unknown extra keys are preserved where practical.

Top-level shape:

```js
{
  version: 1,
  ui: { theme: 'dark', lang: 'es', lastRoute: '#/home' },
  seq: 1,                         // project number sequence (PC-YYYY-NNN)
  company: { ... },               // name, contact, HIC, license, insurance, logo (data URL or URL)
  settings: { ... },              // defaults: taxRate (decimal), taxMode, markups, depositPct, etc.
  suppliers: [ ... ],             // editable supplier records (email, phone, portal, domain, logo)
  catalog: [ ... ],               // seed catalog + user edits
  projects: [ ... ]               // newest first
}
```

### Project shape (important fields)

```js
{
  id, number, projectName, createdAt, updatedAt, status,
  date, validUntil,
  client: { name, company, email, phone, address, city, state, zip, type },
  scope: ['ac', 'heat', 'maint', ...],
  selectedSuppliers: ['homedepot', ...],
  lines: {
    equipment: [], freight: [], indirects: [], materials: [], labor: [], other: []
  },
  settings: {
    taxMode, taxRate,            // taxRate is a DECIMAL internally (0.06625)
    globalFactor, contingencyPct, overheadPct, depositPct,
    validityDays, discountPct, discountAmt,
    materialsTaxAsCost, pricingMode: 'margin' | 'markup' | 'target'
  },
  terms: {
    deliveryTime, paymentMethod, equipmentLeadTime, warranty, notes,
    schedule: [{ label, pct }],  // kept in sync with depositPct
    ...
  },
  inclusions: [], exclusions: [],
  maintenance: { items: [], notes: '', contractMonths: 12, includeMaterials: true },
  acknowledged: { st8, permit, insurance },
  internalNotes
}
```

### Payment schedule

`P.store.buildSchedule(depositPct)` produces the three-stage schedule used by both the UI and the PDF:

- `depositPct` = 100 → single payment at signing.
- `depositPct` = 0 → 50% at start, 50% at completion.
- Otherwise → deposit at signing, then the remainder split between start and completion.

`P.store.syncPayment(project)` writes the schedule into the project. Any change to the deposit percentage or payment terms must go through this function so the printed proposal never diverges from the on-screen totals.

---

## 3. Calculation Engine

`P.store.calc(project)` is the single source of truth for money. It:

1. Normalizes each line (quantity, unit cost, sell price, markup, stage grouping).
2. Applies stage markup / target pricing and the global factor.
3. Adds contingency and overhead.
4. Adds maintenance (sell and cost) when present.
5. Applies discounts (percentage and fixed amount).
6. Computes tax according to `taxMode` and `materialsTaxAsCost`.
7. Returns totals used by:
   - stage subtotals,
   - summary cards,
   - checklist scoring,
   - PDF/print output,
   - deposit and schedule amounts.

**Tax rate contract:** `settings.taxRate` is always a decimal (`0.06625`). The UI divides/multiplies by 100 for display. Do not store `6.625` in state.

**Maintenance:** `project.maintenance.items[]` entries use `{ type, qty, visits, pricePerVisit, materialsPerVisit }`. `includeMaterials` and `contractMonths` affect the totals. Maintenance is included in `calc`, checklist, summary, and PDF when scope contains `maint`.

---

## 4. Completeness Checklist

`P.store.checklist(project, calc)` returns `{ score, ok, warn, fail, items }`. It is intentionally permissive: missing information is a warning with a bilingual explanation, not a hard block. The wizard shows the score; the summary step repeats the critical items.

Key checks include: scope, client, description, delivery/payment terms, at least one equipment line, material/labor coverage, price freshness (`priceDate`), "what is included", margin, tax/ST-8 acknowledgment, HIC/license/insurance, and maintenance when in scope.

---

## 5. Persistence & Import/Export

- `save()` writes the whole state to `localStorage` after every meaningful edit (and on interval/demand).
- `importJSON(text)` validates and replaces state; used by file upload and the live URL loader.
- `exportJSON()` returns a deterministic backup.
- `importCatalogCSV(text)` updates catalog items in bulk (price, promo, source/date/link).
- **Live URL import** uses `fetch()`; the source must allow CORS. Offline or CORS-blocked sources fail gracefully with a toast.
- Logos: local files are stored as data URLs; remote logos use domain-based providers with an initials fallback.

**Privacy:** no state leaves the browser unless the user explicitly loads a URL or opens a supplier portal. There is no analytics.

---

## 6. Rendering, Wizard & Events

- `P.ui.render*` functions return HTML strings; `app.js` swaps `#app` content.
- **Event delegation:** global `click`, `input`, `change`, and `focusout` handlers in `app.js`. Interactive elements carry `data-action` or `data-bind`.
- **Focus stability:** bound inputs are not re-rendered on every keystroke. Input updates state, refreshes totals in place, and schedules a soft re-render only after typing settles.
- **Critical naming rule:** inside event handlers, do not name a DOM element `t` — it shadows the i18n helper `t(key)`, causing runtime failures. The click handler uses `btn`.
- **Wizard:** `P.ui.getSteps(project)` returns the base steps and inserts `maintenance` before `summary` only when `scope` includes `maint`. URLs are `#/project/{id}/{step}`.
- **Modals:** a single shell (`#modal-backdrop`, `#modal-body`, `#modal-foot`); `openModal/closeModal` manage content and visibility. Backdrop click and `close-modal` close it.

### Recent root-cause fixes (v1.2)

- `app.js` click handler variable `t` → `btn` (translation shadowing).
- `store.js` missing `var U = P.util;` caused `U is not defined` during `newProject → syncPayment → buildSchedule`.
- Input/change/focusout handlers restored to use `event.target` after an over-broad rename.

---

## 7. i18n & Theming

- `P.i18n.t(key)` resolves strings for the active language. Dictionaries live in `js/i18n.js`.
- Language is persisted in `state.ui.lang`; the document `lang` attribute is updated at runtime.
- All user-facing labels should go through `t()` or the `tr(es, en)` helper; dynamic data (brand/supplier names, catalog labels) uses bilingual fields or `P.subLabel`/`P.subIcon`.
- Theme is persisted in `state.ui.theme` and applied via `data-theme` on `<html>`. Dark is the default; both themes share the same tokens in `styles.css`.

---

## 8. Catalog & Supplier Rules

- Catalog items carry `supplierId`, `sub` (material subgroup), brand/model/SKU, cost, unit, `includes`, `priceDate`, `sourceUrl`, and optional promo.
- `P.MAT_SUBS` groups materials by function, not by store, so a single installation can mix suppliers. Labels are bilingual (`label` / `labelEn`).
- **Catalog-linked lines** (`catalogId`) are locked to the catalog item's supplier. A user cannot reassign them to a supplier that does not offer the item.
- Lines from non-selected suppliers are flagged in red with **"Buscar en otro proveedor"**, constrained to the project's selected suppliers.
- RFQ emails are generated only from supplier records with a configured email. The app never invents addresses.

---

## 9. PDF / Print

- `P.ui.printProject(project)` builds a print-only document in `#print-root` and invokes the browser print dialog (Save as PDF).
- The client proposal intentionally **excludes the detailed material list**. It includes company identity/logo, client/project, scope/overview, equipment and brands, delivery/lead times, payment schedule, warranty/terms, inclusions/exclusions, totals, taxes, and acceptance language.
- Maintenance appears as part of the scope and totals when applicable.
- Remote logos may be unavailable offline; the PDF falls back to initials/wordmarks. For mission-critical printouts, configure a local company logo and confirm suppliers' logos while online.

---

## 10. Online Behavior & Limitations

- A connectivity indicator reflects `navigator.onLine` plus `online`/`offline` events.
- Live logos use public domain-based endpoints with `onerror` fallback chains.
- **No automatic scraping:** browser CORS and supplier anti-bot measures make unattended price scraping infeasible. Price verification is manual through supplier portals, then stored with a date/source.
- Live JSON import depends on the remote server sending permissive CORS headers.

---

## 11. Repository Conventions

- `README.md` — user-facing overview and quick start.
- `PROJECT_CONTEXT.md` — this file.
- `RELEASE_NOTES.md` — version highlights.
- `NEXT_VERSION_ROADMAP.md` — planned work.
- `docs/` — architecture, QA, deployment.
- `.github/workflows/deploy-pages.yml` — static GitHub Pages deployment (copies only runtime files to `_site`).
- `LICENSE` — MIT.
- No generated build artifacts are committed; `_site`, `dist`, and `node_modules` are ignored.

---

## 12. Verification Commands

```bash
node --check js/data.js
node --check js/i18n.js
node --check js/store.js
node --check js/ui.js
node --check js/app.js
```

Smoke test for the store (Node, no browser):

```js
global.window = {};
global.localStorage = { _d: {}, getItem(k){ return this._d[k] || null; }, setItem(k,v){ this._d[k] = String(v); } };
require('./js/data.js');
require('./js/store.js');
const P = global.window.PCP, S = P.store;
S.load();
const p = S.newProject({ projectName: 'Test', clientName: 'Client' });
console.log(p.number, p.schedule);
```
