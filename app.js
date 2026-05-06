'use strict';

/* ─── Config ────────────────────────────────────────────── */
const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/' +
  '2PACX-1vTkmdZbTZ-rLI305yY5IhP7sDJY7ViC2MnCUh1J2muinEjoOT4BT4yLV8I7v0kxdiba_R81vHjBA_b0' +
  '/pub?output=csv';
const FALLBACK_CSV_URL = 'HackeXe4.csv';

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
  whereInsert:    'Dónde insertar',
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
  linkCopied:     '¡Enlace copiado!',
  linkCopiedFail: 'No se pudo copiar el enlace',
};

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
    detailView:    $('detailView'),
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

/* ─── CSV Parser (RFC 4180) ─────────────────────────────── */
function parseCSV(str) {
  const rows = [];
  let inQuote = false, col = '', row = [];
  for (let i = 0; i < str.length; i++) {
    const ch = str[i], next = str[i + 1];
    if (!inQuote) {
      if (ch === '"') { inQuote = true; continue; }
      if (ch === ',') { row.push(col); col = ''; continue; }
      if (ch === '\r') continue;
      if (ch === '\n') { row.push(col); col = ''; rows.push(row); row = []; continue; }
      col += ch;
    } else {
      if (ch === '"' && next === '"') { col += '"'; i++; continue; }
      if (ch === '"') { inQuote = false; continue; }
      col += ch;
    }
  }
  row.push(col);
  if (row.some(c => c !== '')) rows.push(row);
  return rows;
}

function csvToScripts(rows) {
  if (rows.length < 2) return [];
  const headers = rows[0].map(h => h.trim());
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (row[i] || '').trim(); });
    return obj;
  })
  .filter(s => s['ID'] && s['Título'])
  .sort((a, b) => a['Título'].localeCompare(b['Título'], 'es'));
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

