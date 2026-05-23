(function () {
  if (!document.getElementById('ts-container')) return;

  const KEY = 'vgc-team-sheet-v1';
  const SPR = '../../images/sprites/';

  /* Per-slot selected Pokémon (null if none picked) */
  const selected = [null, null, null, null, null, null];

  /* ── HTML builders ── */

  function buildOverview() {
    const cols = ['POKÉMON', 'TYPE', 'ABILITY', 'NATURE', 'HELD ITEM'];
    const rows = [0,1,2,3,4,5].map(i => {
      const nameCell = `
        <td class="ts-ov-name-cell">
          <div class="ts-ov-poke">
            <img class="ts-ov-sprite" id="ov${i}-sprite" src="" alt=""
                 style="display:none" onerror="this.style.display='none'">
            <div class="ts-ac-wrap">
              <input type="text" id="ov${i}-name" autocomplete="off"
                     oninput="tsNameInput(${i})" onblur="tsNameBlur(${i})">
              <div class="ts-ac-drop" id="ov${i}-drop"></div>
            </div>
          </div>
        </td>`;
      const rest = ['type','ability','nature','item'].map(f =>
        `<td><input type="text" id="ov${i}-${f}" autocomplete="off"></td>`
      ).join('');
      return `<tr>${nameCell}${rest}</tr>`;
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
      <div class="ts-section${i === 0 ? ' ts-section--active' : ''}" id="ts-section-${i}">
        <div class="ts-stats-area">${statCols}</div>
        <div class="ts-moves-area">
          <div class="ts-vert-label">MOVES</div>
          <div class="ts-move-grid">${moves}</div>
        </div>
        <div class="ts-notes-area">
          <div class="ts-notes-header">
            <div class="ts-vert-label">NOTES</div>
            <button class="ts-speed-btn" onclick="tsFillSpeed(${i})">Fill Speed Ranges</button>
          </div>
          <textarea id="pk${i}-notes" rows="4"></textarea>
        </div>
      </div>`;
  }

  /* ── Autocomplete ── */

  const DATA = window.POKEMON_DATA || [];

  function acFilter(query) {
    if (!query.trim()) return [];
    const lq = query.toLowerCase();
    return DATA.filter(p => p.name.toLowerCase().includes(lq)).slice(0, 8);
  }

  function acShowDrop(i, matches) {
    const drop = document.getElementById(`ov${i}-drop`);
    if (!drop) return;
    if (!matches.length) { drop.innerHTML = ''; drop.style.display = 'none'; return; }
    drop.innerHTML = matches.map(p =>
      `<div class="ts-ac-item" onmousedown="tsAcSelect(${i}, '${p.name.replace(/'/g, "\\'")}')">
        <img src="${SPR}${p.spriteKey}.png" alt="" onerror="this.style.visibility='hidden'">
        <span>${p.name}</span>
       </div>`
    ).join('');
    drop.style.display = 'block';
  }

  window.tsNameInput = function (i) {
    const inp = document.getElementById(`ov${i}-name`);
    if (!inp) return;
    tsUpdateTabName(i);
    const matches = acFilter(inp.value);
    acShowDrop(i, matches);
    if (!inp.value.trim()) tsSetSprite(i, null);
  };

  window.tsNameBlur = function (i) {
    /* Short delay so mousedown on a drop item fires first */
    setTimeout(() => {
      const drop = document.getElementById(`ov${i}-drop`);
      if (drop) { drop.innerHTML = ''; drop.style.display = 'none'; }
    }, 150);
  };

  window.tsAcSelect = function (i, name) {
    const inp = document.getElementById(`ov${i}-name`);
    if (inp) inp.value = name;
    const poke = DATA.find(p => p.name === name) || null;
    selected[i] = poke;
    tsSetSprite(i, poke);
    tsUpdateTabName(i);
    const drop = document.getElementById(`ov${i}-drop`);
    if (drop) { drop.innerHTML = ''; drop.style.display = 'none'; }
    save();
  };

  function tsSetSprite(i, poke) {
    const img = document.getElementById(`ov${i}-sprite`);
    const tabImg = document.getElementById(`ts-tab-spr-${i}`);
    if (!img) return;
    if (poke) {
      img.src = `${SPR}${poke.spriteKey}.png`;
      img.style.display = 'block';
    } else {
      img.src = '';
      img.style.display = 'none';
    }
    if (tabImg) {
      if (poke) {
        tabImg.src = `${SPR}${poke.spriteKey}.png`;
        tabImg.style.display = 'inline-block';
      } else {
        tabImg.src = '';
        tabImg.style.display = 'none';
      }
    }
  }

  /* ── Fill Speed Ranges ── */

  window.tsFillSpeed = function (i) {
    const notes = document.getElementById(`pk${i}-notes`);
    if (!notes) return;
    const poke = selected[i];
    if (!poke) {
      alert('Select a Pokémon in the overview table first.');
      return;
    }
    const sp = window.calcSpeed(poke.base);
    const lines = [
      `=== Speed Tiers: ${poke.name} (Base ${poke.base}) ===`,
      `Max Speed (Timid +32 SP):    ${sp.maxSpeed}`,
      `Neutral +32 SP:              ${sp.neutral32}`,
      `Neutral  0 SP:               ${sp.neutral0}`,
      `−Spe     0 SP:               ${sp.minus0}`,
      `Choice Scarf (max):          ${sp.scarfMax}`,
      `Choice Scarf (+32 neutral):  ${sp.scarfNeutral32}`,
    ];
    notes.value = lines.join('\n');
    save();
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
    const c = document.getElementById('ts-container');
    if (!c) return;
    c.innerHTML = buildOverview() + buildTabBar() + [0,1,2,3,4,5].map(buildSection).join('');
    load();
    [0,1,2,3,4,5].forEach(i => {
      tsUpdateTabName(i);
      /* Restore sprites from saved names */
      const inp = document.getElementById(`ov${i}-name`);
      if (inp && inp.value) {
        const poke = DATA.find(p => p.name === inp.value) || null;
        selected[i] = poke;
        tsSetSprite(i, poke);
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
