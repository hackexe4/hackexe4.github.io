# 5. La versión se fija a mano al publicar, con su etiqueta

Fecha: 2026-09-30 · Estado: aceptado

## Contexto

El workflow `bump-version.yml` sumaba uno a la versión del pie en cada push a
`main` y lo subía con un commit automático. No llegó a funcionar nunca: GitHub
le negaba el permiso para subir ese commit, así que el pie se quedó en la 1.0.3
mientras se publicaban cambios. Además, un push no equivale a una versión: un mismo trabajo puede
llevar varios, y la versión debe corresponderse con una etiqueta y unas notas.

## Decisión

Se elimina el workflow. Al publicar una versión se cambia a mano el número del
pie de `index.html`, enlazado a sus notas, se crea la etiqueta `vX.Y.Z` y la
release con las notas. Una etiqueta publicada no se mueve ni se reutiliza.

## Alternativas descartadas

- **Arreglar el workflow**: seguiría creando una versión por push, sin notas y
  distinta de las etiquetas.
- **Crear la versión desde la etiqueta con un workflow**: automatiza un paso de
  un minuto a cambio de otra pieza que mantener.

## Consecuencias

La versión del pie, la etiqueta y la release siempre coinciden. Publicar exige
acordarse de cambiar el pie.

## Evidencia

`gh run list -w "Bump version"`: las 28 ejecuciones del 06-05-2026 al
26-07-2026 acaban en fallo, con «Permission to hackexe4/hackexe4.github.io.git
denied to github-actions[bot]» (error 403). En la v1.0.4 el workflow ya no encontraba la versión, porque
el pie pasó a ser un enlace, y terminaba sin hacer nada.
