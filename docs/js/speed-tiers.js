(function () {
  if (!document.getElementById('st-container')) return;

  const SPR = '../../images/sprites/';
  const TS_KEY = 'vgc-team-sheet-v2';

  const ROWS = (window.POKEMON_DATA || []).map(r => ({ ...r, ...window.calcSpeed(r.base) }));

  const COLS = [
    { key: 'base',           label: 'BASE',     cls: '',       title: 'Base Speed stat' },
    { key: 'maxSpeed',       label: 'MAX',      cls: 'st-max', title: '+Speed nature, max EVs' },
    { key: 'neutral32',      label: 'N +32',    cls: '',       title: 'Neutral nature, 32 EVs' },
    { key: 'neutral0',       label: 'N 0',      cls: '',       title: 'Neutral nature, 0 EVs' },
    { key: 'minus0',         label: '−N 0',     cls: '',       title: '−Speed nature, 0 EVs' },
    { key: 'scarfMax',       label: 'SCARF',    cls: '',       title: '+Speed nature, max EVs + Choice Scarf' },
    { key: 'scarfNeutral32', label: 'SCF N+32', cls: '',       title: 'Neutral nature, 32 EVs + Choice Scarf' },
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
      `<th id="sth${i}" class="st-th ${col.cls}" onclick="stSort('${col.key}')" title="${col.title || col.label}">${col.label}</th>`
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
        <button id="sc-toggle-btn" class="st-compare-btn" onclick="scToggle()">Compare Teams</button>
      </div>
      <div class="sc-panel" id="sc-panel">${buildComparePanel()}</div>
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

  /* ══════════════════════════════════════════════
     TEAM SPEED COMPARISON
  ══════════════════════════════════════════════ */

  const NAT_MUL = { '+': 1.1, 'n': 1.0, '-': 0.9 };

  function slotSpeed(name, natKey, scarf) {
    const poke = (window.POKEMON_DATA || []).find(
      p => p.name.toLowerCase() === name.toLowerCase().trim()
    );
    if (!poke) return null;
    const sp  = window.calcSpeed(poke.base);
    const nat = NAT_MUL[natKey] || 1.0;
    const spd = Math.floor(sp.neutral32 * nat);
    return { name: poke.name, speed: scarf ? Math.floor(spd * 1.5) : spd, poke };
  }

  function buildCompareCols(prefix, count) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `<div class="sc-slot">
        <input type="text" list="sc-datalist" id="${prefix}-name-${i}"
               placeholder="Pokémon ${i + 1}" autocomplete="off">
        <select id="${prefix}-nat-${i}">
          <option value="n">Neutral</option>
          <option value="+">+SPE</option>
          <option value="-">−SPE</option>
        </select>
        <label class="sc-scarf-lbl">
          <input type="checkbox" id="${prefix}-scarf-${i}"> Scarf
        </label>
      </div>`;
    }
    return html;
  }

  function loadMyTeamFromSheet(prefix) {
    try {
      const saved = JSON.parse(localStorage.getItem(TS_KEY) || '{}');
      for (let i = 0; i < 6; i++) {
        const nameEl = document.getElementById(`${prefix}-name-${i}`);
        const natEl  = document.getElementById(`${prefix}-nat-${i}`);
        const name   = saved[`ov${i}-name`] || '';
        const nature = saved[`ov${i}-nature`] || '';
        if (nameEl && name) nameEl.value = name;
        if (natEl && nature) {
          const SPEED_PLUS  = ['Timid','Jolly','Hasty','Naive'];
          const SPEED_MINUS = ['Brave','Relaxed','Quiet','Sassy'];
          natEl.value = SPEED_PLUS.includes(nature) ? '+' : SPEED_MINUS.includes(nature) ? '-' : 'n';
        }
        const item = saved[`ov${i}-item`] || '';
        if (item && /choice scarf/i.test(item)) {
          const scarfEl = document.getElementById(`${prefix}-scarf-${i}`);
          if (scarfEl) scarfEl.checked = true;
        }
      }
    } catch (e) {}
  }

  function buildComparePanel() {
    const allNames = (window.POKEMON_DATA || []).map(p => `<option value="${p.name}"></option>`).join('');
    return `
      <datalist id="sc-datalist">${allNames}</datalist>
      <div class="sc-panel-title">Team Speed Comparison</div>
      <div class="sc-teams">
        <div>
          <div class="sc-team-col-title">
            My Team
            <button onclick="scLoadMyTeam()" style="margin-left:0.5rem;padding:0.2rem 0.55rem;font-size:0.7rem;border:1px solid rgba(77,208,225,0.4);border-radius:4px;background:transparent;color:#4dd0e1;cursor:pointer;" title="Load from Team Sheet">Load from Sheet</button>
          </div>
          ${buildCompareCols('sc-my', 6)}
        </div>
        <div>
          <div class="sc-team-col-title">Opponent's Team</div>
          ${buildCompareCols('sc-opp', 6)}
        </div>
      </div>
      <button class="sc-run-btn" onclick="scCompare()">Compare Speeds</button>
      <div id="sc-result"></div>`;
  }

  window.scToggle = function () {
    const panel = document.getElementById('sc-panel');
    const btn   = document.getElementById('sc-toggle-btn');
    if (!panel || !btn) return;
    const open = panel.classList.toggle('sc-open');
    btn.classList.toggle('active', open);
    btn.textContent = open ? 'Hide Comparison' : 'Compare Teams';
  };

  window.scLoadMyTeam = function () {
    loadMyTeamFromSheet('sc-my');
  };

  window.scCompare = function () {
    const resultEl = document.getElementById('sc-result');
    if (!resultEl) return;

    const mySlots  = [];
    const oppSlots = [];

    for (let i = 0; i < 6; i++) {
      const myName   = (document.getElementById(`sc-my-name-${i}`)?.value || '').trim();
      const myNat    = document.getElementById(`sc-my-nat-${i}`)?.value || 'n';
      const myScarf  = document.getElementById(`sc-my-scarf-${i}`)?.checked || false;
      if (myName) mySlots.push(slotSpeed(myName, myNat, myScarf) || { name: myName, speed: null });

      const oppName  = (document.getElementById(`sc-opp-name-${i}`)?.value || '').trim();
      const oppNat   = document.getElementById(`sc-opp-nat-${i}`)?.value || 'n';
      const oppScarf = document.getElementById(`sc-opp-scarf-${i}`)?.checked || false;
      if (oppName) oppSlots.push(slotSpeed(oppName, oppNat, oppScarf) || { name: oppName, speed: null });
    }

    if (!mySlots.length || !oppSlots.length) {
      resultEl.innerHTML = `<p class="sc-empty-note">Enter at least one Pokémon in each team to compare.</p>`;
      return;
    }

    const oppHeaders = oppSlots.map((o, j) => {
      const spd = o.speed !== null ? ` <span style="color:rgba(255,255,255,0.4);font-weight:400">(${o.speed})</span>` : '';
      return `<th class="sc-opp-header">${o.name}${spd}</th>`;
    }).join('');

    const bodyRows = mySlots.map(m => {
      const mSpd = m.speed !== null ? ` <span style="color:rgba(255,255,255,0.4);font-weight:400">(${m.speed})</span>` : '';
      const cells = oppSlots.map(o => {
        if (m.speed === null || o.speed === null) {
          return `<td class="sc-cell-tie">?</td>`;
        }
        if (m.speed > o.speed)  return `<td class="sc-cell-win" title="${m.speed} > ${o.speed}">✓ Faster</td>`;
        if (m.speed < o.speed)  return `<td class="sc-cell-lose" title="${m.speed} < ${o.speed}">✗ Slower</td>`;
        return `<td class="sc-cell-tie" title="${m.speed} = ${o.speed}">= Tied</td>`;
      }).join('');
      return `<tr><td class="sc-row-label">${m.name}${mSpd}</td>${cells}</tr>`;
    }).join('');

    resultEl.innerHTML = `
      <div class="sc-matrix-wrap">
        <table class="sc-matrix">
          <thead><tr>
            <th class="sc-mine-header">My Team</th>
            ${oppHeaders}
          </tr></thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
      <p style="font-size:0.72rem;color:rgba(255,255,255,0.3);margin-top:0.5rem;">
        Speeds shown at max EV investment with the selected nature/item modifier.
        ✓ = your Pokémon moves first &nbsp;|&nbsp; ✗ = opponent moves first.
      </p>`;
  };

})();
