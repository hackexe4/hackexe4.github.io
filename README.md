# HackeXe

**Directorio de recursos para [eXeLearning](https://exelearning.net) 4+**

🌐 **[hackexelearning.github.io](https://hackexelearning.github.io)**

---

## ¿Qué es?

HackeXe es un directorio de recursos (HTML, CSS, JavaScript) listos para pegar en eXeLearning sin necesidad de conocimientos de programación. Permiten ampliar las funcionalidades del programa más allá de lo que ofrecen sus iDevices por defecto.

Compatibles con **eXeLearning 4 y superiores**. Para la versión 2.9 visita [hackexe.tiddlyhost.com](https://hackexe.tiddlyhost.com).

## Características

- **Búsqueda** en tiempo real por cualquier campo
- **Filtrado por categorías** desde la barra lateral
- **Vista de código** con resaltado de sintaxis (HTML, CSS, JavaScript)
- **Copiar con un clic** para pegar directamente en eXeLearning
- **Compartir recursos** mediante URL: una vista, un recurso concreto o una selección personalizada
- **Modo claro/oscuro** automático y manual
- Los datos se cargan desde una hoja de Google Sheets pública — añadir un recurso es inmediato

## Uso

Abre la web, busca o navega por categorías, y copia el código del recurso que necesites en el iDevice correspondiente de eXeLearning.

Para compartir un recurso o una selección, usa el botón **Compartir** — genera una URL que abre directamente esos recursos.

## Datos

Los recursos se gestionan en una hoja de Google Sheets con las columnas:

| Columna | Descripción |
|---|---|
| ID | Identificador único (`exe_0001`) |
| Título | Nombre del recurso |
| Descripción | Explicación y modo de uso |
| Donde insertar | Lugar de eXeLearning donde se pega |
| Script | Código listo para copiar |
| Etiquetas | Palabras clave separadas por comas |
| Categorías | Categoría o categorías separadas por comas |
| Relacionados | IDs de recursos relacionados separados por comas |

## Tecnología

Aplicación web estática — HTML, CSS y JavaScript vanilla, sin frameworks ni dependencias locales. Resaltado de sintaxis con [highlight.js](https://highlightjs.org/).

Alojada en GitHub Pages.