function renderMarkdown(text) {
  if (typeof marked === 'undefined') {
    return text.split(/\n{2,}/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
  }
  return marked.parse(text, { breaks: true });
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

function parseTags(val) {
  if (!val) return [];
  return val.split(/[,;]+/).map(t => t.trim()).filter(Boolean);
}

function detectLang(code) {
  const t = code.trim();
  if (t.startsWith('<')) return 'html';
  if (/^\s*(?:\/\*|[\.\#\:\*]|[a-z\-]+\s*\{)/m.test(t)) return 'css';
  return 'javascript';
}

function findById(id) {
  return allScripts.find(s => s['ID'] === id) || null;
}

/* ─── URL State ──────────────────────────────────────────── */
function readURLState() {
  const hash = window.location.hash.slice(1);
  const params = new URLSearchParams(hash);
  return {
    q:       params.get('q')       || '',
    cat:     params.get('cat')     || '',
    script:  params.get('script')  || '',
    scripts: params.get('scripts') || '',
  };
}

function updateURL() {
  const params = new URLSearchParams();
  if (sharedScripts.length > 0) {
    params.set('scripts', sharedScripts.map(s => s['ID']).join(','));
  } else {
    if (searchQuery)    params.set('q',   searchQuery);
    if (activeCategory) params.set('cat', activeCategory);
    if (currentScript)  params.set('script', currentScript['ID']);
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
    parseTags(s['Categorías']).forEach(c => map.set(c, (map.get(c) || 0) + 1));
  });
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0], 'es'));
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
  dom.catList.querySelectorAll('.cat-item').forEach(el =>
    el.classList.toggle('active', el.dataset.cat === cat));
  dom.detailView.hidden = true;
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
  dom.detailView.hidden = true;
  dom.listView.hidden   = false;
  renderList();
  updateURL();
}

/* ─── Filter ─────────────────────────────────────────────── */
function filteredScripts() {
  if (sharedScripts.length > 0) return sharedScripts;
  let list = allScripts;
  if (activeCategory) list = list.filter(s => parseTags(s['Categorías']).includes(activeCategory));
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(s =>
      (s['Título']         || '').toLowerCase().includes(q) ||
      (s['Resumen']        || '').toLowerCase().includes(q) ||
      (s['Descripción']    || '').toLowerCase().includes(q) ||
      (s['Etiquetas']      || '').toLowerCase().includes(q) ||
      (s['Categorías']     || '').toLowerCase().includes(q) ||
      (s['Donde insertar'] || '').toLowerCase().includes(q) ||
      (s['ID']             || '').toLowerCase().includes(q)
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
    params.set('scripts', sharedScripts.map(s => s['ID']).join(','));
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
  const cats     = parseTags(script['Categorías']);
  const tags     = parseTags(script['Etiquetas']);
  const related  = parseTags(script['Relacionados']);
  const fullDesc = stripMarkdown(stripHtml(script['Resumen'] || script['Descripción'] || ''));
  const id       = script['ID'];
  const isSelected = selectedIds.has(id);

  const relatedItems = related
    .map(r => allScripts.find(s => s['ID'] === r || s['Título'].toLowerCase() === r.toLowerCase()))
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
    <h3 class="card-title">${escHtml(script['Título'])}</h3>
    <p class="card-desc">${escHtml(fullDesc)}</p>
    <div class="card-meta">
      ${tags.map(t => `<span class="tag tag-clickable" data-tag="${escHtml(t)}">${escHtml(t)}</span>`).join('')}
    </div>
    ${relatedItems.length ? `<div class="card-related">
      <p class="card-related-label">${T.related}</p>
      ${relatedItems.map(r => `<button class="card-related-link" data-rel-id="${escHtml(r['ID'])}">${escHtml(r['Título'])}</button>`).join('')}
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
    card.setAttribute('aria-label', `Ver ${script['Título']}`);
    card.addEventListener('click',   () => showDetail(script));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') showDetail(script); });
  }

  return card;
}

/* ─── Detail View ────────────────────────────────────────── */
function showDetail(script, pushHistory = true) {
  if (pushHistory && currentScript) navStack.push(currentScript);
  currentScript = script;

  const cats    = parseTags(script['Categorías']);
  const related = parseTags(script['Relacionados']);
  const code    = script['Script'] || '';
  const lang    = detectLang(code);
  const resumen = renderMarkdown(script['Resumen'] || '');
  const desc    = renderMarkdown(script['Descripción'] || '');
  const wheres  = parseTags(script['Donde insertar']);
  const fuente  = renderMarkdown(script['Fuente'] || '');

  let highlighted = '';
  try {
    highlighted = typeof hljs !== 'undefined'
      ? hljs.highlight(code, { language: lang === 'html' ? 'xml' : lang }).value
      : escHtml(code);
  } catch { highlighted = escHtml(code); }

  const params = new URLSearchParams({ script: script['ID'] });
  const scriptURL = buildShareURL(params);

  const relatedHtml = related.length ? `
    <div class="detail-section">
      <p class="detail-label">${T.related}</p>
      <div class="detail-related">
        ${related.map(r => {
          const found = allScripts.find(s => s['ID'] === r || s['Título'].toLowerCase() === r.toLowerCase());
          return found
            ? `<button class="related-link" data-rel-id="${found['ID']}">
                ${IC.next} ${escHtml(found['Título'])}
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
        <h1 class="detail-title">${escHtml(script['Título'])}</h1>
        <p class="detail-id">ID: <code>${escHtml(script['ID'])}</code></p>
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
          ${wheres.map(w => `
            <div class="detail-where">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              ${escHtml(w)}
            </div>`).join('')}
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
  dom.detailView.hidden = false;
  dom.headerSearch.hidden = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (pushHistory) {
    history.pushState({ scriptId: script['ID'] }, '', '#' + new URLSearchParams({ script: script['ID'] }));
  }

  $('detailBack').addEventListener('click', () => {
    if (navStack.length > 0) {
      const prev = navStack.pop();
      showDetail(prev, false);
    } else {
      showList(true);
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

  dom.detailView.querySelectorAll('.related-link[data-rel-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const found = findById(btn.dataset.relId);
      if (found) showDetail(found);
    });
  });
}

function showList(popHistory = false) {
  currentScript = null;
  navStack = [];
  dom.detailView.hidden = true;
  dom.listView.hidden   = false;
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
async function fetchScriptsFrom(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`${url}: HTTP ${resp.status}`);
  const rows = parseCSV(await resp.text());
  const scripts = csvToScripts(rows);
  if (scripts.length === 0) throw new Error(`${url}: CSV sin recursos válidos`);
  return scripts;
}

async function loadData() {
  showLoading();
  dom.listView.hidden   = false;
  dom.detailView.hidden = true;
  currentScript = null;

  const errors = [];
  for (const url of [CSV_URL, FALLBACK_CSV_URL]) {
    try {
      allScripts = await fetchScriptsFrom(url);
      dom.statusMsg.hidden = true;
      renderCategories();
      applyURLState(pendingURLState);
      return;
    } catch (err) {
      errors.push(err);
      console.warn('HackeXe4:', err);
    }
  }

  console.error('HackeXe4:', errors);
  showError();
}

/* ─── Events ─────────────────────────────────────────────── */
function initEvents() {
  dom.themeToggle.addEventListener('click', toggleTheme);
  dom.sidebarToggle.addEventListener('click', toggleSidebar);

  dom.brandLink.addEventListener('click', () => {
    sharedScripts = [];
    selectionMode = false;
    selectedIds.clear();
    activeCategory = '';
    searchQuery = '';
    currentScript = null;
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
      renderList();
      updateURL();
    }, 200);
  });

  dom.searchClear.addEventListener('click', clearSearch);

  dom.inputClear.addEventListener('click', () => {
    searchQuery = '';
    dom.searchInput.value = '';
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

  document.addEventListener('click', e => {
    if (window.innerWidth < 769 && dom.sidebar.classList.contains('open') &&
        !dom.sidebar.contains(e.target) && e.target !== dom.sidebarToggle) {
      closeSidebar();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (dom.sidebar.classList.contains('open')) closeSidebar();
      else if (selectionMode) exitSelectionMode();
      else if (!dom.detailView.hidden) showList();
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
}

document.addEventListener('DOMContentLoaded', init);
