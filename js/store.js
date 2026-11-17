/* =====================================================================
   Project_Catcher_Plus — Estado, cálculo y motor de completitud
   ===================================================================== */
window.PCP = window.PCP || {};
(function (P) {
  'use strict';

  var LS_KEY = 'pcp_state_v1_v1';

  /* ---------------------------------------------------------------- */
  /* Utilidades                                                        */
  /* ---------------------------------------------------------------- */
  function uid(prefix) {
    return prefix + '_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
  }
  function num(v) {
    if (v === null || v === undefined || v === '') return 0;
    if (typeof v === 'number') return isFinite(v) ? v : 0;
    var s = String(v).replace(/[^0-9.\-]/g, '');
    var n = parseFloat(s);
    return isFinite(n) ? n : 0;
  }
  function round2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }
  function today() { return new Date().toISOString().slice(0, 10); }
  function addDays(d, n) {
    var x = new Date(d + 'T12:00:00');
    x.setDate(x.getDate() + n);
    return x.toISOString().slice(0, 10);
  }
  function daysBetween(a, b) {
    if (!a) return 9999;
    var d1 = new Date(a + 'T12:00:00'), d2 = new Date((b || today()) + 'T12:00:00');
    return Math.round((d2 - d1) / 86400000);
  }
  var fmtMoney = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
  var fmtMoney0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  P.util = {
    uid: uid, num: num, round2: round2, today: today, addDays: addDays, daysBetween: daysBetween,
    money: function (n) { return fmtMoney.format(num(n)); },
    money0: function (n) { return fmtMoney0.format(num(n)); },
    pct: function (n) { return (Math.round(num(n) * 10) / 10).toFixed(1) + '%'; },
    date: function (s) {
      if (!s) return '—';
      var p = String(s).slice(0, 10).split('-');
      return p.length === 3 ? p[1] + '/' + p[2] + '/' + p[0] : s;
    },
    esc: function (s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
      });
    },
    clone: function (o) { return JSON.parse(JSON.stringify(o)); }
  };

  var U = P.util;

  function isMaintOnly(p) {
    var sc = (p && p.scope) || [];
    return sc.length > 0 && sc.every(function (x) { return x === 'maint'; });
  }
  function maintLabel(line) {
    var l = line || {};
    var brandModel = [String(l.brand || '').trim(), String(l.model || '').trim()].filter(Boolean).join(' ');
    return brandModel || String(l.name || '').trim() || 'Equipo';
  }

  /* ---------------------------------------------------------------- */
  /* Estado inicial                                                    */
  /* ---------------------------------------------------------------- */
  function blankState() {
    return {
      version: P.VERSION,
      company: P.util.clone(P.DEFAULT_COMPANY),
      settings: P.util.clone(P.DEFAULT_SETTINGS),
      suppliers: P.util.clone(P.SUPPLIERS),
      catalog: P.util.clone(P.CATALOG),
      projects: [],
      seq: 1,
      ui: { lastRoute: '#/home', theme: 'dark', lang: 'es' }
    };
  }

  var S = {
    state: null,

    load: function () {
      var raw = null;
      try { raw = localStorage.getItem(LS_KEY); } catch (e) { raw = null; }
      if (raw) {
        try {
          var parsed = JSON.parse(raw);
          S.state = S.migrate(parsed);
          return S.state;
        } catch (e) { /* corrupto: reiniciar */ }
      }
      S.state = blankState();
      S.save();
      return S.state;
    },

    buildSchedule: function (depositPct) {
      var d = Math.max(0, Math.min(100, U.num(depositPct)));
      var rest = round2(100 - d);
      if (d >= 100) return [{ label: 'Depósito / pago total al firmar', pct: 100 }];
      if (d <= 0) return [{ label: 'Al iniciar', pct: 50 }, { label: 'Al terminar y entregar', pct: 50 }];
      var mid = round2(rest / 2);
      var fin = round2(rest - mid);
      return [
        { label: 'Depósito al firmar', pct: d },
        { label: 'Al iniciar la instalación', pct: mid },
        { label: 'Al terminar y entregar', pct: fin }
      ];
    },
    syncPayment: function (p) {
      if (!p) return;
      p.settings = p.settings || {};
      p.schedule = S.buildSchedule(p.settings.depositPct);
      // keep payment method coherent if empty or looks like default template
      p.terms = p.terms || {};
      var pm = (p.terms.paymentMethod || '').trim();
      var isGeneric = !pm || /30%|dep[oó]sito.*40%.*30%|deposit.*start.*completion/i.test(pm);
      if (isGeneric) {
        var parts = p.schedule.map(function(s){ return U.pct ? (s.pct + '% ' + s.label) : (s.pct + '% ' + s.label); });
        // simpler readable form
        var labels = p.schedule.map(function(s){ return s.pct + '% — ' + s.label; });
        p.terms.paymentMethod = labels.join(' / ');
      }
      return p;
    },

    migrate: function (s) {
      var base = blankState();
      s = s || {};
      s.version = P.VERSION;
      s.company = Object.assign({}, base.company, s.company || {});
      s.settings = Object.assign({}, base.settings, s.settings || {});
      s.settings.defaultMarkups = Object.assign({}, base.settings.defaultMarkups, (s.settings || {}).defaultMarkups || {});
      s.suppliers = Array.isArray(s.suppliers) && s.suppliers.length ? s.suppliers : base.suppliers;
      // merge logo/domain metadata from seed for known suppliers (keeps user edits)
      if (Array.isArray(s.suppliers)) {
        var seedMap = {};
        (P.SUPPLIERS || []).forEach(function (ss) { seedMap[ss.id] = ss; });
        s.suppliers = s.suppliers.map(function (sp) {
          var seed = seedMap[sp.id] || {};
          if (!sp.logo && seed.logo) sp.logo = seed.logo;
          if (!sp.domain && seed.domain) sp.domain = seed.domain;
          if (!sp.short && seed.short) sp.short = seed.short;
          return sp;
        });
      }
      s.catalog = Array.isArray(s.catalog) && s.catalog.length ? s.catalog : base.catalog;
      s.projects = Array.isArray(s.projects) ? s.projects : [];
      s.seq = s.seq || (s.projects.length + 1);
      s.ui = Object.assign({}, base.ui, s.ui || {});
      // migración suave
      s.projects.forEach(function (p) {
        if (!p.projectName) p.projectName = p.client && (p.client.company || p.client.name) ? ('Proyecto - ' + (p.client.company || p.client.name)) : 'Proyecto HVAC';
        if (!p.terms) p.terms = { deliveryTime: '', paymentMethod: '', equipmentLeadTime: '', warranty: 'Mano de obra según propuesta. Garantías de fábrica según fabricante.' };
        p.terms.deliveryTime = p.terms.deliveryTime || '';
        p.terms.paymentMethod = p.terms.paymentMethod || '';
        p.terms.equipmentLeadTime = p.terms.equipmentLeadTime || '';
        p.terms.warranty = p.terms.warranty || 'Mano de obra según propuesta. Garantías de fábrica según fabricante.';
        if (!Array.isArray(p.selectedSuppliers)) p.selectedSuppliers = [];
        if (typeof p.settings.depositPct !== 'number') p.settings.depositPct = num(p.settings.depositPct || base.settings.depositPct || 30);
        if (!p.schedule || !p.schedule.length) p.schedule = S.buildSchedule(p.settings.depositPct);
        else S.syncPayment(p);
        if (!p.maintenance) p.maintenance = { items: [], notes: '', contractMonths: 12, includeMaterials: true };
        if (!Array.isArray(p.maintenance.items)) p.maintenance.items = [];
        if (!Array.isArray(p.maintenance.dismissed)) p.maintenance.dismissed = [];
      });
      return s;
    },

    save: function () {
      try { localStorage.setItem(LS_KEY, JSON.stringify(S.state)); }
      catch (e) {
        try {
          // Intentar sin logo (suele ser lo más pesado)
          var copy = JSON.parse(JSON.stringify(S.state));
          copy.company.logo = '';
          localStorage.setItem(LS_KEY, JSON.stringify(copy));
        } catch (e2) {
          console.warn('No se pudo guardar el estado', e2);
        }
      }
    },

    reset: function () {
      S.state = blankState();
      S.save();
    },

    /* -------------------------------------------------------------- */
    /* Proyectos                                                      */
    /* -------------------------------------------------------------- */
    newProject: function (opts) {
      var st = S.state.settings;
      opts = opts || {};
      var n = S.state.seq++;
      var number = 'PC-' + new Date().getFullYear() + '-' + String(n).padStart(3, '0');
      var p = {
        id: uid('prj'),
        number: number,
        projectName: (opts.projectName || 'Nuevo proyecto HVAC').trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft',
        date: today(),
        validUntil: addDays(today(), st.validityDays),
        client: {
          name: (opts.clientName || '').trim(), company: (opts.clientCompany || '').trim(), email: '', phone: '',
          address: '', city: '', state: 'NJ', zip: '', type: 'residential'
        },
        scope: opts.scope || ['ac'],
        selectedSuppliers: opts.selectedSuppliers || [],
        lines: { equipment: [], freight: [], indirects: [], materials: [], labor: [], other: [] },
        settings: {
          taxMode: st.taxMode,
          taxRate: st.taxRate,
          globalFactor: st.globalFactor,
          contingencyPct: st.contingencyPct,
          overheadPct: st.overheadPct,
          depositPct: st.depositPct,
          validityDays: st.validityDays,
          discountPct: 0,
          discountAmt: 0,
          materialsTaxAsCost: st.materialsTaxAsCost,
          pricingMode: 'margin' // 'markup' | 'target'
        },
        terms: {
          deliveryTime: (opts.deliveryTime || '').trim(),
          paymentMethod: (opts.paymentMethod || '').trim(),
          equipmentLeadTime: '',
          warranty: 'Mano de obra según propuesta. Garantías de fábrica según fabricante.'
        },
        inclusions: P.util.clone(P.DEFAULT_INCLUSIONS),
        exclusions: P.util.clone(P.DEFAULT_EXCLUSIONS),
        options: [],
        schedule: [],
        notes: '',
        internalNotes: '',
        maintenance: { items: [], notes: '', contractMonths: 12, includeMaterials: true },
        acknowledged: { st8: false, permit: false, insurance: false }
      };
      S.syncPayment(p);
      S.state.projects.unshift(p);
      S.save();
      return p;
    },

    getProject: function (id) {
      return S.state.projects.filter(function (p) { return p.id === id; })[0] || null;
    },

    isMaintOnly: isMaintOnly,

    /* Load the equipment quoted in the offer into the maintenance plan.
       Quantities follow the quote; visit/price/material values stay as edited. */
    syncMaintenance: function (p, opts) {
      opts = opts || {};
      if (!p || !p.scope || p.scope.indexOf('maint') < 0) return false;
      p.maintenance = p.maintenance || { items: [], notes: '', contractMonths: 12, includeMaterials: true };
      var m = p.maintenance;
      if (!Array.isArray(m.items)) m.items = [];
      if (!Array.isArray(m.dismissed)) m.dismissed = [];
      if (opts.restoreDismissed) m.dismissed = [];

      var eq = (p.lines && Array.isArray(p.lines.equipment)) ? p.lines.equipment : [];
      var eqById = {};
      eq.forEach(function (l) { if (l && l.id) eqById[l.id] = l; });
      var changed = false;

      // Remove automatic rows whose source equipment line no longer exists.
      var kept = [];
      m.items.forEach(function (it) {
        if (it && it.sourceLineId && !eqById[it.sourceLineId]) { changed = true; return; }
        kept.push(it);
      });
      m.items = kept;

      var dismissed = m.dismissed.filter(function (id) { return !!eqById[id]; });
      if (dismissed.length !== m.dismissed.length) { m.dismissed = dismissed; changed = true; }

      var bySource = {};
      m.items.forEach(function (it) { if (it && it.sourceLineId) bySource[it.sourceLineId] = it; });

      eq.forEach(function (l) {
        if (!l || !l.id || m.dismissed.indexOf(l.id) >= 0) return;
        var label = maintLabel(l);
        var qty = num(l.qty);
        var it = bySource[l.id];
        if (!it) {
          m.items.push({
            sourceLineId: l.id,
            auto: true,
            type: label,
            sourceType: label,
            qty: qty,
            sourceQty: qty,
            visits: 2,
            pricePerVisit: 0,
            materialsPerVisit: 0
          });
          changed = true;
          return;
        }
        // Follow quote quantities unless the user changed the quantity in the plan.
        var prevQty = it.sourceQty == null ? num(it.qty) : num(it.sourceQty);
        if (num(it.qty) === prevQty && num(it.qty) !== qty) { it.qty = qty; changed = true; }
        it.sourceQty = qty;
        // Follow the equipment label unless the user renamed the maintenance line.
        if (!it.type || it.type === it.sourceType) {
          if (it.type !== label) { it.type = label; changed = true; }
        }
        it.sourceType = label;
        if (it.auto !== true) { it.auto = true; changed = true; }
      });

      if (changed) {
        p.updatedAt = new Date().toISOString();
        if (opts.save !== false) S.save();
      }
      return changed;
    },

    updateProject: function (id, patch) {
      var p = S.getProject(id);
      if (!p) return null;
      Object.assign(p, patch);
      p.updatedAt = new Date().toISOString();
      S.save();
      return p;
    },

    updateSettings: function (id, patch) {
      var p = S.getProject(id);
      if (!p) return null;
      Object.assign(p.settings, patch);
      p.updatedAt = new Date().toISOString();
      S.save();
      return p;
    },

    deleteProject: function (id) {
      S.state.projects = S.state.projects.filter(function (p) { return p.id !== id; });
      S.save();
    },

    duplicateProject: function (id) {
      var p = S.getProject(id);
      if (!p) return null;
      var c = JSON.parse(JSON.stringify(p));
      c.id = uid('prj');
      c.number = 'PC-' + new Date().getFullYear() + '-' + String(S.state.seq++).padStart(3, '0');
      c.createdAt = new Date().toISOString();
      c.updatedAt = c.createdAt;
      c.date = today();
      c.status = 'draft';
      c.projectName = (c.projectName || 'Proyecto') + ' (copia)';
      c.client = Object.assign({}, c.client, { name: c.client.name || '', company: c.client.company || '' });
      S.state.projects.unshift(c);
      S.save();
      return c;
    },

    /* -------------------------------------------------------------- */
    /* Líneas                                                         */
    /* -------------------------------------------------------------- */
    addLine: function (pid, stage, line) {
      var p = S.getProject(pid);
      if (!p) return null;
      if (!p.lines[stage]) p.lines[stage] = [];
      var l = {
        id: uid('ln'),
        name: line.name || 'Nuevo ítem',
        brand: line.brand || '',
        model: line.model || '',
        sku: line.sku || '',
        supplier: line.supplier || 'manual',
        qty: line.qty == null ? 1 : num(line.qty),
        unit: line.unit || 'ea',
        unitCost: num(line.unitCost),
        unitPrice: line.unitPrice === '' || line.unitPrice == null ? null : num(line.unitPrice),
        markupPct: line.markupPct === '' || line.markupPct == null ? null : num(line.markupPct),
        includes: line.includes || '',
        excludes: line.excludes || '',
        url: line.url || '',
        priceDate: line.priceDate || today(),
        catalogId: line.catalogId || '',
        regularCost: line.regularCost == null ? null : num(line.regularCost),
        promoEnds: line.promoEnds || '',
        promoLabel: line.promoLabel || '',
        note: line.note || ''
      };
      p.lines[stage].push(l);
      p.updatedAt = new Date().toISOString();
      S.save();
      return l;
    },

    getLine: function (pid, lineId) {
      var p = S.getProject(pid);
      if (!p) return null;
      for (var st in p.lines) {
        var found = (p.lines[st] || []).filter(function (l) { return l.id === lineId; })[0];
        if (found) return { stage: st, line: found };
      }
      return null;
    },

    updateLine: function (pid, lineId, patch) {
      var f = S.getLine(pid, lineId);
      if (!f) return null;
      Object.assign(f.line, patch);
      var p = S.getProject(pid);
      p.updatedAt = new Date().toISOString();
      S.save();
      return f.line;
    },

    removeLine: function (pid, lineId) {
      var p = S.getProject(pid);
      if (!p) return;
      for (var st in p.lines) {
        p.lines[st] = (p.lines[st] || []).filter(function (l) { return l.id !== lineId; });
      }
      p.updatedAt = new Date().toISOString();
      S.save();
    },

    moveLine: function (pid, lineId, dir) {
      var f = S.getLine(pid, lineId);
      if (!f) return;
      var arr = S.getProject(pid).lines[f.stage];
      var i = arr.indexOf(f.line);
      var j = i + dir;
      if (j < 0 || j >= arr.length) return;
      arr.splice(i, 1);
      arr.splice(j, 0, f.line);
      S.save();
    },

    /* -------------------------------------------------------------- */
    /* Cálculo                                                        */
    /* -------------------------------------------------------------- */
    calc: function (p) {
      var st = p.settings || {};
      var marks = S.state.settings.defaultMarkups || {};
      var rate = num(st.taxRate);
      var byStage = {};
      var cost = 0, sell = 0, materialSell = 0, materialCost = 0;
      var promoSavings = 0;
      var lineCount = 0;

      P.STAGES.forEach(function (stage) {
        var sCost = 0, sSell = 0, sQty = 0;
        (p.lines[stage.id] || []).forEach(function (l) {
          lineCount++;
          var q = num(l.qty), uc = num(l.unitCost);
          var lc = q * uc;
          if (st.materialsTaxAsCost && (stage.id === 'equipment' || stage.id === 'materials')) {
            lc = lc * (1 + rate);
          }
          var mk = (l.markupPct === null || l.markupPct === undefined || l.markupPct === '')
            ? num(marks[stage.id]) : num(l.markupPct);
          var us = (l.unitPrice === null || l.unitPrice === undefined || l.unitPrice === '')
            ? uc * (1 + mk / 100) : num(l.unitPrice);
          var ls = q * us;
          sCost += lc; sSell += ls; sQty += q;
          if (stage.id === 'materials') { materialCost += lc; materialSell += ls; }
          if (l.regularCost && l.regularCost > uc) {
            promoSavings += (l.regularCost - uc) * q;
          }
          l._extCost = lc; l._unitSell = us; l._extSell = ls; l._margin = ls > 0 ? (ls - lc) / ls : 0;
        });
        byStage[stage.id] = { cost: sCost, sell: sSell, qty: sQty, count: (p.lines[stage.id] || []).length };
        cost += sCost; sell += sSell;
      });

      // Maintenance budget (when applicable)
      var maintSell = 0, maintCost = 0, maintItems = 0;
      if (p.scope && p.scope.indexOf('maint') >= 0 && p.maintenance && Array.isArray(p.maintenance.items)) {
        p.maintenance.items.forEach(function (m) {
          var qty = num(m.qty), visits = num(m.visits), price = num(m.pricePerVisit), mat = num(m.materialsPerVisit);
          if (qty <= 0 && price <= 0 && mat <= 0) return;
          maintItems++;
          var lineSell = visits * (qty * price + mat);
          var lineCost = visits * mat; // materials/parts allowance treated as direct cost
          maintSell += lineSell;
          maintCost += lineCost;
          m._lineSell = round2(lineSell);
          m._lineCost = round2(lineCost);
        });
      }
      if (maintSell || maintCost) {
        cost += maintCost; sell += maintSell;
        byStage.maintenance = { cost: round2(maintCost), sell: round2(maintSell), qty: 0, count: maintItems };
      }

      var blendedMarkup = cost > 0 ? sell / cost - 1 : 0;
      var contCost = cost * num(st.contingencyPct) / 100;
      var contSell = contCost * (1 + blendedMarkup);
      var overhead = cost * num(st.overheadPct) / 100;

      var subtotalSell = sell + contSell;
      var factor = num(st.globalFactor) || 1;
      var beforeDiscount = subtotalSell * factor;
      var discount = num(st.discountAmt) > 0 ? num(st.discountAmt) : beforeDiscount * num(st.discountPct) / 100;
      var afterDiscount = Math.max(0, beforeDiscount - discount);

      var materialShare = subtotalSell > 0 ? ((materialSell + maintCost) / subtotalSell) : 0;
      var taxableBase;
      switch (st.taxMode) {
        case 'capital': taxableBase = 0; break;
        case 'repair': taxableBase = afterDiscount; break;
        case 'materials': taxableBase = afterDiscount * materialShare; break;
        default: taxableBase = afterDiscount;
      }
      var tax = taxableBase * rate;
      var total = afterDiscount + tax;

      var totalCost = cost + contCost + overhead;
      var profit = afterDiscount - totalCost;
      var margin = afterDiscount > 0 ? profit / afterDiscount : 0;
      var markupPct = totalCost > 0 ? profit / totalCost : 0;

      var deposit = total * num(st.depositPct) / 100;

      return {
        byStage: byStage,
        cost: round2(cost),
        sell: round2(sell),
        contCost: round2(contCost),
        contSell: round2(contSell),
        overhead: round2(overhead),
        subtotalSell: round2(subtotalSell),
        factor: factor,
        beforeDiscount: round2(beforeDiscount),
        discount: round2(discount),
        afterDiscount: round2(afterDiscount),
        taxableBase: round2(taxableBase),
        tax: round2(tax),
        total: round2(total),
        totalCost: round2(totalCost),
        profit: round2(profit),
        margin: margin,
        markup: markupPct,
        deposit: round2(deposit),
        promoSavings: round2(promoSavings),
        lineCount: lineCount,
        materialShare: materialShare,
        rate: rate,
        maintSell: round2(maintSell),
        maintCost: round2(maintCost),
        maintItems: maintItems
      };
    },

    /* -------------------------------------------------------------- */
    /* Motor de completitud ("que no se te olvide nada")              */
    /* -------------------------------------------------------------- */
    checklist: function (p, c) {
      c = c || S.calc(p);
      var all = [];
      P.STAGES.forEach(function (s) {
        (p.lines[s.id] || []).forEach(function (l) {
          all.push({ stage: s.id, line: l, hay: ((l.name || '') + ' ' + (l.brand || '') + ' ' + (l.model || '') + ' ' + (l.includes || '') + ' ' + (l.sku || '')).toLowerCase() });
        });
      });
      function any(re, stage) {
        return all.some(function (x) {
          if (stage && x.stage !== stage) return false;
          return re.test(x.hay);
        });
      }
      function has(re) { return any(re, null); }
      function countStage(id) { return (p.lines[id] || []).length; }

      var sc = p.scope || [];
      var maintOnly = isMaintOnly(p);
      var hasMaintScope = sc.indexOf('maint') >= 0;
      var isAC = sc.indexOf('ac') >= 0;
      var isHeat = sc.indexOf('heat') >= 0;
      var isVent = sc.indexOf('vent') >= 0;
      var isRefrig = sc.indexOf('refrig') >= 0;
      var isIAQ = sc.indexOf('iaq') >= 0;
      var R = [];

      function add(id, label, step, ok, detail, sev) {
        R.push({ id: id, label: label, step: step, status: ok ? 'ok' : (sev || 'fail'), detail: detail });
      }

      /* --- cliente y alcance --- */
      add('scope', 'Alcance del proyecto definido', 1, sc.length > 0,
        'Selecciona al menos un sistema (A/C, calefacción, ventilación…).');
      add('client', 'Datos del cliente completos', 1,
        !!(p.client.name && p.client.address && p.client.city && p.client.zip),
        'Faltan nombre, dirección, ciudad o ZIP.');
      add('system', 'Descripción del sistema / ubicación', 1,
        !!(p.notes && p.notes.length > 15),
        'Agrega una descripción breve del sistema y dónde se instalará.');
      add('delivery', 'Tiempo de entrega / ejecución definido', 1,
        !!(p.terms && p.terms.deliveryTime && String(p.terms.deliveryTime).trim().length > 2),
        'Indica el tiempo estimado de entrega o ejecución para la propuesta del cliente.');
      add('payment', 'Forma de pago definida', 1,
        !!(p.terms && p.terms.paymentMethod && String(p.terms.paymentMethod).trim().length > 2),
        'Indica la forma de pago o condiciones comerciales para la propuesta del cliente.');

      /* --- mantenimiento (si aplica) --- */
      var hasMaintScope = sc.indexOf('maint') >= 0;
      if (hasMaintScope) {
        var mItems = (p.maintenance && Array.isArray(p.maintenance.items)) ? p.maintenance.items : [];
        var mOk = mItems.some(function(m){ return U.num(m.qty) > 0 && U.num(m.visits) > 0 && (U.num(m.pricePerVisit) > 0 || U.num(m.materialsPerVisit) > 0); });
        add('maintplan', 'Plan de mantenimiento definido', maintOnly ? 2 : 8, mOk,
          'El alcance incluye mantenimiento: define equipos/cantidad, visitas y precio/materiales por visita en la etapa de Mantenimiento.');
      }

      /* --- proveedores --- */
      if (!maintOnly) {
        add('suppliers', 'Proveedores seleccionados', 2,
          Array.isArray(p.selectedSuppliers) && p.selectedSuppliers.length > 0,
          'Selecciona al menos un proveedor en la etapa de Proveedores para filtrar materiales y precios (puedes elegir varios para comparar).', 'warn');
      }

      /* --- equipos / instalación (no aplica a proyectos solo de mantenimiento) --- */
      if (!maintOnly) {
      /* --- equipos --- */
      add('equipment', 'Equipo principal cargado', 3, countStage('equipment') > 0,
        'No hay equipos en la cotización.');
      if (isAC) {
        add('outdoor', 'Unidad exterior / condensadora', 3,
          has(/condens|outdoor|exterior|paquete|rooftop|mini|lspf|split/),
          'Falta la unidad exterior (o el equipo paquete/mini-split).');
        add('indoor', 'Unidad interior (air handler / coil / cabeza)', 3,
          has(/air handler|manejadora|evaporad|coil|interior|cabeza|fan coil/),
          'Falta la unidad interior, coil o cabeza del mini-split.');
        add('lineset', 'Line set / tubería de refrigerante', 6,
          has(/line set|line-set|línea de cobre|tubería de cobre|cobre acr|acr/),
          'No hay line set ni tubería de cobre para conectar el equipo.');
        add('drain', 'Drenaje de condensado', 6,
          has(/drenaje|condensad|pvc|trampa|bomba/),
          'Falta el drenaje de condensado (PVC, trampa o bomba).');
        add('elec', 'Eléctrico del equipo (disconnect / whip / breaker)', 6,
          has(/disconnect|desconect|whip|breaker|breaker|eléctric|electric|conduit/),
          'Falta desconectador, whip o breaker para el circuito del equipo.');
        add('thermostat', 'Termostato / control', 3,
          has(/termostato|thermostat|control|zona/),
          'No hay termostato ni control especificado.');
        add('startup', 'Arranque, vacío y comisionamiento', 7,
          has(/arranque|startup|comision|puesta en marcha|vacío|vacuum/),
          'Falta el arranque/comisionamiento: es lo que evita la llamada de garantía.');
        add('permit', 'Permiso e inspección', 7,
          has(/permiso|permit|inspecci/),
          'No hay permiso cargado. En NJ casi todo cambio de equipo lo requiere.');
        add('disposal', 'Disposición del equipo viejo', 7,
          has(/disposición|disposicion|retiro|reciclaje|dumpster|escombro/),
          'Falta el retiro/reciclaje del equipo existente y del refrigerante.');
      }
      if (isHeat) {
        add('heatunit', 'Equipo de calefacción', 3,
          has(/furnace|caldera|boiler|bomba de calor|heat pump|calefacc/),
          'Falta el equipo de calefacción.');
        add('flue', 'Ventilación / flue / gas', 6,
          has(/flue|ventilación|ventilacion|gas|chimenea|escape/),
          'Falta flue, ventilación de combustión o conexión de gas.');
      }
      if (isVent) {
        add('duct', 'Ductería y accesorios', 6,
          has(/ducto|duct|flex|plenum|lámina|lamina/),
          'Falta la ductería del sistema de ventilación.');
        add('fan', 'Ventilador / ERV / HRV', 3,
          has(/erv|hrv|ventilador|extractor|fan|exhaust/),
          'Falta el ventilador, ERV o HRV.');
      }
      if (isRefrig) {
        add('refunit', 'Equipo de refrigeración comercial', 3,
          has(/walk-in|reach-in|rack|vitrina|caso|congelad|refriger/),
          'Falta el equipo de refrigeración comercial.');
        add('refctrl', 'Controles y defrost', 6,
          has(/defrost|controlador|termostato|presostato|solenoide/),
          'Faltan controles, defrost o presostatos.');
      }
      if (isIAQ) {
        add('iaq', 'Filtración / UV / humidificación', 3,
          has(/filtro|filter|uv|humidific|merv|media/),
          'Falta el componente de calidad de aire.');
      }

      /* --- materiales base --- */
      if (countStage('materials') === 0) {
        add('materials', 'Materiales cargados', 6, false,
          'No hay materiales. Aunque sea mínimo: tubería, aislamiento, sellador.');
      } else {
        add('insul', 'Aislamiento de tubería / ducto', 6,
          has(/aislamiento|armaflex|armaflex|insul|wrap|burbuja/),
          'Falta aislamiento: es el olvido #1 en cotizaciones de A/C.');
        add('refrig', 'Refrigerante adicional', 6,
          has(/refrigerante|r-?410|r-?32|r-?454|r-?22/),
          'No hay refrigerante para ajuste de carga en el sitio.');
        add('weld', 'Soldadura / consumibles de instalación', 6,
          has(/soldadura|varilla|plata|flux|soplete|nitrógeno|nitrogeno/),
          'Falta soldadura, varilla o nitrógeno.');
        add('support', 'Soportería / bases / anclajes', 6,
          has(/soport|unistrut|colgador|pad|base|bracket|anclaje|vibraci/),
          'Falta soportería, base o anclajes para el equipo.');
      }

      /* --- logística e indirectos --- */
      add('freight', 'Flete / movilización', 4, countStage('freight') > 0,
        'No hay flete ni movilización: el costo se come el margen.', 'warn');
      if (c.cost > 15000) {
        add('lift', 'Equipo de acceso (plataforma / andamio)', 5,
          has(/plataforma|lift|andamio|scaffold|boom/) || countStage('indirects') > 0,
          'Proyecto grande sin equipo de acceso: revisa si necesitas plataforma.',
          'warn');
      }
      add('labor', 'Mano de obra cargada', 7, countStage('labor') > 0,
        'No hay horas de instalación. Es la partida que más se olvida.');
      }

      add('contingency', 'Contingencia ≥ 3%', 8, num(p.settings.contingencyPct) >= 3,
        'Contingencia en ' + num(p.settings.contingencyPct) + '%. Para obra, 3–8%.', 'warn');

      /* --- precios --- */
      var stale = all.filter(function (x) { return daysBetween(x.line.priceDate) > 45; });
      add('fresh', 'Precios actualizados (≤ 45 días)', 8, stale.length === 0,
        'Hay ' + stale.length + ' ítem(s) con precio de hace más de 45 días. Actualízalos antes de enviar.',
        'warn');
      var noIncludes = all.filter(function (x) { return !x.line.includes; });
      add('includes', 'Cada precio dice qué incluye', 8, noIncludes.length === 0,
        'Hay ' + noIncludes.length + ' ítem(s) sin la nota "qué incluye". Un precio sin alcance es una discusión futura.',
        'warn');

      /* --- rentabilidad y legal --- */
      add('margin', 'Margen bruto ≥ 15%', 8, c.margin >= 0.15,
        'Margen actual ' + P.util.pct(c.margin * 100) + '. Por debajo de 15% el proyecto no cubre imprevistos.',
        'warn');
      add('deposit', 'Depósito ≤ 33%', 8, num(p.settings.depositPct) <= 33,
        'Depósito de ' + num(p.settings.depositPct) + '%. La práctica del mercado en NJ es 10–33%.', 'warn');
      add('valid', 'Vigencia de la oferta definida', 8, !!p.validUntil,
        'Sin fecha de vigencia el cliente puede aceptar un precio viejo.', 'warn');
      add('st8', 'Form ST-8 firmado (capital improvement)', 8,
        p.settings.taxMode !== 'capital' || p.client.type !== 'residential' || !!p.acknowledged.st8,
        'Modo capital improvement sin ST-8: no puedes facturar la mano de obra libre de sales tax.', 'warn');
      add('hic', 'Registro HIC de la empresa', 8,
        !!S.state.company.hic || p.client.type !== 'residential',
        'Falta el número HIC (13VH…) en Empresa. Es obligatorio en contratos residenciales en NJ.');
      add('license', 'Licencia HVACR de la empresa', 8, !!S.state.company.hvacr,
        'Falta la licencia Master HVACR en Empresa.');
      add('insurance', 'Certificado de seguro', 8,
        !!S.state.company.insurance,
        'Falta el certificado de seguro (el cliente casi siempre lo pide).', 'warn');

      var ok = R.filter(function (r) { return r.status === 'ok'; }).length;
      var warn = R.filter(function (r) { return r.status === 'warn'; }).length;
      var fail = R.filter(function (r) { return r.status === 'fail'; }).length;
      var score = Math.round(((ok + warn * 0.5) / Math.max(1, R.length)) * 100);

      return { items: R, ok: ok, warn: warn, fail: fail, score: score, total: R.length, stale: stale.length, noIncludes: noIncludes.length };
    },

    /* -------------------------------------------------------------- */
    /* Catálogo                                                       */
    /* -------------------------------------------------------------- */
    searchCatalog: function (q, filters) {
      filters = filters || {};
      var term = (q || '').toLowerCase().trim();
      var supList = (filters.suppliers && filters.suppliers.length) ? filters.suppliers : null;
      return S.state.catalog.filter(function (it) {
        if (filters.cat && it.cat !== filters.cat) return false;
        if (filters.sub && it.sub !== filters.sub) return false;
        if (filters.supplier && it.supplier !== filters.supplier) return false;
        if (supList && supList.indexOf(it.supplier) < 0) return false;
        if (filters.promo && !S.activePromo(it)) return false;
        if (!term) return true;
        var hay = (it.name + ' ' + it.brand + ' ' + it.model + ' ' + it.sku + ' ' + (it.tags || []).join(' ') + ' ' + it.sub).toLowerCase();
        return term.split(/\s+/).every(function (t) { return hay.indexOf(t) >= 0; });
      });
    },

    activePromo: function (it) {
      if (!it.promo || !it.promo.price) return null;
      if (it.promo.ends && it.promo.ends < today()) return null;
      return it.promo;
    },

    effectiveCost: function (it) {
      var pr = S.activePromo(it);
      return pr ? num(pr.price) : num(it.cost);
    },

    addFromCatalog: function (pid, stage, item, qty) {
      var pr = S.activePromo(item);
      var cost = pr ? num(pr.price) : num(item.cost);
      return S.addLine(pid, stage, {
        name: item.name, brand: item.brand, model: item.model, sku: item.sku,
        supplier: item.supplier, qty: qty == null ? 1 : qty, unit: item.unit,
        unitCost: cost, includes: item.includes, excludes: item.excludes, url: item.url,
        priceDate: today(), catalogId: item.id,
        regularCost: pr ? num(item.cost) : null,
        promoEnds: pr ? pr.ends : '', promoLabel: pr ? pr.label : ''
      });
    },

    supplierName: function (id) {
      var s = S.state.suppliers.filter(function (x) { return x.id === id; })[0];
      return s ? s.short : (id || '—');
    },

    supplier: function (id) {
      return S.state.suppliers.filter(function (x) { return x.id === id; })[0] || null;
    },

    /* -------------------------------------------------------------- */
    /* Ofertas / deals                                                */
    /* -------------------------------------------------------------- */
    activeDeals: function () {
      return S.state.catalog
        .filter(function (it) { return !!S.activePromo(it); })
        .map(function (it) {
          var pr = S.activePromo(it);
          return {
            item: it, promo: pr,
            regular: num(it.cost),
            price: num(pr.price),
            saving: num(it.cost) - num(pr.price),
            savingPct: num(it.cost) > 0 ? (1 - num(pr.price) / num(it.cost)) : 0,
            daysLeft: pr.ends ? daysBetween(today(), pr.ends) : null
          };
        })
        .sort(function (a, b) { return b.savingPct - a.savingPct; });
    },

    /* Sugerencias de oferta relevantes para un proyecto */
    dealSuggestions: function (p) {
      var used = {};
      P.STAGES.forEach(function (s) {
        (p.lines[s.id] || []).forEach(function (l) { if (l.catalogId) used[l.catalogId] = 1; });
      });
      var scopes = p.scope || [];
      var sel = (p.selectedSuppliers && p.selectedSuppliers.length) ? p.selectedSuppliers : null;
      return S.activeDeals().filter(function (d) {
        if (used[d.item.id]) return false;
        if (sel && sel.indexOf(d.item.supplier) < 0) return false;
        if (d.item.cat === 'equipment') {
          if (d.item.sub === 'heat') return scopes.indexOf('heat') >= 0;
          if (d.item.sub === 'vent') return scopes.indexOf('vent') >= 0;
          if (d.item.sub === 'controls') return scopes.indexOf('controls') >= 0 || scopes.indexOf('ac') >= 0;
          return scopes.indexOf('ac') >= 0 || scopes.indexOf('maint') >= 0;
        }
        return true;
      });
    },

    /* -------------------------------------------------------------- */
    /* Import / export                                                */
    /* -------------------------------------------------------------- */
    exportJSON: function () {
      return JSON.stringify(S.state, null, 2);
    },

    importJSON: function (text) {
      var obj = JSON.parse(text);
      if (!obj || !obj.projects) throw new Error('El archivo no parece un respaldo de Project_Catcher_Plus.');
      S.state = S.migrate(obj);
      S.save();
      return S.state;
    },

    csvEscape: function (v) {
      var s = String(v == null ? '' : v);
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    },

    catalogCSV: function () {
      var head = ['id', 'cat', 'sub', 'name', 'brand', 'model', 'unit', 'cost', 'supplier', 'sku', 'includes', 'promoPrice', 'promoEnds'];
      var rows = S.state.catalog.map(function (it) {
        return [it.id, it.cat, it.sub, it.name, it.brand, it.model, it.unit, it.cost, it.supplier, it.sku, it.includes,
          it.promo ? it.promo.price : '', it.promo ? it.promo.ends : ''];
      });
      return [head].concat(rows).map(function (r) { return r.map(S.csvEscape).join(','); }).join('\n');
    },

    importCatalogCSV: function (text) {
      var lines = String(text).replace(/\r/g, '').split('\n').filter(function (l) { return l.trim(); });
      if (!lines.length) return 0;
      var head = lines[0].split(',').map(function (h) { return h.trim().toLowerCase(); });
      var count = 0;
      for (var i = 1; i < lines.length; i++) {
        var cols = S.parseCSVLine(lines[i]);
        var o = {};
        head.forEach(function (h, idx) { o[h] = (cols[idx] || '').trim(); });
        if (!o.name) continue;
        var existing = S.state.catalog.filter(function (x) { return x.id === o.id; })[0];
        var rec = {
          id: o.id || uid('cat'),
          cat: o.cat || 'materials',
          sub: o.sub || 'misc',
          name: o.name,
          brand: o.brand || '',
          model: o.model || '',
          unit: o.unit || 'ea',
          cost: num(o.cost),
          supplier: o.supplier || 'manual',
          sku: o.sku || '',
          includes: o.includes || '',
          excludes: '',
          url: '',
          tags: [],
          promo: o.promoprice ? { price: num(o.promoprice), ends: o.promoends || '', label: 'Importada' } : null,
          demo: false,
          updated: today()
        };
        if (existing) { Object.assign(existing, rec); } else { S.state.catalog.push(rec); }
        count++;
      }
      S.save();
      return count;
    },

    parseCSVLine: function (line) {
      var out = [], cur = '', inQ = false;
      for (var i = 0; i < line.length; i++) {
        var ch = line[i];
        if (inQ) {
          if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
          else if (ch === '"') { inQ = false; }
          else { cur += ch; }
        } else {
          if (ch === '"') inQ = true;
          else if (ch === ',') { out.push(cur); cur = ''; }
          else cur += ch;
        }
      }
      out.push(cur);
      return out;
    }
  };

  P.store = S;
})(window.PCP);
