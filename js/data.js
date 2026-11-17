/* =====================================================================
   Project_Catcher_Plus — Datos base
   Catálogo semilla (precios de EJEMPLO), proveedores, plantillas NJ.
   Los precios marcados demo:true deben reemplazarse con cotización real.
   ===================================================================== */
window.PCP = window.PCP || {};
(function (P) {
  'use strict';

  P.VERSION = '1.0.0';
  P.CURRENCY = 'USD';
  P.STATE = 'NJ';

  /* ---------------------------------------------------------------- */
  /* Unidades                                                          */
  /* ---------------------------------------------------------------- */
  P.UNITS = ['ea', 'ft', 'lb', 'hr', 'day', 'wk', 'lot', 'set', 'gal', 'box', 'roll', 'sqft', 'ton'];

  /* ---------------------------------------------------------------- */
  /* Etapas del presupuesto                                            */
  /* ---------------------------------------------------------------- */
  P.STAGES = [
    { id: 'equipment', label: 'Equipos', icon: '❄', color: '#1B6CA8',
      hint: 'Unidades, accesorios y controles que se instalan.' },
    { id: 'freight', label: 'Fletes y logística', icon: '🚚', color: '#0E7C7B',
      hint: 'Entrega, izaje, almacenaje y movilización al proyecto.' },
    { id: 'indirects', label: 'Rentas e indirectos', icon: '🏗', color: '#8A5A00',
      hint: 'Grúas, plataformas, herramientas, baños, oficina de obra.' },
    { id: 'materials', label: 'Materiales', icon: '🔧', color: '#2F6B3A',
      hint: 'Tubería, aislamiento, refrigerante, soldadura, soportería, eléctrico, civil.' },
    { id: 'labor', label: 'Mano de obra y servicios', icon: '👷', color: '#7A3E8F',
      hint: 'Horas de instalación, permisos, comisionamiento, disposición.' },
    { id: 'other', label: 'Otros y contingencias', icon: '📄', color: '#5B6472',
      hint: 'Imprevistos, garantías extendidas, fianzas, varios.' }
  ];

  /* ---------------------------------------------------------------- */
  /* Alcances del proyecto                                             */
  /* ---------------------------------------------------------------- */
  P.SCOPES = [
    { id: 'ac',     label: 'Aire acondicionado',        desc: 'Split, paquete, mini-split, VRF' },
    { id: 'heat',   label: 'Calefacción',               desc: 'Furnace, bomba de calor, caldera' },
    { id: 'vent',   label: 'Ventilación',               desc: 'Ductos, ERV/HRV, extracción' },
    { id: 'refrig', label: 'Refrigeración comercial',   desc: 'Walk-in, reach-in, racks' },
    { id: 'controls', label: 'Controles y automatización', desc: 'Termostatos, BMS, zonificación' },
    { id: 'duct',   label: 'Ductería y aislamiento',    desc: 'Suministro, retorno, sellado' },
    { id: 'iaq',    label: 'Calidad de aire interior',  desc: 'Filtración, UV, humidificación' },
    { id: 'maint',  label: 'Mantenimiento / reparación', desc: 'Servicio (no capital improvement)' }
  ];

  P.CLIENT_TYPES = [
    { id: 'residential', label: 'Residencial' },
    { id: 'commercial',  label: 'Comercial' },
    { id: 'industrial',  label: 'Industrial' }
  ];

  /* ---------------------------------------------------------------- */
  /* Subcategorías / agrupaciones                                      */
  /* ---------------------------------------------------------------- */
  P.MAT_SUBS = [
    { id: 'fontaneria', label: 'Fontanería y drenajes HVAC (PVC y condensados)', labelEn: 'HVAC plumbing & drains (PVC and condensate)', icon: '🚰' },
    { id: 'pipe',       label: 'Tuberías de cobre y line sets de refrigeración', labelEn: 'Copper tubing & refrigerant line sets', icon: '🧵' },
    { id: 'duct',       label: 'Ductería, rejillas y distribución de aire', labelEn: 'Ductwork, grilles & air distribution', icon: '🌬️' },
    { id: 'elec',       label: 'Eléctrico y protección', labelEn: 'Electrical & protection', icon: '⚡' },
    { id: 'controls',   label: 'Controles, cableado y termostatos', labelEn: 'Controls, wiring & thermostats', icon: '🎛️' },
    { id: 'insul',      label: 'Aislamientos y sellos térmicos', labelEn: 'Insulation & thermal sealing', icon: '🧊' },
    { id: 'refrig',     label: 'Refrigerantes, vacío y consumibles', labelEn: 'Refrigerants, vacuum & consumables', icon: '🧪' },
    { id: 'support',    label: 'Soportería, herrajes y fijaciones', labelEn: 'Supports, hardware & fasteners', icon: '🔩' },
    { id: 'iaq',        label: 'Filtración y calidad de aire (IAQ)', labelEn: 'Filtration & indoor air quality (IAQ)', icon: '🫧' },
    { id: 'civil',      label: 'Bases, pads y montaje de equipos', labelEn: 'Pads, bases & equipment mounting', icon: '🏗️' },
    { id: 'paint',      label: 'Químicos, limpieza y selladores', labelEn: 'Chemicals, cleaning & sealants', icon: '🧴' },
    { id: 'safety',     label: 'Seguridad, EPP y señalización', labelEn: 'Safety, PPE & signage', icon: '🦺' },
    { id: 'misc',       label: 'Varios y consumibles generales', labelEn: 'Miscellaneous & general supplies', icon: '📦' }
  ];

  /* Marcas de equipos (para agrupar y mostrar logo real cuando esté disponible) */
  P.BRANDS = [
    { id: 'goodman',   name: 'Goodman',       color: '#111827', short: 'G',  domain: 'goodmanmfg.com',        logo: 'https://logo.clearbit.com/goodmanmfg.com' },
    { id: 'mrcool',    name: 'MRCOOL',        color: '#0ea5e9', short: 'MC', domain: 'mrcool.com',            logo: 'https://logo.clearbit.com/mrcool.com' },
    { id: 'google',    name: 'Google Nest',   color: '#4285F4', short: 'N',  domain: 'store.google.com',      logo: 'https://logo.clearbit.com/google.com' },
    { id: 'honeywell', name: 'Honeywell',     color: '#c8102e', short: 'H',  domain: 'honeywellhome.com',     logo: 'https://logo.clearbit.com/honeywell.com' },
    { id: 'ecobee',    name: 'ecobee',        color: '#16a34a', short: 'e',  domain: 'ecobee.com',            logo: 'https://logo.clearbit.com/ecobee.com' },
    { id: 'carrier',   name: 'Carrier',       color: '#004b87', short: 'C',  domain: 'carrier.com',           logo: 'https://logo.clearbit.com/carrier.com' },
    { id: 'trane',     name: 'Trane',         color: '#c2410c', short: 'T',  domain: 'trane.com',             logo: 'https://logo.clearbit.com/trane.com' },
    { id: 'lennox',    name: 'Lennox',        color: '#b91c1c', short: 'L',  domain: 'lennox.com',            logo: 'https://logo.clearbit.com/lennox.com' },
    { id: 'rheem',     name: 'Rheem',         color: '#c8102e', short: 'R',  domain: 'rheem.com',             logo: 'https://logo.clearbit.com/rheem.com' },
    { id: 'daikin',    name: 'Daikin',        color: '#0097e0', short: 'D',  domain: 'daikincomfort.com',     logo: 'https://logo.clearbit.com/daikin.com' },
    { id: 'mitsubishi',name: 'Mitsubishi',    color: '#e60012', short: 'M',  domain: 'mitsubishicomfort.com', logo: 'https://logo.clearbit.com/mitsubishielectric.com' },
    { id: 'lg',        name: 'LG',            color: '#a50034', short: 'LG', domain: 'lg.com',                logo: 'https://logo.clearbit.com/lg.com' },
    { id: 'bosch',     name: 'Bosch',         color: '#ea0016', short: 'B',  domain: 'bosch-homecomfort.com', logo: 'https://logo.clearbit.com/bosch.com' },
    { id: 'fujitsu',   name: 'Fujitsu',       color: '#e60012', short: 'F',  domain: 'fujitsugeneral.com',    logo: 'https://logo.clearbit.com/fujitsu.com' },
    { id: 'york',      name: 'YORK',          color: '#003087', short: 'Y',  domain: 'york.com',              logo: 'https://logo.clearbit.com/york.com' },
    { id: 'other',     name: 'Otras marcas',  labelEn: 'Other brands', color: '#64748b', short: '•',  domain: '', logo: '' }
  ];
  P.brandByName = function(name){
    name = String(name||'').toLowerCase();
    if (!name) return P.BRANDS[P.BRANDS.length-1];
    for (var i=0;i<P.BRANDS.length;i++){ var b=P.BRANDS[i]; if (name.indexOf(b.id)>=0 || name.indexOf(b.name.toLowerCase())>=0) return b; }
    return P.BRANDS[P.BRANDS.length-1];
  };
  P.subLabel = function(id){
    var en = (P.i18n && P.i18n.lang && P.i18n.lang() === 'en');
    for (var i=0;i<P.MAT_SUBS.length;i++) if (P.MAT_SUBS[i].id===id) return (en && P.MAT_SUBS[i].labelEn) ? P.MAT_SUBS[i].labelEn : P.MAT_SUBS[i].label;
    var mapEs = { freight:'Fletes y logística', rental:'Rentas y equipos', labor:'Mano de obra', permit:'Permisos y gestión', service:'Servicios y puesta en marcha', ac:'Aire acondicionado', heat:'Calefacción', vent:'Ventilación', refrig:'Refrigeración', duct:'Ductería', iaq:'Calidad de aire', controls:'Controles', fontaneria:'Fontanería y drenajes HVAC' };
    var mapEn = { freight:'Freight & logistics', rental:'Rentals & equipment', labor:'Labor', permit:'Permits & management', service:'Services & commissioning', ac:'Air conditioning', heat:'Heating', vent:'Ventilation', refrig:'Refrigeration', duct:'Ductwork', iaq:'Indoor air quality', controls:'Controls', fontaneria:'HVAC plumbing & drains' };
    return (en ? mapEn[id] : mapEs[id]) || mapEs[id] || id || 'General';
  };
  P.subIcon = function(id){
    for (var i=0;i<P.MAT_SUBS.length;i++) if (P.MAT_SUBS[i].id===id) return P.MAT_SUBS[i].icon || '📦';
    var map = { freight:'🚚', rental:'🏗️', labor:'👷', permit:'📄', service:'🛠️', ac:'❄️', heat:'🔥', vent:'🌬️', refrig:'🧊', duct:'🌬️', iaq:'🫧', controls:'🎛️', fontaneria:'🚰' };
    return map[id] || '📦';
  };

  /* ---------------------------------------------------------------- */
  /* Proveedores (NJ)                                                  */
  /* El email se deja vacío a propósito: se completa una vez y queda   */
  /* guardado. "verify" indica que debe confirmarse con la sucursal.   */
  /* ---------------------------------------------------------------- */
  P.SUPPLIERS = [
    { id: 'homedepot', name: 'The Home Depot — Pro Desk', short: 'Home Depot', email: '', emailStatus: 'pending',
      phone: '', quoteUrl: 'https://www.homedepot.com/c/Pro_Desk', contactUrl: 'https://www.homedepot.com/l/store-finder',
      domain: 'homedepot.com', logo: 'https://logo.clearbit.com/homedepot.com',
      note: 'Pro Desk de la sucursal. Pedir precio de proyecto (Pro Xtra).' },
    { id: 'lowes', name: "Lowe's — Pro", short: "Lowe's", email: '', emailStatus: 'pending',
      phone: '', quoteUrl: 'https://www.lowes.com/l/pro', contactUrl: 'https://www.lowes.com/store/',
      domain: 'lowes.com', logo: 'https://logo.clearbit.com/lowes.com',
      note: "Lowe's Pro de la sucursal." },
    { id: 'grainger', name: 'Grainger', short: 'Grainger', email: '', emailStatus: 'pending',
      phone: '', quoteUrl: 'https://www.grainger.com/quote', contactUrl: 'https://www.grainger.com/branch',
      domain: 'grainger.com', logo: 'https://logo.clearbit.com/grainger.com',
      note: 'Cotización en línea o branch local.' },
    { id: 'ferguson', name: 'Ferguson HVAC', short: 'Ferguson', email: '', emailStatus: 'pending',
      phone: '', quoteUrl: 'https://www.ferguson.com/', contactUrl: 'https://www.ferguson.com/store',
      domain: 'ferguson.com', logo: 'https://logo.clearbit.com/ferguson.com',
      note: 'Distribuidor HVAC; cuenta comercial.' },
    { id: 'johnstone', name: 'Johnstone Supply', short: 'Johnstone', email: '', emailStatus: 'pending',
      phone: '', quoteUrl: 'https://www.johnstonesupply.com/', contactUrl: 'https://www.johnstonesupply.com/storefront/storeLocator.jsp',
      domain: 'johnstonesupply.com', logo: 'https://logo.clearbit.com/johnstonesupply.com',
      note: 'Mayorista HVAC/R.' },
    { id: 'supplyhouse', name: 'SupplyHouse.com', short: 'SupplyHouse', email: '', emailStatus: 'pending',
      phone: '', quoteUrl: 'https://www.supplyhouse.com/', contactUrl: 'https://www.supplyhouse.com/contact-us',
      domain: 'supplyhouse.com', logo: 'https://logo.clearbit.com/supplyhouse.com',
      note: 'Precio en línea, envío NJ.' },
    { id: 'carrier', name: 'Carrier Enterprise', short: 'Carrier Ent.', email: '', emailStatus: 'pending',
      phone: '', quoteUrl: 'https://www.carrierenterprise.com/', contactUrl: 'https://www.carrierenterprise.com/locations',
      domain: 'carrierenterprise.com', logo: 'https://logo.clearbit.com/carrierenterprise.com',
      note: 'Distribuidor Carrier / Bryant.' },
    { id: 'united', name: 'United Rentals', short: 'United Rentals', email: '', emailStatus: 'pending',
      phone: '', quoteUrl: 'https://www.unitedrentals.com/', contactUrl: 'https://www.unitedrentals.com/locations',
      domain: 'unitedrentals.com', logo: 'https://logo.clearbit.com/unitedrentals.com',
      note: 'Rentas: plataformas, grúas, herramientas.' },
    { id: 'sunbelt', name: 'Sunbelt Rentals', short: 'Sunbelt', email: '', emailStatus: 'pending',
      phone: '', quoteUrl: 'https://www.sunbeltrentals.com/', contactUrl: 'https://www.sunbeltrentals.com/locations/',
      domain: 'sunbeltrentals.com', logo: 'https://logo.clearbit.com/sunbeltrentals.com',
      note: 'Rentas y equipos especiales.' },
    { id: 'homedepotrental', name: 'Home Depot Rental', short: 'HD Rental', email: '', emailStatus: 'pending',
      phone: '', quoteUrl: 'https://www.homedepot.com/c/tool_and_truck_rental', contactUrl: 'https://www.homedepot.com/l/store-finder',
      domain: 'homedepot.com', logo: 'https://logo.clearbit.com/homedepot.com',
      note: 'Renta de herramientas y camiones por hora/día.' },
    { id: 'local', name: 'Proveedor local (NJ)', short: 'Local', email: '', emailStatus: 'pending',
      phone: '', quoteUrl: '', contactUrl: '', domain: '', logo: '',
      note: 'Distribuidor local: se define en Empresa → Proveedores.' },
    { id: 'manual', name: 'Cotización manual / cliente', short: 'Manual', email: '', emailStatus: 'pending',
      phone: '', quoteUrl: '', contactUrl: '', domain: '', logo: '',
      note: 'Precio tomado de una cotización existente o dado por el cliente.' }
  ];

  P.supplierMeta = function (id) {
    var list = P.SUPPLIERS || [];
    for (var i = 0; i < list.length; i++) { if (list[i].id === id) return list[i]; }
    return { id: id, short: id || '', name: id || '', domain: '', logo: '' };
  };

  /* ---------------------------------------------------------------- */
  /* Catálogo semilla                                                  */
  /* ------------------------------------------------------------------
     it(id, cat, sub, name, brand, model, unit, cost, supplier, sku,
        includes, opts)
     opts: { promo:{price, ends, label}, tags:[], url, demo:false }
     ------------------------------------------------------------------ */
  function it(id, cat, sub, name, brand, model, unit, cost, supplier, sku, includes, opts) {
    opts = opts || {};
    return {
      id: id, cat: cat, sub: sub || '', name: name,
      brand: brand || '', model: model || '', unit: unit,
      cost: cost, supplier: supplier, sku: sku || '',
      includes: includes || '',
      excludes: opts.excludes || '',
      url: opts.url || '',
      img: opts.img || '',
      icon: opts.icon || '',
      source: opts.source || '', // referencia: Home Depot / Grainger / etc.
      tags: opts.tags || [],
      promo: opts.promo || null,
      demo: opts.demo !== false,
      updated: opts.updated || '2026-11-15',
      live: opts.live || false
    };
  }

  // Precios de REFERENCIA (listados públicos típicos Home Depot / Grainger / distribuidores).
  // Confirmar/actualizar con cotización real de sucursal/proveedor en NJ antes de enviar oferta.
  P.CATALOG = [
    /* ---- EQUIPOS (agrupados por marca) ---- */
    it('eq-cond-2','equipment','ac','Condensadora split 2 ton, 14.3 SEER2','Goodman','GSXH502410','ea',1185,'ferguson','GSXH502410','Unidad exterior R-410A; placa de datos y garantía de compresor según fabricante.',{icon:'❄️',tags:['split','2 ton'],source:'Ferguson/distribuidor ref.',url:'https://www.ferguson.com/'}),
    it('eq-cond-3','equipment','ac','Condensadora split 3 ton, 14.3 SEER2','Goodman','GSXH503610','ea',1395,'ferguson','GSXH503610','Unidad exterior R-410A; conexiones de servicio y gabinete intemperie.',{icon:'❄️',tags:['split','3 ton'],source:'Ferguson/distribuidor ref.',url:'https://www.ferguson.com/'}),
    it('eq-cond-4','equipment','ac','Condensadora split 4 ton, 14.3 SEER2','Goodman','GSXH504810','ea',1595,'ferguson','GSXH504810','Unidad exterior R-410A; eficiencia SEER2 según etiqueta.',{icon:'❄️',tags:['split','4 ton'],source:'Ferguson/distribuidor ref.',url:'https://www.ferguson.com/'}),
    it('eq-cond-5','equipment','ac','Condensadora split 5 ton, 14.3 SEER2','Goodman','GSXH506010','ea',1825,'ferguson','GSXH506010','Unidad exterior R-410A para sistema split central.',{icon:'❄️',tags:['split','5 ton'],source:'Ferguson/distribuidor ref.',url:'https://www.ferguson.com/'}),
    it('eq-ah-3','equipment','ac','Air handler 3 ton, multi-posición','Goodman','AMST36CU1400','ea',845,'ferguson','AMST36CU1400','Manejadora interior, motor ECM, preparado para TXV.',{icon:'🌀',tags:['air handler','3 ton'],source:'Ferguson/distribuidor ref.',url:'https://www.ferguson.com/'}),
    it('eq-ah-4','equipment','ac','Air handler 4 ton, multi-posición','Goodman','AMST48CU1400','ea',945,'ferguson','AMST48CU1400','Manejadora interior multi-posición con blower ECM.',{icon:'🌀',tags:['air handler','4 ton'],source:'Ferguson/distribuidor ref.',url:'https://www.ferguson.com/'}),
    it('eq-coil-3','equipment','ac','Evaporador cased 3 ton (R-410A)','Goodman','CAPTA3626B3','ea',545,'ferguson','CAPTA3626B3','Coil en gabinete con TXV instalado (según modelo).',{icon:'🧊',tags:['coil','3 ton'],source:'Ferguson/distribuidor ref.',url:'https://www.ferguson.com/'}),
    it('eq-hp-3','equipment','heat','Bomba de calor 3 ton, 15 SEER2','Goodman','GSZB403610','ea',2240,'johnstone','GSZB403610','Unidad exterior heat pump, operación frío/calor.',{icon:'🔥',tags:['heat pump','3 ton'],source:'Johnstone/distribuidor ref.',url:'https://www.johnstonesupply.com/'}),
    it('eq-furn-80','equipment','heat','Furnace gas 80k BTU, 96% AFUE','Goodman','GM9S960803BN','ea',1245,'ferguson','GM9S960803BN','Caldera/furnace a gas alta eficiencia (según modelo).',{icon:'🔥',tags:['furnace','gas'],source:'Ferguson/distribuidor ref.',url:'https://www.ferguson.com/'}),

    it('eq-ms-12','equipment','ac','Mini-split inverter 12,000 BTU (1 zona)','MRCOOL','DIY-12-HP-230C','set',1298,'homedepot','DIY-12-HP-230C','Equipo interior + exterior, control remoto; kit pre-cargado según modelo.',{icon:'❄️',tags:['mini-split','12k'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/MRCOOL%20DIY-12-HP-230C'}),
    it('eq-ms-18','equipment','ac','Mini-split inverter 18,000 BTU (1 zona)','MRCOOL','DIY-18-HP-230C','set',1698,'homedepot','DIY-18-HP-230C','Equipo interior + exterior, control remoto y accesorios básicos.',{icon:'❄️',tags:['mini-split','18k'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/MRCOOL%20DIY-18-HP-230C'}),
    it('eq-ms-24','equipment','ac','Mini-split inverter 24,000 BTU (1 zona)','MRCOOL','DIY-24-HP-230C','set',2198,'homedepot','DIY-24-HP-230C','Sistema inverter 2 ton aprox.; verificar kit y línea incluidos.',{icon:'❄️',tags:['mini-split','24k'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/MRCOOL%20DIY-24-HP-230C'}),

    it('eq-therm-nest','equipment','controls','Termostato inteligente Nest Learning','Google Nest','T3021US','ea',249,'homedepot','T3021US','Termostato Wi-Fi, base y accesorios de montaje.',{icon:'🎛️',tags:['termostato','smart'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/Nest%20Learning%20Thermostat'}),
    it('eq-therm-honey','equipment','controls','Termostato programable T6 Pro','Honeywell','TH6220WF2006','ea',119,'grainger','TH6220WF2006','Termostato Wi-Fi programable con placa y tornillería.',{icon:'🎛️',tags:['termostato'],source:'Grainger ref.',url:'https://www.grainger.com/search?searchQuery=TH6220WF2006'}),
    it('eq-therm-eco','equipment','controls','Termostato inteligente ecobee Smart','ecobee','EB-STATE6L-01','ea',169,'homedepot','EB-STATE6L-01','Termostato Wi-Fi con sensor (según paquete).',{icon:'🎛️',tags:['termostato','smart'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/ecobee%20Smart%20Thermostat'}),

    /* ---- MATERIALES: tuberías, cobre y drenaje ---- */
    it('mt-ls-3858-25','materials','pipe','Line set mini-split 3/8" x 5/8", 25 ft','VEVOR/Generic','LS-3858-25','ea',89,'homedepot','','Cobre aislado 3/8" LL x 5/8" SL, 25 ft.',{icon:'🧵',tags:['line set','cobre'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/mini%20split%20line%20set%203%208%205%208%2025'}),
    it('mt-ls-3858-50','materials','pipe','Line set 3/8" x 5/8", 50 ft (con aislamiento)','MRCOOL','MC50-3858','ea',159,'homedepot','MC50-3858','Cobre pre-aislado 3/8" x 5/8", 50 ft.',{icon:'🧵',tags:['line set','cobre'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/MRCOOL%20MC50-3858'}),
    it('mt-ls-3878-50','materials','pipe','Line set 3/8" x 7/8", 50 ft (aislado)','Mueller/ICOOL','LS-3878-50','ea',239,'supplyhouse','','Cobre ACR 3/8" LL x 7/8" SL, 50 ft.',{icon:'🧵',tags:['line set','cobre','3-5 ton'],source:'SupplyHouse ref.',url:'https://www.supplyhouse.com/'}),
    it('mt-ls-1438-25','materials','pipe','Line set 1/4" x 3/8", 25 ft','VEVOR/Generic','LS-1438-25','ea',69,'homedepot','','Cobre aislado para mini-split pequeño.',{icon:'🧵',tags:['line set'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/mini%20split%20line%20set%201%204%203%208'}),
    it('mt-copper-38','materials','pipe','Tubería de cobre ACR 3/8" x 10 ft','Mueller','ACR-38-10','ea',32.50,'supplyhouse','','Tubo de cobre rígido tipo ACR, 10 ft.',{icon:'🧵',tags:['cobre'],source:'SupplyHouse/Ferguson ref.',url:'https://www.supplyhouse.com/'}),
    it('mt-copper-34','materials','pipe','Tubería de cobre ACR 3/4" x 10 ft','Mueller','ACR-34-10','ea',62.00,'supplyhouse','','Tubo de cobre rígido tipo ACR, 10 ft.',{icon:'🧵',tags:['cobre'],source:'SupplyHouse/Ferguson ref.',url:'https://www.supplyhouse.com/'}),
    it('mt-pvc-34','materials','fontaneria','PVC 3/4" x 10 ft Schedule 40','Charlotte Pipe','PVC-34-10','ea',6.48,'homedepot','PVC040070600','PVC Schedule 40 para drenaje de condensado.',{icon:'🧵',tags:['pvc','drenaje'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/3%204%20in%20PVC%20Schedule%2040%20Pipe'}),
    it('mt-condensate-kit','materials','fontaneria','Kit de drenaje de condensado (trampa y fittings)','RectorSeal/Generic','COND-KIT','set',24.98,'homedepot','','Trampa, codos y adaptadores básicos (sin bomba).',{icon:'💧',tags:['drenaje'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/condensate%20drain%20kit'}),
    it('mt-cond-trap','materials','fontaneria','Trampa de condensado PVC con cleanout','RectorSeal','EZT-113B','ea',12.98,'supplyhouse','EZT-113B','Trampa transparente para línea de condensado.',{icon:'💧',tags:['drenaje'],source:'SupplyHouse ref.',url:'https://www.supplyhouse.com/'}),

    /* ---- AISLAMIENTOS ---- */
    it('mt-insul-38','materials','insul','Aislamiento elastomérico 3/8" x 6 ft (pared 3/8")','Armacell/Generic','AP03838','ea',4.98,'homedepot','','Aislamiento tubular para línea de succión.',{icon:'🧊',tags:['aislamiento'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/pipe%20insulation%203%208'}),
    it('mt-insul-58','materials','insul','Aislamiento elastomérico 5/8" x 6 ft','Armacell/Generic','AP05838','ea',5.98,'homedepot','','Aislamiento tubular de espuma elastomérica.',{icon:'🧊',tags:['aislamiento'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/pipe%20insulation%205%208'}),
    it('mt-insul-tape','materials','insul','Cinta de aislamiento foam/UV wrap 2" x 30 ft','Frost King','FV30','roll',8.48,'homedepot','','Cinta aislante para exteriores y uniones.',{icon:'🧊',tags:['aislamiento','cinta'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/foam%20insulation%20tape'}),

    /* ---- REFRIGERANTES Y CONSUMIBLES ---- */
    it('mt-r410','materials','refrig','Refrigerante R-410A, 25 lb (cilindro retornable)','Chemours/Forane','R410A-25','ea',159,'johnstone','R410A-25','Cilindro 25 lb; precio sujeto a mercado. Verificar disponibilidad.',{icon:'🧪',tags:['refrigerante'],source:'Johnstone/distribuidor ref.',url:'https://www.johnstonesupply.com/'}),
    it('mt-r454b','materials','refrig','Refrigerante R-454B, 20 lb (A2L)','Chemours','R454B-20','ea',229,'johnstone','R454B-20','Refrigerante A2L de baja GWP; manejo según normativa.',{icon:'🧪',tags:['refrigerante','a2l'],source:'Johnstone/distribuidor ref.',url:'https://www.johnstonesupply.com/'}),
    it('mt-nitrogen','materials','refrig','Nitrógeno 40 cu ft (cambio/renta cilindro)','Airgas/Local','NI-40','ea',48,'local','NI-40','Para purga, prueba de presión y barrido.',{icon:'🧪',tags:['nitrógeno'],source:'Proveedor local ref.'}),
    it('mt-brazing-kit','materials','refrig','Kit soldadura plata/brazing (varilla y fundente)','Harris/Generic','BRAZE-KIT','set',34.95,'grainger','','Varillas y fundente para soldadura de cobre (consumible).',{icon:'🔥',tags:['soldadura','brazing'],source:'Grainger ref.',url:'https://www.grainger.com/search?searchQuery=brazing%20rod%20kit'}),
    it('mt-map-gas','materials','refrig','Cilindro MAP-Pro gas para soldadura','Bernzomatic','MAP-PRO','ea',11.98,'homedepot','','Gas combustible para antorcha (consumible).',{icon:'🔥',tags:['soldadura'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/MAP-Pro'}),

    /* ---- PINTURA Y ADITIVOS ---- */
    it('mt-uv-paint','materials','paint','Pintura/sellador UV para aislamiento exterior','RectorSeal/Generic','UV-PAINT-QT','ea',24.95,'grainger','','Protección UV para aislamiento y líneas expuestas (1 qt).',{icon:'🎨',tags:['pintura','uv'],source:'Grainger ref.',url:'https://www.grainger.com/search?searchQuery=uv%20insulation%20coating'}),
    it('mt-coil-clean','materials','paint','Limpiador de serpentín (coil cleaner), 1 gal','Nu-Calgon','4168-08','ea',18.50,'supplyhouse','4168-08','Limpiador químico para evaporador/condensador.',{icon:'🎨',tags:['químico','limpieza'],source:'SupplyHouse ref.',url:'https://www.supplyhouse.com/'}),
    it('mt-pan-tabs','materials','paint','Tabletas tratadoras de condensado (pan tabs)','Nu-Calgon','4295-24','box',14.95,'supplyhouse','4295-24','Prevención de lodo/obstrucción en bandeja de drenaje.',{icon:'🎨',tags:['aditivo','drenaje'],source:'SupplyHouse ref.',url:'https://www.supplyhouse.com/'}),
    it('mt-thread-seal','materials','paint','Sellador de roscas / pipe dope','RectorSeal','25790','ea',8.98,'homedepot','','Sellador para conexiones roscadas de gas/agua (según uso).',{icon:'🎨',tags:['sellador'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/pipe%20thread%20sealant'}),

    /* ---- SOPORTERÍA (barras roscadas, tornillería, strut) ---- */
    it('mt-thread-rod','materials','support','Barra roscada 3/8" x 10 ft (galvanizada)','Superstrut/Generic','TR-38-10','ea',11.48,'homedepot','','Varilla roscada para suspensión de ductos/equipos.',{icon:'🔩',tags:['barra roscada','strut'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/3%208%20threaded%20rod%2010%20ft'}),
    it('mt-thread-rod-12','materials','support','Barra roscada 1/2" x 10 ft (galvanizada)','Superstrut/Generic','TR-12-10','ea',16.98,'homedepot','','Varilla roscada de mayor capacidad.',{icon:'🔩',tags:['barra roscada'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/1%202%20threaded%20rod'}),
    it('mt-nut-washer-38','materials','support','Kit tuercas y arandelas 3/8" (pack)','Everbilt/Generic','NW-38','box',9.98,'homedepot','','Tuercas hexagonales y arandelas planas galvanizadas.',{icon:'🔩',tags:['tornillería'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/3%208%20nut%20washer'}),
    it('mt-strut-10','materials','support','Canal strut 1-5/8" x 10 ft','Superstrut','A1200HS-10','ea',29.98,'homedepot','','Canal metálico tipo strut para soporte.',{icon:'🔩',tags:['strut','soporte'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/strut%20channel%2010%20ft'}),
    it('mt-strut-clamp','materials','support','Abrazaderas/cushion clamps para tubería (set)','Unistrut/Generic','CLAMP-SET','set',18.50,'grainger','','Abrazaderas con aislación para líneas y tuberías.',{icon:'🔩',tags:['abrazadera'],source:'Grainger ref.',url:'https://www.grainger.com/search?searchQuery=cushion%20clamp'}),
    it('mt-unistrut-hdwr','materials','support','Herrajes para strut (tuercas resorte, pernos)','Superstrut','STRUT-HW','box',22.00,'grainger','','Conjunto de accesorios para montaje en strut.',{icon:'🔩',tags:['strut','tornillería'],source:'Grainger ref.',url:'https://www.grainger.com/search?searchQuery=strut%20hardware'}),
    it('mt-pad-36','materials','civil','Base de equipo (equipment pad) 36" x 36"','E-Lite/Generic','UC3636-3','ea',54.98,'homedepot','','Base prefabricada para condensadora.',{icon:'🧱',tags:['pad','base'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/equipment%20pad%2036x36'}),
    it('mt-bracket','materials','civil','Soporte de pared para mini-split (bracket)','MRCOOL/Generic','MB440A','set',69.00,'homedepot','','Soportes de montaje para unidad exterior.',{icon:'🧱',tags:['soporte','mini-split'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/mini%20split%20wall%20bracket'}),
    it('mt-vibra','materials','civil','Pads antivibración (juego x4)','DiversiTech','MP-2E','set',18.50,'supplyhouse','','Almohadillas de goma para reducir vibración.',{icon:'🧱',tags:['vibración'],source:'SupplyHouse ref.',url:'https://www.supplyhouse.com/'}),
    it('mt-anchors','materials','support','Tornillos y anclajes para concreto/mampostería (kit)','Tapcon/Generic','ANCHOR-KIT','box',16.98,'homedepot','','Anclajes y tornillería para fijaciones.',{icon:'🔩',tags:['tornillería','anclaje'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/concrete%20anchor%20kit'}),

    /* ---- ELÉCTRICO Y PROTECCIÓN ---- */
    it('mt-disc-60','materials','elec','Desconectador (disconnect) 60A, no fusible, exterior','Eaton/Siemens','DPU222R','ea',17.98,'homedepot','DPU222R','Caja de desconexión 60A 240V, intemperie.',{icon:'⚡',tags:['eléctrico','disconnect'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/60%20amp%20disconnect'}),
    it('mt-disc-30','materials','elec','Desconectador fusible 30A, exterior','Eaton','DPF221R','ea',24.50,'grainger','','Caja de desconexión fusible 30A.',{icon:'⚡',tags:['eléctrico','disconnect'],source:'Grainger ref.',url:'https://www.grainger.com/search?searchQuery=30A%20fused%20disconnect'}),
    it('mt-whip-6ft','materials','elec','Whip liquidtight 1/2" x 6 ft, 10/3','Southwire/Halex','WHIP-6-103','ea',22.98,'homedepot','','Conduit flexible con conductores 10 AWG.',{icon:'⚡',tags:['eléctrico','whip'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/ac%20whip%206%20ft'}),
    it('mt-contactor-30','materials','elec','Contactor 1 polo, 30A, bobina 24V','Packard/Mars','C230B','ea',18.50,'grainger','','Contactor de propósito definido HVAC.',{icon:'⚡',tags:['eléctrico','contactor'],source:'Grainger ref.',url:'https://www.grainger.com/search?searchQuery=30A%2024V%20contactor'}),
    it('mt-contactor-40','materials','elec','Contactor 2 polos, 40A, bobina 24V','Packard','C240C','ea',24.75,'grainger','','Contactor 40A 24V coil.',{icon:'⚡',tags:['eléctrico','contactor'],source:'Grainger ref.',url:'https://www.grainger.com/search?searchQuery=40A%2024V%20contactor'}),
    it('mt-cap-dual','materials','elec','Capacitor dual run 45/5 µF 440V','Titan Pro/Mars','TRCFD455','ea',14.98,'homedepot','','Capacitor dual para compresor y ventilador.',{icon:'⚡',tags:['eléctrico','capacitor'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/45%205%20capacitor'}),
    it('mt-cap-35','materials','elec','Capacitor run 35 µF 440V','Titan Pro','TRCF35','ea',11.50,'grainger','','Capacitor de marcha.',{icon:'⚡',tags:['eléctrico','capacitor'],source:'Grainger ref.',url:'https://www.grainger.com/search?searchQuery=35%20uf%20440v%20capacitor'}),
    it('mt-fuse-30','materials','elec','Fusible de cartucho 30A (par)','Bussmann','FRN-R-30','ea',16.80,'grainger','','Fusibles de retardo para desconectador.',{icon:'⚡',tags:['eléctrico','fusible'],source:'Grainger ref.',url:'https://www.grainger.com/search?searchQuery=FRN-R-30'}),
    it('mt-transformer','materials','elec','Transformador 40VA 120/208/240V a 24V','Packard','PF42440','ea',21.90,'grainger','','Transformador de control 24V.',{icon:'⚡',tags:['eléctrico','transformador'],source:'Grainger ref.',url:'https://www.grainger.com/search?searchQuery=40VA%20transformer%2024V'}),
    it('mt-float','materials','elec','Interruptor de flotador (float switch) SS2','RectorSeal','SS2','ea',29.95,'supplyhouse','SS2','Safety switch para bandeja/drenaje.',{icon:'⚡',tags:['seguridad','drenaje'],source:'SupplyHouse ref.',url:'https://www.supplyhouse.com/'}),

    /* ---- CONTROLES Y CABLEADO ---- */
    it('mt-tstat-wire','materials','controls','Cable termostato 18/5, 50 ft','Southwire','18-5-50','ea',34.98,'homedepot','','Cableado de control para termostato.',{icon:'🎛️',tags:['cable','termostato'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/thermostat%20wire%2018%205'}),
    it('mt-relay-24','materials','controls','Relé 24V / accesorios de control','Honeywell/Generic','R8222','ea',19.95,'grainger','','Relé de control para integración HVAC.',{icon:'🎛️',tags:['control'],source:'Grainger ref.',url:'https://www.grainger.com/search?searchQuery=24V%20relay%20HVAC'}),

    /* ---- DUCTERÍA Y ACCESORIOS ---- */
    it('mt-duct-flex6','materials','duct','Ducto flexible aislado R-6, 6" x 25 ft','Master Flow','F6IFD6X300','ea',39.98,'homedepot','','Ducto flexible con aislamiento y barrera de vapor.',{icon:'🌬️',tags:['ducto'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/6%20inch%20insulated%20flex%20duct'}),
    it('mt-mastic','materials','duct','Sellador mastic para ductos, 1 gal','Master Flow','WBA-100','ea',27.98,'homedepot','','Sellador base agua para juntas y uniones.',{icon:'🌬️',tags:['ducto','sellado'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/duct%20mastic'}),
    it('mt-foil-tape','materials','duct','Cinta foil UL 181, 2" x 50 yd','Nashua/3M','322-2','roll',12.98,'homedepot','','Cinta de aluminio para sellado de ductos.',{icon:'🌬️',tags:['ducto','cinta'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/foil%20duct%20tape'}),
    it('mt-register','materials','duct','Rejilla/suministro de aire (registro) 10"x6"','Accord Ventilation','ABSWWH106','ea',14.98,'homedepot','','Registro de suministro, acero pintado.',{icon:'🌬️',tags:['rejilla'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/air%20register%2010x6'}),

    /* ---- FILTRACIÓN E IAQ ---- */
    it('mt-filter-20251','materials','iaq','Filtro de aire MERV 8, 20x25x1 (paquete)','HDX/Filtrete','20x25x1','box',17.97,'homedepot','','Filtros pleated (cantidad según paquete).',{icon:'🫧',tags:['filtro','iaq'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/20x25x1%20air%20filter'}),
    it('mt-filter-20254','materials','iaq','Filtro de aire MERV 11, 20x25x4','Filtrete','DP03DC-4','ea',29.97,'homedepot','','Filtro media 4" para gabinete.',{icon:'🫧',tags:['filtro','iaq'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/20x25x4%20air%20filter'}),
    it('mt-uv-kit','materials','iaq','Kit UV germicida para ducto/AHU','Fresh-Aire/Generic','UV-KIT','ea',129.00,'supplyhouse','','Lámpara UV para mejora de calidad de aire (según kit).',{icon:'🫧',tags:['uv','iaq'],source:'SupplyHouse ref.',url:'https://www.supplyhouse.com/'}),

    /* ---- SEGURIDAD Y VARIOS / CONSUMIBLES COMUNES DE INSTALACIÓN ---- */
    it('mt-cond-pump','materials','fontaneria','Bomba de condensado 120V','Little Giant','VCMA-15ULS','ea',64.50,'grainger','','Bomba automática con depósito y switch de seguridad.',{icon:'📦',tags:['bomba','drenaje'],source:'Grainger ref.',url:'https://www.grainger.com/search?searchQuery=VCMA-15ULS'}),
    it('mt-ppe','materials','safety','EPP básico: guantes, lentes, respirador (kit)','3M/Generic','PPE-KIT','set',34.95,'homedepot','','Elementos de protección personal para instalación.',{icon:'🦺',tags:['seguridad','epp'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/safety%20glasses%20gloves%20respirator'}),
    it('mt-sealant','materials','misc','Sellador/silicón y consumibles menores','DAP/Generic','SEAL-KIT','set',18.00,'homedepot','','Selladores y consumibles varios de obra.',{icon:'📦',tags:['consumibles'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/silicone%20sealant'}),
    it('mt-pvc-primer-cement','materials','fontaneria','Cemento y primer PVC (kit)','Oatey','30234','set',12.98,'homedepot','','Primer morado y cemento PVC para uniones de drenaje.',{icon:'🧵',tags:['pvc','drenaje','pegamento'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/pvc%20primer%20and%20cement'}),
    it('mt-teflon-tape','materials','misc','Cinta PTFE (teflón) para roscas','Oatey/Generic','PTFE-1','roll',1.98,'homedepot','','Sellado de roscas en conexiones (gas/agua según aplicación).',{icon:'📦',tags:['sellador','roscas'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/teflon%20tape'}),
    it('mt-zip-ties','materials','support','Amarras plásticas UV (pack)','Gardner Bender/Generic','ZIP-UV','pack',9.98,'homedepot','','Sujeción de cableado, aislamiento y líneas.',{icon:'🔩',tags:['amarres','soporte'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/uv%20zip%20ties'}),
    it('mt-line-hide','materials','misc','Canaleta/cubierta para líneas (line hide) 4" kit','Slimduct/Generic','LINE-HIDE-4','set',54.00,'homedepot','','Cubierta estética/protectora para line set y cableado exterior.',{icon:'📦',tags:['mini-split','líneas'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/mini%20split%20line%20hide'}),
    it('mt-cond-tab-drain','materials','fontaneria','Tubo vinilo transparente para drenaje 3/4" x 20 ft','Generic','VINYL-34-20','ea',14.50,'homedepot','','Tubería flexible para descarga de condensado (según aplicación).',{icon:'💧',tags:['drenaje'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/clear%20vinyl%20tubing%203%204'}),
    it('mt-neutralizer','materials','iaq','Neutralizador de condensado (boiler/furnace alta eficiencia)','RectorSeal','N-1','ea',42.00,'supplyhouse','N-1','Cartucho de neutralización para condensado ácido (si aplica).',{icon:'🫧',tags:['condensado','neutralizador'],source:'SupplyHouse ref.',url:'https://www.supplyhouse.com/'}),
    it('mt-sheet-screws','materials','support','Tornillos autorroscantes para lámina (pack)','Hillman/Generic','SHEET-SCR','box',8.98,'homedepot','','Fijación de ductos, plafones y accesorios metálicos.',{icon:'🔩',tags:['tornillería','ducto'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/sheet%20metal%20screws'}),
    it('mt-duct-strap','materials','duct','Cinta/percha de suspensión para ducto (hanger strap)','Master Flow','HS-1','roll',13.98,'homedepot','','Correa metálica perforada para colgar ductería.',{icon:'🌬️',tags:['ducto','soporte'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/duct%20hanger%20strap'}),
    it('mt-flare-kit','materials','pipe','Kit tuercas y flare para cobre (set)','Generic','FLARE-SET','set',16.50,'supplyhouse','','Accesorios de flare para conexiones de refrigeración (según medida).',{icon:'🧵',tags:['cobre','flare'],source:'SupplyHouse ref.',url:'https://www.supplyhouse.com/'}),
    it('mt-service-caps','materials','refrig','Tapas de servicio con sello (Schrader caps)','Mastercool/Generic','CAP-SET','set',7.50,'supplyhouse','','Tapas con o-ring para puertos de servicio.',{icon:'🧪',tags:['refrigerante','servicio'],source:'SupplyHouse ref.',url:'https://www.supplyhouse.com/'}),
    it('mt-coil-cleaner-spray','materials','paint','Limpiador de serpentín en aerosol','Nu-Calgon','4171-75','ea',11.98,'homedepot','4171-75','Limpieza rápida de evaporador/condensador (aerosol).',{icon:'🎨',tags:['químico','limpieza'],source:'Home Depot ref.',url:'https://www.homedepot.com/s/coil%20cleaner%20spray'}),
    it('mt-vacuum-oil','materials','refrig','Aceite para bomba de vacío, 1 qt','Yellow Jacket/Generic','VAC-OIL-QT','ea',19.95,'grainger','','Aceite de reemplazo para bomba de vacío (consumible).',{icon:'🧪',tags:['vacío','herramienta'],source:'Grainger ref.',url:'https://www.grainger.com/search?searchQuery=vacuum%20pump%20oil'}),
    it('mt-condenser-cleaner','materials','paint','Limpiador/desengrasante exterior para condensadora','Nu-Calgon','4291-08','ea',16.50,'supplyhouse','','Limpieza de unidad exterior y aletas (según indicaciones).',{icon:'🎨',tags:['limpieza','mantenimiento'],source:'SupplyHouse ref.',url:'https://www.supplyhouse.com/'}),

    /* ---- RENTAS / FLETES ---- */
    it('rn-lift19','indirects','rental','Plataforma tijera 19 ft (día)','JLG/United','1930ES','day',210,'united','RENT-SC19','Renta diaria; entrega/recogida pueden ser aparte.',{icon:'🏗️',tags:['renta','plataforma'],source:'United Rentals ref.',url:'https://www.unitedrentals.com/marketplace/equipment/aerial-work-platforms/scissor-lifts'}),
    it('rn-vac-pump','indirects','rental','Bomba de vacío 6 CFM (día)','Yellow Jacket','93560','day',45,'united','RENT-VAC','Bomba de vacío para evacuación (día).',{icon:'🏗️',tags:['renta','herramienta'],source:'Renta ref.'}),
    it('rn-recovery','indirects','rental','Máquina de recuperación de refrigerante (día)','Appion/Generic','G5TWIN','day',65,'sunbelt','RENT-REC','Equipo para recuperación según normativa.',{icon:'🏗️',tags:['renta','refrigerante'],source:'Sunbelt/United ref.',url:'https://www.sunbeltrentals.com/'}),
    it('rn-core-drill','indirects','rental','Taladro/perforación para paso de línea (día)','Hilti/Generic','CORE-DR','day',85,'sunbelt','RENT-CORE','Herramienta de perforación; brocas según necesidad.',{icon:'🏗️',tags:['renta','herramienta'],source:'Sunbelt/United ref.',url:'https://www.sunbeltrentals.com/'}),

    it('fr-delivery','freight','freight','Entrega de equipo/material (local)','Proveedor','DEL-LOC','ea',125,'manual','','Entrega local; confirmar si incluye descarga/acarreo.',{icon:'🚚',tags:['flete'],source:'Manual'}),
    it('fr-hoist','freight','freight','Izaje / grúa ligera / montaje en altura','Subcontrato','HOIST','ea',350,'manual','','Izaje de condensadora/equipo; alcance y tiempo según sitio.',{icon:'🚚',tags:['izaje'],source:'Manual'}),
    it('fr-disposal-trip','freight','freight','Transporte y disposición de equipos retirados','Servicio','DISP-TRIP','ea',95,'manual','','Traslado a disposición autorizada (si aplica).',{icon:'🚚',tags:['disposición'],source:'Manual'}),

    /* ---- MANO DE OBRA Y SERVICIOS ---- */
    it('sv-install-lead','labor','labor','Técnico HVAC líder (hora)','Interno','','hr',110,'manual','','Hora de técnico líder: instalación, supervisión y arranque.',{icon:'👷',tags:['mano de obra'],source:'Interno'}),
    it('sv-install-help','labor','labor','Ayudante HVAC (hora)','Interno','','hr',65,'manual','','Hora de ayudante de instalación.',{icon:'👷',tags:['mano de obra'],source:'Interno'}),
    it('sv-duct-labor','labor','labor','Instalación/modificación de ductería (hora)','Interno','','hr',95,'manual','','Mano de obra especializada en ductería y sellado.',{icon:'👷',tags:['mano de obra','ducto'],source:'Interno'}),
    it('sv-permit','labor','permit','Permiso mecánico municipal y gestión','Municipio','','ea',250,'manual','','Permiso e inspección; monto varía por municipio en NJ.',{icon:'📄',tags:['permiso'],source:'Manual NJ'}),
    it('sv-startup','labor','service','Arranque, vacío, carga y puesta en marcha','Interno','','ea',350,'manual','','Evacuación, verificación de carga, pruebas y entrega al cliente.',{icon:'🛠️',tags:['servicio','startup'],source:'Interno'}),
    it('sv-disposal','labor','service','Recuperación y disposición de equipo/refrigerante','Servicio','','ea',150,'manual','','Recuperación de refrigerante y retiro de equipo existente conforme a normas.',{icon:'🛠️',tags:['disposición'],source:'Manual'}),
    it('sv-commission','labor','service','Balanceo/ajuste y verificación de desempeño','Interno','','ea',220,'manual','','Ajustes finales, verificación de flujo/temperaturas y documentación.',{icon:'🛠️',tags:['servicio'],source:'Interno'}),

    /* ---- OTROS ---- */
    it('ot-cont','other','other','Contingencia / imprevistos','Interno','','lot',0,'manual','','Reserva para imprevistos (puede calcularse como %).',{icon:'📄',tags:['contingencia'],source:'Interno'}),
    it('ot-warranty','other','other','Garantía extendida de mano de obra (opción)','Interno','','ea',0,'manual','','Cobertura adicional de mano de obra según términos acordados.',{icon:'🛡️',tags:['garantía'],source:'Interno'}),
    it('ot-bond','other','other','Fianza / seguro especial de proyecto (si aplica)','Aseguradora','','ea',0,'manual','','Costo de fianza o póliza específica del proyecto.',{icon:'📄',tags:['fianza'],source:'Manual'}),
    /* ---- FONTANERÍA Y DRENAJES HVAC (condensados / PVC) ---- */
    it('mt-pvc-34-elbow','materials','fontaneria','Codo PVC 3/4" (90°) para drenaje de condensado','Charlotte Pipe','PVC003001000','ea',0.89,'homedepot','','Codo de 90° Schedule 40 para línea de condensado.',{icon:'🚰',tags:['pvc','drenaje','condensado'],source:'Home Depot ref.'}),
    it('mt-pvc-34-tee','materials','fontaneria','Tee PVC 3/4" para drenaje','Charlotte Pipe','PVC004001000','ea',1.28,'homedepot','','Tee Schedule 40 para derivaciones de condensado.',{icon:'🚰',tags:['pvc','drenaje'],source:'Home Depot ref.'}),
    it('mt-pvc-34-coupling','materials','fontaneria','Cople/acoplamiento PVC 3/4"','Charlotte Pipe','PVC001001000','ea',0.78,'homedepot','','Acoplamiento recto para unir tramos de PVC.',{icon:'🚰',tags:['pvc','drenaje'],source:'Home Depot ref.'}),
    it('mt-pvc-34-cap','materials','fontaneria','Tapón/cap PVC 3/4"','Charlotte Pipe','PVC021001000','ea',0.98,'homedepot','','Tapón para cierre o punto de limpieza.',{icon:'🚰',tags:['pvc','drenaje'],source:'Home Depot ref.'}),
    it('mt-pvc-34-adapter','materials','fontaneria','Adaptador PVC 3/4" (macho/hembra o slip)','Generic','PVC-ADAPT-34','ea',1.48,'homedepot','','Adaptador para transición a manguera o fitting roscado.',{icon:'🚰',tags:['pvc','adaptador'],source:'Home Depot ref.'}),
    it('mt-pvc-34-union','materials','fontaneria','Unión desmontable PVC 3/4"','Generic','PVC-UNION-34','ea',3.48,'homedepot','','Unión para facilitar mantenimiento de trampa/línea.',{icon:'🚰',tags:['pvc','drenaje'],source:'Home Depot ref.'}),
    it('mt-cond-pump-safety','materials','fontaneria','Switch de seguridad/overflow para condensado','DiversiTech','CS-3','ea',24.50,'supplyhouse','CS-3','Interruptor de desborde para apagar equipo si falla el drenaje.',{icon:'🚰',tags:['condensado','seguridad'],source:'SupplyHouse ref.'}),

    /* ---- DUCTERÍA Y DISTRIBUCIÓN (central ductado) ---- */
    it('mt-flex-duct-8','materials','duct','Ducto flexible aislado R-8, 8" x 25 ft','Master Flow','F8IFD8X300','ea',49.98,'homedepot','','Ducto flexible aislado para ramales de suministro/retorno.',{icon:'🌬️',tags:['ducto','flex','aislado'],source:'Home Depot ref.'}),
    it('mt-flex-duct-10','materials','duct','Ducto flexible aislado R-8, 10" x 25 ft','Master Flow','F8IFD10X300','ea',59.98,'homedepot','','Ducto flexible de mayor diámetro para ramales principales.',{icon:'🌬️',tags:['ducto','flex'],source:'Home Depot ref.'}),
    it('mt-duct-collar-6','materials','duct','Collar/takeoff para ducto 6"','Master Flow','CT6','ea',6.98,'homedepot','','Collar metálico para conexión de ramal flexible al plenum/troncal.',{icon:'🌬️',tags:['ducto','takeoff'],source:'Home Depot ref.'}),
    it('mt-duct-collar-8','materials','duct','Collar/takeoff para ducto 8"','Master Flow','CT8','ea',8.48,'homedepot','','Takeoff para conexión de ducto flexible 8".',{icon:'🌬️',tags:['ducto','takeoff'],source:'Home Depot ref.'}),
    it('mt-register-boot-6','materials','duct','Boot/caja para registro 6"','Master Flow','RB6','ea',11.98,'homedepot','','Transición de ducto redondo a registro rectangular.',{icon:'🌬️',tags:['ducto','boot','registro'],source:'Home Depot ref.'}),
    it('mt-return-grille-14x14','materials','duct','Rejilla de retorno 14" x 14" (con opción de filtro)','Accord Ventilation','ABRFWH1414','ea',24.98,'homedepot','','Rejilla de retorno para pared/techo; verificar marco de filtro.',{icon:'🌬️',tags:['retorno','rejilla'],source:'Home Depot ref.'}),
    it('mt-supply-register-12x6','materials','duct','Registro de suministro 12" x 6"','Accord Ventilation','ABSWWH126','ea',16.98,'homedepot','','Registro ajustable para suministro de aire.',{icon:'🌬️',tags:['suministro','registro'],source:'Home Depot ref.'}),
    it('mt-damper-6','materials','duct','Damper regulador 6" en línea','Master Flow','D6','ea',12.98,'homedepot','','Compuerta para balanceo de flujo en ramal.',{icon:'🌬️',tags:['ducto','damper','balanceo'],source:'Home Depot ref.'}),
    it('mt-plenum-fab','materials','duct','Plenum metálico fabricado (suministro/retorno)','Sheet Metal/Local','PLENUM-FAB','ea',185.00,'johnstone','','Plenum fabricado a medida; precio de referencia según tamaño y sitio.',{icon:'🌬️',tags:['ducto','plenum'],source:'Distribuidor/local ref.',demo:true}),
    it('mt-canvas-connector','materials','duct','Conector flexible de lona (canvas/vibración)','Duro Dyne','FC-12','ea',34.50,'grainger','','Aislador de vibración entre equipo y ductería.',{icon:'🌬️',tags:['ducto','vibración'],source:'Grainger ref.'}),
    it('mt-duct-insul-wrap','materials','insul','Aislamiento para ducto metálico (wrap) R-6, rollo','Johns Manville/Generic','DUCTWRAP-R6','roll',68.00,'homedepot','','Aislamiento con barrera de vapor para ductería metálica.',{icon:'🧊',tags:['aislamiento','ducto'],source:'Home Depot ref.'}),

    /* ---- INSTALACIÓN MINI-SPLIT (accesorios comunes) ---- */
    it('mt-ls-1438-16','materials','pipe','Line set 1/4" x 3/8", 16 ft (mini-split)','MRCOOL/Generic','LS-1438-16','ea',59.00,'homedepot','','Cobre pre-aislado corto para instalación típica.',{icon:'🧵',tags:['mini-split','cobre','line set'],source:'Home Depot ref.'}),
    it('mt-ls-1438-50','materials','pipe','Line set 1/4" x 3/8", 50 ft (mini-split)','VEVOR/Generic','LS-1438-50','ea',119.00,'homedepot','','Cobre aislado para mini-split, 50 ft.',{icon:'🧵',tags:['mini-split','cobre','line set'],source:'Home Depot ref.'}),
    it('mt-ls-3858-16','materials','pipe','Line set 3/8" x 5/8", 16 ft (mini-split)','MRCOOL/Generic','LS-3858-16','ea',79.00,'homedepot','','Line set para equipos de mayor capacidad.',{icon:'🧵',tags:['mini-split','cobre','line set'],source:'Home Depot ref.'}),
    it('mt-mini-cover-kit','materials','misc','Kit de cubierta para líneas de mini-split 3" x 7.5 ft','MRCOOL/Generic','LINECOVER-3','set',39.98,'homedepot','','Canaletas decorativas/protectoras para line set y cableado.',{icon:'📦',tags:['mini-split','cubierta'],source:'Home Depot ref.'}),
    it('mt-mini-pad','materials','civil','Pad/base para condensadora de mini-split','DiversiTech/Generic','MINI-PAD','ea',34.98,'homedepot','','Base plástica o compuesto para unidad exterior.',{icon:'🏗️',tags:['mini-split','base'],source:'Home Depot ref.'}),
    it('mt-mini-wall-bracket','materials','civil','Soportes de pared para condensadora mini-split','MRCOOL/Generic','WALL-BRKT-MS','set',79.00,'homedepot','','Brazos de montaje en pared para unidad exterior.',{icon:'🏗️',tags:['mini-split','soporte'],source:'Home Depot ref.'}),
    it('mt-control-wire-144','materials','controls','Cable de comunicación mini-split 14/4 x 50 ft','Southwire/Generic','14-4-50','ea',34.98,'homedepot','','Cable para comunicación/control entre unidades (verificar especificación del fabricante).',{icon:'🎛️',tags:['mini-split','cableado'],source:'Home Depot ref.'}),
    it('mt-wall-sleeve','materials','misc','Manga/pasamuros para mini-split 2.5"','Generic','WALL-SLEEVE-25','ea',9.98,'homedepot','','Protección para paso de líneas por pared.',{icon:'📦',tags:['mini-split','pasamuros'],source:'Home Depot ref.'}),
    it('mt-putty-seal','materials','paint','Sellador/masilla para penetraciones de pared','RectorSeal/Generic','WALL-SEAL','ea',8.98,'homedepot','','Sellado de paso de tuberías y cables para evitar filtraciones.',{icon:'🧴',tags:['sellador','mini-split'],source:'Home Depot ref.'}),
    it('mt-surge-protector','materials','elec','Protector contra sobretensiones para mini-split/HVAC','Intermatic/Generic','AG3000','ea',69.00,'supplyhouse','','Protección eléctrica para equipo exterior/inverter.',{icon:'⚡',tags:['eléctrico','protección','mini-split'],source:'SupplyHouse ref.'})

  ];

  /* ---------------------------------------------------------------- */
  /* Inclusiones / exclusiones por defecto                             */
  /* ---------------------------------------------------------------- */
  P.DEFAULT_INCLUSIONS = [
    'Suministro e instalación de los equipos y materiales listados en esta propuesta.',
    'Conexiones eléctricas hasta el desconectador del equipo.',
    'Conexión de drenaje de condensado al punto existente más cercano.',
    'Arranque, verificación de carga de refrigerante y prueba de funcionamiento.',
    'Limpieza del área de trabajo y retiro de escombros generados.',
    'Garantía de mano de obra según lo indicado en esta propuesta.'
  ];

  P.DEFAULT_EXCLUSIONS = [
    'Trabajos eléctricos aguas arriba del desconectador (panel, acometida, medidor).',
    'Reparaciones estructurales, carpintería, mampostería, pintura o acabados.',
    'Remediación de asbesto, moho o materiales peligrosos.',
    'Permisos, fianzas o revisiones no listados como línea separada.',
    'Trabajos en horario nocturno, fines de semana o días feriados.',
    'Acceso especial (andamios, grúa, izaje) no listado como línea separada.',
    'Adecuaciones de ductos existentes fuera de lo descrito.',
    'Cualquier trabajo no descrito expresamente en esta propuesta.'
  ];

  /* ---------------------------------------------------------------- */
  /* Términos legales / NJ                                             */
  /* ---------------------------------------------------------------- */
  P.NJ_NOTES = {
    capital:
      'Trabajo clasificado como CAPITAL IMPROVEMENT: la mano de obra no está sujeta al Sales Tax de NJ cuando el ' +
      'propietario firma el Form ST-8 (Certificate of Capital Improvement). El contratista paga el sales/use tax ' +
      'de los materiales, ya incluido en el costo interno de esta cotización.',
    repair:
      'Trabajo clasificado como REPARACIÓN / MANTENIMIENTO: la mano de obra y los materiales están sujetos al ' +
      'Sales Tax de New Jersey (6.625%), que se muestra como línea separada en esta propuesta.',
    materials:
      'Venta de materiales: sujeta al Sales Tax de New Jersey (6.625%).',
    custom:
      'Tratamiento de impuesto definido manualmente por la empresa. Verificar con el contador antes de emitir.'
  };

  P.NJ_COMPLIANCE = [
    'Contrato escrito obligatorio para trabajos de home improvement sobre $500 (N.J.S.A. 56:8-136 et seq.).',
    'Número de registro HIC (13VH…) debe aparecer en contratos, presupuestos y documentos comerciales.',
    'El contratista debe estar registrado y mostrar su número en anuncios y vehículos comerciales.',
    'Seguro de responsabilidad general mínimo de $500,000 para HICB.',
    'Para trabajos de HVACR se requiere licencia Master HVACR vigente y la empresa debe estar registrada.',
    'Capital improvement: el propietario debe firmar el Form ST-8 antes de facturar sin sales tax sobre la mano de obra.',
    'NJ no fija por ley un tope de depósito; la práctica del mercado es 10–33%. La app advierte por encima de 33%.',
    'Verificar requisitos del municipio: permiso, inspección y, en algunos towns, registro de contratista local.'
  ];

  /* ---------------------------------------------------------------- */
  /* Unidades de negocio por defecto                                  */
  /* ---------------------------------------------------------------- */
  P.DEFAULT_SETTINGS = {
    taxRate: 0.06625,
    taxMode: 'capital',
    materialsTaxAsCost: true,
    defaultMarkups: { equipment: 22, freight: 15, indirects: 20, materials: 35, labor: 45, other: 15 },
    globalFactor: 1,
    contingencyPct: 5,
    overheadPct: 0,
    validityDays: 30,
    depositPct: 30,
    currency: 'USD'
  };

  P.DEFAULT_COMPANY = {
    name: 'Su Empresa HVAC LLC',
    legalName: '',
    address: '',
    city: '',
    state: 'NJ',
    zip: '',
    phone: '',
    email: '',
    website: '',
    logo: '',
    hic: '',
    hvacr: '',
    taxId: '',
    insurance: '',
    tagline: 'Diseño, instalación y servicio de sistemas HVAC',
    footer: 'Gracias por permitirnos cotizar su proyecto.',
    accent: '#1B6CA8'
  };

  /* ---------------------------------------------------------------- */
  /* Plantilla de cronograma de pagos                                 */
  /* ---------------------------------------------------------------- */
  P.DEFAULT_SCHEDULE = [
    { label: 'Depósito al firmar', pct: 30 },
    { label: 'Al iniciar la instalación', pct: 40 },
    { label: 'Al terminar y entregar', pct: 30 }
  ];

  /* ---------------------------------------------------------------- */
  /* Demo: proyecto de ejemplo                                        */
  /* ---------------------------------------------------------------- */
  P.DEMO_PROJECT = null; // se construye en store.js

})(window.PCP);
