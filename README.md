# Planes

Web de planes cerca de casa: rutas en moto (y más adelante montaña, escapadas…).
Publicada en **https://cmarrades.github.io/plans/** — cada push a `main` la vuelve a publicar.

## Cómo está organizado

Todo el contenido son datos en `src/data/`; las páginas se generan solas.

| Archivo | Qué es |
|---|---|
| `countries.json` | Países (idioma, km/millas, moneda) |
| `cities.json` | Ciudades base: desde donde se calculan los tiempos de los listados |
| `categories.json` | Actividades: `moto`, `montana`, `escapadas`… (`status: "soon"` = próximamente) |
| `plans/<país>/<slug>.json` | Un plan por archivo |

URLs que se generan:

- `/` → portada de la ciudad por defecto
- `/es/valencia/` → portada de una ciudad
- `/es/valencia/moto/` → listado de una categoría, ordenado por tiempo total
- `/es/calderona/moto/serra-garbi/` → detalle (ligado a la zona de la ruta, no a la ciudad)

## Añadir un plan

Copia uno de `src/data/plans/es/` y cambia:

- `stops`: las paradas del **núcleo** de la ruta, en orden. Es agnóstico de la ciudad: el recorrido completo
  (salida → paradas → vuelta) se calcula en el navegador desde donde salga cada uno.
- `bases`: cuánto se tarda desde cada ciudad base hasta el inicio (`minutes`, `km`). Para que aparezca en el
  listado de otra ciudad, añade otra base.
- `core`: km y minutos del núcleo.
- `eats`: sitios para comer; `near` = id de la parada junto a la que están.
  `approachEats` = sitios de camino (con `lat`/`lng`), solo se muestran si quedan a menos de 2 km de tu recorrido.
- `tips`: consejos.

## Añadir una ciudad, país o actividad

Añade una entrada en `cities.json`, `countries.json` o `categories.json`. Para activar una categoría
pon `"status": "active"`; aparecerá en cuanto tenga algún plan.

## Desarrollo

```bash
npm install
npm run dev     # http://localhost:4321/plans/
npm run build
```

Mapas: Leaflet + OpenStreetMap. Rutas por carretera: OSRM (servidor público de demostración).
Geocodificación de direcciones: Nominatim.
