'use strict';

/* ─── Config ────────────────────────────────────────────── */
const JSON_URL = 'HackeXe4.json';
const ANALYTICS_FALLBACK_ENDPOINT = 'https://bilateria.org/app/estadistica/hackexe4/track.php';
const ANALYTICS_FALLBACK_STATS_URL = 'https://bilateria.org/app/estadistica/hackexe4/admin-stats.php';
const ANALYTICS_VISIT_COOLDOWN_MS = 30 * 60 * 1000;
const ANALYTICS_TIMEOUT_MS = 4000;

/* ─── i18n ──────────────────────────────────────────────── */
const T = {
  appName:        'HackeXe4',
  appSub:         'Recursos para eXeLearning 4+',
  categories:     'Categorías',
  allCats:        'Todas',
  loading:        'Cargando recursos…',
  error:          'No se pudieron cargar los recursos.',
  errorSub:       'Comprueba tu conexión e inténtalo de nuevo.',
  retry:          'Reintentar',
  noResults:      'Sin resultados',
  noResultsSub:   'Prueba con otros términos de búsqueda',
  scripts:        n => `${n} recurso${n !== 1 ? 's' : ''}`,
  back:           'Volver',
  whereInsert:    'Dónde insertar el código',
  related:        'Recursos relacionados',
  copyCode:       'Copiar código',
  copied:         '¡Copiado!',
  viewCode:       'Ver recurso',
  summary:        'Resumen',
  description:    'Descripción',
  source:         'Fuente',
  share:          'Compartir',
  shareView:      'Compartir vista',
  shareScript:    'Compartir este recurso',
  shareSelected:  'Compartir selección',
  select:         'Seleccionar',
  cancelSelect:   'Cancelar',
  selected:       n => `${n} seleccionado${n !== 1 ? 's' : ''}`,
  selectHint:     'Selecciona recursos para compartir',
  sharedSet:      n => `${n} recurso${n !== 1 ? 's' : ''} compartido${n !== 1 ? 's' : ''}`,
  viewAll:        'Ver todos',
  list:           'Lista',
  map:            'Mapa',
  exploreTitle:   'Mapa de contenidos',
  categoriesAndTags: 'Categorías y etiquetas',
  resourcesInMap: n => `${n} recurso${n !== 1 ? 's' : ''}`,
  linkCopied:     '¡Enlace copiado!',
  linkCopiedFail: 'No se pudo copiar el enlace',
};

const WHERE_INSERT_HELP = [
  {
    title: 'HTML del iDevice',
    body: 'El HTML se pega directamente en el iDevice, dispones de dos formas. (1) Pulsa el botón <em>Pegar fragmento HTML</em> (&lt;&gt;) para insertarlo en el lugar en el que se encuentra el cursor. (2) Pulsa el botón <em>HTML</em> para insertarlo directamente en el código del iDevice.'
  },
  {
    title: 'Pie del proyecto',
    body: 'Pulsa sobre Archivo -&gt; Propiedades del proyecto -&gt; Código personalizado -&gt; Pie de página.'
  },
  {
    title: 'Cabecera HTML',
    body: 'Pulsa sobre Archivo -&gt; Propiedades del proyecto -&gt; Código personalizado -&gt; HEAD.'
  },
  {
    title: 'HEAD de la página',
    body: 'Pulsa sobre Archivo -&gt; Propiedades del proyecto -&gt; Código personalizado -&gt; HEAD.'
  }
];

