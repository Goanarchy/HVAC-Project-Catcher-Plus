# HVAC Project Catcher Plus 1.2

[![Live Web App](https://img.shields.io/badge/Live%20Web%20App-Open%20App-0F2C59?style=for-the-badge)](https://goanarchy.github.io/HVAC-Project-Catcher-Plus/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Vanilla JS](https://img.shields.io/badge/Vanilla%20JS-ES2020-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![No Build Step](https://img.shields.io/badge/Build-None-10B981)](#inicio-rápido)
[![Offline First](https://img.shields.io/badge/Offline--First-localStorage-0F2C59)](#datos-y-privacidad)
[![Bilingual](https://img.shields.io/badge/UI-English%20%2F%20Español-a855f7)](#interfaz)
[![NJ Sales Tax](https://img.shields.io/badge/NJ%20Sales%20Tax-6.625%25-c2410c)](#impuestos-y-notas-de-new-jersey)

> **Local-first HVAC quoting and proposal builder for New Jersey contractors.**
> Presupuestos HVAC por etapas, comparación de proveedores, control de materiales, checklist de completitud y propuesta PDF para el cliente. Funciona sin instalación, sin servidor y sin cuenta en la nube.

**Demo en vivo / Live demo:** https://goanarchy.github.io/HVAC-Project-Catcher-Plus/

**HVAC Project Catcher Plus 1.2** es una aplicación web local (HTML/CSS/JS vanilla, sin build) para pequeñas empresas HVAC en **New Jersey**. Ayuda a crear cotizaciones y propuestas profesionales por etapas, evitar olvidos con un checklist, comparar proveedores, generar PDF para el cliente y listas/RFQ para proveedores.

- **Nombre:** HVAC Project Catcher Plus **v1.2**
- **Plataforma:** abre con `start.bat` (Edge/Chrome en modo app) o `index.html`.
- **Interfaz:** bilingüe (**Español / English**) con cambio de idioma; **modo noche por defecto** con toggle claro/oscuro.
- **Datos:** guardados localmente en `localStorage` del navegador (clave `pcp_state_v1_v1`) en esta PC/perfil.
- **Moneda/impuestos:** USD, Sales Tax NJ **6.625%** (modos orientativos: capital improvement, reparación, materiales, personalizado).

---

## Inicio rápido

### Opción A — Windows (recomendado)

1. Descarga o clona el repositorio.
2. Doble clic en **`start.bat`**.
3. Se abre la app en Edge/Chrome en modo aplicación.

### Opción B — Cualquier navegador

1. Abre **`index.html`** directamente en un navegador moderno.
2. No requiere instalar dependencias, Node.js ni servidor.

### Opción C — GitHub Pages

Si el workflow de Pages está activo, abre la URL publicada del repositorio (se muestra en la sección **About** del repo).

> **Importante:** los datos se guardan en el `localStorage` del navegador/perfil que uses. Si cambias de navegador, de PC o limpias los datos del sitio, necesitas un respaldo JSON.

---

## Qué incluye

- **Wizard de 8 pasos** con checklist de completitud y puntaje en vivo.
- **Paso de mantenimiento dinámico:** aparece cuando el alcance incluye `maint`; calcula equipos, visitas, materiales y contrato, y se refleja en totales, checklist y PDF.
- **Empresa configurable:** datos, licencias (HIC/Master HVACR), seguros, logo local con vista previa y guardado explícito.
- **Proveedores:** selección por proyecto, comparación de precios, portal/cotización, correos RFQ solo si están configurados.
- **Catálogo profesional:** equipos, ductería, fontanería HVAC/PVC, mini-splits, sistemas centrales, controles, eléctrico, aislamientos, IAQ y más.
- **Ofertas/promociones** con ahorro, precio anterior y vigencia.
- **Propuesta PDF para el cliente:** sin listado detallado de materiales, con alcance, equipos/marcas, tiempos, pagos, garantía, inclusiones/exclusiones e impuestos.
- **Modo en línea:** indicador de conexión, logos en vivo con fallback y carga de JSON desde URL compatible con CORS.
- **Respaldo local:** cargar/guardar JSON y catálogo CSV, sin depender de la nube.

---

## Interfaz

- **Idioma:** cambio ES/EN desde la barra superior; todas las etiquetas, ayudas, modales y PDF respetan el idioma activo.
- **Tema:** oscuro por defecto, con toggle claro/oscuro persistente.
- **Edición estable:** los campos editables están marcados y mantienen el foco mientras se escribe; los totales se actualizan sin reconstruir el formulario.
- **Diseño:** tarjetas, modales alineados, formularios con unidad/medida y tooltips de ayuda en los puntos clave de una cotización HVAC en NJ.

---

## Flujo de cotización (8 pasos)

1. **Alcance y cliente:** nombre del proyecto, cliente/contacto, tipo de cliente, sistemas, ubicación, descripción del trabajo, fechas y condiciones para el cliente (**tiempo de entrega/ejecución**, **forma de pago**, plazo de equipos, garantía).
2. **Selección de proveedores:** elige uno o varios proveedores para el proyecto. La selección filtra catálogo/precios en las siguientes etapas; con 2+ proveedores puedes **comparar precios** del mismo producto cuando existan alternativas en catálogo.
3. **Equipos y accesorios:** condensadoras, manejadoras, mini-splits, termostatos, etc., agrupados por **marca** (con logos).
4. **Fletes y logística:** entrega, izaje, almacenaje, movilización.
5. **Rentas e indirectos:** plataformas, grúas, herramientas, oficina de obra.
6. **Materiales:** categorías completas y subgrupos profesionales (fontanería/PVC y condensados, cobre/tuberías y line sets, ductería/rejillas, eléctrico, controles/cableado, aislamientos, refrigerantes/consumibles, soportería/herrajes, filtración/IAQ, civil/bases, seguridad/EPP, varios).
7. **Mano de obra y servicios:** horas, permisos, arranque/comisionamiento, disposición y otros servicios.
8. **Mantenimiento (si aplica):** equipos, visitas, precio por visita, materiales y meses de contrato.
9. **Resumen:** factor de utilidad, contingencia, descuento, modo de impuesto y generación de propuesta PDF. Cada campo incluye explicación y unidad/medida.

> El paso de mantenimiento se inserta antes del resumen solo cuando el alcance lo incluye; el resto del tiempo el wizard mantiene 8 pasos.

---

## Catálogo, precios y reglas de proveedores

- Ítems con categoría/subcategoría, nombre, marca/modelo/SKU (cuando aplica), proveedor, costo, unidad, **qué incluye**, fecha/fuente/enlace y ofertas/promociones con ahorro.
- Los precios se muestran como **referencia** hasta confirmarlos. Usa **“Actualizar precios”** dentro del proyecto para revisar ítems, abrir **Ver precio**, guardar costo real y fecha de confirmación.
- **Consistencia proveedor–producto:** si un ítem proviene del catálogo (`catalogId`), su proveedor queda vinculado al catálogo y **no se puede cambiar** a un proveedor que no ofrece ese ítem. Para usar otro proveedor, agrega el ítem equivalente de ese proveedor.
- **Proveedores no seleccionados en cotizaciones existentes:** si un ítem pertenece a un proveedor que no está seleccionado en el paso 2, se marca en **rojo** con advertencia y opción **“Buscar en otro proveedor”**, mostrando alternativas de los proveedores seleccionados.
- **Ofertas:** pantalla de ofertas/promos activas con ahorro y vigencia para ayudar a reducir costos.
- **Categorías mixtas:** los materiales se agrupan por función (no por proveedor) para que puedas comparar y mezclar proveedores en una misma instalación.

---

## Proveedores y RFQ

- Proveedores precargados (NJ, editables): Home Depot Pro Desk, Lowe’s Pro, Grainger, Ferguson HVAC, Johnstone Supply, SupplyHouse, Carrier Enterprise, United Rentals, Sunbelt, HD Rental, Local, Manual.
- Los correos se dejan en blanco a propósito (`pendiente de confirmar`). Configúralos en **Proveedores**; la app genera borradores `mailto:` y listas RFQ, pero **no inventa correos**.
- Puedes agregar/editar proveedores, teléfonos, URLs y notas.

---

## Propuesta PDF para el cliente

La propuesta es profesional y orientada al cliente. Incluye:

- Información de la empresa (logo, datos, licencias/seguros si se configuran) y del cliente/proyecto.
- Alcance y **descripción general** del trabajo/servicios según la información disponible.
- **Equipos y marcas** con logos legibles.
- **Tiempos de entrega/ejecución y plazo de equipos**.
- **Forma de pago, garantía y condiciones**, coherentes con el cronograma mostrado en la app.
- **Inclusiones y exclusiones** del trabajo.
- Resumen comercial, impuestos y términos de aceptación.

**No incluye listado detallado de materiales.** La lista de materiales/RFQ es para uso interno y cotización con proveedores.

---

## Impuestos y notas de New Jersey (orientativas)

- **Sales tax estatal:** 6.625% (sin recargos locales).
- **Capital improvement** con **Form ST-8:** mano de obra exenta en ese contexto; materiales/equipos tributables (la app puede incorporar el tax de materiales al costo interno según modo).
- **Reparación/mantenimiento:** mano de obra y materiales sujetos al impuesto (según configuración).
- Contrato escrito recomendado/requerido según monto; número **HIC (13VH…)**, licencia **Master HVACR** y seguro según aplique. Confirme requisitos, depósitos y permisos con su contador/abogado/municipio.

> La tasa se muestra como **porcentaje** en la interfaz y se guarda como decimal internamente. Revisa siempre los totales antes de enviar una oferta.

---

## Motor de completitud y cálculo

- **Checklist/puntaje de completitud** para evitar olvidos (alcance, cliente, descripción, entrega/forma de pago, partidas clave, precios/fechas, “qué incluye”, margen, impuestos/ST-8, HIC/licencia/seguro, mantenimiento, etc.).
- **Cálculo:** costo → precio por etapa/markup, contingencia, factor de utilidad, descuento e impuesto según modo; reporta costo total, venta, utilidad, margen/markup y depósito.
- **Pagos:** el cronograma se sincroniza con el depósito configurado y con la forma de pago/condiciones del proyecto, y se refleja igual en la app y en el PDF.

---

## Datos y privacidad

- Todo el estado vive en **`localStorage`** (`pcp_state_v1_v1`): empresa, proveedores, catálogo y proyectos.
- **No hay backend, cuentas ni telemetría.** Nada se envía a un servidor propio.
- Las funciones en línea (logos, importar JSON desde URL) solo se activan cuando hay internet y el recurso lo permite.
- Usa **Guardar JSON** con frecuencia y conserva copias fuera del navegador. Para mover datos a otra PC/perfil, usa **Cargar JSON**.

---

## Modo en línea (datos y logos en vivo)

La app funciona localmente y, cuando hay internet, aprovecha datos/recursos en vivo:

- **Indicador de conexión:** la barra lateral muestra estado **En línea / Sin conexión** y avisa al cambiar.
- **Logos en vivo:** logos de **marcas y proveedores** se cargan desde fuentes en línea basadas en dominio (p. ej. Clearbit y favicons públicos) con **cadena de respaldo automático**; si no hay conexión o no cargan, se muestran iniciales/insignias locales.
- **Logo de empresa en vivo:** en **Empresa** puedes usar un archivo local o una **URL de logo en vivo**.
- **Cargar JSON desde URL (en vivo):** en **Empresa → Respaldo, datos en vivo y sincronización** puedes obtener e importar un respaldo/estado JSON desde una URL (requiere internet y que la URL permita **CORS**).
- **Verificación de precios:** los enlaces/portales de proveedores abren información en vivo. Por ser una app de navegador sin backend, **no hace scraping automático** de precios de sitios de proveedores (limitaciones de CORS/anti-bot). Los precios del catálogo son referencia hasta confirmarlos y guardarlos con fecha.
- Si no hay conexión, la app sigue operando con los datos locales guardados y respaldos.

---

## Estructura del repositorio

```
Project_Catcher_Plus/
├── index.html                  # Shell de la app y orden de carga de scripts
├── styles.css                  # Tema claro/oscuro, layout, tarjetas, modales, PDF
├── start.bat                   # Lanzador local (Edge/Chrome en modo app)
├── README.md
├── LICENSE
├── PROJECT_CONTEXT.md          # Contexto técnico: arquitectura, estado y flujos
├── RELEASE_NOTES.md            # Novedades de la versión
├── NEXT_VERSION_ROADMAP.md     # Próximas mejoras
├── docs/
│   ├── ARCHITECTURE.md         # Detalle de módulos, datos y cálculos
│   ├── QA_CHECKLIST.md         # Pruebas manuales ES/EN, temas, offline
│   └── DEPLOYMENT.md           # Ejecución local y GitHub Pages
├── .github/
│   └── workflows/
│       └── deploy-pages.yml    # Publicación automática en GitHub Pages
└── js/
    ├── data.js                 # Catálogo semilla, categorías/marcas, proveedores, defaults NJ
    ├── i18n.js                 # Textos ES/EN, helpers de idioma/tema y logo SVG
    ├── store.js                # Estado, migración, cálculo, checklist, import/export
    ├── ui.js                   # Renderizado de pantallas, wizard, logos en vivo, PDF y modales
    └── app.js                  # Arranque, router, eventos, acciones online y conexión
```

### Orden de carga (crítico)

`js/data.js` → `js/i18n.js` → `js/store.js` → `js/ui.js` → `js/app.js`

Todos los módulos comparten el namespace `window.PCP`. No hay bundler ni módulos ES; el orden de los `<script>` debe mantenerse.

---

## Desarrollo y verificación

- Requiere solo un navegador moderno (Edge/Chrome). Sin dependencias.
- Validación de sintaxis:

```bash
node --check js/data.js
node --check js/i18n.js
node --check js/store.js
node --check js/ui.js
node --check js/app.js
```

- Pruebas manuales recomendadas: consulta [`docs/QA_CHECKLIST.md`](./docs/QA_CHECKLIST.md).
- Antes de publicar cambios: verifica ES/EN, tema claro/oscuro, creación de proyecto, guardado de empresa/logo, mantenimiento, totales/impuesto/pagos y PDF.

---

## Documentación

- [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) — arquitectura, modelo de estado y flujos.
- [RELEASE_NOTES.md](./RELEASE_NOTES.md) — cambios de la versión 1.2.
- [NEXT_VERSION_ROADMAP.md](./NEXT_VERSION_ROADMAP.md) — mejoras planificadas.
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — detalle técnico.
- [docs/QA_CHECKLIST.md](./docs/QA_CHECKLIST.md) — lista de verificación.
- [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) — despliegue local y GitHub Pages.

---

## Licencia

MIT © 2026 Goanarchy. Ver [`LICENSE`](./LICENSE).

---

*HVAC Project Catcher Plus 1.2 — herramienta de estimación interna. Los precios del catálogo son referencias y deben confirmarse con cotización real del proveedor/sucursal antes de enviar la oferta. Verifique licencias, seguros, impuestos y requisitos locales con profesionales correspondientes. No afiliado a proveedores ni marcas mencionadas.*
