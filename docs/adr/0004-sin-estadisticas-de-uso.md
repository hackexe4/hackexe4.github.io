# 4. La web no recoge estadísticas de uso

Fecha: 2026-09-30 · Estado: aceptado

## Contexto

Desde el 08-05-2026 (commit `960df32`) la web enviaba cada visita al sistema propio de
estadísticas alojado en bilateria.org (`/app/estadistica/hackexe4/track.php`),
con la dirección de la página, la procedencia y las etiquetas `utm_*`, y
guardaba en `localStorage` la hora de la última visita. Aunque no registraba IP
ni identificadores, era un envío a un servidor que la aplicación no necesita
para funcionar, contrario a la pauta de no añadir analítica ni contadores de
visitas.

## Decisión

Se retira toda la analítica: las etiquetas `meta` de configuración, el código de
`app.js` que programaba el envío, el aviso del pie y la línea del README.

## Alternativas descartadas

- **Mantenerla, dado que no registra datos personales**: sigue siendo un envío
  a un servidor por cada visita, sin utilidad para quien consulta el directorio.

## Consecuencias

La web solo hace peticiones a su propio origen y a las CDN de las bibliotecas.
Deja de haber cifras de visitas de HackeXe4. La clave
`analytics:last-visit:hackexe4` que ya tengan los navegadores queda sin uso.

## Validación

Tras el cambio, `app.js`, `index.html`, `style.css` y `README.md` no contienen
ninguna referencia a `analytics` ni a `estadistica`.
