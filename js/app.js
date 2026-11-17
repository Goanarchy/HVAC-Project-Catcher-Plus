/* =====================================================================
   HVAC Project Catcher Plus 1.2 — App (router, eventos, arranque)
   ===================================================================== */
(function () {
  'use strict';
  var P = window.PCP, S = P.store, UI = P.ui, U = P.util, $ = UI.$, $all = UI.$all;
  var I = P.i18n;
  function t(k,v){ return I ? I.t(k,v) : k; }
  function lang(){ return I ? I.lang() : 'es'; }
  function LClient(id){ return I ? I.clientLabel(id) : id; }
  function tr(es,en){ return lang()==='en' ? en : es; }

  /* ---------------------------------------------------------------- */
  /* Router                                                           */
  /* ---------------------------------------------------------------- */
  function applyLang() {
    document.documentElement.lang = lang();
  }
  function applyTheme() {
    var theme = (S.state.ui && S.state.ui.theme) || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  }

  function route() {
    var h = location.hash || '#/home';
    S.state.ui.lastRoute = h;
    var m;
    if (h === '#/home' || h === '#' || h === '') return render(UI.renderHome());
    if (h === '#/projects') return render(UI.renderProjects());
    if (h === '#/catalog') { render(UI.renderCatalog()); refreshCatalog(); return; }
    if (h === '#/deals') return render(UI.renderDeals());
    if (h === '#/suppliers') return render(UI.renderSuppliers());
    if (h === '#/company') return render(UI.renderCompany());
    if (h === '#/new') { openNewProjectModal(); return; }
    if ((m = h.match(/^#\/project\/([^\/]+)\/(\d+)/))) { render(UI.renderProject(m[1], parseInt(m[2], 10))); return; }
    if ((m = h.match(/^#\/project\/([^\/]+)/))) { render(UI.renderProject(m[1], 1)); return; }
    render(UI.renderHome());
  }

  function openNewProjectModal() {
    var body = '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">' + (I?I.logoSVG(38):'') + '<div><b>' + esc(t('appName')) + '</b><div class="small muted">' + esc(t('tagline')) + '</div></div></div>'
      + '<div class="form-row">'
      + '<div class="field col-12"><label>' + esc(t('projectName')) + ' *</label><input id="np-name" type="text" placeholder="' + esc(t('projectNamePh')) + '"></div>'
      + '<div class="field col-6"><label>' + esc(t('clientName')) + ' *</label><input id="np-client" type="text" placeholder="' + esc(t('clientNamePh')) + '"></div>'
      + '<div class="field col-6"><label>' + esc(t('clientCompanyOpt')) + '</label><input id="np-company" type="text" placeholder="' + esc(t('clientCompanyPh')) + '"></div>'
      + '<div class="field col-6"><label>' + esc(t('clientType')) + '</label><select id="np-type">' + P.CLIENT_TYPES.map(function(ct){return '<option value="'+ct.id+'">'+P.util.esc(LClient(ct.id))+'</option>';}).join('') + '</select></div>'
      + '<div class="col-12"><label class="check-tile maint-only-check"><input type="checkbox" id="np-maint-only"><div><div class="t">🛠️ ' + (lang()==='en'?'Maintenance-only project':'Proyecto solo de mantenimiento') + '</div><div class="d">' + (lang()==='en'?'Creates a simplified Scope → Maintenance → Summary flow. Equipment will load automatically if you quote it.':'Crea un flujo simplificado Alcance → Mantenimiento → Resumen. Los equipos se cargan automáticamente si los cotizas.') + '</div></div></label></div>'
      + '</div><div class="notice info">💡 ' + esc(t('projectClientHelp')) + '</div>';
    UI.openModal('✨ ' + t('newProject'), body,
      '<button class="btn" data-action="close-modal">' + esc(t('cancel')) + '</button><button class="btn primary" data-action="create-project">🚀 ' + esc(t('createProject')) + '</button>', { small: true });
    setTimeout(function(){ var el = document.getElementById('np-name'); if(el) el.focus(); }, 50);
  }
  function esc(s){ return U.esc(s==null?'':String(s)); }

  function captureFocus() {
    var ae = document.activeElement;
    if (!ae) return null;
    var app = $('#app');
    if (!app || !app.contains(ae)) return null;
    var tag = ae.tagName;
    if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') return null;
    var info = { bind: ae.getAttribute('data-bind'), id: ae.id || '', name: ae.getAttribute('name') || '', tag: tag };
    try { info.start = ae.selectionStart; info.end = ae.selectionEnd; } catch (e) {}
    info.scrollX = window.scrollX || 0;
    info.scrollY = window.scrollY || 0;
    info.mainScroll = (document.scrollingElement || document.documentElement).scrollTop || 0;
    return info;
  }
  function restoreFocus(info) {
    if (!info) { window.scrollTo(0, 0); return; }
    var app = $('#app'); if (!app) return;
    var el = null;
    if (info.bind) el = app.querySelector('[data-bind="' + info.bind.replace(/"/g, '\\"') + '"]');
    if (!el && info.id) el = document.getElementById(info.id);
    if (!el && info.name) el = app.querySelector('[name="' + info.name.replace(/"/g, '\\"') + '"]');
    if (el) {
      try { el.focus({ preventScroll: true }); } catch (e) { try { el.focus(); } catch(e2){} }
      if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && info.start != null && info.end != null) {
        try { el.setSelectionRange(info.start, info.end); } catch (e3) {}
      }
    }
    var sy = info.scrollY || info.mainScroll || 0;
    window.scrollTo(info.scrollX || 0, sy);
  }

  function render(html, opts) {
    opts = opts || {};
    var focusInfo = opts.preserveFocus !== false ? captureFocus() : null;
    $('#app').innerHTML = html;
    restoreFocus(focusInfo);
  }

  function rerender() {
    route();
  }

  /* ---------------------------------------------------------------- */
  /* Catalog page helpers                                             */
  /* ---------------------------------------------------------------- */
  function refreshCatalog() {
    var table = $('#catalog-table'); if (!table) return;
    var q = ($('#cat-q') || {}).value || '';
    var stage = ($('#cat-stage') || {}).value || '';
    var sup = ($('#cat-sup') || {}).value || '';
    var promo = ($('#cat-promo') || {}).value || '';
    var items = S.searchCatalog(q, { cat: stage || undefined, supplier: sup || undefined, promo: promo ? true : false }).slice(0, 120);
    table.innerHTML = UI.catalogTableRows(items, {});
  }

  /* ---------------------------------------------------------------- */
  /* Binding                                                          */
  /* ---------------------------------------------------------------- */
  function currentProjectId() {
    var m = location.hash.match(/^#\/project\/([^\/]+)/);
    return m ? m[1] : null;
  }

  function handleBind(el, evt) {
    var bind = el.getAttribute('data-bind'); if (!bind) return;
    var pid = currentProjectId();
    var val = (el.type === 'checkbox') ? el.checked : el.value;
    var evType = (evt && evt.type) || 'change';
    var isTypingInput = el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && /^(text|email|tel|number|search|date|time|url)$/i.test(el.type || 'text'));

    function numVal(v) {
      if (el.type === 'number' && evType === 'input') {
        // keep raw while typing (allows "1.", "-", etc.) to avoid cursor jumps
        if (v === '' || v === '-' || v === '.' || v === '-.') return v;
        return v;
      }
      return U.num(v);
    }

    // company
    if (bind.indexOf('company.') === 0) {
      var ck = bind.slice(8);
      S.state.company[ck] = val;
      S.save();
      return;
    }
    // global settings (company/defaults context)
    if (bind.indexOf('settings.markup.') === 0) {
      var sid = bind.slice('settings.markup.'.length);
      S.state.settings.defaultMarkups[sid] = (el.type === 'number' && evType === 'input') ? val : U.num(val);
      S.save();
      if (evType === 'input') scheduleRerender(); else rerender();
      return;
    }
    if (bind.indexOf('settings.') === 0 && !pid) {
      var sk = bind.slice(9);
      if (sk === 'materialsTaxAsCost') S.state.settings[sk] = (val === 'true' || val === true);
      else if (sk === 'taxMode' || sk === 'pricingMode') S.state.settings[sk] = val;
      else if (sk === 'taxRate') S.state.settings[sk] = U.num(val) / 100;
      else S.state.settings[sk] = (el.type === 'number' && evType === 'input') ? val : U.num(val);
      S.save();
      if (sk === 'taxRate') softRefreshProject(currentProjectId());
      return;
    }

    if (!pid) return;
    var p = S.getProject(pid); if (!p) return;

    if (bind === 'scope') {
      var vals = $all('input[data-bind="scope"]:checked').map(function (x) { return x.value; });
      p.scope = vals;
      if (S.syncMaintenance) S.syncMaintenance(p, { save: false });
    } else if (bind === 'selectedSuppliers') {
      var svals = $all('input[data-bind="selectedSuppliers"]:checked').map(function (x) { return x.value; });
      p.selectedSuppliers = svals;
    } else if (bind.indexOf('client.') === 0) {
      p.client[bind.slice(7)] = val;
    } else if (bind.indexOf('terms.') === 0) {
      p.terms = p.terms || {};
      p.terms[bind.slice(6)] = val;
    } else if (bind.indexOf('settings.') === 0) {
      var pk = bind.slice(9);
      if (pk === 'materialsTaxAsCost') p.settings[pk] = (val === 'true' || val === true);
      else if (pk === 'taxMode' || pk === 'pricingMode') p.settings[pk] = val;
      else if (pk === 'taxRate') p.settings[pk] = U.num(val) / 100;
      else p.settings[pk] = numVal(val);
      if (pk === 'depositPct' && S.syncPayment) S.syncPayment(p);
    } else if (bind.indexOf('maintenance.') === 0) {
      p.maintenance = p.maintenance || { items: [], notes: '', contractMonths: 12, includeMaterials: true };
      var mk = bind.slice(12);
      if (mk === 'notes') p.maintenance.notes = String(val || '');
      else p.maintenance[mk] = (el.type === 'number' && evType === 'input') ? val : U.num(val);
    } else if (bind === 'ack.st8') {
      p.acknowledged.st8 = !!val;
    } else if (bind === 'inclusions') {
      p.inclusions = String(val).split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    } else if (bind === 'exclusions') {
      p.exclusions = String(val).split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    } else if (bind in p) {
      p[bind] = val;
    }
    p.updatedAt = new Date().toISOString();
    S.save();
    // Avoid full rerenders while typing to prevent focus loss; update totals/progress in-place
    if (el.type === 'checkbox' || el.type === 'radio' || el.tagName === 'SELECT') {
      rerender();
      return;
    }
    if (isTypingInput) {
      softRefreshProject(pid);
      // On blur/change of typing inputs, rerender to reflect structural changes (e.g. deposit schedule)
      if (evType === 'change') { rerender(); return; }
      // For some settings/maintenance, schedule a gentle rerender so derived UI catches up
      if (bind === 'settings.depositPct' || bind === 'settings.taxRate' || bind === 'settings.globalFactor' || bind === 'settings.discountPct' || bind === 'settings.discountAmt' || bind.indexOf('maintenance.') === 0) {
        scheduleRerender();
      }
      return;
    }
    rerender();
  }

  function softRefreshProject(pid) {
    if (!pid || !UI || !UI.projectSidebar || !UI.wizardProgressHTML) return;
    var p = S.getProject(pid); if (!p) return;
    try {
      var c = S.calc(p), ch = S.checklist(p, c);
      var sb = document.getElementById('project-sidebar');
      if (sb) sb.outerHTML = UI.projectSidebar(p, c, ch);
      var wp = document.getElementById('wizard-progress');
      if (wp) wp.innerHTML = UI.wizardProgressHTML(ch);
    } catch (e) { /* fallback silent */ }
  }

  function isFiniteNumber(v) { return v !== '' && !isNaN(Number(v)); }

  var rerenderTimer = null;
  function scheduleRerender() {
    clearTimeout(rerenderTimer);
    rerenderTimer = setTimeout(function () { rerender(); }, 900);
  }

  /* ---------------------------------------------------------------- */
  /* Events                                                           */
  /* ---------------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    var a = btn.getAttribute('data-action');

    if (a === 'close-modal') { UI.closeModal(); return; }
    if (a === 'toggle-theme') {
      S.state.ui.theme = (S.state.ui.theme === 'dark') ? 'light' : 'dark';
      S.save(); applyTheme(); rerender(); return;
    }
    if (a === 'toggle-lang') {
      S.state.ui.lang = (S.state.ui.lang === 'en') ? 'es' : 'en';
      S.save(); applyLang(); rerender(); return;
    }
    if (a === 'open-new-project') { openNewProjectModal(); return; }
    if (a === 'create-project') {
      try {
        var pnameEl = $('#np-name');
        var cnameEl = $('#np-client');
        var pname = pnameEl ? pnameEl.value : '';
        var cname = cnameEl ? cnameEl.value : '';
        var ccomp = ($('#np-company')||{}).value || '';
        var ctype = ($('#np-type')||{}).value || 'residential';
        var maintOnlyNew = !!($('#np-maint-only')||{}).checked;
        if (!String(pname).trim() || !String(cname).trim()) {
          UI.toast(tr('Ingresa el nombre del proyecto y del cliente.','Enter the project name and client name.'), 'warn');
          if (pnameEl && !String(pname).trim()) { try { pnameEl.focus(); } catch(e){} }
          else if (cnameEl) { try { cnameEl.focus(); } catch(e){} }
          return;
        }
        var np = S.newProject({ projectName: String(pname).trim(), clientName: String(cname).trim(), clientCompany: String(ccomp).trim(), scope: maintOnlyNew ? ['maint'] : ['ac'] });
        if (np && np.client) np.client.type = ctype;
        if (!np || !np.id) throw new Error('project_not_created');
        S.save();
        UI.closeModal();
        location.hash = '#/project/' + np.id + '/1';
      } catch (err) {
        try { UI.toast(tr('No se pudo crear el proyecto: ', 'Could not create project: ') + (err && err.message ? err.message : err), 'warn'); } catch(e2) { alert((err && err.message) || err); }
      }
      return;
    }

    if (a === 'new-line') {
      UI.openLineModal(currentProjectId(), btn.getAttribute('data-stage'), null);
      return;
    }
    if (a === 'edit-line') {
      var f = S.getLine(currentProjectId(), btn.getAttribute('data-id'));
      if (f) UI.openLineModal(currentProjectId(), f.stage, f.line.id);
      return;
    }
    if (a === 'save-line') {
      var pid = btn.getAttribute('data-pid'), stage = btn.getAttribute('data-stage'), lid = btn.getAttribute('data-line');
      var data = UI.readLineForm();
      if (lid) {
        var ex = S.getLine(pid, lid);
        if (ex && ex.line && ex.line.catalogId) {
          // catalog-linked item: supplier must remain the catalog item's supplier
          data.supplier = ex.line.supplier;
          data.catalogId = ex.line.catalogId;
        }
        S.updateLine(pid, lid, data);
      } else {
        S.addLine(pid, stage, data);
      }
      var lp = S.getProject(pid);
      if (lp && S.syncMaintenance) S.syncMaintenance(lp);
      UI.closeModal(); UI.toast(lid ? tr('Ítem actualizado','Item updated') : tr('Ítem agregado','Item added'), 'success'); rerender();
      return;
    }
    if (a === 'del-line') {
      if (!confirm(tr('¿Eliminar este ítem?','Delete this item?'))) return;
      var dpid = currentProjectId();
      S.removeLine(dpid, btn.getAttribute('data-id'));
      var dp = S.getProject(dpid);
      if (dp && S.syncMaintenance) S.syncMaintenance(dp);
      rerender(); return;
    }
    if (a === 'dup-line') {
      var f2 = S.getLine(currentProjectId(), btn.getAttribute('data-id'));
      if (f2) {
        S.addLine(currentProjectId(), f2.stage, JSON.parse(JSON.stringify(f2.line)));
        var dupP = S.getProject(currentProjectId());
        if (dupP && S.syncMaintenance) S.syncMaintenance(dupP);
        rerender();
      }
      return;
    }

    if (a === 'open-catalog') {
      UI.openCatalogPicker(btn.getAttribute('data-pid') || currentProjectId(), btn.getAttribute('data-stage'), { query: btn.getAttribute('data-query') || '', replaceWarn: !!btn.getAttribute('data-query') }); return;
    }
    if (a === 'add-catalog') {
      var itemId = btn.getAttribute('data-item'), stageId = btn.getAttribute('data-stage');
      var item = S.state.catalog.filter(function (x) { return x.id === itemId; })[0];
      var pid2 = (window._pcpPick && window._pcpPick.pid) || currentProjectId();
      if (item && pid2) {
        S.addFromCatalog(pid2, stageId || item.cat, item, 1);
        var catP = S.getProject(pid2);
        if (catP && S.syncMaintenance) S.syncMaintenance(catP);
        UI.toast(tr('Agregado: ','Added: ') + item.name, 'success');
        rerender();
        if ($('#pick-table')) UI.refreshPicker();
      }
      return;
    }
    if (a === 'edit-catalog') { UI.openCatalogEditModal(btn.getAttribute('data-id')); return; }
    if (a === 'save-catalog') {
      var cid = btn.getAttribute('data-id');
      var it = S.state.catalog.filter(function(x){return x.id===cid;})[0];
      if (it) {
        it.name = $('#ci-name').value.trim() || it.name;
        it.cat = $('#ci-cat').value; it.brand = $('#ci-brand').value.trim(); it.model = $('#ci-model').value.trim();
        it.sku = $('#ci-sku').value.trim(); it.unit = $('#ci-unit').value; it.cost = U.num($('#ci-cost').value);
        it.supplier = $('#ci-supplier').value; it.includes = $('#ci-includes').value.trim();
        var pp = $('#ci-promo').value; var pe = $('#ci-pend').value;
        it.promo = pp !== '' && U.num(pp) > 0 ? { price: U.num(pp), ends: pe || '', label: it.promo ? (it.promo.label||'Oferta') : 'Oferta' } : null;
        it.demo = $('#ci-demo').checked; it.updated = U.today();
        S.save(); UI.closeModal(); UI.toast(tr('Catálogo actualizado','Catalog updated'), 'success'); rerender();
      }
      return;
    }

    if (a === 'edit-supplier') { UI.openSupplierModal(btn.getAttribute('data-id')); return; }
    if (a === 'add-supplier') { UI.openSupplierModal(null); return; }
    if (a === 'save-supplier') {
      var sid = btn.getAttribute('data-id');
      var rec = {
        name: $('#sp-name').value.trim(), short: $('#sp-short').value.trim() || $('#sp-name').value.trim(),
        email: $('#sp-email').value.trim(), phone: $('#sp-phone').value.trim(),
        quoteUrl: $('#sp-quote').value.trim(), contactUrl: $('#sp-contact').value.trim(),
        note: $('#sp-note').value.trim(), emailStatus: $('#sp-email').value.trim() ? 'ok' : 'pending'
      };
      if (sid) { var ex = S.supplier(sid); if (ex) Object.assign(ex, rec); }
      else { rec.id = U.uid('sup'); S.state.suppliers.push(rec); }
      S.save(); UI.closeModal(); UI.toast(tr('Proveedor guardado','Supplier saved'), 'success'); rerender(); return;
    }

    if (a === 'update-prices') { UI.openUpdatePricesModal(btn.getAttribute('data-id') || currentProjectId()); return; }
    if (a === 'mark-price-today') {
      var mpid = btn.getAttribute('data-pid') || currentProjectId();
      var mid = btn.getAttribute('data-id');
      var mf = S.getLine(mpid, mid);
      if (mf && mf.line) { mf.line.priceDate = U.today(); if (mf.project) mf.project.updatedAt = new Date().toISOString(); S.save(); UI.toast(tr('Fecha de precio actualizada a hoy','Price date set to today'), 'success'); UI.openUpdatePricesModal(mpid); rerender(); }
      return;
    }
    if (a === 'edit-line-price') {
      var epid = btn.getAttribute('data-pid') || currentProjectId();
      var eid = btn.getAttribute('data-id');
      var estage = btn.getAttribute('data-stage');
      var ef = S.getLine(epid, eid);
      UI.openLineModal(epid, estage || (ef && ef.stage), eid);
      return;
    }

    if (a === 'open-rfq') { UI.openRFQModal(btn.getAttribute('data-id')); return; }
    if (a === 'copy-rfq') {
      var p = S.getProject(btn.getAttribute('data-id')); if (!p) return;
      var txt = [];
      P.STAGES.forEach(function(stg){ (p.lines[stg.id]||[]).forEach(function(l){ if(stg.id==='labor'||stg.id==='other') return; txt.push('- ' + l.qty + ' ' + l.unit + '  ' + l.name + (l.brand||l.model?' ('+[l.brand,l.model].filter(Boolean).join(' ')+')':'') + (l.sku?' [SKU '+l.sku+']':'') + '  [' + S.supplierName(l.supplier) + ']'); }); });
      copyText(txt.join('\n')); UI.toast(tr('Lista copiada al portapapeles','List copied to clipboard'), 'success'); return;
    }

    if (a === 'toggle-nj-point') {
      var pidnj = btn.getAttribute('data-pid') || currentProjectId();
      var txtnj = btn.getAttribute('data-text') || '';
      var pnj = S.getProject(pidnj);
      if (pnj && txtnj) {
        pnj.inclusions = Array.isArray(pnj.inclusions) ? pnj.inclusions.slice() : [];
        var key = txtnj.toLowerCase().slice(0,24);
        var idx = -1;
        for (var i=0;i<pnj.inclusions.length;i++) { if (String(pnj.inclusions[i]||'').toLowerCase().indexOf(key) >= 0) { idx = i; break; } }
        if (idx >= 0) pnj.inclusions.splice(idx, 1); else pnj.inclusions.push(txtnj);
        pnj.updatedAt = new Date().toISOString();
        S.save();
        rerender();
      }
      return;
    }

    if (a === 'add-maint-item') {
      var pidm = btn.getAttribute('data-pid') || currentProjectId();
      var pm = S.getProject(pidm); if (!pm) return;
      if (S.syncMaintenance) S.syncMaintenance(pm, { save: false });
      pm.maintenance = pm.maintenance || { items: [], notes: '', contractMonths: 12, includeMaterials: true };
      if (!Array.isArray(pm.maintenance.items)) pm.maintenance.items = [];
      pm.maintenance.items.push({ type: '', qty: 1, visits: 2, pricePerVisit: 0, materialsPerVisit: 0 });
      pm.updatedAt = new Date().toISOString();
      S.save(); rerender(); return;
    }
    if (a === 'del-maint-item') {
      var pmd = S.getProject(currentProjectId()); if (!pmd || !pmd.maintenance || !Array.isArray(pmd.maintenance.items)) return;
      var mi = parseInt(btn.getAttribute('data-idx'), 10);
      if (!isNaN(mi)) {
        var removed = pmd.maintenance.items[mi];
        pmd.maintenance.items.splice(mi, 1);
        // Remember intentionally removed quote lines so they are not auto-added again.
        if (removed && removed.sourceLineId) {
          pmd.maintenance.dismissed = Array.isArray(pmd.maintenance.dismissed) ? pmd.maintenance.dismissed : [];
          if (pmd.maintenance.dismissed.indexOf(removed.sourceLineId) < 0) pmd.maintenance.dismissed.push(removed.sourceLineId);
        }
        pmd.updatedAt = new Date().toISOString(); S.save(); rerender();
      }
      return;
    }
    if (a === 'sync-maint') {
      var pms = S.getProject(btn.getAttribute('data-pid') || currentProjectId());
      if (pms) {
        S.syncMaintenance(pms, { restoreDismissed: true });
        UI.toast(tr('Equipos de la oferta sincronizados','Equipment synced from quote'), 'success');
        rerender();
      }
      return;
    }
    if (a === 'maint-visits') {
      var pmv = S.getProject(btn.getAttribute('data-pid') || currentProjectId());
      var vis = parseInt(btn.getAttribute('data-visits'), 10);
      if (pmv && pmv.maintenance && Array.isArray(pmv.maintenance.items) && !isNaN(vis)) {
        pmv.maintenance.items.forEach(function (m) { m.visits = vis; });
        pmv.updatedAt = new Date().toISOString();
        S.save(); rerender();
      }
      return;
    }

    if (a === 'print-project') { UI.printProject(btn.getAttribute('data-id') || currentProjectId()); return; }

    if (a === 'dup-project') { var d = S.duplicateProject(btn.getAttribute('data-id')); if (d) { UI.toast(tr('Proyecto duplicado: ','Project duplicated: ') + d.number, 'success'); rerender(); } return; }
    if (a === 'del-project') { if (confirm(tr('¿Borrar este proyecto? Esta acción no se puede deshacer.','Delete this project? This cannot be undone.'))) { S.deleteProject(btn.getAttribute('data-id')); rerender(); } return; }

    if (a === 'export-json') { download('project_catcher_plus_backup.json', S.exportJSON(), 'application/json'); return; }
    if (a === 'export-catalog-csv') { download('pcp_catalogo.csv', S.catalogCSV(), 'text/csv'); return; }
    if (a === 'import-catalog-csv') { $('#import-csv') && $('#import-csv').click(); return; }
    if (a === 'save-company') {
      S.save();
      UI.toast(tr('Datos de la empresa guardados','Company data saved'), 'success');
      rerender(); return;
    }
    if (a === 'clear-company-logo') {
      S.state.company.logo = '';
      S.save();
      UI.toast(tr('Logo eliminado','Logo removed'), 'success');
      rerender(); return;
    }
    if (a === 'import-json-url') {
      var iu = ($('#import-json-url') || {}).value || '';
      iu = String(iu).trim();
      if (!iu) { UI.toast(tr('Ingresa una URL JSON','Enter a JSON URL'), 'warn'); return; }
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        UI.toast(tr('Sin conexión: se requiere internet para importar desde URL','Offline: internet required to import from URL'), 'warn');
      }
      UI.toast(tr('Descargando datos en vivo…','Fetching live data…'), 'info');
      fetch(iu, { cache: 'no-store' }).then(function(r){
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      }).then(function(txt){
        try {
          S.importJSON(txt);
          UI.toast(tr('Datos importados desde URL','Data imported from URL'), 'success');
          route();
        } catch (e) {
          UI.toast(tr('JSON inválido o incompatible','Invalid or incompatible JSON'), 'error');
        }
      }).catch(function(err){
        UI.toast(tr('No se pudo obtener la URL (red/CORS): ','Could not fetch URL (network/CORS): ') + (err && err.message ? err.message : ''), 'error');
      });
      return;
    }

    if (a === 'reset-all') {
      if (confirm(tr('Esto borrará TODOS los proyectos, catálogo y configuración de este navegador. ¿Continuar?','This will erase ALL projects, catalog, and settings in this browser. Continue?'))) {
        S.reset(); UI.toast(tr('Datos borrados','Data erased'), 'warn'); location.hash = '#/home'; route();
      }
      return;
    }
  });

  function handleMaintField(el, evType) {
    if (!el || !el.hasAttribute || !el.hasAttribute('data-maint-field')) return;
    var pid = currentProjectId(); if (!pid) return;
    var p = S.getProject(pid); if (!p) return;
    p.maintenance = p.maintenance || { items: [], notes: '', contractMonths: 12, includeMaterials: true };
    if (!Array.isArray(p.maintenance.items)) p.maintenance.items = [];
    var idx = parseInt(el.getAttribute('data-maint-idx'), 10);
    if (isNaN(idx) || !p.maintenance.items[idx]) return;
    var field = el.getAttribute('data-maint-field');
    var val = el.value;
    if (field === 'type') p.maintenance.items[idx].type = String(val || '');
    else if (el.type === 'number' && evType === 'input') p.maintenance.items[idx][field] = val;
    else p.maintenance.items[idx][field] = U.num(val);
    p.updatedAt = new Date().toISOString();
    S.save();
    softRefreshProject(pid);
    if (evType === 'change') scheduleRerender();
  }
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t && t.getAttribute && t.getAttribute('data-bind')) { handleBind(t, e); return; }
    if (t && t.hasAttribute && t.hasAttribute('data-maint-field')) { handleMaintField(t, 'input'); return; }
    // catalog filters
    if (t && (t.id === 'cat-q' || t.id === 'cat-stage' || t.id === 'cat-sup' || t.id === 'cat-promo')) { refreshCatalog(); }
    if (t && (t.id === 'pick-q' || t.id === 'pick-sup' || t.id === 'pick-promo')) { UI.refreshPicker(); }
  });
  document.addEventListener('focusout', function (e) {
    var t = e.target;
    if (!t || !t.getAttribute) return;
    if (!t.getAttribute('data-bind')) return;
    if (rerenderTimer) { clearTimeout(rerenderTimer); rerenderTimer = null; }
    // keep typing focus stable; totals already refreshed via softRefresh on input
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (!t) return;
    if (t.getAttribute && t.getAttribute('data-bind')) { handleBind(t, e); return; }
    if (t.hasAttribute && t.hasAttribute('data-maint-field')) { handleMaintField(t, 'change'); return; }
    if (t.id === 'cat-q' || t.id === 'cat-stage' || t.id === 'cat-sup' || t.id === 'cat-promo') { refreshCatalog(); }
    if (t.id === 'pick-q' || t.id === 'pick-sup' || t.id === 'pick-promo') { UI.refreshPicker(); }

    if (t.id === 'import-json' && t.files && t.files[0]) {
      readFile(t.files[0], function (text) {
        try { S.importJSON(text); UI.toast(tr('Respaldo importado','Backup imported'), 'success'); route(); }
        catch (err) { alert(tr('No se pudo importar: ','Could not import: ') + err.message); }
      });
      t.value = '';
    }
    if (t.id === 'import-csv' && t.files && t.files[0]) {
      readFile(t.files[0], function (text) {
        try { var n = S.importCatalogCSV(text); UI.toast(tr('Catálogo actualizado: ','Catalog updated: ') + n + tr(' ítems',' items'), 'success'); route(); }
        catch (err) { alert(tr('No se pudo importar CSV: ','Could not import CSV: ') + err.message); }
      });
      t.value = '';
    }
    if (t.id === 'logo-file' && t.files && t.files[0]) {
      var f = t.files[0];
      if (f.size > 900000) { alert(tr('El logo es muy grande. Usa una imagen menor a ~900 KB.','Logo is too large. Use an image under ~900 KB.')); t.value=''; return; }
      var reader = new FileReader();
      reader.onload = function (ev) {
        S.state.company.logo = String(ev.target.result || '');
        S.save();
        rerender();
        UI.toast(tr('Logo local cargado y guardado','Local logo uploaded and saved'), 'success');
      };
      reader.readAsDataURL(f);
      t.value = '';
    }
  });

  // close modal on backdrop/escape
  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'modal-backdrop') UI.closeModal();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') UI.closeModal(); });

  /* ---------------------------------------------------------------- */
  /* Utils                                                            */
  /* ---------------------------------------------------------------- */
  function download(name, content, type) {
    var blob = new Blob([content], { type: type || 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 0);
  }
  function readFile(file, cb) {
    var r = new FileReader(); r.onload = function (e) { cb(e.target.result); }; r.readAsText(file);
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).catch(function(){ fallbackCopy(text); }); }
    else fallbackCopy(text);
  }
  function fallbackCopy(text) {
    var ta = document.createElement('textarea'); ta.value = text; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch(e) {}
    ta.remove();
  }

  /* ---------------------------------------------------------------- */
  /* Launch modal on first open                                       */
  /* ---------------------------------------------------------------- */
  function showLaunch() {
    if (window._pcpLaunched) return;
    window._pcpLaunched = true;
    var en = lang()==='en';
    var chips = '<div class="launch-chips">'
      + '<span>⚡ ' + (en?'Local-first & offline':'Local y sin conexión') + '</span>'
      + '<span>🧾 ' + (en?'Professional PDF':'PDF profesional') + '</span>'
      + '<span>🛠️ ' + (en?'Maintenance plans':'Planes de mantenimiento') + '</span>'
      + '</div>';
    var body = '<div class="launch-hero">'
      + '<button class="launch-close" data-action="close-modal" title="' + esc(t('close')) + '">✕</button>'
      + '<div class="launch-hero-inner">'
      + '<div class="launch-logo">' + (I?I.logoSVG(92):'') + '</div>'
      + '<div class="launch-copy"><div class="eyebrow">HVAC · New Jersey · v' + esc(t('version')) + '</div>'
      + '<h2 class="launch-title">' + esc(t('appName')) + '</h2>'
      + '<p class="launch-tagline">' + esc(t('tagline')) + '</p>'
      + chips + '</div></div></div>'
      + '<div class="launch-body">'
      + '<div class="launch-welcome-line"><span class="launch-wave">👋</span><div><b>' + (en?'Welcome back':'Bienvenido de nuevo') + '</b><div class="muted small">' + (en?'What would you like to do today?':'¿Qué deseas hacer hoy?') + '</div></div></div>'
      + '<div class="action-grid launch-grid">'
      + '<button class="action-card primary-card" data-action="open-new-project" style="text-align:left;cursor:pointer" onclick="document.getElementById(\'modal-backdrop\').classList.add(\'hidden\')"><div class="ic art-ic">✍️</div><div class="t">' + esc(t('createQuote')) + '</div><div class="d">' + esc(t('createQuoteDesc')) + '</div></button>'
      + launchBtn('#/projects','📋', t('viewQuotes'), t('viewQuotesDesc'))
      + launchBtn('#/catalog','🧰', t('verifyPrices'), t('verifyPricesDesc'))
      + launchBtn('#/deals','🏷️', t('dealsPromos'), t('dealsPromosDesc'))
      + launchBtn('#/suppliers','🏪', t('suppliersRfq'), t('suppliersRfqDesc'))
      + launchBtn('#/company','🏢', t('companyBackup'), t('companyBackupDesc'))
      + '</div>'
      + '<div class="notice info" style="margin-top:14px">💡 ' + t('homePriceNote') + '</div>'
      + '</div>';
    UI.openModal('', body, '<button class="btn primary btn-next" data-action="close-modal">🚀 ' + esc(t('start')) + '</button>', { className: 'launch-modal' });
  }
  function launchBtn(href, ic, title, d) {
    return '<a class="action-card" href="' + href + '" onclick="document.getElementById(\'modal-backdrop\').classList.add(\'hidden\')"><div class="ic art-ic">' + ic + '</div><div class="t">' + esc(title) + '</div><div class="d">' + esc(d) + '</div></a>';
  }

  function updateNetStatus() {
    var el = document.getElementById('net-status');
    if (!el) return;
    var online = (typeof navigator !== 'undefined' && navigator.onLine !== false);
    el.className = 'pill ' + (online ? 'ok' : 'warn');
    el.textContent = '● ' + (online
      ? tr('En línea (datos/logos en vivo)', 'Online (live data/logos)')
      : tr('Sin conexión (modo local)', 'Offline (local mode)'));
  }

  /* ---------------------------------------------------------------- */
  /* Init                                                             */
  /* ---------------------------------------------------------------- */
  S.load();
  // default to dark & Spanish if missing
  S.state.ui = S.state.ui || {};
  if (!S.state.ui.theme) S.state.ui.theme = 'dark';
  if (!S.state.ui.lang) S.state.ui.lang = 'es';
  applyTheme();
  applyLang();
  window.addEventListener('hashchange', function(){ route(); updateNetStatus(); });
  window.addEventListener('online', function(){ updateNetStatus(); UI.toast(tr('Conexión en línea: logos y datos en vivo activos','Online: live logos and data active'), 'success'); });
  window.addEventListener('offline', function(){ updateNetStatus(); UI.toast(tr('Sin conexión: usando datos locales guardados','Offline: using saved local data'), 'warn'); });
  route();
  updateNetStatus();
  if (!location.hash || location.hash === '#' || location.hash === '#/home') {
    setTimeout(showLaunch, 150);
  }

})();