/* ─── Icons (inline SVG snippets) ───────────────────────── */
const IC = {
  link:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  check:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
  copy:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  back:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>`,
  home:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  next:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>`,
  where:  `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
  retry:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
  select: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`,
  map:    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><path d="M8.7 7.4 10.9 15"/><path d="M15.3 7.4 13.1 15"/><path d="M9 6h6"/></svg>`,
};

/* ─── State ─────────────────────────────────────────────── */
let allScripts     = [];
let activeCategory = '';
let searchQuery    = '';
let currentScript  = null;
let selectionMode  = false;
let selectedIds    = new Set();
let sharedScripts  = [];        // non-empty = shared-set view
let debounceTimer  = null;
let pendingURLState = null;     // URL state to apply after data loads
let navStack       = [];        // history stack for detail-to-detail navigation
let activeView     = 'list';    // list | map | detail
let detailReturnView = 'list';  // list | map
let detailMapState   = null;    // { visualFocus, mapHistory } saved when entering detail from map
let visualFocus    = null;      // { type: 'category' | 'tag' | 'script', value: string }
let mapHistory     = [];        // navigation history within the visual map

/* ─── DOM refs ──────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const dom = {};
function initDom() {
  Object.assign(dom, {
    searchInput:   $('searchInput'),
    catList:       $('catList'),
    totalCount:    $('totalCount'),
    listToolbar:   $('listToolbar'),
    statusMsg:     $('statusMsg'),
    cardGrid:      $('cardGrid'),
    listView:      $('listView'),
    exploreView:   $('exploreView'),
    detailView:    $('detailView'),
    appBody:       document.querySelector('.app-body'),
    themeToggle:   $('themeToggle'),
    sidebarToggle: $('sidebarToggle'),
    sidebar:       $('sidebar'),
    brandLink:     $('brandLink'),
    aboutBanner:   $('aboutBanner'),
    aboutClose:    $('aboutClose'),
    toast:         $('toast'),
    searchClear:   $('searchClear'),
    headerSearch:  $('headerSearch'),
    inputClear:    $('inputClear'),
  });
}


/* ─── Helpers ────────────────────────────────────────────── */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function renderWhereInsertHelp(id, label) {
  const item = WHERE_INSERT_HELP.find(h => h.title.toLowerCase() === label.toLowerCase());
  if (!item) return '';
  return `
    <div class="where-help" id="${escHtml(id)}" hidden>
      <p>${item.body}</p>
    </div>`;
}

function openExternalLinksInNewTab(html) {
  const tpl = document.createElement('template');
  tpl.innerHTML = html;

  tpl.content.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    try {
      const url = new URL(href, window.location.href);
      if (['http:', 'https:'].includes(url.protocol) && url.origin !== window.location.origin) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    } catch {
      // Ignore malformed URLs and leave the generated link untouched.
    }
  });

  return tpl.innerHTML;
}

function renderMarkdown(text) {
  if (typeof marked === 'undefined') {
    const html = text.split(/\n{2,}/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
    return openExternalLinksInNewTab(html);
  }
  return openExternalLinksInNewTab(marked.parse(text, { breaks: true }));
}

function stripMarkdown(text) {
  return text
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/#{1,6}\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/`{3}[\s\S]*?`{3}/g, '')
    .replace(/`(.+?)`/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/^\s*>\s*/gm, '')
    .replace(/\n+/g, ' ')
    .trim();
}


function normalizeStr(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

function compareTextEs(a, b) {
  return String(a || '').localeCompare(String(b || ''), 'es', { sensitivity: 'base' });
}

function compareScriptsByTitle(a, b) {
  return compareTextEs(a?.titulo, b?.titulo);
}

function sortScriptsByTitle(scripts) {
  return [...scripts].sort(compareScriptsByTitle);
}

function sortTermEntriesAlpha(entries) {
  return [...entries].sort((a, b) => compareTextEs(a[0], b[0]));
}

function stripMd(text) {
  return (text || '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/#+\s*/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

/* ─── Graph engine (canvas force-directed) ──────────────── */
const HG = {
  REPULSION:  14000,
  IDEAL_LEN:  115,
  ATTRACTION: 0.022,
  DAMPING:    0.80,
  GRAVITY:    0.0012,
  COOLING:    0.976,
  STOP_ALPHA: 0.002,
  CENTER_R:   24,
  NODE_R:     19,
  NODE_R_SM:  13,
  LABEL_H:    48,
};

const HPAL = {
  light: [
    { bg: '#EFF6FF', edge: '#93C5FD', stroke: '#2563EB', text: '#1D4ED8' },
    { bg: '#FFF7ED', edge: '#FED7AA', stroke: '#EA580C', text: '#C2410C' },
    { bg: '#ECFDF5', edge: '#86EFAC', stroke: '#16A34A', text: '#15803D' },
    { bg: '#FDF2F8', edge: '#F9A8D4', stroke: '#DB2777', text: '#BE185D' },
    { bg: '#F5F3FF', edge: '#C4B5FD', stroke: '#7C3AED', text: '#6D28D9' },
    { bg: '#FFFBEB', edge: '#FDE68A', stroke: '#D97706', text: '#B45309' },
    { bg: '#F0FDFA', edge: '#5EEAD4', stroke: '#0D9488', text: '#0F766E' },
    { bg: '#FFF1F2', edge: '#FECDD3', stroke: '#E11D48', text: '#BE123C' },
    { bg: '#F0F9FF', edge: '#7DD3FC', stroke: '#0284C7', text: '#0369A1' },
    { bg: '#F7F7FF', edge: '#C7D2FE', stroke: '#4F46E5', text: '#4338CA' },
    { bg: '#FFFBEB', edge: '#FEF3C7', stroke: '#CA8A04', text: '#A16207' },
    { bg: '#F0FDF4', edge: '#BBF7D0', stroke: '#059669', text: '#047857' },
  ],
  dark: [
    { bg: 'rgba(37,99,235,0.18)',  edge: '#60A5FA', stroke: '#93C5FD', text: '#BFDBFE' },
    { bg: 'rgba(234,88,12,0.18)',  edge: '#FB923C', stroke: '#FDBA74', text: '#FED7AA' },
    { bg: 'rgba(22,163,74,0.18)',  edge: '#4ADE80', stroke: '#86EFAC', text: '#BBF7D0' },
    { bg: 'rgba(219,39,119,0.18)', edge: '#F472B6', stroke: '#F9A8D4', text: '#FBCFE8' },
    { bg: 'rgba(124,58,237,0.18)', edge: '#A78BFA', stroke: '#C4B5FD', text: '#DDD6FE' },
    { bg: 'rgba(217,119,6,0.18)',  edge: '#FBBF24', stroke: '#FDE68A', text: '#FEF3C7' },
    { bg: 'rgba(13,148,136,0.18)', edge: '#2DD4BF', stroke: '#5EEAD4', text: '#99F6E4' },
    { bg: 'rgba(225,29,72,0.18)',  edge: '#FB7185', stroke: '#FECDD3', text: '#FFE4E6' },
    { bg: 'rgba(2,132,199,0.18)',  edge: '#38BDF8', stroke: '#7DD3FC', text: '#BAE6FD' },
    { bg: 'rgba(79,70,229,0.18)',  edge: '#818CF8', stroke: '#A5B4FC', text: '#C7D2FE' },
    { bg: 'rgba(202,138,4,0.18)',  edge: '#FDE047', stroke: '#FEF08A', text: '#FEFCE8' },
    { bg: 'rgba(5,150,105,0.18)',  edge: '#34D399', stroke: '#6EE7B7', text: '#A7F3D0' },
  ],
};

let catColorMap = new Map();

function buildCatColorMap() {
  const cats = [...new Set(allScripts.flatMap(s => s.categorias || []))].sort();
  catColorMap = new Map(cats.map((c, i) => [c, i % HPAL.light.length]));
}

function hmapNodePal(nd) {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  const pal  = dark ? HPAL.dark : HPAL.light;
  if (nd.type === 'tag') return dark
    ? { bg: 'rgba(124,58,237,0.18)', edge: '#A78BFA', stroke: '#C4B5FD', text: '#DDD6FE' }
    : { bg: '#F5F3FF', edge: '#C4B5FD', stroke: '#7C3AED', text: '#6D28D9' };
  return pal[catColorMap.get(nd.catName || '') ?? 0];
}

function catDotColor(catName) {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  const pal  = dark ? HPAL.dark : HPAL.light;
  return pal[catColorMap.get(catName) ?? 0].stroke;
}

const HMAP = {
  nodes: [], edges: [], hover: -1, alpha: 1, raf: null, canvas: null,
  camera: { x: 0, y: 0, scale: 1 },
  isPanning: false, panMoved: false,
  panStart: { x: 0, y: 0 }, camStart: { x: 0, y: 0 },
  dragNode: -1,
};

function hmapStop() {
  if (HMAP.raf !== null) { cancelAnimationFrame(HMAP.raf); HMAP.raf = null; }
}

function hmapBuild(focus) {
  const nodes = [];
  const edges = [];

  function addEdge(a, b) {
    if (a !== b && !edges.find(e => (e.a === a && e.b === b) || (e.a === b && e.b === a)))
      edges.push({ a, b });
  }

  function spread(i, n, r) {
    const a = -Math.PI / 2 + (2 * Math.PI * i / Math.max(n, 1));
    return { x: Math.cos(a) * r + (Math.random() - .5) * 18,
             y: Math.sin(a) * r + (Math.random() - .5) * 18 };
  }

  if (!focus) {
    nodes.push({ id: '__hub__', type: 'hub', label: 'HackeXe4',
                 x: 0, y: 0, vx: 0, vy: 0, r: HG.CENTER_R, isCenter: true,
                 catName: '', resumen: allScripts.length + ' recursos' });
    const cats = [...catColorMap.keys()];
    cats.forEach((cat, i) => {
      const pos = spread(i, cats.length, 145);
      const idx = nodes.length;
      nodes.push({ id: 'cat:' + cat, type: 'category', label: cat,
                   x: pos.x, y: pos.y, vx: 0, vy: 0,
                   r: HG.NODE_R, isCenter: false, catName: cat,
                   resumen: allScripts.filter(s => (s.categorias || []).includes(cat)).length + ' recursos' });
      addEdge(0, idx);
    });

  } else if (focus.type === 'category') {
    const scripts = allScripts.filter(s => (s.categorias || []).includes(focus.value));
    nodes.push({ id: 'cat:' + focus.value, type: 'category', label: focus.value,
                 x: 0, y: 0, vx: 0, vy: 0, r: HG.CENTER_R, isCenter: true,
                 catName: focus.value, resumen: scripts.length + ' recursos' });
    const scriptIdxMap = new Map();
    scripts.forEach((s, i) => {
      const pos = spread(i, scripts.length, 130);
      const idx = nodes.length;
      scriptIdxMap.set(s.id, idx);
      nodes.push({ id: s.id, type: 'script', label: s.titulo,
                   x: pos.x, y: pos.y, vx: 0, vy: 0,
                   r: HG.NODE_R, isCenter: false,
                   catName: (s.categorias || [])[0] || '', resumen: s.resumen || '' });
      addEdge(0, idx);
    });
    const relCats = new Map();
    scripts.forEach(s => {
      (s.categorias || []).forEach(cat => {
        if (cat === focus.value || relCats.has(cat)) return;
        const pos = spread(relCats.size, 6, 210);
        const idx = nodes.length;
        relCats.set(cat, idx);
        nodes.push({ id: 'cat:' + cat, type: 'category', label: cat,
                     x: pos.x, y: pos.y, vx: 0, vy: 0,
                     r: HG.NODE_R_SM, isCenter: false, catName: cat, resumen: '' });
      });
    });
    scripts.forEach(s => {
      const sIdx = scriptIdxMap.get(s.id);
      if (sIdx === undefined) return;
      (s.categorias || []).forEach(cat => {
        if (cat === focus.value) return;
        const cIdx = relCats.get(cat);
        if (cIdx !== undefined) addEdge(sIdx, cIdx);
      });
    });

  } else if (focus.type === 'tag') {
    const scripts = allScripts.filter(s => (s.etiquetas || []).includes(focus.value));
    nodes.push({ id: 'tag:' + focus.value, type: 'tag', label: focus.value,
                 x: 0, y: 0, vx: 0, vy: 0, r: HG.CENTER_R, isCenter: true,
                 catName: '', resumen: scripts.length + ' recursos' });
    scripts.forEach((s, i) => {
      const pos = spread(i, scripts.length, 130);
      nodes.push({ id: s.id, type: 'script', label: s.titulo,
                   x: pos.x, y: pos.y, vx: 0, vy: 0,
                   r: HG.NODE_R, isCenter: false,
                   catName: (s.categorias || [])[0] || '', resumen: s.resumen || '' });
      addEdge(0, nodes.length - 1);
    });

  } else if (focus.type === 'script') {
    const script = findById(focus.value);
    if (!script) { HMAP.nodes = []; HMAP.edges = []; return; }
    nodes.push({ id: script.id, type: 'script', label: script.titulo,
                 x: 0, y: 0, vx: 0, vy: 0, r: HG.CENTER_R, isCenter: true,
                 catName: (script.categorias || [])[0] || '', resumen: script.resumen || '' });
    const seen = new Set([script.id]);
    const idxMap = new Map([[script.id, 0]]);

    const rels = (script.relacionados || []).map(id => findById(id)).filter(Boolean);
    rels.forEach((rel, i) => {
      if (seen.has(rel.id)) return;
      seen.add(rel.id);
      const pos = spread(i, rels.length, 110);
      const idx = nodes.length;
      idxMap.set(rel.id, idx);
      nodes.push({ id: rel.id, type: 'script', label: rel.titulo,
                   x: pos.x, y: pos.y, vx: 0, vy: 0,
                   r: HG.NODE_R, isCenter: false, isDirect: true,
                   catName: (rel.categorias || [])[0] || '', resumen: rel.resumen || '' });
      addEdge(0, idx);
    });

    (script.categorias || []).forEach((cat, i) => {
      const pos = spread(i + rels.length, rels.length + (script.categorias || []).length, 135);
      const idx = nodes.length;
      idxMap.set('cat:' + cat, idx);
      nodes.push({ id: 'cat:' + cat, type: 'category', label: cat,
                   x: pos.x, y: pos.y, vx: 0, vy: 0,
                   r: HG.NODE_R_SM, isCenter: false, catName: cat, resumen: '' });
      addEdge(0, idx);
    });

    allScripts
      .filter(s => s.id !== script.id && !seen.has(s.id) &&
        (s.categorias || []).some(c => (script.categorias || []).includes(c)))
      .slice(0, 7)
      .forEach((s, i) => {
        seen.add(s.id);
        const pos = spread(i, 7, 180);
        const idx = nodes.length;
        idxMap.set(s.id, idx);
        nodes.push({ id: s.id, type: 'script', label: s.titulo,
                     x: pos.x, y: pos.y, vx: 0, vy: 0,
                     r: HG.NODE_R_SM, isCenter: false,
                     catName: (s.categorias || [])[0] || '', resumen: s.resumen || '' });
        (s.categorias || []).forEach(cat => {
          const cIdx = idxMap.get('cat:' + cat);
          if (cIdx !== undefined) addEdge(idx, cIdx);
        });
      });
  }

  HMAP.nodes  = nodes;
  HMAP.edges  = edges;
  HMAP.alpha  = 1;
  HMAP.hover  = -1;
  HMAP.camera = { x: 0, y: 0, scale: 1 };
}

function wrapLabel(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (line && ctx.measureText(test).width > maxWidth) { lines.push(line); line = word; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines.slice(0, 2);
}

function hmapTick() {
  const { nodes, edges } = HMAP;
  const n = nodes.length;
  if (n === 0) return;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      let dx = nodes[j].x - nodes[i].x, dy = nodes[j].y - nodes[i].y;
      const d2 = dx * dx + dy * dy || 0.01;
      const d  = Math.sqrt(d2);
      const f  = (HG.REPULSION * HMAP.alpha) / d2;
      dx /= d; dy /= d;
      nodes[i].vx -= dx * f; nodes[i].vy -= dy * f;
      nodes[j].vx += dx * f; nodes[j].vy += dy * f;
    }
  }

  edges.forEach(({ a, b }) => {
    const na = nodes[a], nb = nodes[b];
    if (!na || !nb) return;
    const dx = nb.x - na.x, dy = nb.y - na.y;
    const d  = Math.sqrt(dx * dx + dy * dy) || 0.01;
    const f  = (d - HG.IDEAL_LEN) * HG.ATTRACTION;
    const ux = dx / d, uy = dy / d;
    if (!na.isCenter) { na.vx += ux * f; na.vy += uy * f; }
    if (!nb.isCenter) { nb.vx -= ux * f; nb.vy -= uy * f; }
  });

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const ni = nodes[i], nj = nodes[j];
      const dx = nj.x - ni.x, dy = nj.y - ni.y;
      const d2 = dx * dx + dy * dy || 0.01;
      const minD = ni.r + nj.r + HG.LABEL_H;
      if (d2 < minD * minD) {
        const d    = Math.sqrt(d2);
        const push = (minD - d) / d * 0.5;
        if (!ni.isCenter) { ni.vx -= dx * push; ni.vy -= dy * push; }
        if (!nj.isCenter) { nj.vx += dx * push; nj.vy += dy * push; }
      }
    }
  }

  nodes.forEach(nd => {
    if (nd.isCenter || nd.fixed) { nd.vx = 0; nd.vy = 0; return; }
    nd.vx -= nd.x * HG.GRAVITY;
    nd.vy -= nd.y * HG.GRAVITY;
    nd.vx *= HG.DAMPING; nd.vy *= HG.DAMPING;
    nd.x  += nd.vx;     nd.y  += nd.vy;
  });

  HMAP.alpha *= HG.COOLING;
}

function hmapDraw() {
  const canvas = HMAP.canvas;
  if (!canvas) return;
  const dpr  = window.devicePixelRatio || 1;
  const ctx  = canvas.getContext('2d');
  const cw   = canvas.width, ch = canvas.height;
  const w    = cw / dpr, h = ch / dpr;
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  const cam  = HMAP.camera;
  const hov  = HMAP.hover;

  ctx.clearRect(0, 0, cw, ch);
  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.translate(w / 2, h / 2);
  ctx.scale(cam.scale, cam.scale);
  ctx.translate(-cam.x, -cam.y);

  HMAP.edges.forEach(({ a, b }) => {
    const na = HMAP.nodes[a], nb = HMAP.nodes[b];
    if (!na || !nb) return;
    const col = hmapNodePal(nb.isCenter ? na : nb);
    ctx.beginPath();
    ctx.moveTo(na.x, na.y);
    ctx.lineTo(nb.x, nb.y);
    ctx.strokeStyle = col.edge + (dark ? '55' : '77');
    ctx.lineWidth   = 1.5;
    ctx.stroke();
  });

  HMAP.nodes.forEach((nd, i) => {
    const col   = hmapNodePal(nd);
    const isHov = i === hov && !nd.isCenter;
    const r     = isHov ? nd.r + 2 : nd.r;

    ctx.beginPath();
    ctx.arc(nd.x, nd.y, r, 0, Math.PI * 2);
    ctx.fillStyle   = col.bg;
    ctx.fill();
    ctx.lineWidth   = nd.isCenter ? 2.5 : isHov ? 2.2 : 1.5;
    ctx.strokeStyle = nd.isCenter || isHov ? col.stroke : col.edge;
    ctx.stroke();

    const fs    = nd.isCenter ? 11 : 10;
    const maxW  = nd.isCenter ? 140 : nd.r < 15 ? 90 : 110;
    const lineH = fs + 2;
    const pad   = 3;
    ctx.font         = `${nd.isCenter ? 700 : 500} ${fs}px -apple-system,BlinkMacSystemFont,sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';
    const lines = wrapLabel(ctx, nd.label, maxW);
    lines.forEach((line, li) => {
      const tw = ctx.measureText(line).width;
      const tx = nd.x, ty = nd.y + r + 4 + li * lineH;
      ctx.fillStyle = dark ? 'rgba(10,15,30,0.82)' : 'rgba(255,255,255,0.9)';
      ctx.fillRect(tx - tw / 2 - pad, ty - 1, tw + pad * 2, fs + 3);
      ctx.fillStyle = col.text;
      ctx.fillText(line, tx, ty);
    });
  });

  ctx.restore();
}

