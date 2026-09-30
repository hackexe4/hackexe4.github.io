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
- Los recursos se añaden y se corrigen en `HackeXe4.json`, que es el único archivo
  de datos. La copia `HackeXe4.csv`, que la aplicación no leía desde mayo, se
  eliminó el 30-09-2026: se había desincronizado y obligaba a hacer cada cambio
  dos veces.
- El cuaderno de NotebookLM de eXeLearning (Karla) no lee la hoja de cálculo,
  sino un Markdown generado a partir del JSON en su actualización diaria.

## Alternativas descartadas

- **Seguir leyendo la hoja en cada visita**: dependencia de Google para quien
  solo quiere consultar, y un fallo de la hoja dejaba la página sin datos
  actualizados.
- **Mantener la hoja como origen y regenerar el JSON desde ella**: dos copias de
  los mismos datos que hay que mantener de acuerdo, sin ventaja para quien
  consulta el directorio.

## Consecuencias

La web no hace ninguna petición a Google. Un recurso nuevo aparece en cuanto se
publica el JSON, y llega a Karla en la siguiente actualización diaria.

## Evidencia

Commit `2dc53c9` («migrar datos de CSV a JSON con campos tipados»): elimina el
lector de CSV y la dirección de la hoja. Commit `5a5a05f`: primera
regeneración del JSON y del CSV desde la hoja.
