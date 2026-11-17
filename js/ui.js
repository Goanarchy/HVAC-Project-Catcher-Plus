/* =====================================================================
   HVAC Project Catcher Plus 1.2 — UI (renderizado)
   ===================================================================== */
window.PCP = window.PCP || {};
(function (P) {
  'use strict';

  var S = P.store, U = P.util, esc = U.esc, money = U.money;
  var I = P.i18n, t = function(k,v){return I ? I.t(k,v) : k;}, tn = function(g,k){return I ? I.tn(g,k) : k;};
  function L(id){ return I ? I.stageLabel(id) : (P.STAGES.filter(function(s){return s.id===id;})[0]||{}).label || id; }
  function LS(id){ return I ? I.stageHint(id) : (P.STAGES.filter(function(s){return s.id===id;})[0]||{}).hint || ''; }
  function LScope(id){ return I ? I.scopeLabel(id) : id; }
  function LScopeD(id){ return I ? I.scopeDesc(id) : ''; }
  function LClient(id){ return I ? I.clientLabel(id) : id; }
  function LStatus(id){ return I ? I.statusLabel(id) : id; }
  function lang(){ return I ? I.lang() : 'es'; }

  /* ---------------------------------------------------------------- */
  /* Helpers                                                          */
  /* ---------------------------------------------------------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'data') Object.keys(attrs[k]).forEach(function (d) { e.dataset[d] = attrs[k][d]; });
      else e.setAttribute(k, attrs[k]);
    });
    if (html != null) e.innerHTML = html;
    return e;
  }
  function option(val, label, selected) {
    return '<option value="' + esc(val) + '"' + (String(val) === String(selected) ? ' selected' : '') + '>' + esc(label) + '</option>';
  }
  function supplierOptions(sel) {
    return S.state.suppliers.map(function (s) { return option(s.id, s.short, sel); }).join('');
  }
  function unitOptions(sel) {
    return P.UNITS.map(function (u) { return option(u, u, sel); }).join('');
  }
  function stageById(id) { return P.STAGES.filter(function (s) { return s.id === id; })[0]; }

  function toast(msg, type) {
    var w = $('#toast-wrap'); if (!w) return;
    var tEl = el('div', { class: 'toast ' + (type || '') }, '<span>🔔</span> ' + esc(msg));
    w.appendChild(tEl);
    setTimeout(function () { tEl.remove(); }, 3200);
  }

  function statusPill(st) {
    var map = { ok: ['ok', t('ok')], warn: ['warn', t('review')], fail: ['fail', lang()==='en'?'Missing':(t('missing')?t('review'):'Falta')] };
    // better labels
    if (st === 'ok') map.ok = ['ok', 'OK'];
    if (st === 'warn') map.warn = ['warn', t('review')];
    if (st === 'fail') map.fail = ['fail', lang()==='en' ? 'Missing' : 'Falta'];
    var m = map[st] || map.fail;
    return '<span class="pill ' + m[0] + '">' + m[1] + '</span>';
  }

  function stageIcon(id){ var s=stageById(id); return s ? (s.icon||'📦') : '📦'; }
  function projectStatus(st) {
    var map = { draft:'draft', sent:'sent', approved:'won', won:'won', lost:'lost' };
    var key = st || 'draft';
    return '<span class="badge badge-' + (key==='won'?'ok':key==='lost'?'fail':'info') + '">' + esc(LStatus(key==='won'?'approved':key)) + '</span>';
  }
  function logoSources(domain, explicit) {
    var out = [], seen = {};
    function add(u){ if(!u) return; var k=String(u); if(seen[k]) return; seen[k]=1; out.push(k); }
    add(explicit);
    if (domain) {
      add('https://logo.clearbit.com/' + domain);
      add('https://www.google.com/s2/favicons?domain=' + encodeURIComponent(domain) + '&sz=128');
      add('https://icons.duckduckgo.com/ip3/' + domain + '.ico');
    }
    return out;
  }
  function logoImgHTML(srcs, alt, size, fbText, fbClass, extraStyle) {
    size = size || 22; fbText = esc(fbText || '?'); fbClass = fbClass || '';
    if (!srcs || !srcs.length) {
      return '<span class="brand-logo ' + fbClass + '" title="' + esc(alt||'') + '" style="width:' + size + 'px;height:' + size + 'px;' + (extraStyle||'') + '">' + fbText + '</span>';
    }
    var first = esc(srcs[0]);
    var rest = esc(srcs.slice(1).join('|'));
    return '<span class="brand-logo-wrap" title="' + esc(alt||'') + '" style="width:' + size + 'px;height:' + size + 'px">'
      + '<img class="brand-logo-img" src="' + first + '" data-fallback="' + rest + '" alt="' + esc(alt||'') + '" loading="lazy" referrerpolicy="no-referrer" onerror="PCP.ui && PCP.ui.logoFallback && PCP.ui.logoFallback(this)">'
      + '<span class="brand-logo-fallback ' + fbClass + '" style="display:none;' + (extraStyle||'') + '">' + fbText + '</span>'
      + '</span>';
  }
  function logoFallback(img) {
    try {
      var fb = img.getAttribute('data-fallback') || '';
      var list = fb ? fb.split('|').filter(Boolean) : [];
      if (list.length) {
        img.src = list.shift();
        img.setAttribute('data-fallback', list.join('|'));
        return;
      }
    } catch(e) {}
    img.style.display = 'none';
    var n = img.nextElementSibling;
    if (n) n.style.display = 'inline-flex';
  }
  function brandInfo(name){ return (P.brandByName ? P.brandByName(name) : {name:name||'Marca',color:'#64748b',short:(name||'?').slice(0,2),logo:'',domain:''}); }
  function brandLabel(b, fallback){
    if (!b) return fallback || '';
    if (lang()==='en' && b.labelEn) return b.labelEn;
    return b.name || fallback || '';
  }
  function brandBadge(name, size){
    var b = brandInfo(name); size = size || 22;
    var dname = brandLabel(b, name || '');
    var sh = (b.short||dname||'?').slice(0,3);
    var col = b.color||'#64748b';
    var srcs = logoSources(b.domain || '', b.logo || '');
    if (srcs.length) return logoImgHTML(srcs, dname||name||'', size, sh, '', '--bcol:' + col);
    return '<span class="brand-logo" title="' + esc(dname||name||'') + '" style="--bcol:' + esc(col) + ';width:' + size + 'px;height:' + size + 'px">' + esc(sh) + '</span>';
  }
  function supplierInfo(id){
    var s = (S && S.supplier) ? S.supplier(id) : null;
    var meta = (P && P.supplierMeta) ? P.supplierMeta(id) : {};
    if (!s) s = meta || { id:id, short:id, name:id };
    var logo = s.logo || meta.logo || '';
    var domain = s.domain || meta.domain || '';
    return { id:id, name:s.name||s.short||id, short:s.short||s.name||id, logo:logo, domain:domain };
  }
  function supplierBadge(id, size){
    var s = supplierInfo(id); size = size || 22;
    var fb = (s.short || s.name || '?').slice(0,2).toUpperCase();
    var srcs = logoSources(s.domain || '', s.logo || '');
    if (srcs.length) return logoImgHTML(srcs, s.name||s.short||id||'', size, fb, 'supplier-fallback', '');
    return '<span class="brand-logo supplier-fallback-badge" title="' + esc(s.name||s.short||id||'') + '" style="width:' + size + 'px;height:' + size + 'px">' + esc(fb) + '</span>';
  }
  function subHead(label, icon){ return '<tr class="group-row"><td colspan="6"><div class="group-head">' + (icon||'📦') + ' <b>' + esc(label) + '</b></div></td></tr>'; }
  function groupKeyFor(it, stageId){
    if (stageId === 'equipment') return 'brand:' + ((it && (it.brand||'')) || 'other');
    return 'sub:' + ((it && it.sub) || 'misc');
  }
  function groupLabelFor(it, stageId){
    if (stageId === 'equipment') {
      var b = brandInfo(it && it.brand);
      if (b && b.id === 'other') return (lang()==='en' ? 'Other brands' : 'Otras marcas');
      return (b && b.name) ? b.name : (lang()==='en'?'Other brands':'Otras marcas');
    }
    var sub = (it && it.sub) || 'misc';
    return (P.subLabel ? P.subLabel(sub) : sub);
  }
  function groupIconFor(it, stageId){
    if (stageId === 'equipment') return brandBadge(it && it.brand, 24);
    var sub = (it && it.sub) || 'misc';
    return '<span class="group-ico">' + esc(P.subIcon ? P.subIcon(sub) : '📦') + '</span>';
  }

  /* ---------------------------------------------------------------- */
  /* Layout                                                           */
  /* ---------------------------------------------------------------- */
  function shell(content, active) {
    active = active || '';
    var navItems = [
      ['#/home', 'home', tn('nav','home'), '🏠'],
      ['#/projects', 'projects', tn('nav','projects'), '📋'],
      ['#/catalog', 'catalog', tn('nav','catalog'), '🧰'],
      ['#/deals', 'deals', tn('nav','deals'), '🏷️'],
      ['#/suppliers', 'suppliers', tn('nav','suppliers'), '🏪'],
      ['#/company', 'company', tn('nav','company'), '🏢']
    ];
    var links = navItems.map(function (n) {
      return '<a href="' + n[0] + '" class="' + (active === n[1] ? 'active' : '') + '"><span class="nav-icon">' + n[3] + '</span>' + esc(n[2]) + '</a>';
    }).join('');
    var co = S.state.company;
    var mark = co.logo ? '<img src="' + esc(co.logo) + '" alt="logo" style="width:42px;height:42px;border-radius:12px;object-fit:cover;border:1px solid rgba(255,255,255,.15)">' : (I ? I.logoSVG(42) : '<div class="brand-mark">PC+</div>');
    var theme = (S.state.ui && S.state.ui.theme) || 'dark';
    var themeLabel = theme === 'dark' ? '☀ ' + t('themeLight') : '🌙 ' + t('themeDark');
    var langLabel = lang() === 'es' ? '🇺🇸 ' + t('switchToEn') : '🇪🇸 ' + t('switchToEs');
    var online = (typeof navigator !== 'undefined' && navigator.onLine !== false);
    var net = online ? '<span class="pill ok" id="net-status">● ' + (lang()==='en'?'Online (live data/logos)':'En línea (datos/logos en vivo)') + '</span>' : '<span class="pill warn" id="net-status">● ' + (lang()==='en'?'Offline (local mode)':'Sin conexión (modo local)') + '</span>';
    return '<div class="app-shell">'
      + '<aside class="sidebar"><div class="brand brand-big">' + mark + '<div><h1>' + esc(t('appName')) + '</h1><div class="sub version-badge">v' + esc(t('version')) + ' · ' + esc(t('subtitle')) + '</div></div></div>'
      + '<nav class="nav">' + links + '</nav>'
      + '<div class="sidebar-foot"><div style="display:grid;gap:8px;margin-bottom:10px">'
      + '<button class="btn sm ghost sidebar-btn" data-action="toggle-theme">' + themeLabel + '</button>'
      + '<button class="btn sm ghost sidebar-btn" data-action="toggle-lang">' + langLabel + '</button>'
      + '<div id="net-status-wrap">' + net + '</div>'
      + '</div>'
      + '<div><b>' + esc(co.name || t('noCompany')) + '</b></div><span class="muted">' + esc(t('localData')) + '</span></div></aside>'
      + '<main class="main" id="main">' + content + '</main></div>';
  }

  /* ---------------------------------------------------------------- */
  /* Modal                                                            */
  /* ---------------------------------------------------------------- */
  function openModal(title, bodyHtml, footHtml, opts) {
    opts = opts || {};
    $('#modal-title').textContent = title || '';
    $('#modal-body').innerHTML = bodyHtml || '';
    $('#modal-foot').innerHTML = footHtml || '';
    var bd = $('#modal-backdrop');
    bd.classList.remove('hidden');
    bd.querySelector('.modal').className = 'modal' + (opts.small ? ' sm' : '');
  }
  function closeModal() { $('#modal-backdrop').classList.add('hidden'); }

  /* ---------------------------------------------------------------- */
  /* Home / launch                                                    */
  /* ---------------------------------------------------------------- */
  function renderHome() {
    var deals = S.activeDeals();
    var projs = S.state.projects.slice(0, 6);
    var hero = '<div class="hero hero-pro"><div class="hero-inner">'
      + '<div class="hero-logo">' + (I?I.logoSVG(84):'') + '</div>'
      + '<div><div class="eyebrow">v' + esc(t('version')) + ' · HVAC · NJ</div>'
      + '<h2 class="hero-title">' + esc(t('appName')) + '</h2>'
      + '<p class="hero-tag">' + esc(t('tagline')) + '</p></div></div></div>';
    var actions = '<div class="action-grid">'
      + actionBtn('open-new-project','✍️', t('createQuote'), t('createQuoteDesc'), 'primary-card')
      + actionCard('#/projects', '📋', t('viewQuotes'), t('viewQuotesDesc'))
      + actionCard('#/catalog', '🧰', t('verifyPrices'), t('verifyPricesDesc'))
      + actionCard('#/deals', '🏷️', t('dealsPromos'), t('activeDealsCount', {n: deals.length}))
      + actionCard('#/suppliers', '🏪', t('suppliersRfq'), t('suppliersRfqDesc'))
      + actionCard('#/company', '🏢', t('companyBackup'), t('companyBackupDesc'))
      + '</div>';
    var html = hero + actions
      + '<div class="grid grid-2" style="margin-top:16px">'
      + '<div class="card"><h3>🕘 ' + esc(t('recentProjects')) + '</h3>' + recentProjects(projs) + '</div>'
      + '<div class="card"><h3>🔥 ' + esc(t('featuredDeals')) + '</h3>' + dealsList(deals.slice(0, 5), true) + '</div>'
      + '</div>'
      + '<div class="notice info" style="margin-top:14px">💡 ' + t('homeImportant') + '</div>';
    return shell(html, 'home');
  }

  function actionCard(href, icon, title, desc) {
    return '<a class="action-card" href="' + href + '"><div class="ic art-ic">' + icon + '</div><div class="t">' + esc(title) + '</div><div class="d">' + esc(desc) + '</div></a>';
  }
  function actionBtn(action, icon, title, desc, cls) {
    return '<button class="action-card ' + (cls||'') + '" data-action="' + action + '" style="text-align:left;cursor:pointer"><div class="ic art-ic">' + icon + '</div><div class="t">' + esc(title) + '</div><div class="d">' + esc(desc) + '</div></button>';
  }

  function recentProjects(list) {
    if (!list.length) return '<div class="empty">📭 ' + esc(t('noProjectsYet')) + ' <button class="btn sm primary" data-action="open-new-project">✨ ' + esc(t('createFirst')) + '</button></div>';
    return '<div class="table-wrap"><table><thead><tr><th>#</th><th>' + esc(t('colProjectClient')) + '</th><th>' + esc(t('colStatus')) + '</th><th class="num">' + esc(t('colTotal')) + '</th><th></th></tr></thead><tbody>'
      + list.map(function (p) {
        var c = S.calc(p);
        return '<tr><td class="mono">' + esc(p.number) + '</td><td><div><b>' + esc(p.projectName || 'HVAC Project') + '</b></div><div class="small muted">👤 ' + esc(p.client.name || p.client.company || '—') + '</div></td>'
          + '<td>' + projectStatus(p.status) + '</td><td class="num"><b>' + money(c.total) + '</b></td>'
          + '<td class="num"><a class="btn sm" href="#/project/' + p.id + '/1">📂 ' + esc(t('open')) + '</a></td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  function dealsList(deals, compact) {
    if (!deals.length) return '<div class="empty">🏷️ ' + (lang()==='en'?'No active deals right now.':'No hay ofertas activas por ahora.') + '</div>';
    return '<div class="deal-grid' + (compact ? ' compact' : '') + '">' + deals.map(function (d) {
      var off = Math.round((d.savingPct || 0) * 100);
      var ends = (d.promo && d.promo.ends) ? U.date(d.promo.ends) : '';
      return '<div class="deal-card">'
        + '<div class="deal-badge">-' + off + '%</div>'
        + '<div class="deal-body">'
        + '<div class="deal-name">' + esc(d.item.name) + '</div>'
        + '<div class="deal-meta"><span class="supplier-inline">' + supplierBadge(d.item.supplier, 16) + ' ' + esc(S.supplierName(d.item.supplier)) + '</span>' + (d.promo && d.promo.label ? ' <span class="pill demo">' + esc(d.promo.label) + '</span>' : '') + '</div>'
        + '<div class="deal-prices"><span class="deal-now">' + money(d.price) + '</span><span class="deal-was">' + money(d.regular) + '</span><span class="pill deal">💰 ' + (lang()==='en'?'Save ':'Ahorras ') + money(d.saving) + '</span></div>'
        + (ends ? '<div class="small muted">' + (lang()==='en'?'Valid until ':'Válido hasta ') + ends + '</div>' : '')
        + '</div></div>';
    }).join('') + '</div>';
  }

  /* ---------------------------------------------------------------- */
  /* Projects list                                                    */
  /* ---------------------------------------------------------------- */
  function renderProjects() {
    var ps = S.state.projects;
    var rows = ps.length ? ps.map(function (p) {
      var c = S.calc(p), ch = S.checklist(p, c);
      return '<tr>'
        + '<td class="mono">' + esc(p.number) + '</td>'
        + '<td><div><b>📁 ' + esc(p.projectName || 'HVAC Project') + '</b></div><div class="small muted">👤 ' + esc(p.client.name || '—') + (p.client.company ? ' · ' + esc(p.client.company) : '') + ' ' + esc(p.client.city || '') + '</div></td>'
        + '<td>' + U.date(p.date) + '</td>'
        + '<td>' + projectStatus(p.status) + '</td>'
        + '<td><div class="progress" title="' + ch.score + '%"><span style="width:' + ch.score + '%"></span></div><div class="small muted">' + ch.score + '% · ' + ch.fail + ' ' + esc(t('missing')) + '</div></td>'
        + '<td class="num"><b>' + money(c.total) + '</b><div class="small muted">' + (lang()==='en'?'margin':'margen') + ' ' + U.pct(c.margin * 100) + '</div></td>'
        + '<td class="num" style="white-space:nowrap">'
        + '<a class="btn sm" href="#/project/' + p.id + '/1">📂 ' + esc(t('open')) + '</a> '
        + '<button class="btn sm" data-action="dup-project" data-id="' + p.id + '">📄 ' + esc(t('duplicate')) + '</button> '
        + '<button class="btn sm danger" data-action="del-project" data-id="' + p.id + '">🗑️ ' + esc(t('delete')) + '</button>'
        + '</td></tr>';
    }).join('') : '<tr><td colspan="7"><div class="empty">📭 ' + esc(lang()==='en'?'No projects yet.':'Sin proyectos todavía.') + '</div></td></tr>';
    var html = pageHead(t('quotesTitle'), t('quotesSub'), '<button class="btn primary" data-action="open-new-project">✨ ' + esc(t('createQuote')) + '</button>')
      + '<div class="card"><div class="table-wrap"><table><thead><tr><th>' + esc(t('colNumber')) + '</th><th>' + esc(t('colProjectClient')) + '</th><th>' + esc(t('colDate')) + '</th><th>' + esc(t('colStatus')) + '</th><th>' + esc(t('colComplete')) + '</th><th class="num">' + esc(t('colTotal')) + '</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div></div>';
    return shell(html, 'projects');
  }

  function pageHead(title, sub, actions) {
    return '<div class="page-head"><div><h2 class="page-title">' + esc(title) + '</h2>' + (sub ? '<p>' + esc(sub) + '</p>' : '') + '</div><div class="actions">' + (actions || '') + '</div></div>';
  }

  /* ---------------------------------------------------------------- */
  /* Project wizard                                                   */
  /* ---------------------------------------------------------------- */
  var BASE_STEPS = [
    { id: 'scope', titleEs: 'Alcance', titleEn: 'Scope', subEs: 'Proyecto y cliente', subEn: 'Project & client' },
    { id: 'suppliers', titleEs: 'Proveedores', titleEn: 'Suppliers', subEs: 'Selecciona tus proveedores', subEn: 'Select your suppliers' },
    { id: 'equipment', stage: 'equipment', titleEs: 'Equipos', titleEn: 'Equipment', subEs: 'Unidades y accesorios', subEn: 'Units & accessories' },
    { id: 'freight', stage: 'freight', titleEs: 'Fletes', titleEn: 'Freight', subEs: 'Logística y entrega', subEn: 'Logistics & delivery' },
    { id: 'indirects', stage: 'indirects', titleEs: 'Rentas', titleEn: 'Rentals', subEs: 'Indirectos y equipos', subEn: 'Indirects & equipment' },
    { id: 'materials', stage: 'materials', titleEs: 'Materiales', titleEn: 'Materials', subEs: 'Consumibles y partes', subEn: 'Consumables & parts' },
    { id: 'labor', stage: 'labor', titleEs: 'Mano de obra', titleEn: 'Labor', subEs: 'Permisos y servicios', subEn: 'Permits & services' },
    { id: 'summary', titleEs: 'Resumen', titleEn: 'Summary', subEs: 'Margen, impuestos y PDF', subEn: 'Margin, taxes & PDF' }
  ];

  function getSteps(p) {
    var hasMaint = !!(p && p.scope && p.scope.indexOf('maint') >= 0);
    var list = BASE_STEPS.slice();
    if (hasMaint) {
      // insert maintenance before summary
      var idx = list.map(function(s){return s.id;}).indexOf('summary');
      list.splice(idx, 0, { id: 'maintenance', titleEs: 'Mantenimiento', titleEn: 'Maintenance', subEs: 'Equipos, visitas y presupuesto', subEn: 'Equipment, visits & budget' });
    }
    return list.map(function(s, i){ var o = Object.assign({}, s); o.n = i + 1; return o; });
  }
  function findStep(steps, n) { for (var i=0;i<steps.length;i++) if (steps[i].n === n) return steps[i]; return steps[steps.length-1]; }

  function stepTitle(s){ return lang()==='en' ? s.titleEn : s.titleEs; }
  function stepSub(s){ return lang()==='en' ? s.subEn : s.subEs; }

  function wizardProgressHTML(ch) {
    return '<div class="small muted">' + esc(t('colComplete')) + '</div><div class="progress" style="margin:6px 0"><span style="width:' + ch.score + '%"></span></div>'
      + '<div class="small"><span class="pill ok">' + ch.ok + ' ok</span> <span class="pill warn">' + ch.warn + ' ' + (lang()==='en'?'review':'revisar') + '</span> <span class="pill fail">' + ch.fail + ' ' + esc(t('missing')) + '</span></div>';
  }

  function totalsBreakdownHTML(p, c) {
    c = c || S.calc(p);
    var st = p.settings || {};
    var en = lang()==='en';
    function row(k, v, cls, note) {
      return '<tr' + (cls ? ' class="' + cls + '"' : '') + '><td><div><b>' + esc(k) + '</b>' + (note ? '<div class="small muted">' + esc(note) + '</div>' : '') + '</div></td><td class="num">' + v + '</td></tr>';
    }
    var hasMaint = (c.maintSell || c.maintCost || (p.maintenance && (p.maintenance.items||[]).length));
    var html = '<div class="table-wrap"><table class="totals-table"><tbody>'
      + row(en?'Direct cost (lines)':'Costo directo (líneas)', money(c.cost), '', en?'Sum of direct line costs including maintenance materials/parts allowance when applicable.':'Suma de costos directos de líneas, incluyendo materiales/repuestos de mantenimiento cuando aplique.')
      + (hasMaint ? row(en?'Maintenance (sell / materials cost)':'Mantenimiento (venta / costo materiales)', money(c.maintSell || 0) + ' / ' + money(c.maintCost || 0), '', en?'Service plan totals included in the project budget.':'Totales del plan de servicio incluidos en el presupuesto.') : '')
      + row(en?'Contingency':'Contingencia', money(c.contCost) + ' / ' + money(c.contSell), '', en?'Cost reserve and its sell amount ('+esc(st.contingencyPct)+'% of direct cost).':'Reserva de costo y su monto de venta ('+esc(st.contingencyPct)+'% del costo directo).')
      + row(en?'Overhead (internal)':'Gastos indirectos (interno)', money(c.overhead), '', en?'Internal overhead cost ('+esc(st.overheadPct)+'% of direct cost), not added as a separate client line.':'Costo interno de overhead ('+esc(st.overheadPct)+'% del costo directo), no se suma como línea aparte al cliente.')
      + row(en?'Sell subtotal (lines + contingency)':'Subtotal de venta (líneas + contingencia)', money(c.subtotalSell), '')
      + (U.num(c.factor) !== 1 ? row(en?'Global factor':'Factor global', '× ' + esc(c.factor), '', en?'Multiplier applied to subtotal.':'Multiplicador aplicado al subtotal.') : '')
      + row(en?'Before discount':'Antes de descuento', money(c.beforeDiscount), '')
      + (U.num(c.discount) > 0 ? row(en?'Discount':'Descuento', '- ' + money(c.discount), '', en?'Applied before tax.':'Aplicado antes de impuesto.') : '')
      + row(en?'Net / taxable base context':'Neto / base imponible', money(c.afterDiscount), '', en?'Amount before sales tax.':'Monto antes del impuesto a las ventas.')
      + row(en?'Taxable base':'Base imponible', money(c.taxableBase), '', en?'Portion subject to NJ sales tax based on tax mode.':'Parte sujeta a impuesto de NJ según el modo.')
      + row(en?'Sales tax':'Impuesto de ventas', money(c.tax) + ' <span class="small muted">(' + U.pct(U.num(c.rate)*100) + ')</span>', '')
      + row(en?'TOTAL (proposal)':'TOTAL (propuesta)', '<b>' + money(c.total) + '</b>', 'total')
      + row(en?'Deposit suggested':'Depósito sugerido', money(c.deposit) + ' <span class="small muted">(' + esc(st.depositPct) + '%)</span>', '')
      + row(en?'Estimated total cost':'Costo total estimado', money(c.totalCost), '', en?'Direct + contingency + overhead.':'Directo + contingencia + overhead.')
      + row(en?'Estimated profit':'Utilidad estimada', money(c.profit) + ' <span class="small muted">(' + U.pct((c.margin||0)*100) + ' margin)</span>', '')
      + '</tbody></table></div>';
    return html;
  }

  function projectSidebar(p, c, ch) {
    c = c || S.calc(p);
    ch = ch || S.checklist(p, c);
    var ok = ch.items.filter(function(i){return i.status==='ok';}).length;
    var total = ch.items.length || 1;
    var pct = Math.round((ok / total) * 100);
    var issues = ch.items.filter(function(i){return i.status!=='ok';}).slice(0, 8);
    var by = P.STAGES.map(function(s){
      var b = c.byStage[s.id]; if (!b || (!b.count && !b.sell)) return '';
      return '<div class="kv" style="margin:2px 0"><span class="k">' + esc(L(s.id)) + '</span><span class="v">' + money(b.sell) + '</span></div>';
    }).join('');
    if (c.byStage.maintenance && (c.byStage.maintenance.sell || c.byStage.maintenance.count)) {
      by += '<div class="kv" style="margin:2px 0"><span class="k">' + (en?'Maintenance':'Mantenimiento') + '</span><span class="v">' + money(c.byStage.maintenance.sell) + '</span></div>';
    }
    var sel = (p.selectedSuppliers || []).length;
    var en = lang()==='en';
    return '<aside class="card project-sidebar" id="project-sidebar">'
      + '<h3 style="margin-top:0">' + esc(p.number || '') + '</h3>'
      + '<div class="small muted" style="margin-bottom:8px">' + esc(p.projectName || '') + '</div>'
      + '<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;align-items:center"><b>' + esc(t('completeness')) + '</b><span class="pill ' + (pct>=90?'ok':pct>=60?'warn':'fail') + '">' + pct + '%</span></div>'
      + '<div class="progress" style="margin-top:6px"><span style="width:' + pct + '%"></span></div>'
      + '<div class="small muted" style="margin-top:4px">' + ok + '/' + total + '</div></div>'
      + '<div class="card" style="padding:10px;margin:0 0 10px;background:var(--surface-2)"><div class="small muted">' + (en?'Proposal total':'Total propuesta') + '</div><div style="font-size:22px;font-weight:800;color:var(--primary-dark)">' + money(c.total) + '</div>'
      + '<div class="kv" style="margin-top:6px"><span class="k">' + (en?'Net before tax':'Neto antes de impuesto') + '</span><span class="v">' + money(c.afterDiscount) + '</span><span class="k">' + (en?'Tax':'Impuesto') + '</span><span class="v">' + money(c.tax) + '</span><span class="k">' + (en?'Deposit':'Depósito') + '</span><span class="v">' + money(c.deposit) + '</span><span class="k">' + (en?'Profit':'Utilidad') + '</span><span class="v">' + money(c.profit) + ' (' + U.pct((c.margin||0)*100) + ')</span></div></div>'
      + '<div style="margin-bottom:10px"><b class="small">' + (en?'Sell by stage':'Venta por etapa') + '</b>' + (by || '<div class="small muted">' + (en?'No lines yet':'Sin líneas aún') + '</div>') + '</div>'
      + '<div style="margin-bottom:10px"><b class="small">' + (en?'Suppliers selected':'Proveedores seleccionados') + '</b><div style="margin-top:4px">' + (sel ? '<span class="pill ok">' + sel + '</span>' : '<span class="pill warn">0</span>') + ' <a class="small" href="#/project/' + p.id + '/2">' + (en?'edit':'editar') + '</a></div></div>'
      + '<div><b class="small">' + (en?'Pending checklist':'Checklist pendiente') + '</b>' + (issues.length ? '<ul class="list" style="margin-top:6px">' + issues.map(function(i){ return '<li>' + statusPill(i.status) + ' <span class="small">' + esc(i.label) + '</span></li>'; }).join('') + '</ul>' : '<div class="notice success" style="margin-top:6px">✅ ' + (en?'All set':'Todo listo') + '</div>') + '</div>'
      + '</aside>';
  }

  function renderProject(pid, step) {
    var p = S.getProject(pid);
    if (!p) return shell('<div class="empty">' + (lang()==='en'?'Project not found.':'Proyecto no encontrado.') + '</div>', 'projects');
    var steps = getSteps(p);
    step = Math.max(1, Math.min(steps.length, parseInt(step, 10) || 1));
    var c = S.calc(p), ch = S.checklist(p, c);
    var cur = findStep(steps, step);

    var nav = '<div class="steps card"><h3 style="margin:0 0 8px">🧭 ' + (lang()==='en'?'Steps':'Etapas') + '</h3>' + steps.map(function (s) {
      return '<a class="step-link ' + (s.n === step ? 'active' : '') + '" href="#/project/' + p.id + '/' + s.n + '">'
        + '<div class="step-num">' + s.n + '</div><div class="step-meta"><div class="t">' + esc(stepTitle(s)) + '</div><div class="s">' + esc(stepSub(s)) + '</div></div></a>';
    }).join('') + '<div id="wizard-progress" style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">'
      + wizardProgressHTML(ch) + '</div></div>';

    var body = '';
    if (cur.id === 'scope') body = stepScope(p, c, ch, steps);
    else if (cur.id === 'suppliers') body = stepSuppliers(p, c, ch, steps);
    else if (cur.stage) body = stepLines(p, c, ch, cur.stage, L(cur.stage), LS(cur.stage), steps);
    else if (cur.id === 'maintenance') body = stepMaintenance(p, c, ch, steps);
    else body = stepSummary(p, c, ch, steps);

    var head = '<div class="page-head"><div><h2 class="page-title">📁 ' + esc(p.projectName || p.number) + ' <span class="muted" style="font-weight:500;font-size:.65em">· ' + esc(step + '/' + steps.length) + '</span></h2>'
      + '<p class="mono small muted">' + esc(p.number) + '</p><p>👤 ' + esc(p.client.name || t('noClient')) + ' · ' + (p.scope || []).map(LScope).map(esc).join(', ') + '</p></div>'
      + '<div class="actions"><button class="btn soft" data-action="update-prices" data-id="' + p.id + '">🔄 ' + esc(t('updatePrices')) + '</button>'
      + '<button class="btn" data-action="print-project" data-id="' + p.id + '">🖨️ ' + esc(t('printPdf')) + '</button>'
      + '<a class="btn" href="#/projects">↩ ' + esc(t('back')) + '</a></div></div>';

    return shell(head + '<div class="wizard">' + nav + '<div>' + body + '</div></div>', 'projects');
  }

  /* ---- Step 1: scope & client ---- */
  function stepScope(p, c, ch, steps) {
    var scopes = P.SCOPES.map(function (s) {
      var on = (p.scope || []).indexOf(s.id) >= 0;
      return '<label class="check-tile"><input type="checkbox" data-bind="scope" value="' + s.id + '"' + (on ? ' checked' : '') + '>'
        + '<div><div class="t">' + esc(LScope(s.id)) + '</div><div class="d">' + esc(LScopeD(s.id)) + '</div></div></label>';
    }).join('');
    var statusOpts = [['draft',LStatus('draft')],['sent',LStatus('sent')],['won',lang()==='en'?'Won':'Ganada'],['lost',LStatus('lost')]];
    var nextN = 2;
    return '<div class="split"><div>'
      + '<div class="card"><h3>🎯 1. ' + (lang()==='en'?'What does the project include?':'¿Qué conforma el proyecto?') + '</h3><p class="muted">' + (lang()==='en'?'Select all applicable systems. This drives the checklist so nothing is missed. If maintenance is included, a dedicated maintenance step will appear.':'Seleccione todos los sistemas que aplican. Esto activa el checklist para que no falte nada. Si incluye mantenimiento, aparecerá una etapa dedicada de mantenimiento.') + '</p>'
      + '<div class="check-grid">' + scopes + '</div></div>'
      + '<div class="card"><h3>📁 ' + (lang()==='en'?'Project & client':'Proyecto y cliente') + '</h3>'
      + '<div class="form-row">'
      + field('col-6', t('projectName') + ' *','<input type="text" data-bind="projectName" value="' + esc(p.projectName || '') + '" placeholder="' + esc(t('projectNamePh')) + '">')
      + field('col-6', t('clientName') + ' *','<input type="text" data-bind="client.name" value="' + esc(p.client.name) + '" placeholder="' + esc(t('clientNamePh')) + '">')
      + field('col-6', t('clientCompany'),'<input type="text" data-bind="client.company" value="' + esc(p.client.company) + '">')
      + field('col-4', lang()==='en'?'Phone':'Teléfono','<input type="tel" data-bind="client.phone" value="' + esc(p.client.phone) + '">')
      + field('col-4','Email','<input type="email" data-bind="client.email" value="' + esc(p.client.email) + '">')
      + field('col-4', t('clientType'),'<select data-bind="client.type">' + P.CLIENT_TYPES.map(function(tt){return option(tt.id,LClient(tt.id),p.client.type);}).join('') + '</select>')
      + field('col-12', lang()==='en'?'Address':'Dirección','<input type="text" data-bind="client.address" value="' + esc(p.client.address) + '">')
      + field('col-5', lang()==='en'?'City':'Ciudad','<input type="text" data-bind="client.city" value="' + esc(p.client.city) + '">')
      + field('col-3', lang()==='en'?'State':'Estado','<input type="text" data-bind="client.state" value="' + esc(p.client.state) + '">')
      + field('col-4','ZIP','<input type="text" data-bind="client.zip" value="' + esc(p.client.zip) + '">')
      + '</div></div>'
      + '<div class="card"><h3>📅 ' + esc(t('termsTitle')) + '</h3>'
      + '<p class="muted">' + esc(t('termsHelp')) + '</p>'
      + '<div class="form-row">'
      + field('col-6', t('deliveryTime') + ' *','<input type="text" data-bind="terms.deliveryTime" value="' + esc((p.terms&&p.terms.deliveryTime)||'') + '" placeholder="' + (lang()==='en'?'e.g. 5-7 business days after approval':'Ej.: 5-7 días hábiles tras aprobación') + '">')
      + field('col-6', t('paymentMethod') + ' *','<input type="text" data-bind="terms.paymentMethod" value="' + esc((p.terms&&p.terms.paymentMethod)||'') + '" placeholder="' + (lang()==='en'?'e.g. 30% deposit, 40% start, 30% completion (check/Zelle)':'Ej.: 30% depósito, 40% inicio, 30% entrega (cheque/Zelle)') + '">')
      + field('col-6', t('equipmentLead'),'<input type="text" data-bind="terms.equipmentLeadTime" value="' + esc((p.terms&&p.terms.equipmentLeadTime)||'') + '" placeholder="' + (lang()==='en'?'e.g. Equipment in stock / 3-10 business days':'Ej.: Equipos en stock / 3-10 días hábiles') + '">')
      + field('col-6', t('warrantyTerms'),'<input type="text" data-bind="terms.warranty" value="' + esc((p.terms&&p.terms.warranty)||'') + '" placeholder="' + (lang()==='en'?'Labor and manufacturer warranty terms':'Garantía de mano de obra y de fábrica') + '">')
      + '</div></div>'
      + '<div class="card"><h3>📝 ' + (lang()==='en'?'Work description':'Descripción del trabajo') + '</h3>'
      + '<div class="field"><label>' + (lang()==='en'?'System summary, location and conditions':'Resumen del sistema, ubicación y condiciones') + '</label><textarea data-bind="notes" placeholder="' + (lang()==='en'?'e.g. Replace 3-ton split on 2nd floor, condenser in backyard, evaluate existing lines...':'Ej.: Reemplazo de split 3 ton en segundo piso, condensadora en patio trasero, líneas existentes a evaluar...') + '">' + esc(p.notes) + '</textarea></div>'
      + '<div class="form-row">' + field('col-4', lang()==='en'?'Date':'Fecha','<input type="date" data-bind="date" value="' + esc(p.date) + '">')
      + field('col-4', lang()==='en'?'Valid until':'Vigencia hasta','<input type="date" data-bind="validUntil" value="' + esc(p.validUntil) + '">')
      + field('col-4', t('colStatus'),'<select data-bind="status">' + statusOpts.map(function(s){return option(s[0],s[1],p.status);}).join('') + '</select>') + '</div></div>'
      + '<div class="actions" style="justify-content:flex-end"><a class="btn primary" href="#/project/' + p.id + '/' + nextN + '">' + (lang()==='en'?'Next':'Siguiente') + ' →</a></div>'
      + '</div>' + projectSidebar(p, c, ch) + '</div>';
  }

  function field(col, label, inputHtml, help) { return '<div class="field ' + col + '"><label>' + esc(label) + '</label>' + inputHtml + (help ? '<span class="field-help">' + help + '</span>' : '') + '</div>'; }

  /* ---- Step 2: supplier selection ---- */
  function stepSuppliers(p, c, ch, steps) {
    var selected = p.selectedSuppliers || [];
    var list = S.state.suppliers.map(function (s) {
      var on = selected.indexOf(s.id) >= 0;
      var hasEmail = s.email && String(s.email).trim();
      return '<label class="check-tile supplier-tile' + (on?' is-on':'') + '"><input type="checkbox" data-bind="selectedSuppliers" value="' + esc(s.id) + '"' + (on ? ' checked' : '') + '>'
        + '<div class="supplier-tile-inner">'
        + '<div class="supplier-tile-logo">' + supplierBadge(s.id, 34) + '</div>'
        + '<div class="supplier-tile-body"><div class="t">' + esc(s.name || s.short) + (on ? ' <span class="pill ok">' + (lang()==='en'?'Selected':'Seleccionado') + '</span>' : '') + '</div>'
        + '<div class="d">' + esc(s.note || '') + '</div>'
        + '<div class="small muted" style="margin-top:4px">' + (hasEmail ? ('✉ ' + esc(s.email)) : (lang()==='en'?'Email: pending':'Correo: pendiente')) + (s.quoteUrl ? ' · <span>RFQ</span>' : '') + '</div>'
        + '</div></div></label>';
    }).join('');
    var selCount = selected.length;
    var compareNote = selCount >= 2
      ? '<div class="notice success" style="margin-top:10px">⚖️ ' + (lang()==='en' ? 'You selected <b>' + selCount + ' suppliers</b>. When adding items, you will see options and prices from these suppliers so you can compare the same product when available.' : 'Seleccionaste <b>' + selCount + ' proveedores</b>. Al agregar ítems verás opciones y precios de estos proveedores para comparar el mismo producto cuando esté disponible.') + '</div>'
      : (selCount === 1
        ? '<div class="notice info" style="margin-top:10px">ℹ️ ' + (lang()==='en' ? 'You selected 1 supplier. The catalog/prices shown in next steps will prioritize this supplier. Select 2+ suppliers if you want to compare prices for the same product.' : 'Seleccionaste 1 proveedor. El catálogo/precios en las siguientes etapas priorizará este proveedor. Selecciona 2+ si deseas comparar precios del mismo producto.') + '</div>'
        : '<div class="notice warn" style="margin-top:10px">⚠️ ' + (lang()==='en' ? 'Select at least one supplier to filter materials and prices in the next steps. You can choose several suppliers to compare.' : 'Selecciona al menos un proveedor para filtrar materiales y precios en las siguientes etapas. Puedes elegir varios para comparar.') + '</div>');
    var nextN = 3;
    return '<div class="split"><div>'
      + '<div class="card"><h3>🏪 ' + (lang()==='en'?'Select suppliers for this project':'Selecciona los proveedores de este proyecto') + '</h3>'
      + '<p class="muted">' + (lang()==='en'
        ? 'Choose where you plan to buy equipment and materials. Some prefer a single supplier; others compare prices. Your selection filters the catalog and prices in the next stages.'
        : 'Elige dónde planeas comprar equipos y materiales. Algunos prefieren un solo proveedor; otros comparan precios. Tu selección filtra el catálogo y precios en las siguientes etapas.') + '</p>'
      + '<div class="notice info"><b>' + (lang()==='en'?'Tip:':'Consejo:') + '</b> ' + (lang()==='en'
        ? 'Select 2 or more suppliers to compare prices for the same product (when the same item is available from different suppliers).'
        : 'Selecciona 2 o más proveedores para comparar precios del mismo producto (cuando el mismo ítem esté disponible en distintos proveedores).') + '</div>'
      + '<div class="check-grid" style="margin-top:10px">' + list + '</div>'
      + compareNote
      + '</div>'
      + '<div class="actions" style="justify-content:space-between"><a class="btn" href="#/project/' + p.id + '/1">← ' + esc(t('previous')) + '</a><a class="btn primary" href="#/project/' + p.id + '/' + nextN + '">' + (lang()==='en'?'Next':'Siguiente') + ' →</a></div>'
      + '</div>' + projectSidebar(p, c, ch) + '</div>';
  }

  /* ---- Steps 3-7: lines ---- */
  function stepLines(p, c, ch, stageId, title, hint, steps) {
    steps = steps || getSteps(p);
    var lines = p.lines[stageId] || [];
    var rows = '';
    if (!lines.length) {
      rows = '<tr><td colspan="6"><div class="empty">📦 ' + (lang()==='en'?'No items in this stage yet. Add from catalog or create a manual line.':'No hay ítems en esta etapa todavía. Agrega desde el catálogo o crea una línea manual.') + '</div></td></tr>';
    } else {
      // group lines by category/brand
      var groups = {};
      var order = [];
      lines.forEach(function(l){
        var key = groupKeyFor(l, stageId);
        if (!groups[key]) { groups[key] = { key:key, label: groupLabelFor(l, stageId), icon: groupIconFor(l, stageId), items: [] }; order.push(key); }
        groups[key].items.push(l);
      });
      order.forEach(function(key){
        var g = groups[key];
        var gtag = (stageId === 'equipment') ? (lang()==='en'?'Brand':'Marca') : (lang()==='en'?'Category':'Categoría');
      rows += '<tr class="group-row"><td colspan="6"><div class="group-head"><span class="group-tag">' + esc(gtag) + '</span> ' + g.icon + ' <span>' + esc(g.label) + '</span> <span class="group-count">(' + g.items.length + ' ' + (lang()==='en'?'items':'ítems') + ')</span></div></td></tr>';
        rows += g.items.map(function (l) {
          var stale = U.daysBetween(l.priceDate) > 45;
          var deal = l.regularCost && l.regularCost > l.unitCost;
          var ic = (stageId === 'equipment' ? brandBadge(l.brand, 26) : stageIcon(stageId));
          var info = [l.brand, l.model].filter(Boolean).join(' ');
          var subLbl = (l.sub && stageId !== 'equipment') ? (P.subLabel ? P.subLabel(l.sub) : l.sub) : '';
          var check = l.url ? '<a class="btn sm soft" href="' + esc(l.url) + '" target="_blank" rel="noopener" title="' + esc(t('viewPrice')) + '">🔗 ' + esc(t('viewPrice')) + '</a> ' : '';
          var selected = p.selectedSuppliers || [];
          var otherSupplier = selected.length > 0 && l.supplier && selected.indexOf(l.supplier) < 0;
          var supWarn = '';
          if (otherSupplier) {
            var q = [l.name, l.brand, l.model, l.sku].filter(Boolean).join(' ');
            supWarn = '<div class="supplier-warn-box"><span class="pill danger">' + (lang()==='en'?'Supplier not selected':'Proveedor no seleccionado') + '</span>'
              + ' <span class="small muted supplier-inline">' + supplierBadge(l.supplier, 16) + ' ' + esc(S.supplierName(l.supplier)) + '</span>'
              + ' <button class="btn sm warn" data-action="open-catalog" data-stage="' + stageId + '" data-pid="' + p.id + '" data-query="' + esc(q).replace(/"/g,'&quot;') + '">' + (lang()==='en'?'Search in another supplier':'Buscar en otro proveedor') + '</button></div>';
          }
          return '<tr' + (otherSupplier ? ' class="line-warn-supplier"' : '') + '>'
            + '<td><div class="item-cell"><div class="thumb sm brand-thumb">' + ic + '</div><div class="meta"><div><b>' + esc(l.name) + '</b>' + (deal ? ' <span class="pill deal">🏷️ ' + esc(t('deal')) + '</span>' : '') + (stale ? ' <span class="pill warn">⏳ ' + esc(t('oldPrice')) + '</span>' : '') + '</div>'
            + '<div class="small muted">' + (stageId==='equipment' && l.brand ? (brandBadge(l.brand,18)+' '):'') + esc(info || '') + (subLbl? ' · ' + esc(subLbl):'') + (l.sku ? ' · SKU ' + esc(l.sku) : '') + '</div>'
            + '<div class="small muted supplier-inline" style="margin-top:2px">' + supplierBadge(l.supplier, 16) + ' ' + esc(S.supplierName(l.supplier)) + '</div>'
            + '<div class="small">' + (l.includes ? '<span class="muted">' + esc(t('includesLabel')) + ':</span> ' + esc(l.includes) : '<span class="pill warn">⚠ ' + esc(t('noIncludes')) + '</span>') + '</div>'
            + supWarn + '</div></div></td>'
            + '<td class="num">' + l.qty + ' ' + esc(l.unit) + '</td>'
            + '<td class="num">' + money(l.unitCost) + '<div class="small muted">' + U.date(l.priceDate) + '</div></td>'
            + '<td class="num">' + money(l._unitSell) + '</td>'
            + '<td class="num"><b>' + money(l._extSell) + '</b><div class="small muted">' + (lang()==='en'?'margin':'margen') + ' ' + U.pct(l._margin * 100) + '</div></td>'
            + '<td class="num" style="white-space:nowrap">' + check
            + '<button class="btn sm" data-action="edit-line" data-id="' + l.id + '">✏️ ' + esc(t('edit')) + '</button> '
            + '<button class="btn sm danger" data-action="del-line" data-id="' + l.id + '">🗑️</button></td></tr>';
        }).join('');
      });
    }

    var suggestions = stageId === 'materials' || stageId === 'equipment' ? S.dealSuggestions(p).filter(function(d){return d.item.cat===stageId || (stageId==='materials' && d.item.cat==='materials');}).slice(0,4) : [];
    var sel = p.selectedSuppliers || [];
    var selInfo = sel.length ? '<div class="small muted" style="margin-top:6px">' + (lang()==='en' ? 'Catalog filtered by selected suppliers (' + sel.length + '). <a href="#/project/' + p.id + '/2">Change suppliers</a>.' : 'Catálogo filtrado por proveedores seleccionados (' + sel.length + '). <a href="#/project/' + p.id + '/2">Cambiar proveedores</a>.') + '</div>' : '';
    var sugHtml = suggestions.length ? '<div class="notice success" style="margin-top:12px"><b>🔥 ' + (lang()==='en'?'Deals that can help win this project:':'Ofertas que pueden ayudar a ganar el proyecto:') + '</b><ul class="list" style="margin-top:6px">'
      + suggestions.map(function(d){ return '<li><span class="pill deal">-' + U.pct(d.savingPct*100) + '</span><div style="flex:1"><b>' + esc(d.item.name) + '</b> · ' + money(d.price) + ' <s class="muted">' + money(d.regular) + '</s> · ' + esc(S.supplierName(d.item.supplier)) + (d.promo.ends?' · ' + (lang()==='en'?'ends':'vence') + ' '+U.date(d.promo.ends):'') + '</div><button class="btn sm primary" data-action="add-catalog" data-item="' + d.item.id + '" data-stage="' + stageId + '">➕ ' + esc(t('add')) + '</button></li>'; }).join('')
      + '</ul></div>' : '';

    var stepN = 1;
    for (var si=0; si<steps.length; si++) if (steps[si].stage === stageId) { stepN = steps[si].n; break; }
    var prev = Math.max(1, stepN - 1);
    var next = Math.min(steps.length, stepN + 1);

    return '<div class="split"><div>'
      + '<div class="card"><div class="page-head" style="margin:0"><div><h3 style="margin:0">' + stageIcon(stageId) + ' ' + esc(title) + '</h3><p class="muted">' + esc(hint) + '</p></div>'
      + '<div class="actions"><button class="btn soft" data-action="open-catalog" data-stage="' + stageId + '">🔎 ' + (lang()==='en'?'Search catalog':'Buscar en catálogo') + '</button>'
      + '<button class="btn primary" data-action="new-line" data-stage="' + stageId + '">➕ ' + (lang()==='en'?'Manual line':'Línea manual') + '</button></div></div></div>'
      + '<div class="card"><div class="table-wrap"><table><thead><tr><th>' + (lang()==='en'?'Item / supplier / includes':'Ítem / proveedor / incluye') + '</th><th class="num">' + esc(t('colQty')) + '</th><th class="num">' + esc(t('colCost')) + '</th><th class="num">' + (lang()==='en'?'Sell':'P. venta') + '</th><th class="num">Ext.</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>'
      + '<div class="notice info" style="margin-top:10px">💡 <b>' + (lang()==='en'?'Tip:':'Consejo:') + '</b> ' + (lang()==='en'?'When entering a manual price, fill in <b>"what\'s included"</b> and the <b>price date</b>. Verify the live price with the supplier before sending the quote.':'Cuando ingreses un precio manual, completa <b>"qué incluye"</b> y la <b>fecha del precio</b>. Verifica el precio vigente con el proveedor antes de enviar la oferta.') + selInfo + '</div>'
      + sugHtml + '</div>'
      + '<div class="actions" style="justify-content:space-between"><a class="btn" href="#/project/' + p.id + '/' + prev + '">← ' + esc(t('previous')) + '</a><a class="btn primary" href="#/project/' + p.id + '/' + next + '">' + esc(t('next')) + ' →</a></div>'
      + '</div>' + projectSidebar(p, c, ch) + '</div>';
  }

  function njQuotePointsHTML(p) {
    var en = lang()==='en';
    var inc = (p.inclusions || []).slice();
    var points = [
      { id:'nj_contractor', title: en?'Contractor identity & NJ HIC license':'Identidad del contratista y licencia HIC de NJ', tip: en?'Include legal/trade name, address, phone, and NJ Home Improvement Contractor (HIC 13VH…) number. Required on NJ home improvement proposals/contracts.':'Incluye nombre legal/comercial, dirección, teléfono y número HIC de NJ (13VH…). Requerido en propuestas/contratos de mejoras del hogar en NJ.', text: en?'Contractor information and NJ HIC license number as stated on this proposal.':'Información del contratista y número de licencia HIC de NJ según esta propuesta.' },
      { id:'nj_scope', title: en?'Detailed scope of work':'Alcance detallado del trabajo', tip: en?'Describe exactly what will be installed/serviced, locations, quantities, and conditions. Helps avoid disputes and change orders.':'Describe exactamente qué se instalará/serviciará, ubicaciones, cantidades y condiciones. Ayuda a evitar disputas y órdenes de cambio.', text: en?'Scope of work as described: equipment, locations, and services included in this proposal.':'Alcance del trabajo según lo descrito: equipos, ubicaciones y servicios incluidos en esta propuesta.' },
      { id:'nj_equipment', title: en?'Equipment specs (brand, model, capacity, efficiency)':'Especificaciones de equipos (marca, modelo, capacidad, eficiencia)', tip: en?'List brand, model, tonnage/BTU, SEER2/AFUE/HSPF as applicable. Shown in proposal equipment section.':'Indica marca, modelo, toneladas/BTU, SEER2/AFUE/HSPF según aplique. Se muestra en la sección de equipos de la propuesta.', text: en?'Equipment brands/models/capacities and efficiencies as specified in this proposal.':'Marcas/modelos/capacidades y eficiencias de equipos según se especifica en esta propuesta.' },
      { id:'nj_price_tax', title: en?'Total price, taxes & tax treatment':'Precio total, impuestos y tratamiento fiscal', tip: en?'State total price and whether NJ sales tax applies (capital improvement ST-8 vs taxable repair/service). Explain what is taxable.':'Indica el precio total y si aplica impuesto de ventas de NJ (mejora capital ST-8 vs reparación/servicio gravado). Explica qué es gravable.', text: en?'Total price and applicable NJ sales tax treatment as shown in the commercial summary.':'Precio total y tratamiento de impuesto de ventas de NJ aplicable según el resumen comercial.' },
      { id:'nj_payment', title: en?'Payment schedule & deposit terms':'Calendario de pagos y términos de depósito', tip: en?'Show deposit amount/%, progress payments, and final payment due upon completion/inspection. Keep it consistent with milestones.':'Muestra depósito (%/monto), pagos parciales y pago final al completar/inspección. Debe coincidir con los hitos.', text: en?'Payment schedule and deposit terms as stated in this proposal.':'Calendario de pagos y términos de depósito según se indica en esta propuesta.' },
      { id:'nj_dates', title: en?'Start, lead time & completion timeframe':'Inicio, plazo de equipos y tiempo de ejecución', tip: en?'Provide estimated start date, equipment/material lead times, and completion timeframe (subject to permits, access, availability).':'Indica fecha estimada de inicio, plazos de equipos/materiales y tiempo de finalización (sujeto a permisos, acceso, disponibilidad).', text: en?'Estimated delivery/execution timeframe and equipment lead times as stated; subject to site conditions and availability.':'Tiempo estimado de entrega/ejecución y plazos de equipos según se indica; sujeto a condiciones del sitio y disponibilidad.' },
      { id:'nj_permits', title: en?'Permits, inspections & code compliance':'Permisos, inspecciones y cumplimiento de código', tip: en?'Clarify who obtains permits, schedules inspections, and ensures compliance with NJ/local codes. Often contractor responsibility for installed work.':'Aclara quién obtiene permisos, programa inspecciones y asegura cumplimiento de códigos de NJ/locales. Frecuentemente es responsabilidad del contratista.', text: en?'Permits and inspections as specified; work performed in accordance with applicable codes and manufacturer instructions.':'Permisos e inspecciones según se especifique; trabajo realizado conforme a códigos aplicables e instrucciones del fabricante.' },
      { id:'nj_warranty', title: en?'Labor & manufacturer warranties':'Garantías de mano de obra y del fabricante', tip: en?'State labor warranty duration/coverage and note manufacturer warranties (registration may be required). Exclude misuse/lack of maintenance.':'Indica duración/cobertura de garantía de mano de obra y garantías del fabricante (puede requerir registro). Excluye mal uso/falta de mantenimiento.', text: en?'Labor warranty and manufacturer warranties as stated; proper operation and maintenance required.':'Garantía de mano de obra y garantías del fabricante según se indique; se requiere operación y mantenimiento adecuados.' },
      { id:'nj_exclusions', title: en?'Exclusions & unforeseen conditions':'Exclusiones y condiciones imprevistas', tip: en?'List what is not included (electrical panel upgrades, structural repairs, asbestos/mold, hidden damage). State how changes are priced.':'Lista lo no incluido (mejoras de panel eléctrico, reparaciones estructurales, asbestos/moho, daños ocultos). Indica cómo se cotizan cambios.', text: en?'Exclusions and unforeseen conditions as listed; additional work or changes require written approval/change order.':'Exclusiones y condiciones imprevistas según se listan; trabajos adicionales o cambios requieren aprobación escrita/orden de cambio.' },
      { id:'nj_disposal', title: en?'Removal, disposal & cleanup':'Retiro, disposición y limpieza', tip: en?'Specify removal/disposal of old equipment/refrigerant and jobsite cleanup/debris removal.':'Especifica retiro/disposición de equipos/refrigerante viejo y limpieza/retiro de escombros del área.','text': en?'Removal/disposal of replaced equipment/materials and jobsite cleanup as specified.':'Retiro/disposición de equipos/materiales reemplazados y limpieza del área según se especifique.' },
      { id:'nj_insurance', title: en?'Insurance & liability':'Seguro y responsabilidad', tip: en?'Mention liability/workers’ comp insurance coverage as applicable. Customers may request certificate of insurance.':'Menciona cobertura de seguro de responsabilidad/compensación laboral según aplique. El cliente puede solicitar certificado.','text': en?'Contractor maintains applicable insurance coverage; certificate available upon request.':'El contratista mantiene cobertura de seguro aplicable; certificado disponible a solicitud.' },
      { id:'nj_acceptance', title: en?'Acceptance, signatures & changes':'Aceptación, firmas y cambios', tip: en?'Include acceptance block for client/contractor signatures and date. State that changes must be approved in writing.':'Incluye espacio de aceptación/firma de cliente y contratista y fecha. Indica que los cambios deben aprobarse por escrito.','text': en?'Proposal accepted upon signature by authorized parties; any changes must be agreed in writing.':'Propuesta aceptada mediante firma de las partes autorizadas; cualquier cambio debe acordarse por escrito.' }
    ];
    function hasText(text){ return inc.some(function(x){ return String(x||'').toLowerCase().indexOf(String(text||'').toLowerCase().slice(0,24)) >= 0; }); }
    var items = points.map(function(pt){
      var on = hasText(pt.text);
      return '<div class="check-tile" style="align-items:flex-start"><div style="flex:1;min-width:0">'
        + '<div class="t"><span class="tip" data-tip="' + esc(pt.tip) + '" tabindex="0">' + esc(pt.title) + '</span> ' + (on ? '<span class="pill ok">' + (en?'Included':'Incluido') + '</span>' : '') + '</div>'
        + '<div class="d" style="margin-top:4px">' + esc(pt.tip) + '</div>'
        + '</div><div class="actions" style="flex:0 0 auto"><button class="btn sm ' + (on?'':'soft') + '" data-action="toggle-nj-point" data-pid="' + esc(p.id) + '" data-text="' + esc(pt.text) + '">' + (on ? (en?'Remove':'Quitar') : (en?'Add':'Agregar')) + '</button></div></div>';
    }).join('');
    return '<div class="notice info" style="margin-bottom:10px">' + (en?'<b>NJ HVAC quote essentials:</b> review and include the points that apply. Hover a title for usage guidance.':'<b>Puntos esenciales para cotización HVAC en NJ:</b> revisa e incluye los que apliquen. Pasa el mouse sobre el título para ver cómo usarlo.') + '</div>'
      + '<div class="check-grid" style="grid-template-columns:1fr">' + items + '</div>';
  }

  /* ---- Maintenance step ---- */
  function stepMaintenance(p, c, ch, steps) {
    steps = steps || getSteps(p);
    var en = lang()==='en';
    p.maintenance = p.maintenance || { items: [], notes: '', contractMonths: 12, includeMaterials: true };
    if (!Array.isArray(p.maintenance.items)) p.maintenance.items = [];
    var items = p.maintenance.items;
    var rows = items.length ? items.map(function(m, idx){
      var qty = U.num(m.qty)||0, visits = U.num(m.visits)||0, price = U.num(m.pricePerVisit)||0, mat = U.num(m.materialsPerVisit)||0;
      var lineSell = visits * (qty * price + mat);
      return '<tr>'
        + '<td><input type="text" data-maint-idx="'+idx+'" data-maint-field="type" value="'+esc(m.type||'')+'" placeholder="'+esc(en?'e.g. Split 3 ton / RTU':'Ej.: Split 3 ton / RTU')+'"></td>'
        + '<td class="num"><input type="number" step="1" min="0" style="width:80px" data-maint-idx="'+idx+'" data-maint-field="qty" value="'+esc(m.qty==null?1:m.qty)+'"></td>'
        + '<td class="num"><input type="number" step="1" min="0" style="width:90px" data-maint-idx="'+idx+'" data-maint-field="visits" value="'+esc(m.visits==null?2:m.visits)+'" title="'+esc(en?'Visits per period/year':'Visitas por periodo/año')+'"></td>'
        + '<td class="num"><input type="number" step="0.01" min="0" style="width:110px" data-maint-idx="'+idx+'" data-maint-field="pricePerVisit" value="'+esc(m.pricePerVisit==null?'':m.pricePerVisit)+'" placeholder="0.00"></td>'
        + '<td class="num"><input type="number" step="0.01" min="0" style="width:110px" data-maint-idx="'+idx+'" data-maint-field="materialsPerVisit" value="'+esc(m.materialsPerVisit==null?'':m.materialsPerVisit)+'" placeholder="0.00"></td>'
        + '<td class="num"><b>'+money(lineSell)+'</b><div class="small muted">'+money(visits*mat)+' '+(en?'parts':'mat.')+'</div></td>'
        + '<td class="num"><button class="btn sm danger" data-action="del-maint-item" data-idx="'+idx+'">🗑️</button></td>'
        + '</tr>';
    }).join('') : '<tr><td colspan="7"><div class="empty">🛠️ ' + (en?'No maintenance items yet. Add equipment/service lines to build the maintenance budget.':'Aún no hay ítems de mantenimiento. Agrega equipos/servicios para crear el presupuesto de mantenimiento.') + '</div></td></tr>';
    var maintTotal = U.num(c.maintSell || 0);
    var maintMat = U.num(c.maintCost || 0);
    var stepN = 1; for (var si=0; si<steps.length; si++) if (steps[si].id === 'maintenance') { stepN = steps[si].n; break; }
    var prev = Math.max(1, stepN - 1), next = Math.min(steps.length, stepN + 1);
    return '<div class="split"><div>'
      + '<div class="card"><div class="page-head" style="margin:0"><div><h3 style="margin:0">🛠️ ' + (en?'Maintenance plan & budget':'Plan y presupuesto de mantenimiento') + '</h3>'
      + '<p class="muted">' + (en?'Define equipment count/type, visit frequency, price per equipment per visit, and materials/parts allowance to produce a clear maintenance budget.':'Define cantidad/tipo de equipos, frecuencia de visitas, precio por equipo por visita y monto de materiales/repuestos para generar un presupuesto de mantenimiento claro.') + '</p></div>'
      + '<div class="actions"><button class="btn primary" data-action="add-maint-item" data-pid="'+esc(p.id)+'">➕ ' + (en?'Add equipment/line':'Agregar equipo/línea') + '</button></div></div>'
      + '<div class="notice info" style="margin-top:10px">' + (en?'<b>How to use:</b> Add one line per equipment type or service group. <b>Visits</b> = visits per contract period (e.g. 2 for semiannual, 4 for quarterly). <b>Price per equipment/visit</b> = labor/service amount per unit per visit. <b>Materials/parts per visit</b> = allowance for filters, belts, chemicals, minor parts per visit (counted as direct cost).':'<b>Cómo usar:</b> Agrega una línea por tipo de equipo o grupo de servicio. <b>Visitas</b> = visitas por periodo/contrato (ej. 2 semestral, 4 trimestral). <b>Precio por equipo/visita</b> = monto de mano de obra/servicio por unidad por visita. <b>Materiales/repuestos por visita</b> = provisión para filtros, correas, químicos, repuestos menores por visita (se cuenta como costo directo).') + '</div></div>'
      + '<div class="card"><h3>📋 ' + (en?'Maintenance lines':'Líneas de mantenimiento') + '</h3>'
      + '<div class="table-wrap"><table><thead><tr><th>' + (en?'Equipment / service type':'Tipo de equipo / servicio') + '</th><th class="num">' + (en?'Qty':'Cant.') + '</th><th class="num">' + (en?'Visits':'Visitas') + '</th><th class="num">' + (en?'$/equip/visit':'$/equipo/visita') + '</th><th class="num">' + (en?'Materials/visit':'Materiales/visita') + '</th><th class="num">' + (en?'Line total':'Total línea') + '</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div></div>'
      + '<div class="card"><h3>🧾 ' + (en?'Maintenance totals':'Totales de mantenimiento') + '</h3>'
      + '<div class="form-row">'
      + field('col-4', en?'Contract period (months)':'Periodo de contrato (meses)','<input type="number" step="1" min="0" data-bind="maintenance.contractMonths" value="'+esc(p.maintenance.contractMonths==null?12:p.maintenance.contractMonths)+'">', en?'Common: 12 months. Use for clarity in the proposal.':'Común: 12 meses. Úsalo para claridad en la propuesta.')
      + field('col-8', en?'Maintenance notes / included tasks':'Notas de mantenimiento / tareas incluidas','<textarea class="textarea-lg" data-bind="maintenance.notes">'+esc(p.maintenance.notes||'')+'</textarea>', en?'E.g. inspection, coil cleaning, filter check/replacement (if included), refrigerant level check, electrical checks, drain cleaning, report.':'Ej.: inspección, limpieza de coil, revisión/cambio de filtros (si aplica), verificación de refrigerante, chequeos eléctricos, limpieza de drenaje, reporte.')
      + '</div>'
      + '<div class="kv" style="max-width:420px;margin-top:8px"><span class="k">' + (en?'Maintenance sell total':'Total venta mantenimiento') + '</span><span class="v"><b>' + money(maintTotal) + '</b></span><span class="k">' + (en?'Materials/parts allowance (cost)':'Provisión materiales/repuestos (costo)') + '</span><span class="v">' + money(maintMat) + '</span></div>'
      + '<div class="notice info" style="margin-top:10px">' + (en?'This maintenance budget is included in project totals when scope includes maintenance. Review tax mode and commercial terms in Summary.':'Este presupuesto de mantenimiento se incluye en los totales del proyecto cuando el alcance incluye mantenimiento. Revisa el modo de impuesto y condiciones comerciales en Resumen.') + '</div></div>'
      + '<div class="actions" style="justify-content:space-between"><a class="btn" href="#/project/' + p.id + '/' + prev + '">← ' + esc(t('previous')) + '</a><a class="btn primary" href="#/project/' + p.id + '/' + next + '">' + esc(t('next')) + ' →</a></div>'
      + '</div>' + projectSidebar(p, c, ch) + '</div>';
  }

  /* ---- Step 7: summary ---- */
  function stepSummary(p, c, ch, steps) {
    steps = steps || getSteps(p);
    var summaryStep = steps[steps.length - 1];
    var prevN = Math.max(1, summaryStep.n - 1);
    var st = p.settings;
    var by = P.STAGES.map(function (s) {
      var b = c.byStage[s.id]; if (!b || (!b.count && !b.sell)) return '';
      return '<tr><td>' + (s.icon||'') + ' ' + esc(L(s.id)) + '</td><td class="num">' + b.count + '</td><td class="num">' + money(b.cost) + '</td><td class="num">' + money(b.sell) + '</td></tr>';
    }).join('');
    if (c.byStage.maintenance && (c.byStage.maintenance.sell || c.byStage.maintenance.count || c.maintSell)) {
      var mb = c.byStage.maintenance || { cost: c.maintCost||0, sell: c.maintSell||0, count: c.maintItems||0 };
      by += '<tr><td>🛠️ ' + (lang()==='en'?'Maintenance':'Mantenimiento') + '</td><td class="num">' + (mb.count||0) + '</td><td class="num">' + money(mb.cost) + '</td><td class="num">' + money(mb.sell) + '</td></tr>';
    }
    var issues = ch.items.filter(function (i) { return i.status !== 'ok'; });
    function stepForIssue(i) {
      if (i && i.id === 'maintplan') {
        for (var si=0; si<steps.length; si++) if (steps[si].id === 'maintenance') return steps[si].n;
      }
      return i.step || 1;
    }
    var issueHtml = issues.length ? '<ul class="list">' + issues.map(function(i){
      return '<li>' + statusPill(i.status) + '<div><b>' + esc(i.label) + '</b><div class="small muted">' + esc(i.detail) + '</div></div><a class="btn sm" href="#/project/' + p.id + '/' + stepForIssue(i) + '">' + (lang()==='en'?'Go':'Ir') + '</a></li>';
    }).join('') + '</ul>' : '<div class="notice success">✅ ' + (lang()==='en'?'All critical checklist items are complete. Review the PDF before sending.':'Todo el checklist crítico está completo. Revisa el PDF antes de enviar.') + '</div>';

    var deals = S.dealSuggestions(p).slice(0,5);
    var dealsHtml = deals.length ? dealsList(deals, true) : '<div class="muted small">' + (lang()==='en'?'No pending deal suggestions for this scope.':'No hay ofertas sugeridas pendientes para este alcance.') + '</div>';
    var taxNote = (P.NJ_NOTES && P.NJ_NOTES[st.taxMode]) || (P.NJ_NOTES ? P.NJ_NOTES.custom : '');

    return '<div class="split"><div>'
      + '<div class="card"><h3>📊 ' + (lang()==='en'?'Summary by stage':'Resumen por etapa') + '</h3><div class="table-wrap"><table><thead><tr><th>' + esc(t('colStage')) + '</th><th class="num">' + (lang()==='en'?'Items':'Ítems') + '</th><th class="num">' + esc(t('colCost')) + '</th><th class="num">' + (lang()==='en'?'Sell':'Venta') + '</th></tr></thead><tbody>' + (by || '<tr><td colspan="4" class="muted">' + (lang()==='en'?'No lines yet.':'Sin líneas aún.') + '</td></tr>') + '</tbody></table></div></div>'
      + '<div class="card"><h3>🧾 ' + (lang()==='en'?'Commercial totals (clear breakdown)':'Totales comerciales (desglose claro)') + '</h3>' + totalsBreakdownHTML(p, c) + '</div>'
      + '<div class="card"><h3>💰 ' + (lang()==='en'?'Margin, taxes & conditions':'Margen, impuestos y condiciones') + '</h3>'
      + '<div class="notice info" style="margin-bottom:10px">' + (lang()==='en'
        ? '<b>How this section works:</b> set pricing and tax settings. Units: <span class="field-unit">%</span> = percentage (enter 6.625 for 6.625%), <span class="field-unit">$</span> = US dollars, <span class="field-unit">factor</span> = multiplier (1.00 = no change).'
        : '<b>Cómo funciona esta sección:</b> define márgenes e impuestos. Unidades: <span class="field-unit">%</span> = porcentaje (ingresa 6.625 para 6.625%), <span class="field-unit">$</span> = dólares USD, <span class="field-unit">factor</span> = multiplicador (1.00 = sin cambio).') + '</div>'
      + '<div class="form-row">'
      + field('col-3', lang()==='en'?'Global profit factor':'Factor global de utilidad','<input type="number" step="0.01" data-bind="settings.globalFactor" value="' + esc(st.globalFactor) + '">', lang()==='en' ? '<span class="field-unit">Unit: factor (x).</span> Multiplies sell subtotal after contingency. Example: 1.10 adds 10%.' : '<span class="field-unit">Unidad: factor (x).</span> Multiplica el subtotal de venta tras contingencia. Ej.: 1.10 agrega 10%.')
      + field('col-3', lang()==='en'?'Contingency':'Contingencia','<input type="number" step="0.1" data-bind="settings.contingencyPct" value="' + esc(st.contingencyPct) + '">', lang()==='en' ? '<span class="field-unit">Unit: % of direct cost.</span> Reserve for unforeseen conditions/waste.' : '<span class="field-unit">Unidad: % del costo directo.</span> Reserva para imprevistos/desperdicios.')
      + field('col-3', lang()==='en'?'Overhead':'Gastos indirectos (overhead)','<input type="number" step="0.1" data-bind="settings.overheadPct" value="' + esc(st.overheadPct) + '">', lang()==='en' ? '<span class="field-unit">Unit: % of direct cost.</span> Office, vehicles, admin, etc.' : '<span class="field-unit">Unidad: % del costo directo.</span> Oficina, vehículos, administración, etc.')
      + field('col-3', lang()==='en'?'Deposit requested':'Depósito solicitado','<input type="number" step="1" data-bind="settings.depositPct" value="' + esc(st.depositPct) + '">', lang()==='en' ? '<span class="field-unit">Unit: % of proposal total.</span> Upfront amount (NJ practice often 10–33%).' : '<span class="field-unit">Unidad: % del total de la propuesta.</span> Anticipo inicial (en NJ suele ser 10–33%).')
      + field('col-3', lang()==='en'?'Discount':'Descuento','<input type="number" step="0.1" data-bind="settings.discountPct" value="' + esc(st.discountPct) + '">', lang()==='en' ? '<span class="field-unit">Unit: %.</span> Percentage discount before tax (if fixed discount is 0).' : '<span class="field-unit">Unidad: %.</span> Descuento porcentual antes de impuesto (si descuento fijo es 0).')
      + field('col-3', lang()==='en'?'Fixed discount':'Descuento fijo','<input type="number" step="0.01" data-bind="settings.discountAmt" value="' + esc(st.discountAmt) + '">', lang()==='en' ? '<span class="field-unit">Unit: $ (USD).</span> If > 0, overrides discount %.' : '<span class="field-unit">Unidad: $ (USD).</span> Si es mayor que 0, reemplaza el descuento en %.')
      + field('col-6', lang()==='en'?'Tax mode (New Jersey)':'Modo de impuesto (Nueva Jersey)','<select data-bind="settings.taxMode">' + [['capital',lang()==='en'?'Capital improvement (ST-8, labor exempt)':'Mejora capital (ST-8, mano de obra exenta)'],['repair',lang()==='en'?'Repair / maintenance (taxable)':'Reparación / mantenimiento (gravado)'],['materials',lang()==='en'?'Materials only (sale)':'Solo materiales (venta)'],['custom',lang()==='en'?'Custom':'Personalizado']].map(function(o){return option(o[0],o[1],st.taxMode);}).join('') + '</select>', lang()==='en' ? '<span class="field-unit">Unit: option.</span> How NJ sales tax applies.' : '<span class="field-unit">Unidad: opción.</span> Cómo se aplica el impuesto de NJ.')
      + field('col-3', lang()==='en'?'Tax rate (%)':'Tasa de impuesto (%)','<input type="number" step="0.001" min="0" data-bind="settings.taxRate" value="' + esc(U.num(st.taxRate) * 100) + '">', lang()==='en' ? '<span class="field-unit">Unit: %.</span> Enter NJ sales tax as percentage (example: 6.625).' : '<span class="field-unit">Unidad: %.</span> Ingresa el impuesto de NJ como porcentaje (ejemplo: 6.625).')
      + field('col-3', lang()==='en'?'Material tax treated as cost':'Impuesto de material como costo','<select data-bind="settings.materialsTaxAsCost">' + option('true',lang()==='en'?'Yes':'Sí',String(st.materialsTaxAsCost)) + option('false','No',String(st.materialsTaxAsCost)) + '</select>', lang()==='en' ? '<span class="field-unit">Unit: Yes/No.</span> Yes = include tax paid on materials/equipment in internal cost.' : '<span class="field-unit">Unidad: Sí/No.</span> Sí = incluir impuesto pagado en materiales/equipos en el costo interno.')
      + '</div><div class="notice info" style="margin-top:8px"><b>' + (lang()==='en'?'NJ note:':'Nota NJ:') + '</b> ' + esc(taxNote) + '</div>'
      + '<div style="margin-top:10px"><label class="check-tile"><input type="checkbox" data-bind="ack.st8"' + (p.acknowledged.st8?' checked':'') + '><div><div class="t">' + (lang()==='en'?'Form ST-8 signed (capital improvement)':'Form ST-8 firmado (capital improvement)') + '</div><div class="d">' + (lang()==='en'?'Check when the owner has signed the capital improvement certificate.':'Marcar cuando el propietario haya firmado el certificado de mejora capital.') + '</div></div></label></div></div>'
      + '<div class="card"><h3>💳 ' + (lang()==='en'?'Payment method & schedule (aligned)':'Forma de pago y calendario (alineados)') + '</h3>'
      + '<div class="notice info" style="margin-bottom:10px">' + (lang()==='en'?'The schedule is automatically aligned with the deposit percentage. Edit the payment terms in Step 1 if you need custom wording.':'El calendario se alinea automáticamente con el porcentaje de depósito. Edita las condiciones de pago en el Paso 1 si necesitas un texto personalizado.') + '</div>'
      + '<div class="form-row">' + field('col-12', lang()==='en'?'Payment method (shown on proposal)':'Forma de pago (mostrada en la propuesta)','<input type="text" data-bind="terms.paymentMethod" value="' + esc((p.terms&&p.terms.paymentMethod)||'') + '">', lang()==='en'?'<span class="field-unit">Tip:</span> should match the milestone schedule below.':'<span class="field-unit">Tip:</span> debe coincidir con el calendario de hitos de abajo.')
      + '</div>'
      + '<div class="table-wrap" style="margin-top:8px"><table><thead><tr><th>' + (lang()==='en'?'Milestone':'Hito') + '</th><th class="num">%</th><th class="num">' + (lang()==='en'?'Amount':'Monto') + '</th></tr></thead><tbody>'
      + (p.schedule||[]).map(function(s){ var amt = c.total * (U.num(s.pct)/100); return '<tr><td>' + esc(s.label) + '</td><td class="num">' + esc(s.pct) + '%</td><td class="num">' + money(amt) + '</td></tr>'; }).join('')
      + '</tbody></table></div></div>'
      + '<div class="card"><h3>📋 ' + (lang()==='en'?'Inclusions, exclusions & notes':'Inclusiones, exclusiones y notas') + '</h3>'
      + '<p class="muted small">' + (lang()==='en'?'Be specific and clear for the client. These appear in the proposal/PDF. Hover each suggested point title to see how to use it.':'Sé específico y claro para el cliente. Esto aparece en la propuesta/PDF. Pasa el mouse sobre cada título sugerido para ver cómo usarlo.') + '</p>'
      + njQuotePointsHTML(p)
      + '<div class="form-row">' + field('col-6', lang()==='en'?'What IS included (one per line)':'Qué SÍ se incluye (una por línea)','<textarea class="textarea-xl" data-bind="inclusions">' + esc((p.inclusions||[]).join('\n')) + '</textarea>', lang()==='en'?'<span class="field-unit">Tip:</span> labor, equipment, materials, permits, startup, cleanup, warranty scope, etc.':'<span class="field-unit">Tip:</span> mano de obra, equipos, materiales, permisos, arranque, limpieza, alcance de garantía, etc.')
      + field('col-6', lang()==='en'?'What is NOT included / exclusions (one per line)':'Qué NO se incluye / exclusiones (una por línea)','<textarea class="textarea-xl" data-bind="exclusions">' + esc((p.exclusions||[]).join('\n')) + '</textarea>', lang()==='en'?'<span class="field-unit">Tip:</span> electrical upgrades, structural work, asbestos, access equipment not listed, unforeseen repairs, etc.':'<span class="field-unit">Tip:</span> mejoras eléctricas, obra civil/estructural, asbestos, accesos no listados, reparaciones imprevistas, etc.') + '</div></div>'
      + '<div class="card"><h3>✅ ' + (lang()==='en'?'Checklist & actions':'Checklist y acciones') + '</h3>' + issueHtml
      + '<div class="actions" style="margin-top:10px;flex-wrap:wrap">'
      + '<button class="btn" data-action="update-prices" data-id="' + p.id + '">💲 ' + esc(t('updatePrices')) + '</button>'
      + '<button class="btn" data-action="open-rfq" data-id="' + p.id + '">📧 ' + (lang()==='en'?'Materials / RFQ':'Materiales / RFQ') + '</button>'
      + '<button class="btn primary" data-action="print-project" data-id="' + p.id + '">🖨️ ' + (lang()==='en'?'Client PDF / Print':'PDF cliente / Imprimir') + '</button>'
      + '</div><div class="notice info" style="margin-top:10px">' + (lang()==='en'?'The client PDF/proposal does not include a detailed materials list. It shows company info, scope/services, equipment & brands, delivery/payment/terms, and totals.':'El PDF/propuesta para el cliente no incluye listado detallado de materiales. Muestra empresa, alcance/servicios, equipos y marcas, entrega/pago/condiciones y totales.') + '</div></div>'
      + '<div class="actions" style="justify-content:space-between"><a class="btn" href="#/project/' + p.id + '/' + prevN + '">← ' + esc(t('previous')) + '</a><span class="muted small">' + (lang()==='en'?'Review before sending':'Revisa antes de enviar') + '</span></div>'
      + '</div>' + projectSidebar(p, c, ch) + '</div>';
  }

  /* ---------------------------------------------------------------- */
  /* Catalog / Deals / Suppliers / Company pages                        */
  /* ---------------------------------------------------------------- */
  function catalogTableRows(items, opts) {
    opts = opts || {};
    if (!items || !items.length) return '<div class="empty">📦 ' + esc(t('noResults') || (lang()==='en'?'No results':'Sin resultados')) + '</div>';
    var groups = {}, order = [];
    var stageId = opts.stage || (items[0] && items[0].cat) || 'materials';
    items.forEach(function(it){
      var key = groupKeyFor(it, stageId);
      if (!groups[key]) { groups[key] = { key:key, label: groupLabelFor(it, stageId), icon: groupIconFor(it, stageId), items: [] }; order.push(key); }
      groups[key].items.push(it);
    });
    var body = '';
    order.forEach(function(key){
      var g = groups[key];
      var sample = g.items[0] || {};
      var catId = sample.cat || stageId || 'materials';
      var gtag = (catId === 'equipment') ? (lang()==='en'?'Brand':'Marca') : (lang()==='en'?'Category':'Categoría');
      body += '<tr class="group-row"><td colspan="6"><div class="group-head"><span class="group-tag">' + esc(gtag) + '</span> ' + g.icon + ' <span>' + esc(g.label) + '</span> <span class="group-count">(' + g.items.length + ' ' + (lang()==='en'?'items':'ítems') + ')</span></div></td></tr>';
      body += g.items.map(function (it) {
        var pr = S.activePromo(it);
        var cost = pr ? money(pr.price) + ' <s class="muted small">' + money(it.cost) + '</s>' : money(it.cost);
        var deal = pr ? '<span class="pill deal">-' + U.pct((1-pr.price/it.cost)*100) + '</span><div class="small muted">' + (lang()==='en'?'ends':'vence') + ' ' + U.date(pr.ends) + '</div>' : '<span class="muted small">—</span>';
        var src = (it.source||'') + (it.updated ? ' · ' + (lang()==='en'?'upd.':'act.') + ' ' + U.date(it.updated) : '');
        var link = it.url ? '<a class="btn sm soft" href="' + esc(it.url) + '" target="_blank" rel="noopener">🔗 ' + esc(t('viewPrice')) + '</a> ' : '';
        var action = opts.pick
          ? '<button class="btn sm primary" data-action="add-catalog" data-item="' + esc(it.id) + '" data-stage="' + esc(opts.stage || it.cat) + '">＋ ' + esc(t('add')) + '</button>'
          : '<button class="btn sm" data-action="edit-catalog" data-id="' + esc(it.id) + '">✏️ ' + esc(t('edit')) + '</button>';
        var subInfo = (it.sub && it.cat !== 'equipment') ? ' <span class="small muted">· ' + esc(P.subLabel ? P.subLabel(it.sub) : it.sub) + '</span>' : '';
        var thumb = it.cat === 'equipment' ? brandBadge(it.brand, 26) : '<span class="group-ico sm">' + esc(P.subIcon ? P.subIcon(it.sub || 'misc') : '📦') + '</span>';
        return '<tr>'
          + '<td><div class="item-cell"><div class="thumb sm brand-thumb">' + thumb + '</div><div class="meta"><div><b>' + esc(it.name) + '</b> ' + (it.demo ? '<span class="pill demo">' + esc(t('ref')) + '</span>' : '') + '</div><div class="small muted">' + esc([it.brand,it.model,it.sku].filter(Boolean).join(' · ')) + '</div><div class="small">' + (it.includes ? esc(t('includesLabel')) + ': ' + esc(it.includes) : '<span class="muted">' + esc(t('noIncludes')) + '</span>') + '</div></div></div></td>'
          + '<td><div>' + esc(L(it.cat)) + subInfo + '</div><div class="small muted supplier-inline">' + supplierBadge(it.supplier, 18) + ' ' + esc(S.supplierName(it.supplier)) + '</div></td>'
          + '<td class="num">' + cost + '<div class="small muted">/ ' + esc(it.unit||'ea') + '</div></td>'
          + '<td class="num">' + deal + '</td>'
          + '<td><div class="small muted">' + esc(src) + '</div></td>'
          + '<td class="num" style="white-space:nowrap">' + link + action + '</td>'
          + '</tr>';
      }).join('');
    });
    return '<div class="table-wrap"><table><thead><tr><th>' + esc(t('colItem')) + '</th><th>' + esc(t('colStage')) + ' / ' + esc(t('supplier')) + '</th><th class="num">' + esc(t('colCost')) + '</th><th class="num">' + (lang()==='en'?'Deal':'Oferta') + '</th><th>' + esc(t('colSource')) + '</th><th></th></tr></thead><tbody>' + body + '</tbody></table></div>';
  }

  function renderCatalog() {
    var html = pageHead('🧰 ' + t('catalogTitle'), t('catalogSub'),
      '<button class="btn" data-action="export-catalog-csv">↓ ' + esc(t('exportCsv')) + '</button><label class="btn" style="cursor:pointer">↑ ' + esc(t('importCsv')) + '<input type="file" id="import-csv" accept=".csv,text/csv" style="display:none"></label>')
      + '<div class="card"><div class="notice info">' + t('catalogNotice') + '</div>'
      + '<div class="form-row" style="margin-top:10px">'
      + field('col-12', '🔎 ' + t('search'), '<input type="text" id="cat-q" placeholder="' + esc(t('searchPh')) + '">')
      + field('col-4', t('stage'), '<select id="cat-stage"><option value="">' + esc(t('allF')) + '</option>' + P.STAGES.map(function(s){return '<option value="'+esc(s.id)+'">'+esc(L(s.id))+'</option>';}).join('') + '</select>')
      + field('col-4', t('supplier'), '<select id="cat-sup"><option value="">' + esc(t('allM')) + '</option>' + S.state.suppliers.map(function(s){return '<option value="'+esc(s.id)+'">'+esc(s.short||s.name)+'</option>';}).join('') + '</select>')
      + field('col-4', t('onlyDeals'), '<select id="cat-promo"><option value="">' + esc(t('none')) + '</option><option value="1">' + esc(t('yes')) + '</option></select>')
      + '</div></div>'
      + '<div class="card" id="catalog-table"></div>';
    return shell(html, 'catalog');
  }

  function renderDeals() {
    var deals = S.activeDeals ? S.activeDeals() : [];
    var best = deals.length ? deals.slice().sort(function(a,b){return (b.savingPct||0)-(a.savingPct||0);})[0] : null;
    var html = pageHead('🏷️ ' + esc(t('dealsTitle')), t('dealsSub'), '<a class="btn" href="#/catalog">🧰 ' + (lang()==='en'?'Go to catalog':'Ir al catálogo') + '</a>')
      + '<div class="grid grid-3" style="margin-bottom:14px">'
      + '<div class="stat stat-deal"><div class="k">' + (lang()==='en'?'Active deals':'Ofertas activas') + '</div><div class="v">' + deals.length + '</div></div>'
      + '<div class="stat stat-deal"><div class="k">' + (lang()==='en'?'Potential savings (1 ea)':'Ahorro potencial (1 ud c/u)') + '</div><div class="v">' + money(deals.reduce(function(a,d){return a+(d.saving||0);},0)) + '</div></div>'
      + '<div class="stat stat-deal stat-best"><div class="k">' + (lang()==='en'?'Best discount':'Mejor descuento') + '</div><div class="v">' + (best ? ('-' + Math.round((best.savingPct||0)*100) + '%') : '—') + '</div>' + (best ? '<div class="small muted">' + esc(best.item.name) + '</div>' : '') + '</div>'
      + '</div>'
      + '<div class="card">' + (deals.length ? dealsList(deals, false) : '<div class="empty">🏷️ ' + (lang()==='en'?'No active deals at the moment. Check catalog prices or promotions later.':'No hay ofertas activas por ahora. Revisa precios o promociones en el catálogo más tarde.') + '</div>') + '</div>'
      + '<div class="notice info" style="margin-top:12px">💡 ' + (lang()==='en'?'Discounts shown are reference/promotional prices from the catalog. Always confirm current price, availability, and conditions with the supplier before quoting.':'Los descuentos mostrados son precios de referencia/promoción del catálogo. Confirma siempre precio vigente, disponibilidad y condiciones con el proveedor antes de cotizar.') + '</div>';
    return shell(html, 'deals');
  }

  function renderSuppliers() {
    var rows = S.state.suppliers.map(function (s) {
      return '<tr><td><div class="item-cell"><div class="thumb sm brand-thumb">' + supplierBadge(s.id, 32) + '</div><div class="meta"><b>' + esc(s.name) + '</b><div class="small muted">' + esc(s.note || '') + '</div></div></div></td>'
        + '<td>' + (s.email ? '<span class="pill ok">' + (lang()==='en'?'configured':'configurado') + '</span><div class="small mono">' + esc(s.email) + '</div>' : '<span class="pill warn">' + (lang()==='en'?'pending':'pendiente') + '</span>') + '</td>'
        + '<td>' + esc(s.phone || '—') + '</td>'
        + '<td>' + (s.quoteUrl ? '<a href="' + esc(s.quoteUrl) + '" target="_blank" rel="noopener">🔗 ' + (lang()==='en'?'Quote':'Cotizar') + '</a>' : '—') + (s.contactUrl ? ' · <a href="' + esc(s.contactUrl) + '" target="_blank" rel="noopener">' + (lang()==='en'?'Contact':'Contacto') + '</a>' : '') + '</td>'
        + '<td class="num"><button class="btn sm" data-action="edit-supplier" data-id="' + esc(s.id) + '">✏️ ' + esc(t('edit')) + '</button></td></tr>';
    }).join('');
    var html = pageHead('🏪 ' + esc(t('suppliersTitle')), t('suppliersSub'),
      '<button class="btn primary" data-action="add-supplier">＋ ' + (lang()==='en'?'Add supplier':'Agregar proveedor') + '</button>')
      + '<div class="notice info">📧 ' + esc(t('suppliersNotice')) + '</div>'
      + '<div class="card" style="margin-top:12px"><div class="table-wrap"><table><thead><tr><th>' + esc(t('colSupplier')) + '</th><th>' + (lang()==='en'?'RFQ email':'Email RFQ') + '</th><th>' + (lang()==='en'?'Phone':'Teléfono') + '</th><th>' + (lang()==='en'?'Links':'Enlaces') + '</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div></div>';
    return shell(html, 'suppliers');
  }

  function renderCompany() {
    var co = S.state.company, st = S.state.settings;
    var logoPrev = co.logo
      ? '<img src="' + esc(co.logo) + '" alt="' + (lang()==='en'?'Company logo preview':'Vista previa del logo de la empresa') + '" class="company-logo-preview">'
      : '<div class="thumb company-logo-placeholder">' + (I ? I.logoSVG(44) : 'PC+') + '</div>';
    var compNotes = (P.NJ_NOTES && P.NJ_NOTES.checklist) ? P.NJ_NOTES.checklist.map(function(n){ return '<li>' + esc(n) + '</li>'; }).join('') : '';
    var html = pageHead('🏢 ' + esc(t('companyTitle')), t('companySub'))
      + '<div class="notice info company-page-intro">'
      + '<b>' + (lang()==='en'?'What this section is for:':'Para qué sirve esta sección:') + '</b> '
      + (lang()==='en'
        ? 'Enter your business information, licenses, and default quote settings. This data is saved locally in this browser and appears on your proposals/PDFs.'
        : 'Ingresa la información de tu empresa, licencias y valores por defecto para cotizar. Estos datos se guardan localmente en este navegador y aparecen en tus propuestas/PDF.')
      + '<div class="small muted" style="margin-top:6px">' + (lang()==='en'?'Tip: changes are saved automatically while you type, and you can also use the “Save company data” button for confirmation.':'Consejo: los cambios se guardan automáticamente mientras escribes y también puedes usar el botón “Guardar datos de la empresa” para confirmar.') + '</div></div>'

      + '<div class="card company-card"><div class="card-head-row"><h3>🏢 ' + (lang()==='en'?'Company details':'Datos de la empresa') + '</h3>'
      + '<button class="btn primary sm" data-action="save-company">💾 ' + (lang()==='en'?'Save company data':'Guardar datos de la empresa') + '</button></div>'
      + '<div class="notice soft small" style="margin:8px 0 12px">' + (lang()==='en'?'Fill in the fields that identify your business. Use the name, address, and contact details exactly as you want clients to see them on quotes and proposals.':'Completa los campos que identifican tu negocio. Usa el nombre, dirección y datos de contacto tal como quieres que los vea el cliente en cotizaciones y propuestas.') + '</div>'
      + '<div class="form-row">'
      + field('col-6', lang()==='en'?'Trade name':'Nombre comercial','<input type="text" data-bind="company.name" value="' + esc(co.name) + '" placeholder="' + (lang()==='en'?'e.g. Rivera HVAC Services':'Ej.: Rivera HVAC Services') + '">', lang()==='en'?'Public/business name shown on proposals.':'Nombre público o comercial que aparecerá en las propuestas.')
      + field('col-6', lang()==='en'?'Legal name':'Razón social','<input type="text" data-bind="company.legalName" value="' + esc(co.legalName) + '" placeholder="' + (lang()==='en'?'e.g. Rivera HVAC LLC':'Ej.: Rivera HVAC LLC') + '">', lang()==='en'?'Registered legal entity name (if different).':'Nombre legal registrado de la empresa (si es diferente).')
      + field('col-12', lang()==='en'?'Address':'Dirección','<input type="text" data-bind="company.address" value="' + esc(co.address) + '" placeholder="' + (lang()==='en'?'Street, suite, etc.':'Calle, suite, etc.') + '">', lang()==='en'?'Business mailing or office address.':'Dirección comercial o de oficina.')
      + field('col-4', lang()==='en'?'City':'Ciudad','<input type="text" data-bind="company.city" value="' + esc(co.city) + '">')
      + field('col-4', lang()==='en'?'State':'Estado','<input type="text" data-bind="company.state" value="' + esc(co.state) + '" placeholder="NJ">', lang()==='en'?'Use NJ for New Jersey jobs.':'Usa NJ para trabajos en Nueva Jersey.')
      + field('col-4','ZIP','<input type="text" data-bind="company.zip" value="' + esc(co.zip) + '">')
      + field('col-4', lang()==='en'?'Phone':'Teléfono','<input type="text" data-bind="company.phone" value="' + esc(co.phone) + '" placeholder="' + (lang()==='en'?'(555) 555-5555':'(555) 555-5555') + '">', lang()==='en'?'Main contact number for clients.':'Número principal de contacto para clientes.')
      + field('col-4','Email','<input type="email" data-bind="company.email" value="' + esc(co.email) + '" placeholder="name@company.com">', lang()==='en'?'Email shown on proposals and replies.':'Correo que aparecerá en propuestas y respuestas.')
      + field('col-4','Website','<input type="text" data-bind="company.website" value="' + esc(co.website) + '" placeholder="https://">', lang()==='en'?'Optional company website.':'Sitio web de la empresa (opcional).')
      + '<div class="field col-12"><label>' + (lang()==='en'?'Company logo (local file from your PC)':'Logo de la empresa (archivo local desde tu PC)') + '</label>'
      + '<div class="company-logo-row">' + logoPrev
      + '<div class="company-logo-controls"><input type="file" id="logo-file" accept="image/*">'
      + '<span class="field-help">' + (lang()==='en'?'Upload a PNG/JPG from your computer. The image is saved locally in this browser (recommended under ~900 KB). Use a clear logo for proposals and PDF.':'Sube un archivo PNG/JPG desde tu computadora. La imagen se guarda localmente en este navegador (recomendado menor a ~900 KB). Usa un logo claro para propuestas y PDF.') + '</span>'
      + '<div class="actions" style="margin-top:6px"><button class="btn sm" data-action="clear-company-logo">🗑️ ' + (lang()==='en'?'Remove logo':'Quitar logo') + '</button></div>'
      + '</div></div></div>'
      + '</div></div>'

      + '<div class="grid grid-2" style="margin-top:14px;align-items:start">'
      + '<div class="card"><h3>📜 ' + (lang()==='en'?'Licenses & compliance (NJ)':'Licencias y cumplimiento (NJ)') + '</h3>'
      + '<div class="notice soft small" style="margin-bottom:10px">' + (lang()==='en'
        ? 'Enter your New Jersey license, tax, and insurance identifiers as applicable. These help present a professional, compliant proposal (confirm legal requirements for your specific work).'
        : 'Ingresa tus licencias, identificación fiscal y seguro aplicables en Nueva Jersey. Esto ayuda a presentar una propuesta profesional y conforme (confirma los requisitos legales según tu trabajo).') + '</div>'
      + '<div class="form-row">'
      + field('col-6','HIC (13VH…)','<input type="text" data-bind="company.hic" value="' + esc(co.hic) + '" placeholder="13VH00000000">', lang()==='en'?'NJ Home Improvement Contractor registration number (if applicable).':'Número de registro de contratista de mejoras del hogar en NJ (si aplica).')
      + field('col-6','Master HVACR','<input type="text" data-bind="company.hvacr" value="' + esc(co.hvacr) + '" placeholder="19HC...">', lang()==='en'?'NJ Master HVACR license number (if applicable).':'Número de licencia Master HVACR de NJ (si aplica).')
      + field('col-6','Tax ID / EIN','<input type="text" data-bind="company.taxId" value="' + esc(co.taxId) + '" placeholder="XX-XXXXXXX">', lang()==='en'?'Business tax identification (EIN) or applicable tax ID.':'Identificación fiscal del negocio (EIN) u otro ID fiscal aplicable.')
      + field('col-6', lang()==='en'?'Liability insurance (policy)':'Seguro de responsabilidad (póliza)','<input type="text" data-bind="company.insurance" value="' + esc(co.insurance) + '" placeholder="' + (lang()==='en'?'Carrier / policy #':'Aseguradora / póliza #') + '">', lang()==='en'?'General liability insurance carrier and/or policy number.':'Aseguradora y/o número de póliza de responsabilidad civil.')
      + '</div>'
      + '<div class="small muted" style="margin-top:8px"><b>' + (lang()==='en'?'NJ checklist reminders:':'Recordatorios de cumplimiento en NJ:') + '</b></div>'
      + '<ul class="list" style="margin-top:6px">' + compNotes + '</ul></div>'

      + '<div class="card"><h3>⚙️ ' + (lang()==='en'?'Default quote settings':'Valores por defecto de cotización') + '</h3>'
      + '<div class="notice soft small" style="margin-bottom:10px">' + (lang()==='en'?'These values are used as defaults for new projects. You can still adjust them per project.':'Estos valores se usan como base para nuevos proyectos. Puedes ajustarlos en cada proyecto.') + '</div>'
      + '<div class="form-row">'
      + field('col-4', lang()==='en'?'NJ Tax (%)':'Impuesto NJ (%)','<input type="number" step="0.001" min="0" data-bind="settings.taxRate" value="' + esc(U.num(st.taxRate) * 100) + '">', lang()==='en'?'Enter as percentage (e.g. 6.625).':'Ingresa como porcentaje (ej.: 6.625).')
      + field('col-4', lang()==='en'?'Tax mode':'Modo de impuesto','<select data-bind="settings.taxMode">' + [['capital',lang()==='en'?'Capital improvement':'Mejora capital'],['repair',lang()==='en'?'Repair':'Reparación'],['materials',lang()==='en'?'Materials':'Materiales'],['custom',lang()==='en'?'Custom':'Personalizado']].map(function(o){return option(o[0],o[1],st.taxMode);}).join('') + '</select>', lang()==='en'?'Select tax treatment for the quote.':'Selecciona el tratamiento fiscal de la cotización.')
      + field('col-4', lang()==='en'?'Deposit (%)':'Depósito (%)','<input type="number" step="1" data-bind="settings.depositPct" value="' + esc(st.depositPct) + '">', lang()==='en'?'Default initial payment percentage.':'Porcentaje inicial por defecto.')
      + field('col-4', lang()==='en'?'Contingency (%)':'Contingencia (%)','<input type="number" step="0.1" data-bind="settings.contingencyPct" value="' + esc(st.contingencyPct) + '">')
      + field('col-4', lang()==='en'?'Global factor':'Factor global','<input type="number" step="0.01" data-bind="settings.globalFactor" value="' + esc(st.globalFactor) + '">', lang()==='en'?'Multiplier applied to totals when needed.':'Multiplicador aplicado a totales cuando sea necesario.')
      + field('col-4', lang()==='en'?'Validity (days)':'Vigencia (días)','<input type="number" step="1" data-bind="settings.validityDays" value="' + esc(st.validityDays) + '">')
      + '</div><h4 style="margin:12px 0 6px;font-size:13px">' + (lang()==='en'?'Default markup (%) by stage':'Markup por defecto (%) por etapa') + '</h4><div class="form-row">'
      + P.STAGES.map(function(sg){ return field('col-4', L(sg.id), '<input type="number" step="0.1" data-bind="settings.markup.' + sg.id + '" value="' + esc((st.defaultMarkups||{})[sg.id]||0) + '">'); }).join('')
      + '</div>'
      + '<div class="actions" style="margin-top:12px"><button class="btn primary" data-action="save-company">💾 ' + (lang()==='en'?'Save company data':'Guardar datos de la empresa') + '</button></div></div></div>'

      + '<div class="card" style="margin-top:14px"><h3>💾 ' + (lang()==='en'?'Backup, live data & sync':'Respaldo, datos en vivo y sincronización') + '</h3><p class="muted">' + (lang()==='en'?'Data lives locally in this browser (localStorage). When online, logos and external data can load live and you can import updates from a URL.':'Los datos viven localmente en este navegador (localStorage). En línea, los logos y datos externos pueden cargarse en vivo y puedes importar actualizaciones desde una URL.') + '</p>'
      + '<div class="actions" style="margin:10px 0"><button class="btn" data-action="export-json">↓ ' + (lang()==='en'?'Save JSON backup':'Guardar respaldo JSON') + '</button>'
      + '<label class="btn" style="cursor:pointer">↑ ' + (lang()==='en'?'Load JSON backup':'Cargar respaldo JSON') + '<input type="file" id="import-json" accept=".json,application/json" style="display:none"></label></div>'
      + '<div class="actions" style="margin:10px 0"><button class="btn" data-action="export-catalog-csv">↓ ' + esc(t('exportCsv')) + '</button>'
      + '<label class="btn" style="cursor:pointer">↑ ' + esc(t('importCsv')) + '<input type="file" id="import-csv" accept=".csv,text/csv" style="display:none"></label></div>'
      + '<div class="field" style="margin-top:10px"><label>' + (lang()==='en'?'Load JSON from URL (online)':'Cargar JSON desde URL (en línea)') + '</label><input type="text" id="import-json-url" placeholder="https://.../backup-or-state.json"><span class="field-help">' + (lang()==='en'?'Fetches and imports JSON data from the web (full backup/state). Requires internet access and a CORS-enabled URL.':'Obtiene e importa datos JSON desde la web (respaldo/estado completo). Requiere internet y una URL con CORS permitido.') + '</span><div class="actions" style="margin-top:6px"><button class="btn sm primary" data-action="import-json-url">↑ ' + (lang()==='en'?'Load from URL':'Cargar desde URL') + '</button></div></div>'
      + '<div class="notice warn" style="margin-top:10px">⚠️ <b>' + (lang()==='en'?'Danger zone:':'Zona de riesgo:') + '</b> ' + (lang()==='en'?'You can erase all local data if needed.':'Puedes borrar todos los datos locales si es necesario.') + '</div>'
      + '<div class="actions" style="margin-top:10px"><button class="btn danger" data-action="reset-all">🗑️ ' + (lang()==='en'?'Erase all data':'Borrar todos los datos') + '</button></div></div>';
    return shell(html, 'company');
  }

  /* ---------------------------------------------------------------- */
  /* Modals: line, catalog, supplier, RFQ                             */
  /* ---------------------------------------------------------------- */
  function openLineModal(pid, stageId, lineId) {
    var editing = !!lineId;
    var f = lineId ? S.getLine(pid, lineId) : null;
    var l = f ? f.line : { name:'', brand:'', model:'', sku:'', supplier:'manual', qty:1, unit:'ea', unitCost:0, unitPrice:'', markupPct:'', includes:'', excludes:'', url:'', priceDate: U.today(), note:'' };
    var stage = stageById(stageId);
    var fromCatalog = !!l.catalogId;
    var supplierField = fromCatalog
      ? ('<input type="text" value="' + esc(S.supplierName(l.supplier)) + '" disabled><input type="hidden" id="ln-supplier" value="' + esc(l.supplier) + '"><span class="field-help">' + (lang()==='en'?'Supplier is locked because this item comes from the catalog. To use another supplier, add the equivalent item from that supplier.':'El proveedor está bloqueado porque este ítem proviene del catálogo. Para usar otro proveedor, agrega el ítem equivalente de ese proveedor.') + '</span>')
      : '<select id="ln-supplier">' + supplierOptions(l.supplier) + '</select>';
    var body = '<div class="form-row">'
      + field('col-8', lang()==='en'?'Name / description':'Nombre / descripción','<input id="ln-name" type="text" value="' + esc(l.name) + '">')
      + field('col-4', t('colSupplier'), supplierField)
      + field('col-4', lang()==='en'?'Brand':'Marca','<input id="ln-brand" type="text" value="' + esc(l.brand) + '">')
      + field('col-4', lang()==='en'?'Model':'Modelo','<input id="ln-model" type="text" value="' + esc(l.model) + '">')
      + field('col-4', lang()==='en'?'SKU / code':'SKU / código','<input id="ln-sku" type="text" value="' + esc(l.sku) + '">')
      + field('col-3', lang()==='en'?'Quantity':'Cantidad','<input id="ln-qty" type="number" step="0.01" value="' + esc(l.qty) + '">')
      + field('col-3', lang()==='en'?'Unit':'Unidad','<select id="ln-unit">' + unitOptions(l.unit) + '</select>')
      + field('col-3', lang()==='en'?'Unit cost':'Costo unit.','<input id="ln-cost" type="number" step="0.01" value="' + esc(l.unitCost) + '">')
      + field('col-3', lang()==='en'?'Unit sell price':'Precio venta unit.','<input id="ln-price" type="number" step="0.01" placeholder="' + (lang()==='en'?'(auto by markup)':'(auto por markup)') + '" value="' + (l.unitPrice==null?'':esc(l.unitPrice)) + '">')
      + field('col-4', lang()==='en'?'Markup % (if no price)':'Markup % (si sin precio)','<input id="ln-markup" type="number" step="0.1" placeholder="' + (lang()==='en'?'(stage default)':'(usa el de la etapa)') + '" value="' + (l.markupPct==null?'':esc(l.markupPct)) + '">')
      + field('col-4', lang()==='en'?'Price date':'Fecha del precio','<input id="ln-date" type="date" value="' + esc(l.priceDate) + '">')
      + field('col-4', lang()==='en'?'URL (quote/spec)':'URL (cotización/ficha)','<input id="ln-url" type="text" value="' + esc(l.url) + '">')
      + field('col-12', lang()==='en'?'What this price includes (delivery, tax, kit, warranty, etc.)':'Qué incluye este precio (entrega, impuesto, kit, garantía, etc.)','<textarea id="ln-includes" class="textarea-lg">' + esc(l.includes) + '</textarea>', lang()==='en'?'<span class="field-unit">Tip:</span> clearly describe what this unit price covers.':'<span class="field-unit">Tip:</span> describe claramente qué cubre este precio unitario.')
      + field('col-12', lang()==='en'?'What it does NOT include / exclusions (item)':'Qué NO incluye / exclusiones del ítem','<textarea id="ln-excludes" class="textarea-lg">' + esc(l.excludes) + '</textarea>')
      + '</div><div class="notice info">💡 ' + (lang()==='en'?'For manual prices, clearly describe what’s included. You can add deal notes below.':'Si el precio es manual, describa claramente qué incluye. Si viene de una oferta, puede indicar precio regular/oferta en la nota.') + ' <input id="ln-note" type="text" placeholder="' + (lang()==='en'?'Note (e.g. offer valid until…, quote #…)':'Nota (ej.: oferta válida hasta…, cotización #…)') + '" value="' + esc(l.note||'') + '"></div>';
    var foot = '<button class="btn" data-action="close-modal">' + esc(t('cancel')) + '</button>'
      + '<button class="btn primary" data-action="save-line" data-pid="' + pid + '" data-stage="' + stageId + '" data-line="' + (lineId||'') + '">' + (editing ? '💾 ' + esc(t('save')) : '➕ ' + esc(t('add'))) + '</button>';
    openModal((editing ? '✏️ ' + (lang()==='en'?'Edit item':'Editar ítem') : '➕ ' + (lang()==='en'?'New item':'Nuevo ítem')) + ' — ' + L(stageId), body, foot);
  }

  function readLineForm() {
    return {
      name: $('#ln-name').value.trim() || (lang()==='en'?'Unnamed item':'Ítem sin nombre'),
      supplier: $('#ln-supplier').value,
      brand: $('#ln-brand').value.trim(),
      model: $('#ln-model').value.trim(),
      sku: $('#ln-sku').value.trim(),
      qty: U.num($('#ln-qty').value) || 1,
      unit: $('#ln-unit').value || 'ea',
      unitCost: U.num($('#ln-cost').value),
      unitPrice: $('#ln-price').value === '' ? null : U.num($('#ln-price').value),
      markupPct: $('#ln-markup').value === '' ? null : U.num($('#ln-markup').value),
      includes: $('#ln-includes').value.trim(),
      excludes: $('#ln-excludes').value.trim(),
      url: $('#ln-url').value.trim(),
      priceDate: $('#ln-date').value || U.today(),
      note: $('#ln-note').value.trim()
    };
  }

  function openCatalogPicker(pid, stageId, opts) {
    opts = opts || {};
    var p = S.getProject(pid);
    var sel = (p && p.selectedSuppliers) ? p.selectedSuppliers.slice() : [];
    window._pcpPick = { pid: pid, stage: stageId, selectedSuppliers: sel, opts: opts };
    var supOpts = '<option value="">' + (sel.length ? (lang()==='en'?'Selected suppliers':'Proveedores seleccionados') : esc(t('allM'))) + '</option>';
    if (sel.length) {
      supOpts += sel.map(function(id){ var s=S.supplier(id); return option(id, s?s.short:id, ''); }).join('');
      supOpts += '<option value="__all__">' + (lang()==='en'?'All suppliers':'Todos los proveedores') + '</option>';
    } else {
      supOpts += S.state.suppliers.map(function(s){ return option(s.id,s.short,''); }).join('');
    }
    var warn = opts.replaceWarn ? '<div class="notice warn" style="margin-top:8px">' + (lang()==='en'?'Showing options from your selected suppliers to replace/find an equivalent item. Use "All suppliers" if needed.':'Mostrando opciones de tus proveedores seleccionados para reemplazar/encontrar un ítem equivalente. Usa "Todos los proveedores" si es necesario.') + '</div>' : '';
    var info = sel.length ? '<div class="notice info" style="margin-top:8px">' + (sel.length >= 2 ? (lang()==='en'?'Comparing prices from your selected suppliers. If the same product is available from different suppliers, each option is shown so you can compare.':'Comparando precios de tus proveedores seleccionados. Si el mismo producto está disponible en distintos proveedores, se muestra cada opción para comparar.') : (lang()==='en'?'Showing items from your selected supplier. You can select more suppliers in step 2 to compare prices.':'Mostrando ítems de tu proveedor seleccionado. Puedes elegir más proveedores en el paso 2 para comparar precios.')) + '</div>' : '';
    var qval = esc(opts.query || '');
    var body = '<div class="form-row">'
      + field('col-12','🔎 ' + t('search'),'<input type="text" id="pick-q" placeholder="' + esc(t('searchPh')) + '" value="' + qval + '">')
      + field('col-6', t('supplier'),'<select id="pick-sup">' + supOpts + '</select>')
      + field('col-6', t('onlyDeals'),'<select id="pick-promo"><option value="">' + esc(t('none')) + '</option><option value="1">' + esc(t('yes')) + '</option></select>')
      + '</div>' + warn + info + '<div id="pick-table" style="margin-top:10px"></div>';
    var foot = '<button class="btn" data-action="close-modal">' + esc(t('close')) + '</button> <a class="btn soft" href="#/project/' + esc(pid) + '/2" onclick="PCP.ui.closeModal()">' + (lang()==='en'?'Change suppliers':'Cambiar proveedores') + '</a>';
    openModal('🧰 ' + (lang()==='en'?'Add from catalog':'Agregar desde catálogo') + ' — ' + L(stageId), body, foot);
    refreshPicker();
  }
  function refreshPicker() {
    var ctx = window._pcpPick; if (!ctx) return;
    var q = ($('#pick-q')||{}).value || '';
    var sup = ($('#pick-sup')||{}).value || '';
    var promo = ($('#pick-promo')||{}).value || '';
    var filters = { cat: ctx.stage, promo: promo ? true : false };
    if (sup && sup !== '__all__') filters.supplier = sup;
    else if (sup === '__all__') { /* no supplier constraint */ }
    else if (ctx.selectedSuppliers && ctx.selectedSuppliers.length) filters.suppliers = ctx.selectedSuppliers;
    var items = S.searchCatalog(q, filters).slice(0, 80);
    $('#pick-table').innerHTML = catalogTableRows(items, { pick: true, stage: ctx.stage, pid: ctx.pid, compare: (ctx.selectedSuppliers && ctx.selectedSuppliers.length >= 2) });
  }

  function openSupplierModal(id) {
    var s = id ? S.supplier(id) : { id:'', name:'', short:'', email:'', phone:'', quoteUrl:'', contactUrl:'', note:'' };
    s = s || { id:'', name:'', short:'', email:'', phone:'', quoteUrl:'', contactUrl:'', note:'' };
    var body = '<div class="notice soft small" style="margin-bottom:12px">' + (lang()==='en'
      ? 'Enter the supplier’s contact and quote information. This is used for RFQ drafts, supplier selection, and quick access links. Add only real emails/URLs you trust.'
      : 'Ingresa la información de contacto y cotización del proveedor. Se usa para borradores de RFQ, selección de proveedores y enlaces rápidos. Agrega solo correos/URLs reales y confiables.') + '</div>'
      + '<div class="form-row">'
      + field('col-7', lang()==='en'?'Supplier name':'Nombre del proveedor','<input id="sp-name" type="text" value="' + esc(s.name||'') + '" placeholder="' + (lang()==='en'?'e.g. Ferguson HVAC':'Ej.: Ferguson HVAC') + '">', lang()==='en'?'Full business name.':'Nombre completo del negocio.')
      + field('col-5', lang()==='en'?'Short name':'Nombre corto','<input id="sp-short" type="text" value="' + esc(s.short||'') + '" placeholder="' + (lang()==='en'?'e.g. Ferguson':'Ej.: Ferguson') + '">', lang()==='en'?'Short label shown in tables/buttons.':'Etiqueta corta para tablas y botones.')
      + field('col-6','Email RFQ','<input id="sp-email" type="email" value="' + esc(s.email||'') + '" placeholder="quotes@supplier.com">', lang()==='en'?'Email address to receive quote requests (RFQ).':'Correo para recibir solicitudes de cotización (RFQ).')
      + field('col-6', lang()==='en'?'Phone':'Teléfono','<input id="sp-phone" type="text" value="' + esc(s.phone||'') + '" placeholder="' + (lang()==='en'?'(555) 555-5555':'(555) 555-5555') + '">', lang()==='en'?'Main branch/desk phone number.':'Teléfono principal de sucursal o mostrador.')
      + field('col-6', lang()==='en'?'Quote URL':'URL de cotización','<input id="sp-quote" type="text" value="' + esc(s.quoteUrl||'') + '" placeholder="https://...">', lang()==='en'?'Online quote/cart/login page (optional).':'Página de cotización/carrito/acceso en línea (opcional).')
      + field('col-6', lang()==='en'?'Contact/branch URL':'URL de contacto/sucursal','<input id="sp-contact" type="text" value="' + esc(s.contactUrl||'') + '" placeholder="https://...">', lang()==='en'?'Branch/contact page for this supplier (optional).':'Página de contacto o sucursal del proveedor (opcional).')
      + field('col-12', lang()==='en'?'Notes':'Notas','<textarea id="sp-note" class="textarea-sm" placeholder="' + (lang()==='en'?'Account #, branch details, pickup notes, etc.':'N.° de cuenta, sucursal, notas de retiro, etc.') + '">' + esc(s.note||'') + '</textarea>', lang()==='en'?'Internal notes for your team (not shown to client PDF).':'Notas internas para tu equipo (no se muestran en el PDF del cliente).')
      + '</div>';
    var foot = '<button class="btn" data-action="close-modal">' + esc(t('cancel')) + '</button><button class="btn primary" data-action="save-supplier" data-id="' + esc(id||'') + '">💾 ' + esc(t('save')) + '</button>';
    openModal(id ? 'Editar proveedor' : 'Nuevo proveedor', body, foot, { small: true });
  }

  function openCatalogEditModal(id) {
    var it = S.state.catalog.filter(function(x){return x.id===id;})[0];
    if (!it) return;
    var body = '<div class="form-row">'
      + field('col-8', lang()==='en'?'Name':'Nombre','<input id="ci-name" type="text" value="' + esc(it.name) + '">')
      + field('col-4', t('stage'),'<select id="ci-cat">' + P.STAGES.map(function(s){return option(s.id,L(s.id),it.cat);}).join('') + '</select>')
      + field('col-4', lang()==='en'?'Brand':'Marca','<input id="ci-brand" type="text" value="' + esc(it.brand) + '">')
      + field('col-4', lang()==='en'?'Model':'Modelo','<input id="ci-model" type="text" value="' + esc(it.model) + '">')
      + field('col-4','SKU','<input id="ci-sku" type="text" value="' + esc(it.sku) + '">')
      + field('col-3', lang()==='en'?'Unit':'Unidad','<select id="ci-unit">' + unitOptions(it.unit) + '</select>')
      + field('col-3', t('colCost'),'<input id="ci-cost" type="number" step="0.01" value="' + esc(it.cost) + '">')
      + field('col-3', lang()==='en'?'Deal price':'Precio oferta','<input id="ci-promo" type="number" step="0.01" value="' + (it.promo?esc(it.promo.price):'') + '">')
      + field('col-3', lang()==='en'?'Deal ends':'Oferta vence','<input id="ci-pend" type="date" value="' + (it.promo?esc(it.promo.ends):'') + '">')
      + field('col-12', t('colSupplier'),'<select id="ci-supplier">' + supplierOptions(it.supplier) + '</select>')
      + field('col-12', lang()==='en'?'What’s included':'Qué incluye','<textarea id="ci-includes">' + esc(it.includes) + '</textarea>')
      + '</div><label class="check-tile"><input type="checkbox" id="ci-demo"' + (it.demo?' checked':'') + '><div><div class="t">' + (lang()==='en'?'Mark as reference price (unconfirmed)':'Marcar como precio de referencia (no confirmado)') + '</div><div class="d">' + (lang()==='en'?'Uncheck when it’s a real price confirmed with the supplier and date updated.':'Desmarque cuando sea un precio real confirmado con el proveedor y la fecha actualizada.') + '</div></div></label>';
    var foot = '<button class="btn" data-action="close-modal">' + esc(t('cancel')) + '</button><button class="btn primary" data-action="save-catalog" data-id="' + esc(id) + '">💾 ' + esc(t('save')) + '</button>';
    openModal('✏️ ' + (lang()==='en'?'Edit catalog item':'Editar ítem de catálogo'), body, foot);
  }

  function collectProjectLines(p) {
    var out = [];
    P.STAGES.forEach(function(st){ (p.lines[st.id]||[]).forEach(function(l){ out.push({stage: st.id, line: l}); }); });
    return out;
  }

  function openUpdatePricesModal(pid) {
    var p = S.getProject(pid); if (!p) return;
    var items = collectProjectLines(p);
    if (!items.length) { toast(t('noLinesToUpdate'), 'warn'); return; }
    // ensure calc for display values if present
    try { S.calc(p); } catch(e){}
    var rows = items.map(function(it){
      var l = it.line, stage = it.stage;
      var stale = U.daysBetween(l.priceDate) > 45;
      var view = l.url ? '<a class="btn sm soft" href="' + esc(l.url) + '" target="_blank" rel="noopener">🔗 ' + esc(t('viewPrice')) + '</a> ' : '';
      return '<tr>'
        + '<td><div><b>' + esc(l.name) + '</b></div><div class="small muted supplier-inline">' + esc(L(stage)) + ' · ' + supplierBadge(l.supplier, 16) + ' ' + esc(S.supplierName(l.supplier)) + (l.sku ? ' · SKU ' + esc(l.sku) : '') + '</div>'
        + '<div class="small">' + (l.includes ? esc(t('includesLabel')) + ': ' + esc(l.includes) : '<span class="pill warn">⚠ ' + esc(t('noIncludes')) + '</span>') + '</div></td>'
        + '<td class="num">' + (l.qty||0) + ' ' + esc(l.unit||'ea') + '</td>'
        + '<td class="num"><b>' + money(l.unitCost) + '</b><div class="small muted">' + U.date(l.priceDate) + '</div></td>'
        + '<td>' + (stale ? '<span class="pill warn">⏳ ' + esc(t('stale')) + '</span>' : '<span class="pill ok">✓ ' + esc(t('current')) + '</span>') + '</td>'
        + '<td class="num" style="white-space:nowrap">' + view
        + '<button class="btn sm" data-action="mark-price-today" data-pid="' + esc(pid) + '" data-id="' + esc(l.id) + '">📅 ' + esc(t('markToday')) + '</button> '
        + '<button class="btn sm" data-action="edit-line-price" data-pid="' + esc(pid) + '" data-id="' + esc(l.id) + '" data-stage="' + esc(stage) + '">✏️ ' + esc(t('openEdit')) + '</button></td>'
        + '</tr>';
    }).join('');
    var body = '<p class="muted">' + esc(t('updatePricesSub')) + '</p>'
      + '<div class="notice info" style="margin-bottom:10px">💡 ' + (lang()==='en' ? 'Use “View price” to confirm live value with the supplier, then “Edit” to save the real cost and date. “Set today” marks the price as reviewed today without changing the amount.' : 'Usa “Ver precio” para confirmar el valor en vivo con el proveedor, luego “Editar” para guardar el costo real y la fecha. “Fecha hoy” marca el precio como revisado hoy sin cambiar el monto.') + '</div>'
      + '<div class="table-wrap"><table><thead><tr><th>' + esc(t('colItem')) + '</th><th class="num">' + esc(t('colQty')) + '</th><th class="num">' + esc(t('colCost')) + '</th><th>' + esc(t('colStatus')) + '</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
    openModal('🔄 ' + t('updatePricesTitle'), body, '<button class="btn primary" data-action="close-modal">' + esc(t('close')) + '</button>');
  }

  function openRFQModal(pid) {
    var p = S.getProject(pid); if (!p) return;
    var mats = [].concat(p.lines.equipment||[], p.lines.materials||[], p.lines.indirects||[], p.lines.freight||[]);
    if (!mats.length) { toast(lang()==='en'?'No items to quote in this project.':'No hay ítems para cotizar en este proyecto.', 'warn'); return; }
    var groups = {};
    mats.forEach(function(l){ var sid=l.supplier||'manual'; if(!groups[sid]) groups[sid]=[]; groups[sid].push(l); });
    var blocks = Object.keys(groups).map(function(sid){
      var sup = S.supplier(sid) || { short: sid, email:'', quoteUrl:'' };
      var list = groups[sid].map(function(l){ return '- ' + l.qty + ' ' + l.unit + '  ' + l.name + (l.brand||l.model? ' ('+[l.brand,l.model].filter(Boolean).join(' ')+')':'') + (l.sku? ' [SKU '+l.sku+']':''); }).join('\n');
      var subject = encodeURIComponent((lang()==='en'?'Quote request':'Solicitud de cotización') + ' - ' + p.number + ' - ' + (S.state.company.name||'HVAC'));
      var bodyTxt = encodeURIComponent((lang()==='en'
        ? 'Hello ' + (sup.short||'') + ',\n\nI request a quote for project ' + p.number + ' (' + (p.client.city||'NJ') + '):\n\n' + list + '\n\nPlease provide: unit price, availability, validity, whether delivery/taxes are included, and lead time.\n\nThanks,\n'
        : 'Hola ' + (sup.short||'') + ',\n\nSolicito cotización para el proyecto ' + p.number + ' (' + (p.client.city||'NJ') + '):\n\n' + list + '\n\nPor favor indicar: precio unitario, disponibilidad, vigencia, si incluye entrega/impuestos y tiempos.\n\nGracias,\n') + (S.state.company.name||'') + '\n' + (S.state.company.phone||'') + ' ' + (S.state.company.email||''));
      var mail = sup.email ? '<a class="btn sm primary" href="mailto:' + esc(sup.email) + '?subject=' + subject + '&body=' + bodyTxt + '">✉️ ' + (lang()==='en'?'Open email':'Abrir correo') + '</a>' : '<span class="pill warn">' + (lang()==='en'?'no email set':'sin email configurado') + '</span> <a class="btn sm" href="#/suppliers">⚙️ ' + (lang()==='en'?'Configure':'Configurar') + '</a>';
      var copyId = 'rfq_' + sid;
      return '<div class="card" style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;flex-wrap:wrap"><div style="display:flex;align-items:center;gap:10px;min-width:0"><div>' + supplierBadge(sid, 34) + '</div><div style="min-width:0"><h3 style="margin:0">' + esc(sup.short||sup.name||sid) + '</h3><div class="small muted">' + groups[sid].length + ' ' + (lang()==='en'?'item(s)':'ítem(s)') + '</div></div></div><div class="actions">' + mail + (sup.quoteUrl?'<a class="btn sm" href="' + esc(sup.quoteUrl) + '" target="_blank">🔗 Portal</a>':'') + '</div></div>'
        + '<pre id="' + copyId + '" style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px;white-space:pre-wrap;font-size:12px;margin:10px 0 0;color:var(--text)">' + esc(list) + '</pre></div>';
    }).join('');
    openModal('📧 ' + (lang()==='en'?'Materials list & RFQ':'Lista de materiales y RFQ') + ' — ' + p.number, '<p class="muted">' + (lang()==='en'?'Review the list by supplier and send the request. Emails open as drafts in your mail client.':'Revise la lista por proveedor y envíe la solicitud. Los correos se abren como borrador en su cliente de correo.') + '</p>' + blocks,
      '<button class="btn" data-action="close-modal">' + esc(t('close')) + '</button><button class="btn primary" data-action="copy-rfq" data-id="' + pid + '">📋 ' + (lang()==='en'?'Copy full list':'Copiar lista completa') + '</button>');
  }

  /* ---------------------------------------------------------------- */
  /* Print                                                            */
  /* ---------------------------------------------------------------- */
  function printProject(pid) {
    var p = S.getProject(pid); if (!p) return;
    var c = S.calc(p), co = S.state.company;
    // Client proposal must NOT list materials. Build professional general explanation.
    var logo = co.logo ? '<img src="' + esc(co.logo) + '" alt="logo" style="max-height:60px;margin-bottom:6px">' : '';
    var comp = [co.address, [co.city, co.state, co.zip].filter(Boolean).join(', '), co.phone, co.email, co.website].filter(Boolean).map(esc).join(' · ');
    var lic = [co.hic?'HIC '+co.hic:'', co.hvacr?'HVACR '+co.hvacr:'', co.taxId?(lang()==='en'?'Tax ID ':'Tax ID ')+co.taxId:'', co.insurance?(lang()==='en'?'Insurance ':'Seguro ')+co.insurance:''].filter(Boolean).join(' · ');
    var scopes = (p.scope||[]).map(LScope).join(', ');
    var terms = p.terms || {};
    var delivery = terms.deliveryTime || (lang()==='en'?'To be coordinated upon approval.':'A coordinar tras aprobación.');
    var payment = terms.paymentMethod || (lang()==='en'?'As per agreed schedule.':'Según calendario acordado.');
    var lead = terms.equipmentLeadTime || (lang()==='en'?'Subject to availability.':'Sujeto a disponibilidad.');
    var warranty = terms.warranty || (lang()==='en'?'Labor as per proposal; manufacturer warranties apply.':'Mano de obra según propuesta; aplican garantías de fabricante.');

    // Equipment summary (brands/models) - no material itemization
    var eq = (p.lines.equipment||[]);
    var byBrand = {};
    eq.forEach(function(l){
      var b = (l.brand || '').trim() || (lang()==='en'?'Specified brand':'Marca especificada');
      if (!byBrand[b]) byBrand[b] = [];
      byBrand[b].push(l);
    });
    var brandNames = Object.keys(byBrand);
    var equipmentHtml = '';
    if (!brandNames.length) {
      equipmentHtml = '<div class="smallprint">' + esc(t('noEquipmentListed')) + '</div>';
    } else {
      equipmentHtml = brandNames.map(function(b){
        var items = byBrand[b];
        var list = items.map(function(l){
          return '<li><b>' + esc(l.name) + '</b>' + (l.model? ' <span class="smallprint">(' + esc(l.model) + (l.sku? ', SKU '+esc(l.sku):'') + ')</span>':'') + '</li>';
        }).join('');
        return '<div class="equip-brand-block" style="margin:8px 0 12px;break-inside:avoid"><div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;padding:6px 8px;border:1px solid #d7dde5;border-radius:8px;background:#f8fafc">' + brandBadge(b,40) + '<div><div style="font-size:14px;font-weight:700;line-height:1.2">' + esc(b) + '</div><div class="smallprint">' + (lang()==='en'?'Equipment brand':'Marca del equipo') + '</div></div></div><ul style="margin:0 0 0 20px;padding:0">' + list + '</ul></div>';
      }).join('');
    }
    var scopeChips = (p.scope||[]).map(function(s){ return '• ' + esc(LScope(s)); }).join('<br>');
    var overview = p.notes ? esc(p.notes) : (lang()==='en'?'Project defined according to the selected scope and site conditions.':'Proyecto definido de acuerdo al alcance seleccionado y condiciones del sitio.');
    var inc = (p.inclusions||[]).map(function(x){return '<li>'+esc(x)+'</li>';}).join('');
    var exc = (p.exclusions||[]).map(function(x){return '<li>'+esc(x)+'</li>';}).join('');
    var taxNote = (P.NJ_NOTES && P.NJ_NOTES[p.settings.taxMode]) || '';
    var scheduleRows = (p.schedule||[]).map(function(s){ var amt = c.total * (U.num(s.pct)/100); return '<tr><td>'+esc(s.label)+'</td><td style="text-align:right">'+esc(s.pct)+'%</td><td style="text-align:right">'+money(amt)+'</td></tr>'; }).join('');

    var hasMaint = (p.scope && p.scope.indexOf('maint') >= 0) && p.maintenance && Array.isArray(p.maintenance.items) && p.maintenance.items.length;
    var services = [];
    if ((p.lines.labor||[]).length) services.push(lang()==='en'?'Professional installation labor and technical services':'Mano de obra profesional de instalación y servicios técnicos');
    if ((p.lines.freight||[]).length) services.push(lang()==='en'?'Logistics, delivery and mobilization as required':'Logística, entrega y movilización según requerimiento');
    if ((p.lines.indirects||[]).length) services.push(lang()==='en'?'Equipment rentals/indirects required for execution':'Rentas de equipos e indirectos necesarios para la ejecución');
    if ((p.lines.materials||[]).length) services.push(lang()==='en'?'Materials, accessories and consumables required for a complete installation':'Materiales, accesorios y consumibles necesarios para una instalación completa');
    if (hasMaint) services.push(lang()==='en'?'Preventive/corrective maintenance plan and service visits as detailed below':'Plan de mantenimiento preventivo/correctivo y visitas de servicio según se detalla');
    if (!services.length) services.push(lang()==='en'?'Scope-based HVAC services as described':'Servicios HVAC según alcance descrito');
    var servicesHtml = '<ul>' + services.map(function(x){return '<li>'+esc(x)+'</li>';}).join('') + '</ul>';

    var maintHtml = '';
    if (hasMaint) {
      var mrows = p.maintenance.items.map(function(m){
        var qty = U.num(m.qty)||0, visits = U.num(m.visits)||0, price = U.num(m.pricePerVisit)||0, mat = U.num(m.materialsPerVisit)||0;
        var lineSell = visits * (qty * price + mat);
        if (!m.type && qty<=0 && visits<=0 && price<=0 && mat<=0) return '';
        return '<tr><td>' + esc(m.type || (lang()==='en'?'Equipment/service':'Equipo/servicio')) + '</td><td style="text-align:right">' + esc(qty) + '</td><td style="text-align:right">' + esc(visits) + '</td><td style="text-align:right">' + money(price) + '</td><td style="text-align:right">' + money(mat) + '</td><td style="text-align:right">' + money(lineSell) + '</td></tr>';
      }).filter(Boolean).join('');
      var mnotes = (p.maintenance.notes || '').trim();
      maintHtml = '<div class="print-section avoid-break"><h3>' + (lang()==='en'?'Maintenance plan & budget':'Plan y presupuesto de mantenimiento') + '</h3>'
        + '<div class="smallprint" style="margin-bottom:6px">' + (lang()==='en'?'Contract period':'Periodo de contrato') + ': <b>' + esc(p.maintenance.contractMonths || 12) + ' ' + (lang()==='en'?'month(s)':'mes(es)') + '</b></div>'
        + (mrows ? '<table class="print-table"><thead><tr><th>' + (lang()==='en'?'Equipment / service':'Equipo / servicio') + '</th><th style="width:55px">' + (lang()==='en'?'Qty':'Cant.') + '</th><th style="width:60px">' + (lang()==='en'?'Visits':'Visitas') + '</th><th style="width:90px">' + (lang()==='en'?'$/equip/visit':'$/equipo/visita') + '</th><th style="width:90px">' + (lang()==='en'?'Materials/visit':'Mat./visita') + '</th><th style="width:95px">' + (lang()==='en'?'Total':'Total') + '</th></tr></thead><tbody>' + mrows + '</tbody></table>' : '<div class="smallprint">' + (lang()==='en'?'Maintenance scope as agreed.':'Alcance de mantenimiento según lo acordado.') + '</div>')
        + '<div class="smallprint" style="margin-top:6px">' + (lang()==='en'?'Maintenance total (included above): ':'Total de mantenimiento (incluido arriba): ') + '<b>' + money(c.maintSell || 0) + '</b>' + ((c.maintCost||0)>0 ? ' · ' + (lang()==='en'?'Materials/parts allowance: ':'Provisión materiales/repuestos: ') + money(c.maintCost||0) : '') + '</div>'
        + (mnotes ? '<div style="margin-top:6px"><b>' + (lang()==='en'?'Included tasks / notes:':'Tareas incluidas / notas:') + '</b><div class="smallprint">' + esc(mnotes).replace(/\n/g,'<br>') + '</div></div>' : '')
        + '</div>';
    }

    var html = '<div class="print-doc">'
      + '<div class="print-header"><div>' + logo + '<h1>' + esc(co.name||t('appName')) + '</h1><div>' + esc(co.tagline||'') + '</div><div class="smallprint">' + comp + '</div><div class="smallprint">' + esc(lic) + '</div></div>'
      + '<div style="text-align:right"><div style="font-size:18px;font-weight:700">' + (lang()==='en'?'PROPOSAL / QUOTE':'PROPUESTA / COTIZACIÓN') + '</div><div><b>' + esc(p.number) + '</b></div><div>' + (lang()==='en'?'Date':'Fecha') + ': ' + U.date(p.date) + '</div><div>' + (lang()==='en'?'Valid until':'Válida hasta') + ': ' + U.date(p.validUntil) + '</div></div></div>'
      + '<div class="print-grid avoid-break"><div class="print-section"><h3>' + (lang()==='en'?'Prepared for':'Preparado para') + '</h3><div><b>' + esc(p.client.name||'') + '</b> ' + esc(p.client.company||'') + '</div><div>' + esc(p.client.address||'') + '</div><div>' + esc([p.client.city,p.client.state,p.client.zip].filter(Boolean).join(', ')) + '</div><div>' + esc(p.client.phone||'') + ' ' + esc(p.client.email||'') + '</div></div>'
      + '<div class="print-section"><h3>' + (lang()==='en'?'Project':'Proyecto') + '</h3><div><b>' + esc(p.projectName||'') + '</b></div><div class="smallprint">' + esc(scopes) + '</div><div style="margin-top:4px"><b>' + (lang()==='en'?'Client type':'Tipo de cliente') + ':</b> ' + esc(LClient(p.client.type||'residential')) + '</div></div></div>'

      + '<div class="print-section avoid-break"><h3>' + esc(t('proposalOverview')) + '</h3>'
      + '<div>' + overview + '</div>'
      + '<div style="margin-top:8px"><b>' + (lang()==='en'?'Scope of work':'Alcance del trabajo') + ':</b><div class="smallprint" style="margin-top:4px">' + (scopeChips || esc(scopes)) + '</div></div>'
      + '<div style="margin-top:8px"><b>' + (lang()==='en'?'Included services & supply':'Servicios y suministro incluidos') + ':</b>' + servicesHtml + '</div>'
      + '<div class="smallprint" style="margin-top:6px">' + (lang()==='en'?'Note: materials and detailed internal quantities are managed by the contractor; this proposal presents a general, professional description of the project.':'Nota: los materiales y cantidades internas detalladas son gestionados por el contratista; esta propuesta presenta una descripción general y profesional del proyecto.') + '</div></div>'

      + '<div class="print-section avoid-break"><h3>' + esc(t('equipmentBrands')) + '</h3>' + equipmentHtml + '</div>'
      + maintHtml

      + '<div class="print-grid avoid-break">'
      + '<div class="print-section"><h3>' + esc(t('deliveryTime')) + '</h3><div><b>' + esc(delivery) + '</b></div><div class="smallprint" style="margin-top:4px">' + esc(t('equipmentLead')) + ': ' + esc(lead) + '</div></div>'
      + '<div class="print-section"><h3>' + esc(t('paymentMethod')) + '</h3><div><b>' + esc(payment) + '</b></div><div class="smallprint" style="margin-top:4px">' + esc(t('warrantyTerms')) + ': ' + esc(warranty) + '</div></div>'
      + '</div>'

      + '<div class="print-section avoid-break"><h3>' + (lang()==='en'?'Commercial summary':'Resumen comercial') + '</h3><div class="totals-box"><table class="print-table"><tbody>'
      + '<tr><td>' + (lang()==='en'?'Project subtotal':'Subtotal del proyecto') + '</td><td style="text-align:right">' + money(c.beforeDiscount) + '</td></tr>'
      + (c.discount>0?'<tr><td>' + (lang()==='en'?'Discount':'Descuento') + '</td><td style="text-align:right">- ' + money(c.discount) + '</td></tr>':'')
      + '<tr><td>' + (lang()==='en'?'Taxable base':'Base imponible') + '</td><td style="text-align:right">' + money(c.taxableBase) + '</td></tr>'
      + '<tr><td>Sales Tax NJ (' + U.pct(c.rate*100) + ')</td><td style="text-align:right">' + money(c.tax) + '</td></tr>'
      + '<tr><th>TOTAL</th><th style="text-align:right">' + money(c.total) + '</th></tr>'
      + '</tbody></table></div>'
      + '<div class="smallprint" style="margin-top:6px">' + esc(taxNote) + '</div></div>'

      + (scheduleRows?'<div class="print-section avoid-break"><h3>' + (lang()==='en'?'Payment schedule':'Calendario de pagos') + '</h3><table class="print-table"><thead><tr><th>' + (lang()==='en'?'Milestone':'Hito') + '</th><th style="width:80px">%</th><th style="width:110px">' + (lang()==='en'?'Amount':'Monto') + '</th></tr></thead><tbody>' + scheduleRows + '</tbody></table><div class="smallprint">' + (lang()==='en'?'Suggested deposit':'Depósito sugerido') + ': ' + money(c.deposit) + ' (' + esc(p.settings.depositPct) + '%).</div></div>':'')

      + '<div class="print-grid avoid-break"><div class="print-section"><h3>' + (lang()==='en'?'Includes':'Incluye') + '</h3><ul>' + (inc||'<li>' + (lang()==='en'?'As described in this proposal.':'Según lo descrito en esta propuesta.') + '</li>') + '</ul></div>'
      + '<div class="print-section"><h3>' + (lang()==='en'?'Excludes':'No incluye / exclusiones') + '</h3><ul>' + (exc||'<li>' + (lang()==='en'?'Anything not expressly described.':'Todo lo no descrito expresamente.') + '</li>') + '</ul></div></div>'

      + '<div class="print-section avoid-break"><h3>' + (lang()==='en'?'Acceptance':'Aceptación') + '</h3><div class="print-grid"><div>' + (lang()==='en'?'Client signature':'Firma cliente') + ': ____________________________<br><br>' + (lang()==='en'?'Name':'Nombre') + ': ____________________________<br><br>' + (lang()==='en'?'Date':'Fecha') + ': ____ / ____ / ________</div>'
      + '<div>' + (lang()==='en'?'Contractor signature':'Firma contratista') + ': ____________________________<br><br>' + esc(co.name||'') + '<br><br>' + (lang()==='en'?'Date':'Fecha') + ': ____ / ____ / ________</div></div>'
      + '<div class="smallprint" style="margin-top:10px">' + esc(co.footer||'') + '</div>'
      + '<div class="smallprint" style="margin-top:4px">' + (lang()==='en'?'Proposal subject to stated conditions. For residential work > $500 a written contract is required per NJ. ':'Propuesta sujeta a las condiciones indicadas. Para trabajos residenciales &gt; $500 se requiere contrato escrito conforme a NJ. ') + (p.settings.taxMode==='capital'?(lang()==='en'?'Form ST-8 signature required for capital improvement treatment.':'Se requiere Form ST-8 firmado para tratamiento de capital improvement.'):'') + '</div>'
      + '<div class="smallprint" style="margin-top:4px;color:#666">' + esc(t('generatedNote')) + '</div></div>'
      + '</div>';
    $('#print-root').innerHTML = html;
    window.print();
  }

  P.ui = {
    $, $all, esc, money, toast, openModal, closeModal,
    renderHome, renderProjects, renderProject, renderCatalog, renderDeals, renderSuppliers, renderCompany,
    catalogTableRows, refreshPicker,
    openLineModal, readLineForm, openCatalogPicker, openSupplierModal, openCatalogEditModal, openRFQModal, openUpdatePricesModal, printProject,
    projectSidebar, wizardProgressHTML, logoFallback,
    statusPill
  };
})(window.PCP);