function hmapResize() {
  const canvas = HMAP.canvas;
  if (!canvas || !canvas.clientWidth) return;
  const dpr     = window.devicePixelRatio || 1;
  canvas.width  = Math.round(canvas.clientWidth  * dpr);
  canvas.height = Math.round(canvas.clientHeight * dpr);
}

function hmapHit(sx, sy) {
  const canvas = HMAP.canvas;
  if (!canvas) return -1;
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.width / dpr, h = canvas.height / dpr;
  const cam = HMAP.camera;
  const wx = (sx - w / 2) / cam.scale + cam.x;
  const wy = (sy - h / 2) / cam.scale + cam.y;
  for (let i = HMAP.nodes.length - 1; i >= 0; i--) {
    const nd = HMAP.nodes[i];
    const dx = wx - nd.x, dy = wy - nd.y;
    if (dx * dx + dy * dy <= (nd.r + 5) * (nd.r + 5)) return i;
  }
  return -1;
}

function hmapLoop() {
  if (HMAP.alpha > HG.STOP_ALPHA) hmapTick();
  hmapResize();
  hmapDraw();
  HMAP.raf = requestAnimationFrame(hmapLoop);
}

function hmapNavigate(nd) {
  if (!nd) return;
  if (nd.isCenter) {
    if (nd.type === 'script') { const s = findById(nd.id); if (s) showDetail(s); }
    return;
  }
  mapHistory.push(visualFocus);
  if (nd.type === 'script') {
    visualFocus = { type: 'script', value: nd.id };
  } else if (nd.type === 'category') {
    visualFocus = { type: 'category', value: nd.id.replace(/^cat:/, '') };
  } else if (nd.type === 'tag') {
    visualFocus = { type: 'tag', value: nd.id.replace(/^tag:/, '') };
  } else {
    return;
  }
  renderVisualExplorer();
  updateURL();
}

