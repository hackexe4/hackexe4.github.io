# 2. Los recursos se guardan en un JSON dentro del repositorio

Fecha: 2026-09-30 · Estado: aceptado

Registra retroactivamente la decisión del 28-05-2026 (commit `2dc53c9`).

## Contexto

Hasta mayo de 2026 la aplicación leía los recursos de una hoja de Google Sheets
pública, con `HackeXe4.csv` como copia local por si la hoja no respondía. Eso
hacía depender cada visita de un servicio de Google y obligaba a interpretar
CSV en el navegador, con campos de lista escritos como texto separado por comas.

## Decisión

- La aplicación lee solo `HackeXe4.json`, servido desde el propio repositorio.
- Las etiquetas, categorías, recursos relacionados y lugares de inserción son
  listas reales en el JSON, no texto que haya que partir.
- La hoja de cálculo sigue siendo el lugar donde se editan los recursos. Al
  cambiarla, se regeneran `HackeXe4.json` y la copia `HackeXe4.csv`, y se suben
  al repositorio.

## Alternativas descartadas

- **Seguir leyendo la hoja en cada visita**: dependencia de Google para quien
  solo quiere consultar, y un fallo de la hoja dejaba la página sin datos
  actualizados.
- **Editar el JSON a mano**: posible, pero la hoja es más cómoda para escribir
  textos largos y código.

## Consecuencias

La web no hace ninguna petición a Google. Un recurso nuevo no aparece hasta que
se regenera el JSON y se publica.

## Evidencia

Commit `2dc53c9` («migrar datos de CSV a JSON con campos tipados»): elimina el
lector de CSV y la dirección de la hoja. Commit `5a5a05f`: primera
regeneración del JSON y del CSV desde la hoja.

## Riesgos y limitaciones

Hipótesis pendiente de validación: el repositorio no guarda el procedimiento de
regeneración, así que no consta cómo se hace ni si el CSV sigue haciendo falta.
El apartado «Datos» del README todavía describe la carga desde la hoja.
