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

Los recursos están en `HackeXe4.json`, una lista con un objeto por recurso. Es el único archivo de datos: la aplicación lo lee y el cuaderno de NotebookLM de eXeLearning (Karla) recibe cada día una versión en Markdown generada a partir de él.

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

## Licencia

- Código de la aplicación: [GNU AGPL v3 o posterior](LICENSE).
- Textos, documentación y recursos del directorio, incluido su código: [CC BY-SA 4.0](LICENSE-CONTENIDOS).
- Recursos de terceros: [TERCEROS.md](TERCEROS.md).

Las decisiones del proyecto se registran en [docs/adr](docs/adr/README.md).