function hmapStart(focus) {
  hmapStop();
  const canvas = document.getElementById('hmap-canvas');
  if (!canvas) return;
  HMAP.canvas   = canvas;
  HMAP.dragNode = -1;
  HMAP.isPanning = false;
  hmapBuild(focus);
  requestAnimationFrame(() => { hmapResize(); hmapLoop(); });

  let touchDist = 0;

  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const dpr  = window.devicePixelRatio || 1;
    const cw   = canvas.width / dpr, ch = canvas.height / dpr;
    const cam  = HMAP.camera;
    const mx   = e.clientX - rect.left, my = e.clientY - rect.top;
    const wx   = (mx - cw / 2) / cam.scale + cam.x;
    const wy   = (my - ch / 2) / cam.scale + cam.y;
    const f    = e.deltaY < 0 ? 1.14 : 1 / 1.14;
    cam.scale  = Math.max(0.18, Math.min(6, cam.scale * f));
    cam.x = wx - (mx - cw / 2) / cam.scale;
    cam.y = wy - (my - ch / 2) / cam.scale;
  }, { passive: false });

  canvas.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    const tip = document.getElementById('hmap-tooltip');
    if (tip) tip.style.display = 'none';
    const rect = canvas.getBoundingClientRect();
    const idx  = hmapHit(e.clientX - rect.left, e.clientY - rect.top);
    if (idx >= 0) {
      HMAP.dragNode = idx; HMAP.nodes[idx].fixed = true;
      HMAP.alpha = Math.max(HMAP.alpha, 0.3);
      HMAP.panMoved = false; HMAP.panStart = { x: e.clientX, y: e.clientY };
    } else {
      HMAP.isPanning = true; HMAP.panMoved = false;
      HMAP.panStart = { x: e.clientX, y: e.clientY };
      HMAP.camStart = { x: HMAP.camera.x, y: HMAP.camera.y };
    }
    canvas.style.cursor = 'grabbing';
    e.preventDefault();
  });

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    if (HMAP.dragNode >= 0) {
      if (Math.hypot(e.clientX - HMAP.panStart.x, e.clientY - HMAP.panStart.y) > 4) HMAP.panMoved = true;
      const dpr = window.devicePixelRatio || 1;
      const cw = canvas.width / dpr, ch = canvas.height / dpr;
      const nd = HMAP.nodes[HMAP.dragNode];
      nd.x = (e.clientX - rect.left - cw / 2) / HMAP.camera.scale + HMAP.camera.x;
      nd.y = (e.clientY - rect.top  - ch / 2) / HMAP.camera.scale + HMAP.camera.y;
      nd.vx = 0; nd.vy = 0;
      return;
    }
    if (HMAP.isPanning) {
      const dx = e.clientX - HMAP.panStart.x, dy = e.clientY - HMAP.panStart.y;
      if (Math.hypot(dx, dy) > 3) HMAP.panMoved = true;
      HMAP.camera.x = HMAP.camStart.x - dx / HMAP.camera.scale;
      HMAP.camera.y = HMAP.camStart.y - dy / HMAP.camera.scale;
      return;
    }
    const idx = hmapHit(e.clientX - rect.left, e.clientY - rect.top);
    HMAP.hover = idx;
    canvas.style.cursor = idx >= 0 ? 'pointer' : 'grab';
    const tip = document.getElementById('hmap-tooltip');
    if (!tip) return;
    if (idx >= 0) {
      const nd = HMAP.nodes[idx];
      tip.innerHTML = `<strong>${escHtml(nd.label)}</strong>${nd.resumen ? `<br><span style="opacity:.85">${escHtml(nd.resumen.slice(0, 110))}</span>` : ''}`;
      tip.style.left    = e.clientX + 'px';
      tip.style.top     = e.clientY + 'px';
      tip.style.display = 'block';
    } else {
      tip.style.display = 'none';
    }
  });

  canvas.addEventListener('mouseleave', () => {
    if (!HMAP.isPanning) {
      HMAP.hover = -1;
      canvas.style.cursor = 'grab';
      const tip = document.getElementById('hmap-tooltip');
      if (tip) tip.style.display = 'none';
    }
  });

  canvas.addEventListener('click', e => {
    if (HMAP.panMoved) { HMAP.panMoved = false; return; }
    const rect = canvas.getBoundingClientRect();
    const idx  = hmapHit(e.clientX - rect.left, e.clientY - rect.top);
    if (idx >= 0) hmapNavigate(HMAP.nodes[idx]);
  });

  canvas.addEventListener('dblclick', () => {
    HMAP.camera = { x: 0, y: 0, scale: 1 };
  });

  canvas.addEventListener('touchstart', e => {
    if (!HMAP.nodes.length) return;
    e.preventDefault();
    if (e.touches.length === 1) {
      const t = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const idx  = hmapHit(t.clientX - rect.left, t.clientY - rect.top);
      if (idx >= 0) {
        HMAP.dragNode = idx; HMAP.nodes[idx].fixed = true;
        HMAP.alpha = Math.max(HMAP.alpha, 0.3);
        HMAP.panMoved = false; HMAP.panStart = { x: t.clientX, y: t.clientY };
      } else {
        HMAP.isPanning = true; HMAP.panMoved = false;
        HMAP.panStart = { x: t.clientX, y: t.clientY };
        HMAP.camStart = { x: HMAP.camera.x, y: HMAP.camera.y };
      }
    } else if (e.touches.length === 2) {
      touchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX,
                             e.touches[0].clientY - e.touches[1].clientY);
      HMAP.isPanning = false;
      if (HMAP.dragNode >= 0) { HMAP.nodes[HMAP.dragNode].fixed = false; HMAP.dragNode = -1; }
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', e => {
    if (!HMAP.nodes.length) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    if (e.touches.length === 1) {
      const t = e.touches[0];
      if (HMAP.dragNode >= 0) {
        if (Math.hypot(t.clientX - HMAP.panStart.x, t.clientY - HMAP.panStart.y) > 4) HMAP.panMoved = true;
        const dpr = window.devicePixelRatio || 1;
        const nd  = HMAP.nodes[HMAP.dragNode];
        nd.x  = (t.clientX - rect.left - canvas.width  / dpr / 2) / HMAP.camera.scale + HMAP.camera.x;
        nd.y  = (t.clientY - rect.top  - canvas.height / dpr / 2) / HMAP.camera.scale + HMAP.camera.y;
        nd.vx = 0; nd.vy = 0;
        return;
      }
      if (HMAP.isPanning) {
        const dx = t.clientX - HMAP.panStart.x, dy = t.clientY - HMAP.panStart.y;
        if (Math.hypot(dx, dy) > 3) HMAP.panMoved = true;
        HMAP.camera.x = HMAP.camStart.x - dx / HMAP.camera.scale;
        HMAP.camera.y = HMAP.camStart.y - dy / HMAP.camera.scale;
      }
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX,
                              e.touches[0].clientY - e.touches[1].clientY);
      if (touchDist > 0) {
        const dpr = window.devicePixelRatio || 1;
        const cw  = canvas.width / dpr, ch = canvas.height / dpr;
        const cam = HMAP.camera;
        const mx  = ((e.touches[0].clientX + e.touches[1].clientX) / 2) - rect.left;
        const my  = ((e.touches[0].clientY + e.touches[1].clientY) / 2) - rect.top;
        const wx  = (mx - cw / 2) / cam.scale + cam.x;
        const wy  = (my - ch / 2) / cam.scale + cam.y;
        cam.scale = Math.max(0.18, Math.min(6, cam.scale * dist / touchDist));
        cam.x = wx - (mx - cw / 2) / cam.scale;
        cam.y = wy - (my - ch / 2) / cam.scale;
      }
      touchDist = dist;
    }
  }, { passive: false });

  canvas.addEventListener('touchend', e => {
    e.preventDefault();
    const wasPanning = HMAP.isPanning;
    if (HMAP.dragNode >= 0) {
      HMAP.nodes[HMAP.dragNode].fixed = false; HMAP.dragNode = -1;
      HMAP.alpha = Math.max(HMAP.alpha, 0.1);
    }
    HMAP.isPanning = false; touchDist = 0;
    if (!HMAP.panMoved && wasPanning && e.changedTouches.length === 1) {
      const t = e.changedTouches[0];
      const rect = canvas.getBoundingClientRect();
      const idx  = hmapHit(t.clientX - rect.left, t.clientY - rect.top);
      if (idx >= 0) hmapNavigate(HMAP.nodes[idx]);
    }
    HMAP.panMoved = false;
  }, { passive: false });
}

