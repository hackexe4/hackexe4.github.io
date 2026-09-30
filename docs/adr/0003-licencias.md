# 3. AGPL para el código de la aplicación y CC BY-SA para los recursos

Fecha: 2026-09-30 · Estado: aceptado

## Contexto

El pie de la web ya declaraba CC BY-SA para el contenido y AGPLv3 para el
código, pero el repositorio no tenía los textos de las licencias. Además, en
HackeXe4 el contenido es en buena parte código: cada recurso es un fragmento de
HTML, CSS o JavaScript pensado para pegarse en un proyecto de eXeLearning.

## Decisión

- El código de la aplicación (`index.html`, `app.js`, `style.css`) se publica
  con la GNU AGPL v3 o posterior: texto en `LICENSE` y línea
  `SPDX-License-Identifier: AGPL-3.0-or-later` al principio de cada archivo.
- Los textos, la documentación y los recursos del directorio, incluido el código
  de cada recurso, se publican con CC BY-SA 4.0: texto en `LICENSE-CONTENIDOS`.
- Las bibliotecas y los iconos ajenos se acreditan en `TERCEROS.md`, y los
  recursos que parten de obra ajena, en su campo «fuente».

## Alternativas descartadas

- **AGPL también para el código de los recursos**: obligaría a publicar con esa
  licencia los materiales de eXeLearning donde se pega un fragmento, algo
  desproporcionado para unas líneas de código y ajeno a lo que ya decía el pie.

## Consecuencias

Un material hecho con eXeLearning que use un recurso debe reconocer la autoría y
compartirse con la misma licencia o una compatible, como cualquier otro
contenido CC BY-SA.

## Riesgos y limitaciones

Los recursos que parten de obra ajena (por ejemplo, `exe_0002` y `exe_0004`)
dependen de las condiciones de su autor original, que no constan en el
repositorio.
