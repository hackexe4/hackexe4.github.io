# 6. Los recursos visuales llevan imagen, guardada en el repositorio

Fecha: 2026-10-04 · Estado: aceptado

## Contexto

El 04-10-2026 se añadieron al directorio cinco estilos de eXeLearning (fichas
`exe_0033` a `exe_0037`). En un estilo lo que importa es el aspecto, y una
descripción en texto no basta para elegir entre ellos: hace falta verlos. Hasta
entonces las fichas solo tenían texto y código.

## Decisión

- Dos campos opcionales en `HackeXe4.json`: `imagen`, la imagen que se ve en la
  ficha, y `miniatura`, la que se ve en la tarjeta de la lista. Si falta la
  miniatura, la tarjeta usa la imagen.
- Las imágenes se guardan en `img/`, dentro del repositorio, en WebP: la
  imagen a 1200 px de ancho y la miniatura a 600 px.
- En la ficha, la imagen se amplía al pulsarla, al mayor tamaño que cabe en la
  ventana, con un enlace para descargarla. El visor es un `<dialog>` nativo y
  se cierra con Escape, con su botón o pulsando fuera.
- Las imágenes de los estilos son las capturas que publica su autor en cada
  repositorio (`.github/screenshot.png`, CC0), convertidas a WebP.

## Alternativas descartadas

- **Enlazar las capturas desde GitHub** (`raw.githubusercontent.com`): cada
  visita pediría las imágenes a otro servidor, y la ficha se quedaría sin
  imagen si el autor mueve o renombra el archivo.
- **Una sola imagen para la tarjeta y la ficha**: la lista de estilos
  cargaría 222 KB en vez de 72 KB.
- **Generar la miniatura en el navegador o en un proceso de publicación**:
  añade una pieza que mantener para cinco archivos que se convierten una vez.

## Consecuencias

Las tarjetas con imagen son más altas que las demás. Añadir una ficha con
imagen exige convertir y guardar dos archivos, y la imagen ajena se acredita en
`TERCEROS.md`. Karla no recibe las imágenes: el Markdown que se genera para su
cuaderno ignora estos campos.

## Validación

Probado con `probar-web` en Chromium, Firefox y WebKit, en escritorio, móvil y
tableta, con tema claro y oscuro: lista de la categoría «Estilos», ficha,
apertura del visor, descarga, cierre con Escape (sin salir de la ficha) y
cierre pulsando fuera. Sin errores de JavaScript, recursos fallidos ni
desbordamiento horizontal.
