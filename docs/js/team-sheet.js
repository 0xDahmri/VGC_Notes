(function () {
  const KEY = 'vgc-team-sheet-v1';

  /* ── HTML builders ── */

  function buildOverview() {
    const cols = ['POKÉMON', 'TYPE', 'ABILITY', 'NATURE', 'HELD ITEM'];
    const rows = [0,1,2,3,4,5].map(i => {
      const cells = ['name','type','ability','nature','item'].map(f =>
        `<td><input type="text" id="ov${i}-${f}" autocomplete="off"></td>`
      ).join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    return `
      <table class="ts-overview">
        <thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  function buildSection(i) {
    const stats = ['HP','ATK','DEF','SP.A','SP.D','SPD','TOTAL'];

    const statCols = stats.map(s => {
      const id = `pk${i}-${s.replace(/\./g,'')}`;
      return `<div class="ts-stat-col">
        <div class="ts-stat-label">${s}</div>
        <input type="text" id="${id}" autocomplete="off">
      </div>`;
    }).join('');

    const moves = [1,2,3,4].map(n => `
      <div class="ts-move-slot">
        <span class="ts-field-label">Move ${n}</span>
        <input type="text" id="pk${i}-mv${n}" autocomplete="off">
        <span class="ts-field-label ts-type-lbl">Type</span>
        <input type="text" id="pk${i}-mv${n}t" autocomplete="off">
      </div>`).join('');

    return `
      <div class="ts-section">
        <div class="ts-stats-area">
          <div class="ts-stat-icon"></div>
          ${statCols}
        </div>
        <div class="ts-moves-area">
          <div class="ts-check"></div>
          <div class="ts-vert-label">MOVES</div>
          <div class="ts-move-grid">${moves}</div>
        </div>
        <div class="ts-notes-area">
          <div class="ts-vert-label">NOTES</div>
          <textarea id="pk${i}-notes" rows="2"></textarea>
        </div>
      </div>`;
  }

  /* ── DOM injection ── */

  function build() {
    const c = document.getElementById('ts-container');
    if (!c) return;
    c.innerHTML = buildOverview() + [0,1,2,3,4,5].map(buildSection).join('');
    load();
    c.addEventListener('input', save);
  }

  /* ── Persistence ── */

  function fields() {
    return document.querySelectorAll('#ts-container input, #ts-container textarea');
  }

  function save() {
    const data = {};
    fields().forEach(f => { data[f.id] = f.value; });
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch(e) {}
  }

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || '{}');
      fields().forEach(f => { if (f.id && data[f.id] != null) f.value = data[f.id]; });
    } catch(e) {}
  }

  /* ── Public API ── */

  window.clearSheet = function () {
    if (!confirm('Clear all notes for the next game?')) return;
    fields().forEach(f => { f.value = ''; });
    try { localStorage.removeItem(KEY); } catch(e) {}
  };

  window.saveSheet = function () { window.print(); };

  /* ── Init ── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
