# HackeXe4

**Directorio de recursos para [eXeLearning](https://exelearning.net) 4+**

🌐 **[hackexe4.github.io](https://hackexe4.github.io)**

---

## ¿Qué es?

HackeXe4 es un directorio de recursos (HTML, CSS, JavaScript) listos para pegar en eXeLearning sin necesidad de conocimientos de programación. Permiten ampliar las funcionalidades del programa más allá de lo que ofrecen sus iDevices por defecto.

Compatibles con **eXeLearning 4 y superiores**. Para la versión 2.9 visita [hackexe.tiddlyhost.com](https://hackexe.tiddlyhost.com).

## Características

- **Búsqueda** en tiempo real por cualquier campo
- **Filtrado por categorías** desde la barra lateral
- **Vista de código** con resaltado de sintaxis (HTML, CSS, JavaScript)
- **Copiar con un clic** para pegar directamente en eXeLearning
- **Compartir recursos** mediante URL: una vista, un recurso concreto o una selección personalizada
- **Modo claro/oscuro** automático y manual
- Los recursos se guardan en `HackeXe4.json`, dentro del propio repositorio

## Uso

Abre la web, busca o navega por categorías, y copia el código del recurso que necesites en el iDevice correspondiente de eXeLearning.

Para compartir un recurso o una selección, usa el botón **Compartir** — genera una URL que abre directamente esos recursos.

## Datos

Los recursos están en `HackeXe4.json`, una lista con un objeto por recurso. Es el único archivo de datos: lo lee la aplicación y, cuando cambia, el cuaderno de NotebookLM de eXeLearning (Karla) recibe al día siguiente una versión en Markdown generada a partir de él.

Campos:

| Campo | Descripción |
|---|---|
| `id` | Identificador único (`exe_0001`) |
| `titulo` | Nombre del recurso |
| `resumen` | Texto breve de la tarjeta |
| `descripcion` | Explicación y modo de uso, en Markdown |
| `donde` | Lugares de eXeLearning donde se pega (lista) |
| `script` | Código listo para copiar; vacío si el recurso es una herramienta o un enlace |
| `etiquetas` | Palabras clave (lista) |
| `categorias` | Categorías (lista) |
| `relacionados` | IDs de recursos relacionados (lista) |
| `fuente` | Autoría y procedencia, en Markdown |

## Tecnología

Aplicación web estática — HTML, CSS y JavaScript vanilla, sin frameworks ni dependencias locales. Resaltado de sintaxis con [highlight.js](https://highlightjs.org/).

Alojada en GitHub Pages.

## Cómo modificarlo

**Archivos**

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura de la página: cabecera, barra de categorías, vistas y pie |
| `app.js` | Todo el funcionamiento; la cabecera del archivo explica cómo está organizado |
| `style.css` | Aspecto, con los colores de los temas claro y oscuro al principio |
| `HackeXe4.json` | Los recursos |
| `docs/adr/` | Las decisiones del proyecto y su motivo |

**Añadir un recurso**

1. Añade un objeto al final de `HackeXe4.json` con el `id` siguiente al último (`exe_0033`, `exe_0034`…) y los campos del apartado «Datos».
2. Si es un fragmento de código, pon en `script` el código completo y en `donde` el lugar de eXeLearning donde se pega. Si es una ficha de un programa o una web, deja los dos vacíos.
3. En `relacionados`, los `id` de los recursos con los que se relaciona.
4. Para crear una categoría nueva basta con escribir su nombre en `categorias`: aparece sola en la barra lateral.

**Probarlo en local**

La página carga el JSON, y los navegadores no lo permiten si se abre el archivo directamente desde el disco. Hay que servir la carpeta, por ejemplo con `python3 -m http.server 8000`, y abrir `http://localhost:8000`.

**Publicarlo**

Basta con subir los cambios a `main`: GitHub Pages publica la web en unos segundos. Añadir o corregir recursos no cambia la versión; si cambia la aplicación, se actualiza el número del pie de `index.html` y se crean la etiqueta y la release ([ADR 5](docs/adr/0005-version-a-mano-con-etiqueta.md)).

## Uso de IA

Esta aplicación se ha programado con ayuda de IA, en [cocreación, nivel 4 del MIAE](https://jjdeharo.github.io/miae/?nivel=4): el autor ha elegido los recursos, ha decidido el diseño y las funciones, y ha probado el programa para detectar errores y aspectos que mejorar.

## Licencia

- Código de la aplicación: [GNU AGPL v3 o posterior](LICENSE).
- Textos, documentación y recursos del directorio, incluido su código: [CC BY-SA 4.0](LICENSE-CONTENIDOS).
- Recursos de terceros: [TERCEROS.md](TERCEROS.md).

Las decisiones del proyecto se registran en [docs/adr](docs/adr/README.md).
