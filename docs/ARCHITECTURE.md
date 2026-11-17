# Architecture — HVAC Project Catcher Plus

## System shape

```
Browser
  index.html
    ├── styles.css
    ├── js/data.js    → constants (catalog, brands, suppliers, NJ defaults)
    ├── js/i18n.js    → ES/EN dictionary + language helpers + SVG logo
    ├── js/store.js   → state, migration, persistence, calc, checklist, imports
    ├── js/ui.js      → HTML rendering, wizard, modals, tables, PDF
    └── js/app.js     → router, event delegation, startup, online status
```

There is no server, no build step, and no external JS dependency. The modules share `window.PCP`.

## Module responsibilities

### `js/data.js`

- `P.CATALOG` seed items with supplier, cost, unit, source, date, promo, brand/model/SKU, and `includes`.
- `P.BRANDS` brand records with domain/logo/color/short code.
- `P.SUPPLIERS` supplier records with portal URLs, domain, logo, email status.
- `P.MAT_SUBS` material subgroups with bilingual labels and icons.
- `P.DEFAULT_COMPANY`, `P.DEFAULT_SETTINGS`, `P.DEFAULT_INCLUSIONS`, `P.DEFAULT_EXCLUSIONS`.
- NJ tax defaults and client/system dictionaries.

### `js/i18n.js`

- `P.i18n.t(key)`, `P.i18n.lang()`, `P.i18n.setLang()`.
- Dictionaries for all UI strings in Spanish and English.
- `P.i18n.clientLabel(id)`, `P.i18n.logoSVG(size)`.

### `js/store.js`

- `S.load()`, `S.save()`, `S.migrate(state)`.
- `S.newProject(opts)`, `S.getProject(id)`, `S.deleteProject(id)`.
- `S.buildSchedule(depositPct)`, `S.syncPayment(project)`.
- `S.calc(project)`, `S.checklist(project, calc)`.
- `S.exportJSON()`, `S.importJSON(text)`, `S.importCatalogCSV(text)`.
- `S.uid`, `U.num`, `U.round2`, `U.money`, `U.pct`, etc.

### `js/ui.js`

- Screen renderers: home, projects, project wizard, catalog, deals, suppliers, company.
- Wizard step definitions and dynamic maintenance insertion.
- Catalog table rows, picker refresh, line modal, supplier/catalog/RFQ modals.
- `printProject(project)` builds `#print-root` for browser PDF.
- Logo fallback and status pills.
- Local helper `t()` wraps `P.i18n.t()`.

### `js/app.js`

- Hash router: `#/home`, `#/projects`, `#/project/{id}/{step}`, `#/catalog`, `#/deals`, `#/suppliers`, `#/company`.
- Global click/input/change/focusout handlers using `data-action` / `data-bind`.
- Create-project flow, theme/language toggles, backup/restore, CSV/JSON, URL import, online status.
- Initial load and soft rerender scheduling.

## Data flow

1. User edits a field.
2. Event handler updates `S.state` in place.
3. `S.save()` persists to `localStorage`.
4. `S.calc(project)` recomputes totals.
5. UI updates totals in place (no full re-render while typing).
6. On navigation/change, `UI.render*` returns fresh HTML.

## Calculation order

```
line cost × qty
  → stage markup or target pricing
  → global factor
  → contingency %
  → overhead %
  → maintenance sell/cost
  → discount % + fixed amount
  → taxable base by mode
  → sales tax
  → total / deposit / schedule
```

The exact implementation is `S.calc`. Any new money field must be added there first, then surfaced in summary/PDF.

## Tax modes

- **Capital improvement (ST-8):** labor exempt; materials/equipment taxable.
- **Repair/maintenance:** labor and materials taxable.
- **Materials only:** tax on materials/equipment.
- **Custom:** user-defined base.

Tax is stored as a decimal and displayed as a percentage.

## Persistence & migration

- One key: `pcp_state_v1_v1`.
- On load: parse → migrate → normalize. Corrupt JSON falls back to a blank state.
- On save: serialize the entire state.
- Backups are plain JSON. CSV import only updates catalog rows.

## Security & privacy

- No remote API, analytics, or auth.
- User data stays in the browser.
- Remote requests are limited to logo URLs and user-initiated JSON URLs.
- Supplier portals open in new tabs.

## Extension rules

- Add new UI strings to both ES and EN dictionaries.
- Add new colors as CSS variables and verify both themes.
- Add new catalog subgroups to `P.MAT_SUBS` with `label`, `labelEn`, and `icon`.
- Never name a DOM element `t` inside handlers that use i18n `t()`.
- Keep script order unchanged.
- Keep tax decimal internally.
- Update `S.calc`, `S.checklist`, and `printProject` together when adding a money/scope concept.