function detectLang(code) {
  const t = code.trim();
  if (t.startsWith('<')) return 'html';
  if (/^\s*(?:\/\*|[\.\#\:\*]|[a-z\-]+\s*\{)/m.test(t)) return 'css';
  return 'javascript';
}

function findById(id) {
  return allScripts.find(s => s.id === id) || null;
}

/* ─── URL State ──────────────────────────────────────────── */
function readURLState() {
  const hash = window.location.hash.slice(1);
  const params = new URLSearchParams(hash);
  return {
    q:       params.get('q')       || '',
    cat:     params.get('cat')     || '',
    view:    params.get('view')    || '',
    focusType: params.get('focusType') || '',
    focus:   params.get('focus')   || '',
    script:  params.get('script')  || '',
    scripts: params.get('scripts') || '',
  };
}

function updateURL() {
  const params = new URLSearchParams();
  if (sharedScripts.length > 0) {
    params.set('scripts', sharedScripts.map(s => s.id).join(','));
  } else {
    if (activeView === 'map') params.set('view', 'map');
    if (activeView === 'map' && visualFocus) {
      params.set('focusType', visualFocus.type);
      params.set('focus', visualFocus.value);
    }
    if (searchQuery)    params.set('q',   searchQuery);
    if (activeCategory) params.set('cat', activeCategory);
    if (currentScript)  params.set('script', currentScript.id);
  }
  const str = params.toString();
  history.replaceState(null, '', str ? '#' + str : location.pathname + location.search);
}

function buildShareURL(params) {
  const url = new URL(location.href);
  url.hash = params.toString() ? '#' + params.toString() : '';
  return url.toString();
}

function applyURLState(state) {
  if (!state) return;

  if (state.scripts) {
    const ids = state.scripts.split(',').map(s => s.trim()).filter(Boolean);
    sharedScripts = ids.map(findById).filter(Boolean);
    if (sharedScripts.length > 0) {
      renderList();
      updateURL();
      return;
    }
  }

  if (state.cat) {
    activeCategory = state.cat;
    dom.catList.querySelectorAll('.cat-item').forEach(el =>
      el.classList.toggle('active', el.dataset.cat === state.cat));
  }

  if (state.q) {
    searchQuery = state.q;
    dom.searchInput.value = state.q;
  }

  renderList();

  if (state.view === 'map') {
    if (state.focusType && state.focus) {
      const t = state.focusType === 'tag' ? 'tag' : state.focusType === 'script' ? 'script' : 'category';
      visualFocus = { type: t, value: state.focus };
    }
    showExplore(true);
  }

  if (state.script) {
    const found = findById(state.script);
    if (found) showDetail(found, false);
  }

  updateURL();
}

/* ─── Toast ──────────────────────────────────────────────── */
let toastTimer = null;
function showToast(msg, ok = true) {
  const t = dom.toast;
  t.textContent = msg;
  t.className = 'toast show' + (ok ? '' : ' toast-error');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ─── Clipboard ──────────────────────────────────────────── */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = Object.assign(document.createElement('textarea'), {
        value: text, style: { cssText: 'position:fixed;opacity:0;' }
      });
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch { return false; }
  }
}

async function shareURL(url) {
  const ok = await copyToClipboard(url);
  showToast(ok ? T.linkCopied : T.linkCopiedFail, ok);
}

/* ─── Categories ─────────────────────────────────────────── */
function allCategories() {
  const map = new Map();
  allScripts.forEach(s => {
    (s.categorias || []).forEach(c => map.set(c, (map.get(c) || 0) + 1));
  });
  return sortTermEntriesAlpha(map.entries());
}

function renderCategories() {
  dom.totalCount.textContent = allScripts.length;
  dom.catList.querySelectorAll('.cat-item:not([data-cat=""])').forEach(el => el.remove());
  allCategories().forEach(([name, count]) => {
    const li = document.createElement('li');
    li.className = 'cat-item' + (activeCategory === name ? ' active' : '');
    li.dataset.cat = name;
    li.setAttribute('tabindex', '0');
    li.innerHTML = `<span class="cat-name">${escHtml(name)}</span><span class="cat-count">${count}</span>`;
    dom.catList.appendChild(li);
    const activate = () => selectCategory(name);
    li.addEventListener('click', activate);
    li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') activate(); });
  });
}

function selectCategory(cat) {
  activeCategory = cat;
  sharedScripts = [];
  currentScript = null;
  activeView = 'list';
  detailReturnView = 'list';
  dom.catList.querySelectorAll('.cat-item').forEach(el =>
    el.classList.toggle('active', el.dataset.cat === cat));
  dom.detailView.hidden = true;
  dom.exploreView.hidden = true;
  dom.listView.hidden   = false;
  renderList();
  updateURL();
  if (window.innerWidth < 769) closeSidebar();
}

function syncSearchClear(currentCount) {
  // Solo mostrar si se está viendo un subconjunto de los recursos totales
  const isFiltered = currentCount < allScripts.length && allScripts.length > 0;
  dom.searchClear.classList.toggle('visible', isFiltered);

  // Mostrar "x" interna solo si hay texto en el buscador
  dom.inputClear.hidden = !dom.searchInput.value.trim();
}

function clearSearch() {
  searchQuery = '';
  activeCategory = '';
  sharedScripts = [];
  activeView = 'list';
  detailReturnView = 'list';
  dom.searchInput.value = '';
  dom.catList.querySelectorAll('.cat-item').forEach(el =>
    el.classList.toggle('active', el.dataset.cat === ''));
  renderList();
  updateURL();
}

function filterByTag(tag) {
  searchQuery = tag;
  dom.searchInput.value = tag;
  sharedScripts = [];
  currentScript = null;
  navStack = [];
  activeView = 'list';
  detailReturnView = 'list';
  dom.detailView.hidden = true;
  dom.exploreView.hidden = true;
  dom.listView.hidden   = false;
  renderList();
  updateURL();
}

/* ─── Filter ─────────────────────────────────────────────── */
function filteredScripts() {
  if (sharedScripts.length > 0) return sharedScripts;
  let list = allScripts;
  if (activeCategory) list = list.filter(s => (s.categorias || []).includes(activeCategory));
  if (searchQuery) {
    const q = normalizeStr(searchQuery);
    list = list.filter(s =>
      normalizeStr(s.titulo).includes(q) ||
      normalizeStr(s.resumen).includes(q) ||
      normalizeStr(s.descripcion).includes(q) ||
      normalizeStr((s.etiquetas  || []).join(' ')).includes(q) ||
      normalizeStr((s.categorias || []).join(' ')).includes(q) ||
      normalizeStr((s.donde      || []).join(' ')).includes(q) ||
      normalizeStr(s.id).includes(q)
    );
  }
  return list;
}

/* ─── Toolbar ────────────────────────────────────────────── */
function renderToolbar() {
  const list = filteredScripts();
  let html = '';

  if (sharedScripts.length > 0) {
    const params = new URLSearchParams();
    params.set('scripts', sharedScripts.map(s => s.id).join(','));
    const url = buildShareURL(params);
    html = `
      <span class="results-count">
        <span class="shared-badge">${IC.link} ${T.sharedSet(list.length)}</span>
      </span>
      <div class="toolbar-btns">
        <button class="btn-toolbar btn-share" id="btnShareShared" data-url="${escHtml(url)}"
          title="Copiar enlace de esta selección">
          ${IC.link} ${T.share}
        </button>
        <button class="btn-toolbar" id="btnExitShared">${T.viewAll} →</button>
      </div>`;
  } else if (selectionMode) {
    const n = selectedIds.size;
    html = `
      <span class="results-count">
        ${n === 0 ? T.selectHint : T.selected(n)}
      </span>
      <div class="toolbar-btns">
        <button class="btn-toolbar btn-share" id="btnShareSelected" ${n === 0 ? 'disabled' : ''}
          title="Compartir los recursos seleccionados">
          ${IC.link} ${T.shareSelected}
        </button>
        <button class="btn-toolbar" id="btnCancelSelect">${T.cancelSelect}</button>
      </div>`;
  } else {
    const params = new URLSearchParams();
    if (searchQuery)    params.set('q',   searchQuery);
    if (activeCategory) params.set('cat', activeCategory);
    const url = buildShareURL(params);
    html = `
      <span class="results-count">${T.scripts(list.length)}</span>
      <div class="toolbar-btns">
        <button class="btn-toolbar" id="btnExplore" title="Explorar visualmente categorías y etiquetas">
          ${IC.map} ${T.map}
        </button>
        <button class="btn-toolbar" id="btnSelect" title="Seleccionar recursos para compartir">
          ${IC.select} ${T.select}
        </button>
        <button class="btn-toolbar btn-share" id="btnShareView" data-url="${escHtml(url)}"
          title="Copiar enlace de la vista actual">
          ${IC.link} ${T.shareView}
        </button>
      </div>`;
  }

  dom.listToolbar.innerHTML = html;

  $('btnExplore')?.addEventListener('click', () => showExplore());
  $('btnSelect')?.addEventListener('click', enterSelectionMode);
  $('btnCancelSelect')?.addEventListener('click', exitSelectionMode);
  $('btnShareView')?.addEventListener('click', e =>
    shareURL(e.currentTarget.dataset.url));
  $('btnShareShared')?.addEventListener('click', e =>
    shareURL(e.currentTarget.dataset.url));
  $('btnShareSelected')?.addEventListener('click', shareSelected);
  $('btnExitShared')?.addEventListener('click', exitSharedView);
}

/* ─── Selection mode ─────────────────────────────────────── */
function enterSelectionMode() {
  selectionMode = true;
  selectedIds.clear();
  renderList();
}

function exitSelectionMode() {
  selectionMode = false;
  selectedIds.clear();
  renderList();
}

function toggleCardSelection(id) {
  if (selectedIds.has(id)) selectedIds.delete(id);
  else selectedIds.add(id);
  const card = dom.cardGrid.querySelector(`[data-script-id="${id}"]`);
  if (card) {
    card.classList.toggle('selected', selectedIds.has(id));
    card.querySelector('.card-check')?.classList.toggle('checked', selectedIds.has(id));
  }
  renderToolbar();
}

async function shareSelected() {
  if (selectedIds.size === 0) return;
  const ids = [...selectedIds].join(',');
  const params = new URLSearchParams({ scripts: ids });
  await shareURL(buildShareURL(params));
}

function exitSharedView() {
  sharedScripts = [];
  activeCategory = '';
  searchQuery = '';
  dom.searchInput.value = '';
  dom.catList.querySelectorAll('.cat-item').forEach(el =>
    el.classList.toggle('active', el.dataset.cat === ''));
  renderList();
  updateURL();
}

/* ─── Cards ──────────────────────────────────────────────── */
function renderList() {
  const list = filteredScripts();
  dom.cardGrid.innerHTML = '';
  dom.cardGrid.classList.toggle('selection-mode', selectionMode);
  syncSearchClear(list.length);
  renderToolbar();

  if (list.length === 0) {
    dom.cardGrid.innerHTML = `
      <div class="no-results">
        <p>🔍</p>
        <p><strong>${T.noResults}</strong></p>
        <p>${T.noResultsSub}</p>
      </div>`;
    return;
  }

  list.forEach(script => dom.cardGrid.appendChild(createCard(script)));
}

function createCard(script) {
  const cats     = script.categorias || [];
  const tags     = script.etiquetas || [];
  const related  = script.relacionados || [];
  const fullDesc = stripMarkdown(stripHtml(script.resumen || script.descripcion || ''));
  const id       = script.id;
  const isSelected = selectedIds.has(id);

  const relatedItems = related
    .map(r => allScripts.find(s => s.id === r || s.titulo.toLowerCase() === r.toLowerCase()))
    .filter(Boolean);

  const card = document.createElement('article');
  card.className = 'script-card' + (isSelected ? ' selected' : '');
  card.dataset.scriptId = id;
  card.setAttribute('tabindex', '0');

  card.innerHTML = `
    <div class="card-check ${isSelected ? 'checked' : ''}" aria-hidden="true">
      ${IC.check}
    </div>
    ${cats.length ? `<div class="card-cats">${cats.map(c => `<span class="card-category tag-clickable" data-cat="${escHtml(c)}">${escHtml(c)}</span>`).join('')}</div>` : ''}
    <h3 class="card-title">${escHtml(script.titulo)}</h3>
    <p class="card-desc">${escHtml(fullDesc)}</p>
    <div class="card-meta">
      ${tags.map(t => `<span class="tag tag-clickable" data-tag="${escHtml(t)}">${escHtml(t)}</span>`).join('')}
    </div>
    ${relatedItems.length ? `<div class="card-related">
      <p class="card-related-label">${T.related}</p>
      ${relatedItems.map(r => `<button class="card-related-link" data-rel-id="${escHtml(r.id)}">${escHtml(r.titulo)}</button>`).join('')}
    </div>` : ''}
    ${!selectionMode ? `
    <div class="card-footer">
      <span class="btn-view">${T.viewCode} ${IC.next}</span>
    </div>` : ''}`;

  card.querySelectorAll('.tag-clickable').forEach(tagEl => {
    tagEl.addEventListener('click', e => {
      e.stopPropagation();
      if (tagEl.dataset.tag) {
        filterByTag(tagEl.dataset.tag);
      } else if (tagEl.dataset.cat) {
        selectCategory(tagEl.dataset.cat);
      }
    });
  });

  card.querySelectorAll('.card-related-link').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const found = findById(btn.dataset.relId);
      if (found) showDetail(found);
    });
  });

  if (selectionMode) {
    card.setAttribute('role', 'checkbox');
    card.setAttribute('aria-checked', String(isSelected));
    const toggle = () => toggleCardSelection(id);
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') toggle(); });
  } else {
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Ver ${script.titulo}`);
    card.addEventListener('click',   () => showDetail(script));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') showDetail(script); });
  }

  return card;
}

/* ─── Visual Explorer ────────────────────────────────────── */
function countTerms(getTerms, scripts = allScripts) {
  const map = new Map();
  scripts.forEach(script => {
    getTerms(script).forEach(term => map.set(term, (map.get(term) || 0) + 1));
  });
  return [...map.entries()].sort((a, b) => b[1] - a[1] || compareTextEs(a[0], b[0]));
}

function pickVisualFocus() {
  if (visualFocus) return visualFocus;
  if (activeCategory) return { type: 'category', value: activeCategory };
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    const tag = countTerms(s => s.etiquetas || []).find(([name]) => name.toLowerCase() === q);
    if (tag) return { type: 'tag', value: tag[0] };
  }
  return null;
}

function scriptsForFocus(focus) {
  if (!focus) return filteredScripts();
  return allScripts.filter(script => {
    const terms = focus.type === 'tag' ? (script.etiquetas || []) : (script.categorias || []);
    return terms.includes(focus.value);
  });
}

function findRelatedScript(ref) {
  const needle = String(ref || '').trim();
  if (!needle) return null;
  return allScripts.find(s => s.id === needle || s.titulo.toLowerCase() === needle.toLowerCase()) || null;
}

function connectedScriptsForFocus(focus) {
  if (focus?.type === 'script') {
    const script = findById(focus.value);
    if (!script) return { direct: [], related: [], scripts: [] };
    const relatedRefs = script.relacionados || [];
    const direct = relatedRefs.map(r => findRelatedScript(r)).filter(s => s && s.id !== script.id);
    const seen = new Set([script.id, ...direct.map(s => s.id)]);
    const cats = script.categorias || [];
    const tags = script.etiquetas || [];
    const related = [];
    allScripts.forEach(s => {
      if (seen.has(s.id)) return;
      const sCats = s.categorias || [];
      const sTags = s.etiquetas || [];
      if (cats.some(c => sCats.includes(c)) || tags.some(t => sTags.includes(t))) {
        related.push(s);
        seen.add(s.id);
      }
    });
    const limitedRelated = sortScriptsByTitle(related).slice(0, 6);
    const sortedDirect = sortScriptsByTitle(direct);
    return { direct: sortedDirect, related: limitedRelated, scripts: sortScriptsByTitle([...sortedDirect, ...limitedRelated]) };
  }

  const direct = sortScriptsByTitle(scriptsForFocus(focus));
  const directIds = new Set(direct.map(s => s.id));
  const related = [];
  const seenRelated = new Set();

  direct.forEach(script => {
    (script.relacionados || []).forEach(ref => {
      const found = findRelatedScript(ref);
      if (!found || directIds.has(found.id) || seenRelated.has(found.id)) return;
      seenRelated.add(found.id);
      related.push(found);
    });
  });

  const sortedRelated = sortScriptsByTitle(related);
  return { direct, related: sortedRelated, scripts: sortScriptsByTitle([...direct, ...sortedRelated]) };
}

// Builds mixed map nodes (scripts + category/tag terms) from the already-computed connected data.
function mapNodesForFocus(focus, connected, maxNodes) {
  const directIds = new Set(connected.direct.map(s => s.id));

  if (focus?.type === 'script') {
    const script = findById(focus.value);
    const cats = script ? (script.categorias || []).slice().sort(compareTextEs) : [];
    const scriptTags = script ? (script.etiquetas || []).slice().sort(compareTextEs) : [];
    const catNodes = cats.slice(0, 3).map(c => ({ type: 'category', id: c, label: c, direct: true }));
    const tagNodes = scriptTags.slice(0, 2).map(t => ({ type: 'tag', id: t, label: t, direct: true }));
    const slotsForScripts = maxNodes - catNodes.length - tagNodes.length;
    const scriptNodes = connected.scripts
      .slice(0, slotsForScripts)
      .map(s => ({ type: 'script', id: s.id, label: s.titulo, direct: directIds.has(s.id) }));
    return [...scriptNodes, ...catNodes, ...tagNodes].slice(0, maxNodes);
  }

  if (!focus) {
    return sortTermEntriesAlpha(countTerms(s => s.categorias || [], connected.direct))
      .slice(0, maxNodes)
      .map(([name]) => ({ type: 'category', id: name, label: name, direct: true }));
  }

  const focusScripts = connected.direct;
  const termCount = new Map();
  focusScripts.slice(0, 20).forEach(s => {
    const terms = focus?.type === 'category'
      ? (s.categorias || []).filter(c => c !== focus.value)
      : (s.etiquetas || []).filter(t => t !== focus?.value);
    terms.forEach(t => termCount.set(t, (termCount.get(t) || 0) + 1));
  });
  const relatedTermNodes = [...termCount.entries()]
    .sort((a, b) => b[1] - a[1] || compareTextEs(a[0], b[0]))
    .slice(0, 3)
    .sort((a, b) => compareTextEs(a[0], b[0]))
    .map(([name]) => ({ type: focus?.type || 'category', id: name, label: name, direct: false }));

  const scriptNodes = connected.scripts
    .slice(0, maxNodes - relatedTermNodes.length)
    .map(s => ({ type: 'script', id: s.id, label: s.titulo, direct: directIds.has(s.id) }));

  return [...scriptNodes, ...relatedTermNodes].slice(0, maxNodes);
}

function buildExploreParams() {
  const params = new URLSearchParams({ view: 'map' });
  if (searchQuery) params.set('q', searchQuery);
  if (activeCategory) params.set('cat', activeCategory);
  if (visualFocus) {
    params.set('focusType', visualFocus.type);
    params.set('focus', visualFocus.value);
  }
  return params;
}

function renderVisualExplorer() {
  const focus = pickVisualFocus();
  visualFocus = focus;
  const connected = connectedScriptsForFocus(focus);
  const scripts = connected.scripts;
  const directIds = new Set(connected.direct.map(s => s.id));
  const categorySource = focus ? allScripts : connected.direct;
  const categories = sortTermEntriesAlpha(countTerms(s => s.categorias || [], categorySource)).slice(0, 14);

  const isScriptFocus = focus?.type === 'script';
  const scriptFocusScript = isScriptFocus ? findById(focus.value) : null;
  const tags = isScriptFocus
    ? sortTermEntriesAlpha(countTerms(s => s.etiquetas || [], scriptFocusScript ? [scriptFocusScript] : [])).slice(0, 18)
    : sortTermEntriesAlpha(countTerms(s => s.etiquetas || [], connected.direct)).slice(0, 18);

  const scriptCats = scriptFocusScript ? (scriptFocusScript.categorias || []).slice().sort(compareTextEs) : [];
  const scriptTags = scriptFocusScript ? (scriptFocusScript.etiquetas || []).slice().sort(compareTextEs) : [];

  const leftPanelHtml = isScriptFocus ? `
    ${scriptCats.length ? `
    <div class="visual-facet-block">
      <p class="visual-facet-title">Categorías del recurso</p>
      <div class="visual-chip-list">
        ${scriptCats.map(cat => `
          <button class="visual-chip" data-focus-type="category" data-focus-value="${escHtml(cat)}">
            <span class="chip-dot" style="background:${catDotColor(cat)}"></span>
            <span>${escHtml(cat)}</span>
          </button>`).join('')}
      </div>
    </div>` : ''}
    ${scriptTags.length ? `
    <div class="visual-facet-block">
      <p class="visual-facet-title">Etiquetas del recurso</p>
      <div class="visual-chip-list">
        ${scriptTags.map(tag => `
          <button class="visual-chip visual-chip-tag" data-focus-type="tag" data-focus-value="${escHtml(tag)}">
            <span class="chip-dot chip-dot-tag"></span>
            <span>${escHtml(tag)}</span>
          </button>`).join('')}
      </div>
    </div>` : ''}
    <div class="visual-facet-block">
      <p class="visual-facet-title">${T.categories}</p>
      <div class="visual-chip-list">
        ${categories.slice(0, 8).map(([name, count]) => `
          <button class="visual-chip" data-focus-type="category" data-focus-value="${escHtml(name)}">
            <span class="chip-dot" style="background:${catDotColor(name)}"></span>
            <span>${escHtml(name)}</span><strong>${count}</strong>
          </button>`).join('')}
      </div>
    </div>` : `
    <div class="visual-facet-block">
      <p class="visual-facet-title">${T.categories}</p>
      <div class="visual-chip-list">
        ${categories.map(([name, count]) => `
          <button class="visual-chip ${focus?.type === 'category' && focus.value === name ? 'active' : ''}"
            data-focus-type="category" data-focus-value="${escHtml(name)}">
            <span class="chip-dot" style="background:${catDotColor(name)}"></span>
            <span>${escHtml(name)}</span><strong>${count}</strong>
          </button>`).join('')}
      </div>
    </div>
    <div class="visual-facet-block">
      <p class="visual-facet-title">Etiquetas del foco</p>
      <div class="visual-chip-list">
        ${tags.map(([name, count]) => `
          <button class="visual-chip visual-chip-tag ${focus?.type === 'tag' && focus.value === name ? 'active' : ''}"
            data-focus-type="tag" data-focus-value="${escHtml(name)}">
            <span class="chip-dot chip-dot-tag"></span>
            <span>${escHtml(name)}</span><strong>${count}</strong>
          </button>`).join('')}
      </div>
    </div>`;

  const rightPanelLabel = isScriptFocus ? 'Recursos relacionados' : 'Recursos conectados';

  dom.exploreView.innerHTML = `
    <section class="visual-explorer" aria-labelledby="visualExplorerTitle">
      <div class="visual-head">
        <div>
          <p class="detail-label">${T.categoriesAndTags}</p>
          <h1 class="visual-title" id="visualExplorerTitle">${T.exploreTitle}</h1>
        </div>
        <div class="visual-head-actions">
          <span class="visual-count">${T.resourcesInMap(scripts.length)}</span>
          <button class="btn-toolbar" id="btnListFromExplore">${IC.home} ${T.list}</button>
        </div>
      </div>

      <div class="visual-layout">
        <aside class="visual-facets" aria-label="Categorías y etiquetas del mapa">
          ${leftPanelHtml}
        </aside>

        <div class="visual-map" aria-label="Red visual de recursos">
          ${mapHistory.length > 0 ? `<button class="map-nav-back" id="mapNavBack">${IC.back} Atrás</button>` : ''}
          <canvas id="hmap-canvas" aria-hidden="true"></canvas>
          <div id="hmap-tooltip" class="map-tooltip" aria-hidden="true"></div>
          <p class="hmap-hint">Clic: explorar · Doble clic: centrar · Rueda: zoom</p>
        </div>

        <aside class="visual-results" aria-label="Recursos del foco seleccionado">
          <p class="visual-facet-title">${rightPanelLabel}</p>
          <div class="visual-result-list">
            ${scripts.map(script => {
              const cats = (script.categorias || []).slice(0, 2);
              const relatedOnly = !directIds.has(script.id);
              return `
                <button class="visual-result ${relatedOnly ? 'visual-result-related' : ''}" data-open-script-id="${escHtml(script.id)}">
                  <span>${escHtml(script.titulo)}</span>
                  <small>${relatedOnly ? 'Relacionado · ' : ''}${cats.map(escHtml).join(' · ')}</small>
                </button>`;
            }).join('')}
          </div>
        </aside>
      </div>
    </section>`;

  $('btnListFromExplore')?.addEventListener('click', () => showList());

  $('mapNavBack')?.addEventListener('click', () => {
    visualFocus = mapHistory.pop();
    renderVisualExplorer();
    updateURL();
  });

  dom.exploreView.querySelectorAll('[data-focus-type][data-focus-value]').forEach(btn => {
    btn.addEventListener('click', () => {
      mapHistory.push(visualFocus);
      visualFocus = {
        type: btn.dataset.focusType === 'tag' ? 'tag' : 'category',
        value: btn.dataset.focusValue,
      };
      renderVisualExplorer();
      updateURL();
      const shareBtn = $('btnShareExplore');
      if (shareBtn) shareBtn.dataset.url = buildShareURL(buildExploreParams());
    });
  });

  dom.exploreView.querySelectorAll('[data-open-script-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const found = findById(btn.dataset.openScriptId);
      if (found) showDetail(found);
    });
  });

  hmapStart(focus);
}

function showExplore(popHistory = false) {
  hmapStop();
  if (!popHistory) visualFocus = null; // let pickVisualFocus derive from current list state
  activeView = 'map';
  detailReturnView = 'map';
  currentScript = null;
  selectionMode = false;
  selectedIds.clear();
  navStack = [];
  mapHistory = [];
  dom.listView.hidden = true;
  dom.detailView.hidden = true;
  dom.exploreView.hidden = false;
  dom.headerSearch.hidden = true;
  dom.appBody.classList.add('map-mode');
  renderVisualExplorer();
  dom.listToolbar.innerHTML = `
    <div class="toolbar-btns">
      <button class="btn-toolbar" id="exploreBack">${IC.back} ${T.list}</button>
      <button class="btn-toolbar btn-share" id="btnShareExplore"
        data-url="${escHtml(buildShareURL(buildExploreParams()))}" title="Compartir este mapa">
        ${IC.link} ${T.share}
      </button>
    </div>`;
  $('exploreBack')?.addEventListener('click', () => showList());
  $('btnShareExplore')?.addEventListener('click', e => shareURL(e.currentTarget.dataset.url));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (!popHistory) updateURL();
}

/* ─── Detail View ────────────────────────────────────────── */
function showDetail(script, pushHistory = true) {
  hmapStop();
  if (pushHistory && currentScript) navStack.push(currentScript);
  if (activeView === 'map') {
    detailReturnView = 'map';
    if (!detailMapState) detailMapState = { visualFocus, mapHistory: [...mapHistory] };
  }
  activeView = 'detail';
  currentScript = script;

  const cats    = script.categorias || [];
  const related = script.relacionados || [];
  const code    = script.script || '';
  const lang    = detectLang(code);
  const resumen = renderMarkdown(script.resumen || '');
  const desc    = renderMarkdown(script.descripcion || '');
  const wheres  = script.donde || [];
  const fuente  = renderMarkdown(script.fuente || '');
  const whereHelpId = `whereHelp-${script.id}`;

  let highlighted = '';
  try {
    highlighted = typeof hljs !== 'undefined'
      ? hljs.highlight(code, { language: lang === 'html' ? 'xml' : lang }).value
      : escHtml(code);
  } catch { highlighted = escHtml(code); }

  const params = new URLSearchParams({ script: script.id });
  const scriptURL = buildShareURL(params);

  const relatedHtml = related.length ? `
    <div class="detail-section">
      <p class="detail-label">${T.related}</p>
      <div class="detail-related">
        ${related.map(r => {
          const found = allScripts.find(s => s.id === r || s.titulo.toLowerCase() === r.toLowerCase());
          return found
            ? `<button class="related-link" data-rel-id="${found.id}">
                ${IC.next} ${escHtml(found.titulo)}
               </button>`
            : `<span class="related-link">${escHtml(r)}</span>`;
        }).join('')}
      </div>
    </div>` : '';

  dom.listToolbar.innerHTML = `
    <div class="toolbar-btns" style="flex:1; justify-content: space-between;">
      <button class="btn-toolbar" id="detailBack">${IC.back} ${T.back}</button>
      <button class="btn-toolbar btn-share" id="btnShareDetail"
        data-url="${escHtml(scriptURL)}" title="${T.shareScript}">
        ${IC.link} ${T.share}
      </button>
    </div>`;

  dom.detailView.innerHTML = `
    <div class="detail-view">
      <div class="detail-header">
        ${cats.length ? `<div class="detail-category">${escHtml(cats.join(' · '))}</div>` : ''}
        <h1 class="detail-title">${escHtml(script.titulo)}</h1>
        <p class="detail-id">ID: <code>${escHtml(script.id)}</code></p>
      </div>

      ${resumen ? `<div class="detail-section">
        <p class="detail-label">${T.summary}</p>
        <div class="detail-desc">${resumen}</div>
      </div>` : ''}

      ${desc ? `<div class="detail-section">
        <p class="detail-label">${T.description}</p>
        <div class="detail-desc">${desc}</div>
      </div>` : ''}

      ${wheres.length ? `<div class="detail-section">
        <p class="detail-label">${T.whereInsert}</p>
        <div class="detail-where-list">
          ${wheres.map((w, i) => {
            const helpId = `${whereHelpId}-${i}`;
            const helpHtml = renderWhereInsertHelp(helpId, w);
            return `
            <button class="detail-where" type="button" data-where-help-toggle
              aria-expanded="false" aria-controls="${helpHtml ? escHtml(helpId) : ''}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              ${escHtml(w)}
            </button>
            ${helpHtml}`;
          }).join('')}
        </div>
      </div>` : ''}

      ${fuente ? `<div class="detail-section">
        <p class="detail-label">${T.source}</p>
        <div class="detail-desc">${fuente}</div>
      </div>` : ''}

      ${relatedHtml}

      ${code ? `<div class="detail-section">
        <div class="code-wrapper">
          <div class="code-toolbar">
            <span class="code-lang">${lang}</span>
            <button class="btn-copy" id="btnCopy">
              ${IC.copy} ${T.copyCode}
            </button>
          </div>
          <div class="code-scroll">
            <pre><code class="hljs language-${lang === 'html' ? 'xml' : lang}">${highlighted}</code></pre>
          </div>
        </div>
      </div>` : ''}
    </div>`;

  dom.listView.hidden   = true;
  dom.exploreView.hidden = true;
  dom.detailView.hidden = false;
  dom.appBody.classList.remove('map-mode');
  dom.headerSearch.hidden = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (pushHistory) {
    history.pushState({ scriptId: script.id }, '', '#' + new URLSearchParams({ script: script.id }));
  }

  $('detailBack').addEventListener('click', () => {
    if (navStack.length > 0) {
      const prev = navStack.pop();
      showDetail(prev, false);
    } else if (detailReturnView === 'map') {
      if (detailMapState) {
        visualFocus = detailMapState.visualFocus;
        mapHistory  = detailMapState.mapHistory;
        detailMapState = null;
      }
      showExplore(true);
    } else {
      showList();
    }
  });

  $('btnShareDetail').addEventListener('click', e =>
    shareURL(e.currentTarget.dataset.url));

  const btnCopy = $('btnCopy');
  if (btnCopy) {
    btnCopy.addEventListener('click', async () => {
      const ok = await copyToClipboard(code);
      if (ok) {
        btnCopy.classList.add('copied');
        btnCopy.innerHTML = `${IC.check} ${T.copied}`;
        setTimeout(() => {
          btnCopy.classList.remove('copied');
          btnCopy.innerHTML = `${IC.copy} ${T.copyCode}`;
        }, 2000);
      }
    });
  }

  dom.detailView.querySelectorAll('[data-where-help-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const controlsId = btn.getAttribute('aria-controls');
      if (!controlsId) return;
      const helpDiv = document.getElementById(controlsId);
      if (!helpDiv) return;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      dom.detailView.querySelectorAll('[data-where-help-toggle]').forEach(otherBtn => {
        if (otherBtn === btn) return;
        const otherControlsId = otherBtn.getAttribute('aria-controls');
        if (!otherControlsId) return;
        const otherHelpDiv = document.getElementById(otherControlsId);
        otherBtn.setAttribute('aria-expanded', 'false');
        if (otherHelpDiv) otherHelpDiv.hidden = true;
      });

      btn.setAttribute('aria-expanded', String(!isOpen));
      helpDiv.hidden = isOpen;
    });
  });

  dom.detailView.querySelectorAll('.related-link[data-rel-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const found = findById(btn.dataset.relId);
      if (found) showDetail(found);
    });
  });
}

function showList(popHistory = false) {
  hmapStop();
  detailMapState = null;
  activeView = 'list';
  detailReturnView = 'list';
  currentScript = null;
  navStack = [];
  dom.detailView.hidden = true;
  dom.exploreView.hidden = true;
  dom.listView.hidden   = false;
  dom.appBody.classList.remove('map-mode');
  dom.headerSearch.hidden = false;
  renderToolbar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (!popHistory) updateURL();
}

/* ─── Status helpers ─────────────────────────────────────── */
function showLoading() {
  dom.statusMsg.hidden = false;
  dom.cardGrid.innerHTML = '';
  dom.statusMsg.innerHTML = `
    <div class="loading-dots"><span></span><span></span><span></span></div>
    <p>${T.loading}</p>`;
}

function showError() {
  dom.statusMsg.hidden = false;
  dom.statusMsg.innerHTML = `
    <div class="status-icon">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    </div>
    <p>${T.error}</p>
    <p style="font-size:.82rem">${T.errorSub}</p>
    <button class="btn-retry" id="retryBtn">${IC.retry} ${T.retry}</button>`;
  $('retryBtn')?.addEventListener('click', loadData);
}

/* ─── Analytics ──────────────────────────────────────────── */
function getMetaContent(name) {
  const node = document.querySelector(`meta[name="${name}"]`);
  return node ? String(node.getAttribute('content') || '').trim() : '';
}

function getAnalyticsConfig() {
  return {
    endpoint: getMetaContent('analytics-endpoint') || ANALYTICS_FALLBACK_ENDPOINT,
    statsUrl: getMetaContent('analytics-stats-url') || ANALYTICS_FALLBACK_STATS_URL,
    siteId: getMetaContent('analytics-site-id') || 'hackexe4',
  };
}

function shouldTrackAnalytics() {
  const protocol = String(window.location.protocol || '');
  const host = String(window.location.hostname || '').toLowerCase();
  if (protocol !== 'http:' && protocol !== 'https:') return false;
  if (host === 'localhost' || host === '127.0.0.1' || host === '::1') return false;
  if (host.endsWith('.local')) return false;
  return true;
}

function getAnalyticsStorageKey(siteId) {
  return `analytics:last-visit:${siteId}`;
}

function shouldCountAnalyticsVisit(siteId) {
  try {
    const rawValue = window.localStorage.getItem(getAnalyticsStorageKey(siteId)) || '';
    const lastVisit = Number.parseInt(rawValue, 10);
    if (Number.isFinite(lastVisit) && Date.now() - lastVisit < ANALYTICS_VISIT_COOLDOWN_MS) {
      return false;
    }
  } catch {
    return true;
  }
  return true;
}

function rememberAnalyticsVisit(siteId) {
  try {
    window.localStorage.setItem(getAnalyticsStorageKey(siteId), String(Date.now()));
  } catch {
    // Analytics is optional and must never block the app.
  }
}

function requestAnalytics() {
  if (!shouldTrackAnalytics()) return;
  if (typeof window.fetch !== 'function') return;
  const cfg = getAnalyticsConfig();
  if (!cfg.endpoint) return;

  const query = new URLSearchParams();
  const pageParams = new URLSearchParams(window.location.search || '');
  const shouldCountVisit = shouldCountAnalyticsVisit(cfg.siteId);

  query.set('site', cfg.siteId);
  query.set('page_url', window.location.href);
  query.set('referrer', document.referrer || '');
  if (!shouldCountVisit) query.set('summary_only', '1');
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(key => {
    const value = String(pageParams.get(key) || '').trim();
    if (value) query.set(key, value);
  });

  const url = `${cfg.endpoint}${cfg.endpoint.includes('?') ? '&' : '?'}${query.toString()}`;
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timeoutId = window.setTimeout(() => {
    if (controller) controller.abort();
  }, ANALYTICS_TIMEOUT_MS);

  window.fetch(url, {
    method: 'GET',
    mode: 'no-cors',
    credentials: 'omit',
    cache: 'no-store',
    keepalive: true,
    signal: controller ? controller.signal : undefined,
  })
    .then(() => {
      if (shouldCountVisit) rememberAnalyticsVisit(cfg.siteId);
    })
    .catch(() => {})
    .finally(() => {
      window.clearTimeout(timeoutId);
    });
}

function scheduleAnalyticsLoad() {
  if (!shouldTrackAnalytics()) return;
  const run = () => window.setTimeout(requestAnalytics, 0);
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(run, { timeout: 2500 });
    return;
  }
  if (document.readyState === 'complete') {
    run();
    return;
  }
  window.addEventListener('load', run, { once: true });
}

/* ─── Theme ──────────────────────────────────────────────── */
function initTheme() {
  const saved = localStorage.getItem('hackexe-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'), false);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('hackexe-theme')) applyTheme(e.matches ? 'dark' : 'light', false);
  });
}

function applyTheme(theme, save = true) {
  document.documentElement.setAttribute('data-theme', theme);
  if (save) localStorage.setItem('hackexe-theme', theme);
  const hlLink = $('hlTheme');
  if (hlLink) hlLink.href = theme === 'dark'
    ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
    : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
}

function toggleTheme() {
  applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

/* ─── Sidebar (mobile) ───────────────────────────────────── */
function closeSidebar() {
  dom.sidebar.classList.remove('open');
  dom.sidebarToggle.setAttribute('aria-expanded', 'false');
}
function toggleSidebar() {
  const open = dom.sidebar.classList.toggle('open');
  dom.sidebarToggle.setAttribute('aria-expanded', String(open));
}

/* ─── Data loading ───────────────────────────────────────── */
async function loadData() {
  showLoading();
  activeView = 'list';
  detailReturnView = 'list';
  dom.listView.hidden   = false;
  dom.exploreView.hidden = true;
  dom.detailView.hidden = true;
  dom.appBody.classList.remove('map-mode');
  currentScript = null;

  try {
    const resp = await fetch(JSON_URL);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('JSON sin recursos válidos');
    allScripts = data.filter(s => s.id && s.titulo).sort(compareScriptsByTitle);
    buildCatColorMap();
    dom.statusMsg.hidden = true;
    renderCategories();
    applyURLState(pendingURLState);
  } catch (err) {
    console.error('HackeXe4:', err);
    showError();
  }
}

/* ─── Events ─────────────────────────────────────────────── */
function initEvents() {
  document.addEventListener('mouseup', () => {
    if (HMAP.dragNode >= 0) {
      HMAP.nodes[HMAP.dragNode].fixed = false;
      HMAP.dragNode = -1;
      HMAP.alpha = Math.max(HMAP.alpha, 0.1);
      if (HMAP.canvas) HMAP.canvas.style.cursor = 'grab';
    }
    if (HMAP.isPanning) {
      HMAP.isPanning = false;
      if (HMAP.canvas) HMAP.canvas.style.cursor = 'grab';
    }
  });

  dom.themeToggle.addEventListener('click', toggleTheme);
  dom.sidebarToggle.addEventListener('click', toggleSidebar);

  dom.brandLink.addEventListener('click', () => {
    sharedScripts = [];
    selectionMode = false;
    selectedIds.clear();
    activeCategory = '';
    searchQuery = '';
    currentScript = null;
    visualFocus = null;
    activeView = 'list';
    detailReturnView = 'list';
    dom.searchInput.value = '';
    dom.catList.querySelectorAll('.cat-item').forEach(el =>
      el.classList.toggle('active', el.dataset.cat === ''));
    showList();
    renderList();
  });

  dom.searchInput.addEventListener('input', () => {
    syncSearchClear();
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = dom.searchInput.value.trim();
      sharedScripts = [];
      if (activeView === 'map') {
        visualFocus = null;
        showExplore();
        return;
      }
      renderList();
      updateURL();
    }, 200);
  });

  dom.searchClear.addEventListener('click', clearSearch);

  dom.inputClear.addEventListener('click', () => {
    searchQuery = '';
    dom.searchInput.value = '';
    if (activeView === 'map') {
      visualFocus = null;
      showExplore();
      return;
    }
    renderList();
    updateURL();
    dom.searchInput.focus();
  });

  const allItem = dom.catList.querySelector('[data-cat=""]');
  allItem.addEventListener('click', () => selectCategory(''));
  allItem.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') selectCategory(''); });

  dom.aboutClose.addEventListener('click', () => {
    dom.aboutBanner.classList.add('hidden');
    localStorage.setItem('hackexe-about-closed', '1');
  });

  document.getElementById('showAbout').addEventListener('click', e => {
    e.preventDefault();
    dom.aboutBanner.classList.remove('hidden');
    localStorage.removeItem('hackexe-about-closed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.addEventListener('click', e => {
    const clickedToggle = dom.sidebarToggle.contains(e.target);
    if (window.innerWidth < 769 && dom.sidebar.classList.contains('open') &&
        !dom.sidebar.contains(e.target) && !clickedToggle) {
      closeSidebar();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (dom.sidebar.classList.contains('open')) closeSidebar();
      else if (selectionMode) exitSelectionMode();
      else if (!dom.detailView.hidden) showList();
      else if (!dom.exploreView.hidden) showList();
    }
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      dom.searchInput.focus();
    }
  });

  window.addEventListener('popstate', e => {
    if (e.state?.scriptId) {
      const found = findById(e.state.scriptId);
      if (found) { showDetail(found, false); return; }
    }
    const state = readURLState();
    if (state.view === 'map') {
      visualFocus = state.focus ? { type: state.focusType === 'tag' ? 'tag' : 'category', value: state.focus } : null;
      showExplore(true);
      return;
    }
    showList(true);
    renderList();
  });
}

/* ─── Init ───────────────────────────────────────────────── */
function init() {
  initDom();
  initTheme();
  initEvents();

  if (localStorage.getItem('hackexe-about-closed') === '1') {
    dom.aboutBanner.classList.add('hidden');
  }

  pendingURLState = readURLState();
  loadData();
  scheduleAnalyticsLoad();
}

document.addEventListener('DOMContentLoaded', init);
