# 1. Web estática en GitHub Pages, con las bibliotecas cargadas desde CDN

Fecha: 2026-09-30 · Estado: aceptado

Registra retroactivamente cómo está construida la aplicación desde su
primera versión.

## Contexto

HackeXe4 es un directorio de consulta: muestra recursos, permite buscarlos,
filtrarlos y copiarlos. No necesita cuentas, ni guardar nada en un servidor, ni
procesar datos fuera del navegador.

## Decisión

- La aplicación son tres archivos sin compilar (`index.html`, `app.js` y
  `style.css`), en JavaScript sin frameworks, publicados en GitHub Pages desde la
  organización `hackexe4`.
- El resaltado de sintaxis (highlight.js 11.9.0, desde cdnjs) y la conversión de
  Markdown (marked 12, desde jsDelivr) se cargan de una CDN. Sus licencias están
  en [TERCEROS.md](../../TERCEROS.md).
- Lo que se comparte (una vista, un recurso o una selección) viaja en la
  dirección de la página, sin servidor.

## Alternativas descartadas

- **Un generador de sitios o un framework**: añade una compilación y
  dependencias sin ninguna ventaja para un directorio de este tamaño.
- **Copiar las bibliotecas al repositorio**: haría que la copia descargada
  funcionara entera sin internet, pero la web publicada necesita conexión de
  todos modos. Queda como opción si se quiere ofrecer una versión descargable.

## Consecuencias

Cualquiera puede leer y modificar el código sin instalar nada. Sin conexión, el
código de los recursos se ve sin colores y las descripciones sin formato: el
programa comprueba si `hljs` y `marked` existen y, si no, muestra el texto tal
cual.

## Evidencia

`index.html` carga `highlight.min.js` y `marked.min.js` al final del cuerpo;
`app.js` comprueba `typeof marked` y `typeof hljs` antes de usarlos.
