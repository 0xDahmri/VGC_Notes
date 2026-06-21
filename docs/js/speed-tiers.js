(function () {
  if (!document.getElementById('st-container')) return;

  const SPR = '../../images/sprites/';

  const ROWS = (window.POKEMON_DATA || []).map(r => ({ ...r, ...window.calcSpeed(r.base) }));

  const COLS = [
    { key: 'base',           label: 'BASE SPE',            cls: '' },
    { key: 'maxSpeed',       label: 'MAX SPEED',           cls: 'st-max' },
    { key: 'neutral32',      label: 'NEUTRAL +32 SP',      cls: '' },
    { key: 'neutral0',       label: 'NEUTRAL 0 SP',        cls: '' },
    { key: 'minus0',         label: '−SPE 0 SP',           cls: '' },
    { key: 'scarfMax',       label: 'MAX + SCARF',         cls: '' },
    { key: 'scarfNeutral32', label: 'NEUTRAL +32 + SCARF', cls: '' },
  ];

  /* ── State ── */
  let sk = 'base', sd = -1, q = '';

  function visible() {
    const lq = q.toLowerCase();
    let r = lq ? ROWS.filter(x => x.name.toLowerCase().includes(lq)) : ROWS;
    return [...r].sort((a, b) => {
      const av = a[sk], bv = b[sk];
      return typeof av === 'string' ? sd * av.localeCompare(bv) : sd * (av - bv);
    });
  }

  /* ── Render ── */
  function bodyHTML() {
    const rows = visible();
    if (!rows.length) return `<tr><td colspan="9" class="st-empty">No Pokémon found.</td></tr>`;
    return rows.map(r => `<tr>
      <td class="st-name-td"><div class="st-poke">
        <img class="st-sprite" src="${SPR}${r.spriteKey}.png" alt="" loading="lazy" onerror="this.style.visibility='hidden'">
        <div>
          <div class="st-pname">${r.name}</div>
          <div class="st-type-row">${r.types.map(t => `<span class="ts-type-badge ts-type-${t.toLowerCase()}">${t}</span>`).join('')}</div>
        </div>
      </div></td>
      ${COLS.map(c => `<td class="${c.cls}">${r[c.key]}</td>`).join('')}
    </tr>`).join('');
  }

  function refreshBody() {
    const el = document.getElementById('st-tbody');
    if (el) el.innerHTML = bodyHTML();
  }

  function refreshHeaders() {
    COLS.forEach((c, i) => {
      const th = document.getElementById('sth' + i);
      if (!th) return;
      const on = c.key === sk;
      th.className = 'st-th' + (c.cls ? ' ' + c.cls : '') + (on ? ' st-on' : '');
      th.innerHTML = c.label + (on ? `<span class="st-arr">${sd < 0 ? '▼' : '▲'}</span>` : '');
    });
    const nth = document.getElementById('sth-name');
    if (nth) {
      const on = sk === 'name';
      nth.className = 'st-th st-name-th' + (on ? ' st-on' : '');
      nth.innerHTML = 'POKÉMON' + (on ? `<span class="st-arr">${sd < 0 ? '▼' : '▲'}</span>` : '');
    }
  }

  /* ── Public ── */
  window.stSort = function (key) {
    if (sk === key) sd *= -1;
    else { sk = key; sd = key === 'name' ? 1 : -1; }
    refreshHeaders();
    refreshBody();
  };

  /* ── Init ── */
  function init() {
    const c = document.getElementById('st-container');
    if (!c) return;

    const thCols = COLS.map((col, i) =>
      `<th id="sth${i}" class="st-th ${col.cls}" onclick="stSort('${col.key}')">${col.label}</th>`
    ).join('');

    const searchSVG = `<svg class="st-sicon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;

    c.innerHTML = `
      <div class="st-hero">
        <div class="st-eyebrow">VGC NOTES &middot; TOOLS</div>
        <div class="st-htitle">Pokemon Champions Speed Tiers</div>
        <div class="st-hsub">Browse Pokemon Champions speed tiers for every Pokémon and Mega in the VGC 2026 Reg. M-A format, with base Speed, max Speed, neutral natures, and Choice Scarf calcs.</div>
        <div class="st-sbox">
          ${searchSVG}
          <input id="st-search" type="text" placeholder="Search Pokémon" autocomplete="off">
        </div>
      </div>
      <div class="st-wrap">
        <table class="st-table">
          <thead><tr>
            <th id="sth-name" class="st-th st-name-th" onclick="stSort('name')">POKÉMON</th>
            ${thCols}
          </tr></thead>
          <tbody id="st-tbody">${bodyHTML()}</tbody>
        </table>
      </div>`;

    document.getElementById('st-search').addEventListener('input', function () {
      q = this.value;
      refreshBody();
    });

    refreshHeaders();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
