/* =====================================================================
   HVAC Project Catcher Plus 1.2 — I18N + Branding
   ===================================================================== */
window.PCP = window.PCP || {};
(function (P) {
  'use strict';

  var STR = {
    es: {
      appName: 'HVAC Project Catcher Plus',
      version: '1.2',
      tagline: 'Cotiza HVAC como un pro, sin olvidos',
      subtitle: 'HVAC · NJ',
      nav: { home: 'Inicio', projects: 'Presupuestos', catalog: 'Catálogo', deals: 'Ofertas', suppliers: 'Proveedores', company: 'Empresa' },
      themeDark: 'Modo noche', themeLight: 'Modo día',
      langEs: 'Español', langEn: 'English', switchToEn: 'English', switchToEs: 'Español',
      localData: 'Datos locales (este navegador)',
      noCompany: 'Sin empresa',
      welcome: 'Bienvenido a HVAC Project Catcher Plus 1.2',
      start: 'Comenzar', cancel: 'Cancelar', save: 'Guardar', edit: 'Editar', delete: 'Borrar', duplicate: 'Duplicar', open: 'Abrir', add: 'Agregar', back: 'Volver', next: 'Siguiente', previous: 'Anterior', close: 'Cerrar', search: 'Buscar', all: 'Todas', allM: 'Todos', none: 'No', yes: 'Sí',
      createQuote: 'Crear presupuesto / oferta', viewQuotes: 'Ver ofertas / proyectos', verifyPrices: 'Verificar precios de materiales', dealsPromos: 'Ofertas y promociones', suppliersRfq: 'Proveedores y RFQ', companyBackup: 'Empresa y respaldo',
      createQuoteDesc: 'Nuevo proyecto por etapas con checklist de completitud.',
      viewQuotesDesc: 'Historial, duplicar, editar, imprimir PDF.',
      verifyPricesDesc: 'Catálogo interno, actualizar precios y "qué incluye".',
      dealsPromosDesc: 'Promociones activas para reducir costos.',
      suppliersRfqDesc: 'Correos, sucursales y solicitud de cotización.',
      companyBackupDesc: 'Logo, licencias, impuestos por defecto, cargar/guardar respaldos.',
      recentProjects: 'Proyectos recientes', featuredDeals: 'Ofertas activas destacadas',
      noProjectsYet: 'Aún no hay proyectos.', createFirst: 'Crear el primero',
      newProject: 'Nuevo presupuesto / oferta', createProject: 'Crear proyecto',
      projectName: 'Nombre del proyecto', clientName: 'Nombre del cliente / contacto', clientCompany: 'Empresa / propiedad', clientCompanyOpt: 'Empresa / propiedad (opcional)', clientType: 'Tipo de cliente',
      projectNamePh: 'Ej.: Instalación split 3 ton - Casa Rivera', clientNamePh: 'Nombre y apellido', clientCompanyPh: 'Empresa o nombre de la propiedad',
      projectClientHelp: 'Estos datos se pueden editar después en el paso 1. El nombre del proyecto y del cliente ayudan a organizar tus cotizaciones.',
      reqProjectClient: 'Ingresa el nombre del proyecto y del cliente.',
      quotesTitle: 'Presupuestos y ofertas', quotesSub: 'Historial de proyectos, estado, completitud y totales.',
      colNumber: 'Número', colProjectClient: 'Proyecto / Cliente', colDate: 'Fecha', colStatus: 'Estado', colComplete: 'Completitud', colTotal: 'Total', colItem: 'Ítem', colStage: 'Etapa', colSupplier: 'Proveedor', colCost: 'Costo', colCostRef: 'Costo ref.', colOffer: 'Oferta', colIncludes: 'Incluye', colQty: 'Cant.', colUnitPrice: 'P. unit.', colSell: 'Venta', colUpdated: 'Actualizado', colActions: '',
      catalogTitle: 'Catálogo y verificación de precios', catalogSub: 'Precios internos de referencia. Verifique en el proveedor (Home Depot/Grainger/distribuidor), actualice el precio real y la fecha, y marque "qué incluye".',
      exportCsv: 'Guardar CSV', importCsv: 'Cargar CSV',
      searchPh: 'nombre, marca, modelo, SKU…', stage: 'Etapa', supplier: 'Proveedor', onlyDeals: 'Solo ofertas',
      catalogNotice: 'Los ítems <span class="pill demo">referencia</span> traen precios típicos (Home Depot/Grainger/distribuidor). Use <b>“Ver precio”</b> para confirmar el valor en vivo y guarde el precio real con <b>Editar</b> (queda la fecha).',
      noResults: 'Sin resultados. Ajusta la búsqueda o agrega el ítem manualmente.',
      viewPrice: 'Ver precio', ref: 'referencia', confirmed: 'confirmado', stageSupplier: 'Etapa / proveedor', includesSource: 'Incluye / fuente',
      dealsTitle: 'Ofertas y promociones', dealsSub: 'Promociones activas detectadas en el catálogo. Confirmar vigencia y condiciones con el proveedor.',
      suppliersTitle: 'Proveedores', suppliersSub: 'Configure correos, teléfonos y enlaces de sus sucursales en NJ. La app no inventa correos.',
      companyTitle: 'Empresa y configuración', companySub: 'Datos que aparecerán en la propuesta y valores por defecto para nuevos proyectos.',
      printPdf: 'Imprimir / PDF', stepOf: 'Paso {n} de 8', noClient: 'Sin cliente',
      addLine: 'Agregar línea', addFromCatalog: 'Desde catálogo', addManual: 'Manual',
      includesLabel: 'Incluye', noIncludes: 'sin "incluye"', oldPrice: 'precio viejo', deal: 'oferta',
      homePriceNote: 'Los precios del catálogo son <b>de referencia</b>. Confírmalos en vivo con el proveedor (Home Depot/Grainger/distribuidor) y actualízalos con fecha antes de enviar tu oferta.',
      homeImportant: '<b>Precios:</b> el catálogo incluye referencias típicas (Home Depot/Grainger/distribuidor). Use <b>“Verificar precios de materiales”</b> → <b>Ver precio</b> para confirmar el valor en vivo con el proveedor y luego guarde el precio real con fecha. Configure en <a href="#/company">Empresa</a> su HIC, licencia HVACR y seguro.',
      heroSub: '',
      missing: 'faltan', ready: 'Listo', review: 'Revisar', ok: 'OK', score: 'Puntaje',
      status_draft: 'Borrador', status_sent: 'Enviada', status_approved: 'Aprobada', status_lost: 'Perdida',
      activeDealsCount: '{n} oferta(s) activa(s) en el catálogo.',
      updatePrices: 'Actualizar precios',
      updatePricesTitle: 'Revisión y actualización de precios',
      updatePricesSub: 'Revisa los precios del proyecto, confirma valores en vivo con el proveedor y actualiza costo/fecha para mantener la cotización precisa.',
      noLinesToUpdate: 'No hay ítems con precio en este proyecto todavía.',
      markToday: 'Fecha hoy',
      openEdit: 'Editar',
      stale: 'Vencido',
      current: 'Al día',
      deliveryTime: 'Tiempo de entrega / ejecución',
      paymentMethod: 'Forma de pago',
      equipmentLead: 'Plazo de equipos / materiales',
      warrantyTerms: 'Garantía',
      termsTitle: 'Plazos y condiciones para el cliente',
      termsHelp: 'Estos datos se solicitan para la propuesta del cliente (no se listan materiales en el PDF).',
      proposalOverview: 'Descripción general del proyecto',
      equipmentBrands: 'Equipos y marcas incluidos',
      noEquipmentListed: 'Equipos según alcance y especificaciones acordadas.',
      generatedNote: 'Propuesta generada con HVAC Project Catcher Plus 1.2 a partir de la información del proyecto.',
      logoAlt: 'Logo HVAC Project Catcher Plus'
    },
    en: {
      appName: 'HVAC Project Catcher Plus',
      version: '1.2',
      tagline: 'Quote HVAC like a pro, miss nothing',
      subtitle: 'HVAC · NJ',
      nav: { home: 'Home', projects: 'Quotes', catalog: 'Catalog', deals: 'Deals', suppliers: 'Suppliers', company: 'Company' },
      themeDark: 'Dark mode', themeLight: 'Light mode',
      langEs: 'Español', langEn: 'English', switchToEn: 'English', switchToEs: 'Español',
      localData: 'Local data (this browser)',
      noCompany: 'No company set',
      welcome: 'Welcome to HVAC Project Catcher Plus 1.2',
      start: 'Start', cancel: 'Cancel', save: 'Save', edit: 'Edit', delete: 'Delete', duplicate: 'Duplicate', open: 'Open', add: 'Add', back: 'Back', next: 'Next', previous: 'Previous', close: 'Close', search: 'Search', all: 'All', allM: 'All', none: 'No', yes: 'Yes',
      createQuote: 'Create quote / proposal', viewQuotes: 'View quotes / projects', verifyPrices: 'Verify material prices', dealsPromos: 'Deals & promotions', suppliersRfq: 'Suppliers & RFQ', companyBackup: 'Company & backup',
      createQuoteDesc: 'New staged project with a completeness checklist.',
      viewQuotesDesc: 'History, duplicate, edit, print PDF.',
      verifyPricesDesc: 'Internal catalog, update prices and "what’s included".',
      dealsPromosDesc: 'Active promotions to reduce costs.',
      suppliersRfqDesc: 'Emails, branches, and quote requests.',
      companyBackupDesc: 'Logo, licenses, default taxes, load/save backups.',
      recentProjects: 'Recent projects', featuredDeals: 'Featured active deals',
      noProjectsYet: 'No projects yet.', createFirst: 'Create the first one',
      newProject: 'New quote / proposal', createProject: 'Create project',
      projectName: 'Project name', clientName: 'Client / contact name', clientCompany: 'Company / property', clientCompanyOpt: 'Company / property (optional)', clientType: 'Client type',
      projectNamePh: 'e.g. 3-ton split install - Rivera House', clientNamePh: 'Full name', clientCompanyPh: 'Company or property name',
      projectClientHelp: 'You can edit these later in step 1. Project and client names help organize your quotes.',
      reqProjectClient: 'Enter the project name and client name.',
      quotesTitle: 'Quotes & proposals', quotesSub: 'Project history, status, completeness, and totals.',
      colNumber: 'Number', colProjectClient: 'Project / Client', colDate: 'Date', colStatus: 'Status', colComplete: 'Completeness', colTotal: 'Total', colItem: 'Item', colStage: 'Stage', colSupplier: 'Supplier', colCost: 'Cost', colCostRef: 'Ref. cost', colOffer: 'Deal', colIncludes: 'Includes', colQty: 'Qty', colUnitPrice: 'Unit price', colSell: 'Sell', colUpdated: 'Updated', colActions: '',
      catalogTitle: 'Catalog & price verification', catalogSub: 'Internal reference prices. Verify with the supplier (Home Depot/Grainger/distributor), update the real price and date, and mark "what’s included".',
      exportCsv: 'Save CSV', importCsv: 'Load CSV',
      searchPh: 'name, brand, model, SKU…', stage: 'Stage', supplier: 'Supplier', onlyDeals: 'Deals only',
      catalogNotice: 'Items marked <span class="pill demo">reference</span> show typical prices (Home Depot/Grainger/distributor). Use <b>“View price”</b> to confirm live value and save the real price with <b>Edit</b> (date is kept).',
      noResults: 'No results. Adjust your search or add the item manually.',
      viewPrice: 'View price', ref: 'reference', confirmed: 'confirmed', stageSupplier: 'Stage / supplier', includesSource: 'Includes / source',
      dealsTitle: 'Deals & promotions', dealsSub: 'Active promotions found in the catalog. Confirm validity and conditions with the supplier.',
      suppliersTitle: 'Suppliers', suppliersSub: 'Configure emails, phones, and links for your NJ branches. The app does not invent emails.',
      companyTitle: 'Company & settings', companySub: 'Information shown on proposals and defaults for new projects.',
      printPdf: 'Print / PDF', stepOf: 'Step {n} of 8', noClient: 'No client',
      addLine: 'Add line', addFromCatalog: 'From catalog', addManual: 'Manual',
      includesLabel: 'Includes', noIncludes: 'no "includes"', oldPrice: 'old price', deal: 'deal',
      homePriceNote: 'Catalog prices are <b>for reference</b>. Confirm them live with the supplier (Home Depot/Grainger/distributor) and update with the date before sending your quote.',
      homeImportant: '<b>Prices:</b> the catalog includes typical references (Home Depot/Grainger/distributor). Use <b>“Verify material prices”</b> → <b>View price</b> to confirm live value with the supplier, then save the real price with date. Set your HIC, HVACR license, and insurance in <a href="#/company">Company</a>.',
      heroSub: '',
      missing: 'missing', ready: 'Ready', review: 'Review', ok: 'OK', score: 'Score',
      status_draft: 'Draft', status_sent: 'Sent', status_approved: 'Approved', status_lost: 'Lost',
      activeDealsCount: '{n} active deal(s) in catalog.',
      updatePrices: 'Update prices',
      updatePricesTitle: 'Price review & update',
      updatePricesSub: 'Review project prices, confirm live values with suppliers, and update cost/date to keep your quote accurate.',
      noLinesToUpdate: 'There are no priced items in this project yet.',
      markToday: 'Set today',
      openEdit: 'Edit',
      stale: 'Stale',
      current: 'Up to date',
      deliveryTime: 'Delivery / execution time',
      paymentMethod: 'Payment method',
      equipmentLead: 'Equipment / materials lead time',
      warrantyTerms: 'Warranty',
      termsTitle: 'Client schedule & terms',
      termsHelp: 'Requested for the client proposal (materials are not itemized in the PDF).',
      proposalOverview: 'Project overview',
      equipmentBrands: 'Included equipment & brands',
      noEquipmentListed: 'Equipment as per agreed scope and specifications.',
      generatedNote: 'Proposal generated with HVAC Project Catcher Plus 1.2 based on project information.',
      logoAlt: 'HVAC Project Catcher Plus logo'
    }
  };

  // Data label translations (stages/scopes/client types/subs/statuses)
  var DATA = {
    es: {
      stages: { equipment:'Equipos', freight:'Fletes y logística', indirects:'Rentas e indirectos', materials:'Materiales', labor:'Mano de obra y servicios', other:'Otros y contingencias' },
      stageHints: { equipment:'Unidades, accesorios y controles que se instalan.', freight:'Entrega, izaje, almacenaje y movilización al proyecto.', indirects:'Grúas, plataformas, herramientas, baños, oficina de obra.', materials:'Tubería, aislamiento, refrigerante, soldadura, soportes, eléctrico, civil.', labor:'Horas de instalación, permisos, comisionamiento, disposición.', other:'Imprevistos, garantías extendidas, fianzas, varios.' },
      scopes: { ac:'Aire acondicionado', heat:'Calefacción', vent:'Ventilación', refrig:'Refrigeración comercial', controls:'Controles y automatización', duct:'Ductería y aislamiento', iaq:'Calidad de aire interior', maint:'Mantenimiento / reparación' },
      scopeDesc: { ac:'Split, paquete, mini-split, VRF', heat:'Furnace, bomba de calor, caldera', vent:'Ductos, ERV/HRV, extracción', refrig:'Walk-in, reach-in, racks', controls:'Termostatos, BMS, zonificación', duct:'Suministro, retorno, sellado', iaq:'Filtración, UV, humidificación', maint:'Servicio (no mejora capital)' },
      client: { residential:'Residencial', commercial:'Comercial', industrial:'Industrial' }
    },
    en: {
      stages: { equipment:'Equipment', freight:'Freight & logistics', indirects:'Rentals & indirects', materials:'Materials', labor:'Labor & services', other:'Other & contingencies' },
      stageHints: { equipment:'Units, accessories, and controls to install.', freight:'Delivery, hoisting, storage, and mobilization.', indirects:'Cranes, lifts, tools, toilets, jobsite office.', materials:'Piping, insulation, refrigerant, brazing, supports, electrical, civil.', labor:'Installation hours, permits, commissioning, disposal.', other:'Unexpected costs, extended warranties, bonds, misc.' },
      scopes: { ac:'Air conditioning', heat:'Heating', vent:'Ventilation', refrig:'Commercial refrigeration', controls:'Controls & automation', duct:'Ductwork & insulation', iaq:'Indoor air quality', maint:'Maintenance / repair' },
      scopeDesc: { ac:'Split, package, mini-split, VRF', heat:'Furnace, heat pump, boiler', vent:'Ducts, ERV/HRV, exhaust', refrig:'Walk-in, reach-in, racks', controls:'Thermostats, BMS, zoning', duct:'Supply, return, sealing', iaq:'Filtration, UV, humidification', maint:'Service (not capital improvement)' },
      client: { residential:'Residential', commercial:'Commercial', industrial:'Industrial' }
    }
  };

  function lang() { return (P.store && P.store.state && P.store.state.ui && P.store.state.ui.lang) || 'es'; }
  function t(key, vars) {
    var L = lang();
    var s = (STR[L] && STR[L][key] != null) ? STR[L][key] : (STR.es[key] != null ? STR.es[key] : key);
    if (vars) Object.keys(vars).forEach(function(k){ s = String(s).replace(new RegExp('\\{'+k+'\\}','g'), vars[k]); });
    return s;
  }
  function tn(group, subkey) {
    var L = lang();
    return (STR[L] && STR[L][group] && STR[L][group][subkey]) || (STR.es[group] && STR.es[group][subkey]) || subkey;
  }
  function td(group, id) {
    var L = lang();
    return (DATA[L] && DATA[L][group] && DATA[L][group][id]) || (DATA.es[group] && DATA.es[group][id]) || id;
  }
  function stageLabel(id) { return td('stages', id); }
  function stageHint(id) { return td('stageHints', id); }
  function scopeLabel(id) { return td('scopes', id); }
  function scopeDesc(id) { return td('scopeDesc', id); }
  function clientLabel(id) { return td('client', id); }
  function statusLabel(id) { return t('status_' + id) || id; }

  // SVG Logo: clear HVAC catcher mark (cool + heat) optimized for small sizes
  function logoSVG(size) {
    size = size || 40;
    var gid = 'pcg_' + String(size).replace(/[^a-z0-9]/gi, '');
    return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-label="'+t('logoAlt')+'" role="img" focusable="false">'
      + '<defs><linearGradient id="'+gid+'" x1="8" y1="8" x2="56" y2="56"><stop offset="0%" stop-color="#67e8f9"/><stop offset="48%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#fb923c"/></linearGradient></defs>'
      + '<rect x="3" y="3" width="58" height="58" rx="18" fill="#081321"/>'
      + '<rect x="3" y="3" width="58" height="58" rx="18" fill="none" stroke="url(#'+gid+')" stroke-width="3.5"/>'
      + '<circle cx="32" cy="32" r="16.5" fill="#0d2238" stroke="#93c5fd" stroke-width="2.2"/>'
      + '<path d="M32 12v8M32 44v8M12 32h8M44 32h8" stroke="#e0f2fe" stroke-width="3" stroke-linecap="round"/>'
      + '<path d="M32 22v20M22 32h20M25 25l14 14M39 25L25 39" stroke="#67e8f9" stroke-width="2.4" stroke-linecap="round" opacity="0.95"/>'
      + '<path d="M40.5 40.5c0 4.2-3.5 7.5-8.5 7.5s-8.5-3.3-8.5-7.5c0-3.2 2-5.6 4.4-7.4.7 2.2 2.1 3.4 4.1 3.4 1.4 0 2.6-.7 3.4-1.9 1.1 2 5.1 2.6 5.1 5.9z" fill="#fb923c" stroke="#fff7ed" stroke-width="1"/>'
      + '<circle cx="32" cy="32" r="3.2" fill="#ffffff"/>'
      + '</svg>';
  }

  P.i18n = { t: t, tn: tn, td: td, lang: lang, data: DATA, str: STR, stageLabel: stageLabel, stageHint: stageHint, scopeLabel: scopeLabel, scopeDesc: scopeDesc, clientLabel: clientLabel, statusLabel: statusLabel, logoSVG: logoSVG };
})(window.PCP);
