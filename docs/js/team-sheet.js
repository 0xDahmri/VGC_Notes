(function () {
  if (!document.getElementById('ts-container')) return;

  const KEY = 'vgc-team-sheet-v2';
  const SPR = '../../images/sprites/';

  const selected = [null, null, null, null, null, null];
  let DATA = [];

  /* ── Global autocomplete dropdown (body-level avoids overflow clipping) ── */
  let _drop = null;
  let _dropCtx = null;   // { type: 'ability'|'item', slot: i }
  let _dropOptions = []; // values for index-based simple dropdown

  function getDrop() {
    if (!_drop) {
      _drop = document.createElement('div');
      _drop.id = 'ts-ac-global';
      _drop.className = 'ts-ac-drop';
      document.body.appendChild(_drop);
    }
    return _drop;
  }

  function showDrop(i, inputEl, matches) {
    const drop = getDrop();
    if (!matches.length) { hideDrop(); return; }
    drop.innerHTML = matches.map(p =>
      `<div class="ts-ac-item" onmousedown="tsAcSelect(${i},'${p.name.replace(/'/g, "\\'")}')">
        <img src="${SPR}${p.spriteKey}.png" alt="" onerror="this.style.visibility='hidden'">
        <span>${p.name}</span>
      </div>`
    ).join('');
    const r = inputEl.getBoundingClientRect();
    drop.style.left  = r.left + 'px';
    drop.style.top   = (r.bottom + 2) + 'px';
    drop.style.width = Math.max(220, r.width) + 'px';
    drop.style.display = 'block';
  }

  function hideDrop() {
    if (_drop) { _drop.innerHTML = ''; _drop.style.display = 'none'; }
    _dropCtx = null;
  }

  function showSimpleDrop(inputEl, options) {
    _dropOptions = options;
    const drop = getDrop();
    if (!options.length) { hideDrop(); return; }
    drop.innerHTML = options.map((opt, idx) =>
      `<div class="ts-ac-item" onmousedown="tsSimpleSelect(${idx})"><span>${opt}</span></div>`
    ).join('');
    const r = inputEl.getBoundingClientRect();
    drop.style.left    = r.left + 'px';
    drop.style.top     = (r.bottom + 2) + 'px';
    drop.style.width   = Math.max(200, r.width) + 'px';
    drop.style.display = 'block';
  }

  window.tsSimpleSelect = function (idx) {
    const value = _dropOptions[idx];
    if (value === undefined || !_dropCtx) return;
    const { type, slot } = _dropCtx;
    const field = document.getElementById(type === 'ability' ? `ov${slot}-ability` : `ov${slot}-item`);
    if (field) field.value = value;
    if (type === 'item') tsRefreshSpeed(slot);
    hideDrop();
    save();
  };

  window.tsAbilityFocus = function (i) {
    const poke = selected[i];
    const abilities = poke ? (window.ABILITIES_DATA || {})[poke.name] || [] : [];
    if (!abilities.length) return;
    const inp = document.getElementById(`ov${i}-ability`);
    if (!inp) return;
    _dropCtx = { type: 'ability', slot: i };
    showSimpleDrop(inp, abilities);
  };

  window.tsAbilityInput = function (i) {
    const poke = selected[i];
    const abilities = poke ? (window.ABILITIES_DATA || {})[poke.name] || [] : [];
    const inp = document.getElementById(`ov${i}-ability`);
    if (!inp) return;
    const q = inp.value.toLowerCase();
    const filtered = q ? abilities.filter(a => a.toLowerCase().includes(q)) : abilities;
    _dropCtx = { type: 'ability', slot: i };
    showSimpleDrop(inp, filtered);
  };

  window.tsItemInput = function (i) {
    const inp = document.getElementById(`ov${i}-item`);
    if (!inp) return;
    const q = inp.value.toLowerCase().trim();
    if (!q) { hideDrop(); } else {
      const filtered = (window.VGC_ITEMS || []).filter(it => it.toLowerCase().includes(q)).slice(0, 12);
      _dropCtx = { type: 'item', slot: i };
      showSimpleDrop(inp, filtered);
    }
    tsRefreshSpeed(i);
  };

  function acFilter(query) {
    if (!query.trim()) return [];
    const lq = query.toLowerCase();
    return DATA.filter(p => p.name.toLowerCase().includes(lq)).slice(0, 8);
  }

  /* ── HTML builders ── */

  function buildOverview() {
    const cols = ['POKÉMON', 'TYPE', 'ABILITY', 'NATURE', 'HELD ITEM'];
    const rows = [0,1,2,3,4,5].map(i => {
      const nameCell = `
        <td class="ts-ov-name-cell">
          <div class="ts-ov-poke">
            <img class="ts-ov-sprite" id="ov${i}-sprite" src="" alt=""
                 style="display:none" onerror="this.style.display='none'">
            <input type="text" id="ov${i}-name" autocomplete="off"
                   oninput="tsNameInput(${i})" onblur="tsNameBlur()">
          </div>
        </td>`;
      const typeCell = `<td class="ts-ov-type-cell"><div class="ts-type-display" id="ov${i}-types"></div></td>`;
      const rest = ['ability', 'nature', 'item'].map(f => {
        if (f === 'ability') return `<td><input type="text" id="ov${i}-ability" autocomplete="off" onfocus="tsAbilityFocus(${i})" oninput="tsAbilityInput(${i})" onblur="tsNameBlur()"></td>`;
        if (f === 'nature')  return `<td><input type="text" id="ov${i}-nature" autocomplete="off" oninput="tsRefreshSpeed(${i})"></td>`;
        if (f === 'item')    return `<td><input type="text" id="ov${i}-item"   autocomplete="off" oninput="tsItemInput(${i})" onblur="tsNameBlur()"></td>`;
        return `<td><input type="text" id="ov${i}-${f}" autocomplete="off"></td>`;
      }).join('');
      return `<tr>${nameCell}${typeCell}${rest}</tr>`;
    }).join('');

    return `
      <table class="ts-overview">
        <thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  function buildTabBar() {
    const tabs = [0,1,2,3,4,5].map(i =>
      `<button class="ts-tab${i === 0 ? ' ts-tab--active' : ''}"
               id="ts-tab-${i}"
               onclick="tsSwitchTab(${i})">
        <img class="ts-tab-sprite" id="ts-tab-spr-${i}" src="" alt="" style="display:none"
             onerror="this.style.display='none'">
        <span id="ts-tab-name-${i}">${i + 1}</span>
       </button>`
    ).join('');
    return `<div class="ts-tab-bar">${tabs}</div>`;
  }

  const STATS = [
    { label: 'HP',    id: 'HP'    },
    { label: 'ATK',   id: 'ATK'   },
    { label: 'DEF',   id: 'DEF'   },
    { label: 'SP.A',  id: 'SPA'   },
    { label: 'SP.D',  id: 'SPDEF' },
    { label: 'SPD',   id: 'SPD'   },
    { label: 'TOTAL', id: 'TOTAL' },
  ];

  function buildSection(i) {
    const statCols = STATS.map(s =>
      `<div class="ts-stat-col">
        <div class="ts-stat-label">${s.label}</div>
        <input type="text" id="pk${i}-${s.id}" autocomplete="off">
      </div>`
    ).join('');

    const moves = [1,2,3,4].map(n => `
      <div class="ts-move-slot">
        <span class="ts-field-label">Move ${n}</span>
        <input type="text" id="pk${i}-mv${n}" autocomplete="off">
        <span class="ts-field-label ts-type-lbl">Type</span>
        <input type="text" id="pk${i}-mv${n}t" autocomplete="off">
      </div>`).join('');

    return `
      <div class="ts-section${i === 0 ? ' ts-section--active' : ''}" id="ts-section-${i}">
        <div class="ts-stats-area">${statCols}</div>
        <div class="ts-moves-area">
          <div class="ts-vert-label">MOVES</div>
          <div class="ts-move-grid">${moves}</div>
        </div>
        <div class="ts-notes-area">
          <div class="ts-vert-label">NOTES</div>
          <textarea id="pk${i}-notes" rows="3"></textarea>
        </div>
      </div>`;
  }

  /* ── Autocomplete public handlers ── */

  window.tsNameInput = function (i) {
    const inp = document.getElementById(`ov${i}-name`);
    if (!inp) return;
    tsUpdateTabName(i);
    showDrop(i, inp, acFilter(inp.value));
    if (!inp.value.trim()) {
      tsSetSprite(i, null);
      tsSetTypes(i, null);
      const spdEl = document.getElementById(`pk${i}-SPD`);
      if (spdEl) spdEl.value = '';
    }
  };

  window.tsNameBlur = function () {
    setTimeout(hideDrop, 150);
  };

  window.tsAcSelect = function (i, name) {
    const inp = document.getElementById(`ov${i}-name`);
    if (inp) inp.value = name;
    const poke = DATA.find(p => p.name === name) || null;
    selected[i] = poke;
    tsSetSprite(i, poke);
    tsSetTypes(i, poke);
    if (poke) {
      tsRefreshSpeed(i);
      const abilities = (window.ABILITIES_DATA || {})[poke.name] || [];
      const abilityEl = document.getElementById(`ov${i}-ability`);
      if (abilityEl) abilityEl.value = abilities.length === 1 ? abilities[0] : '';
    }
    tsUpdateTabName(i);
    hideDrop();
    save();
  };

  /* ── Sprite helpers ── */

  function tsSetSprite(i, poke) {
    const img    = document.getElementById(`ov${i}-sprite`);
    const tabImg = document.getElementById(`ts-tab-spr-${i}`);
    if (img) {
      if (poke) { img.src = `${SPR}${poke.spriteKey}.png`; img.style.display = 'block'; }
      else      { img.src = ''; img.style.display = 'none'; }
    }
    if (tabImg) {
      if (poke) { tabImg.src = `${SPR}${poke.spriteKey}.png`; tabImg.style.display = 'inline-block'; }
      else      { tabImg.src = ''; tabImg.style.display = 'none'; }
    }
  }

  /* ── Type badge helpers ── */

  function tsSetTypes(i, poke) {
    const el = document.getElementById(`ov${i}-types`);
    if (!el) return;
    if (!poke || !poke.types || !poke.types.length) { el.innerHTML = ''; return; }
    el.innerHTML = poke.types.map(t =>
      `<span class="ts-type-badge ts-type-${t.toLowerCase()}">${t}</span>`
    ).join('');
  }

  /* ── Speed auto-fill (nature + item aware) ── */

  const SPEED_PLUS  = new Set(['Timid', 'Jolly', 'Hasty', 'Naive']);
  const SPEED_MINUS = new Set(['Brave', 'Relaxed', 'Quiet', 'Sassy']);

  window.tsRefreshSpeed = function (i) {
    const poke = selected[i];
    if (!poke) return;
    const sp     = window.calcSpeed(poke.base);
    const nature = ((document.getElementById(`ov${i}-nature`) || {}).value || '').trim();
    const item   = ((document.getElementById(`ov${i}-item`)   || {}).value || '').trim();

    const mul   = SPEED_PLUS.has(nature) ? 1.1 : SPEED_MINUS.has(nature) ? 0.9 : 1.0;
    const scarf = /choice scarf/i.test(item);

    const lo = Math.floor(Math.floor(sp.neutral0  * mul) * (scarf ? 1.5 : 1));
    const hi = Math.floor(Math.floor(sp.neutral32 * mul) * (scarf ? 1.5 : 1));

    const spdEl = document.getElementById(`pk${i}-SPD`);
    if (spdEl) spdEl.value = lo === hi ? String(lo) : `${lo}–${hi}`;

    const notesEl = document.getElementById(`pk${i}-notes`);
    if (!notesEl) return;

    const ctx = [
      SPEED_PLUS.has(nature)  ? `+${nature}` : SPEED_MINUS.has(nature) ? `-${nature}` : '',
      scarf ? 'Scarf' : ''
    ].filter(Boolean).join(', ');

    const line1 = `${poke.name} (B${poke.base})${ctx ? ` [${ctx}]` : ''}: ${sp.minus0}–${sp.maxSpeed} | 0SP: ${sp.neutral0} | +32SP: ${sp.neutral32}`;
    const line2 = `Scarf: ${sp.scarfNeutral32}(+32SP) / ${sp.scarfMax}(max)`;
    const lines = notesEl.value.split('\n');
    lines[0] = line1;
    if (lines.length < 2) lines.push(line2); else lines[1] = line2;
    notesEl.value = lines.join('\n');
  };

  /* ── Tab switching ── */

  window.tsSwitchTab = function (idx) {
    document.querySelectorAll('.ts-tab').forEach((t, i) =>
      t.classList.toggle('ts-tab--active', i === idx));
    document.querySelectorAll('.ts-section').forEach((s, i) =>
      s.classList.toggle('ts-section--active', i === idx));
  };

  window.tsUpdateTabName = function (i) {
    const val = (document.getElementById(`ov${i}-name`) || {}).value || '';
    const label = document.getElementById(`ts-tab-name-${i}`);
    if (label) label.textContent = val.trim() || String(i + 1);
  };

  /* ── DOM injection ── */

  function build() {
    DATA = window.POKEMON_DATA || [];

    const c = document.getElementById('ts-container');
    if (!c) return;
    c.innerHTML = buildOverview() + buildTabBar() + [0,1,2,3,4,5].map(buildSection).join('');
    load();
    [0,1,2,3,4,5].forEach(i => {
      tsUpdateTabName(i);
      const inp = document.getElementById(`ov${i}-name`);
      if (inp && inp.value) {
        const poke = DATA.find(p => p.name === inp.value) || null;
        selected[i] = poke;
        tsSetSprite(i, poke);
        tsSetTypes(i, poke);
        if (poke) tsRefreshSpeed(i);
      }
    });
    c.addEventListener('input', save);
  }

  /* ── Persistence ── */

  function fields() {
    return document.querySelectorAll('#ts-container input:not([type="button"]), #ts-container textarea');
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
    [0,1,2,3,4,5].forEach(i => {
      selected[i] = null;
      tsSetSprite(i, null);
      tsSetTypes(i, null);
      const label = document.getElementById(`ts-tab-name-${i}`);
      if (label) label.textContent = String(i + 1);
    });
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
