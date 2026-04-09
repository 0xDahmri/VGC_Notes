// Pokemon Champions Damage Calculator — Engine
// Mechanics: Level 50 fixed, 31 IVs fixed, Stat Points (SP) replace EVs
// 1 SP = +1 to final stat at Lv50 (equiv. 8 EVs). Max 32 SP/stat, 66 total.

const LEVEL = 50;

// ── Stat Calculation ──────────────────────────────────────────────────────────

function calcHP(base, sp) {
  if (base === 1) return 1; // Shedinja
  return Math.floor((base * 2 + 31) * LEVEL / 100) + LEVEL + 10 + sp;
}

function calcStat(base, sp, statName, nature) {
  const natureMods = NATURES[nature] || ['', ''];
  const natMult = natureMods[0] === statName ? 1.1 : natureMods[1] === statName ? 0.9 : 1.0;
  return Math.floor(((Math.floor((base * 2 + 31) * LEVEL / 100) + 5) + sp) * natMult);
}

// Apply in-battle stat boost stage (-6 to +6)
function applyBoost(stat, stage) {
  if (stage >= 0) return Math.floor(stat * (2 + stage) / 2);
  return Math.floor(stat * 2 / (2 - stage));
}

// ── Type Effectiveness ────────────────────────────────────────────────────────

function getTypeEffectiveness(moveType, defType1, defType2) {
  const chart = TYPE_CHART;
  if (!chart[moveType]) return 1;
  let e = chart[moveType][defType1] ?? 1;
  if (defType2 && defType2 !== defType1) e *= chart[moveType][defType2] ?? 1;
  return e;
}

// ── Item helpers ──────────────────────────────────────────────────────────────

function getTypeBoostItem(item) {
  return ITEM_EFFECTS[item]?.typeBoost ?? null;
}

function getResistBerryType(item) {
  return ITEM_EFFECTS[item]?.resistBerry ?? null;
}

// ── Main Damage Calculator ────────────────────────────────────────────────────
// Returns { rolls, min, max, minPct, maxPct, desc }

function calcDamage(atk, def) {
  // atk / def are objects built from the form:
  // { pokemon, nature, sp:{hp,at,df,sa,sd,sp}, boosts:{at,df,sa,sd,sp},
  //   ability, item, isBurned, move, isSpread, isCrit,
  //   weather, terrain, screens }

  const atkPoke = POKEMON[atk.pokemon];
  const defPoke = POKEMON[def.pokemon];
  if (!atkPoke || !defPoke || !atk.move || atk.move === '(No Move)') return null;

  const moveData = MOVES[atk.move];
  if (!moveData || moveData.cat === 'Status') return null;

  const isPhysical = moveData.cat === 'Physical';
  const moveType   = moveData.type;
  let   bp         = moveData.bp;

  // ── Attacker's offensive stat ─────────────────────────────────────────────
  const atkStatName = isPhysical ? 'at' : 'sa';
  let rawAtkStat = calcStat(atkPoke[atkStatName], atk.sp[atkStatName] ?? 0, atkStatName, atk.nature);

  // Pure Power / Huge Power doubles Attack
  if (['Pure Power','Huge Power'].includes(atk.ability)) {
    if (isPhysical) rawAtkStat *= 2;
  }
  // Gorilla Tactics boosts Attack 1.5x (physical only)
  if (atk.ability === 'Gorilla Tactics' && isPhysical) rawAtkStat = Math.floor(rawAtkStat * 1.5);
  // Hadron Engine boosts SpA in Electric Terrain
  if (atk.ability === 'Hadron Engine' && atk.terrain === 'Electric' && !isPhysical) rawAtkStat = Math.floor(rawAtkStat * 4/3);
  // Orichalcum Pulse boosts Atk in Sun
  if (atk.ability === 'Orichalcum Pulse' && (atk.weather === 'Sun' || atk.ability === 'Mega Sol') && isPhysical) rawAtkStat = Math.floor(rawAtkStat * 4/3);
  // Quark Drive boosts highest stat in Electric Terrain (simplified: boost Atk or SpA if it's the highest)
  // Guts: 1.5x Attack when statused, ignore burn penalty
  if (atk.ability === 'Guts' && atk.isBurned) rawAtkStat = Math.floor(rawAtkStat * 1.5);
  // Light Ball: double Pikachu's offenses
  if (atk.item === 'Light Ball' && atk.pokemon === 'Pikachu') rawAtkStat *= 2;

  let atkStat = applyBoost(rawAtkStat, atk.boosts[atkStatName] ?? 0);

  // Burn halves physical attack (unless Guts)
  if (isPhysical && atk.isBurned && atk.ability !== 'Guts') atkStat = Math.floor(atkStat * 0.5);

  // ── Defender's defensive stat ─────────────────────────────────────────────
  const defStatName = isPhysical ? 'df' : 'sd';
  let rawDefStat = calcStat(defPoke[defStatName], def.sp[defStatName] ?? 0, defStatName, def.nature);

  // Fur Coat doubles Defense vs Physical
  if (def.ability === 'Fur Coat' && isPhysical) rawDefStat *= 2;
  // Marvel Scale boosts Defense if statused
  if (def.ability === 'Marvel Scale' && def.isStatused) rawDefStat = Math.floor(rawDefStat * 1.5);
  // Ice Scales halves SpD damage taken
  if (def.ability === 'Ice Scales' && !isPhysical) rawDefStat *= 2;

  // Crit ignores positive defense boosts; Unaware ignores all boosts
  const defBoostStage = def.boosts[defStatName] ?? 0;
  let defStat;
  if (atk.isCrit) {
    defStat = applyBoost(rawDefStat, Math.min(defBoostStage, 0));
  } else if (atk.ability === 'Unaware' || def.ability === 'Unaware') {
    defStat = rawDefStat;
  } else {
    defStat = applyBoost(rawDefStat, defBoostStage);
  }

  // ── Base Power modifiers ──────────────────────────────────────────────────

  // Technician: moves ≤60 BP get 1.5x
  if (atk.ability === 'Technician' && bp <= 60) bp = Math.floor(bp * 1.5);

  // Adaptability: STAB becomes 2x instead of 1.5x (handled in STAB section)

  // Sheer Force: handled by ignoring secondary effects (simplified: 1.3x BP if move has secondary)
  // (skipped for simplicity – would need secondary effect flag on move)

  // Aerilate / Pixilate / Refrigerate / Galvanize / Normalize / Dragonize
  let convertedType = moveType;
  const ateAbilities = {
    'Aerilate':   'Flying',
    'Pixilate':   'Fairy',
    'Refrigerate':'Ice',
    'Galvanize':  'Electric',
    'Dragonize':  'Dragon',
  };
  if (ateAbilities[atk.ability] && moveType === 'Normal') {
    convertedType = ateAbilities[atk.ability];
    bp = Math.floor(bp * 1.2);
  }

  // Type-boosting item (1.2x)
  const itemTypeBoost = getTypeBoostItem(atk.item);
  if (itemTypeBoost && itemTypeBoost === convertedType) bp = Math.floor(bp * 1.2);

  // ── Base damage formula ───────────────────────────────────────────────────
  // floor(floor(floor(2*50/5 + 2) * BP * Atk / Def) / 50 + 2)
  let baseDmg = Math.floor(Math.floor(Math.floor(2 * LEVEL / 5 + 2) * bp * atkStat / defStat) / 50 + 2);

  // ── General modifiers (chained) ───────────────────────────────────────────
  let mod = 0x1000; // 4096-based fixed point

  // Spread move in doubles: 0.75x
  if (moveData.spread && atk.isSpread) mod = chainMod(mod, 0xC00);

  // Weather
  if (atk.weather === 'Sun' || atk.ability === 'Mega Sol') {
    if (convertedType === 'Fire')  mod = chainMod(mod, 0x1800); // 1.5x
    if (convertedType === 'Water') mod = chainMod(mod, 0x800);  // 0.5x
  }
  if (atk.weather === 'Rain') {
    if (convertedType === 'Water') mod = chainMod(mod, 0x1800);
    if (convertedType === 'Fire')  mod = chainMod(mod, 0x800);
  }
  if (atk.weather === 'Sand') {
    if (defPoke.t1 === 'Rock' || defPoke.t2 === 'Rock') {
      if (!isPhysical) mod = chainMod(mod, 0xAAB); // SpD x1.5 for Rock in sand
    }
  }

  // Critical hit: 1.5x, ignores negative attack boosts (already handled above)
  if (atk.isCrit) mod = chainMod(mod, 0x1800);

  // STAB
  const atkType1 = atkPoke.t1;
  const atkType2 = atkPoke.t2;
  const hasSTAB  = convertedType === atkType1 || (atkType2 && convertedType === atkType2);
  if (hasSTAB) {
    if (atk.ability === 'Adaptability') mod = chainMod(mod, 0x2000); // 2x
    else mod = chainMod(mod, 0x1800); // 1.5x
  }

  // Type effectiveness
  const typeEff = getTypeEffectiveness(convertedType, defPoke.t1, defPoke.t2 ?? null);
  if (typeEff === 0)   return { rolls: [], min: 0, max: 0, minPct: '0', maxPct: '0', typeEff: 0 };
  if (typeEff === 0.25) mod = chainMod(mod, 0x400);
  else if (typeEff === 0.5) mod = chainMod(mod, 0x800);
  else if (typeEff === 2)   mod = chainMod(mod, 0x2000);
  else if (typeEff === 4)   mod = chainMod(mod, 0x4000);

  // Wonder Guard: only super effective hits land
  if (def.ability === 'Wonder Guard' && typeEff <= 1) return { rolls: [], min: 0, max: 0, minPct: '0', maxPct: '0', immune: true };

  // Screens (Reflect / Light Screen)
  const hasScreen = isPhysical ? def.reflect : def.lightScreen;
  if (hasScreen && !atk.isCrit) mod = chainMod(mod, 0x800);

  // Neuroforce: 1.25x if super effective
  if (atk.ability === 'Neuroforce' && typeEff > 1) mod = chainMod(mod, 0x1400);

  // Solid Rock / Filter / Prism Armor: 0.75x if super effective
  if (['Solid Rock','Filter','Prism Armor'].includes(def.ability) && typeEff > 1) mod = chainMod(mod, 0xC00);

  // Resistance berry: 0.5x if matching super-effective type hit
  const berryType = getResistBerryType(def.item);
  if (berryType && berryType === convertedType && typeEff >= 2) mod = chainMod(mod, 0x800);

  // Fluffy: 0.5x physical contact; 2x Fire
  if (def.ability === 'Fluffy') {
    if (moveData.contact && isPhysical) mod = chainMod(mod, 0x800);
    if (convertedType === 'Fire')       mod = chainMod(mod, 0x2000);
  }

  // Terrain boosts
  if (atk.terrain === 'Electric' && convertedType === 'Electric') mod = chainMod(mod, 0x14CC); // 1.3x
  if (atk.terrain === 'Grassy'   && convertedType === 'Grass')    mod = chainMod(mod, 0x14CC);
  if (atk.terrain === 'Psychic'  && convertedType === 'Psychic')  mod = chainMod(mod, 0x14CC);
  if (atk.terrain === 'Misty'    && convertedType === 'Dragon')   mod = chainMod(mod, 0x800);

  // ── Generate 16 damage rolls (85%–100%) ──────────────────────────────────
  const rolls = [];
  for (let r = 85; r <= 100; r++) {
    let dmg = Math.floor(baseDmg * mod / 0x1000);
    dmg = Math.floor(dmg * r / 100);
    rolls.push(dmg);
  }

  const defHP = calcHP(defPoke.hp, def.sp.hp ?? 0);
  const minDmg = rolls[0];
  const maxDmg = rolls[15];

  return {
    rolls,
    min: minDmg,
    max: maxDmg,
    minPct: (minDmg / defHP * 100).toFixed(1),
    maxPct: (maxDmg / defHP * 100).toFixed(1),
    defHP,
    typeEff,
    convertedType,
    hasSTAB,
  };
}

// Fixed-point chain modifier (4096 base)
function chainMod(current, next) {
  return Math.floor((current * next + 0x800) / 0x1000);
}

// ── UI Helpers ────────────────────────────────────────────────────────────────

function populateSelect(id, options, selected) {
  const el = document.getElementById(id);
  el.innerHTML = '';
  options.forEach(opt => {
    const o = document.createElement('option');
    o.value = o.textContent = opt;
    if (opt === selected) o.selected = true;
    el.appendChild(o);
  });
}

function getFormValue(id) {
  return document.getElementById(id)?.value ?? '';
}

function getIntValue(id, fallback = 0) {
  return parseInt(document.getElementById(id)?.value ?? fallback, 10) || fallback;
}

function getBoolValue(id) {
  return document.getElementById(id)?.checked ?? false;
}

function buildPokemonData(prefix) {
  const pokeName = getFormValue(prefix + 'Pokemon');
  const poke = POKEMON[pokeName];
  if (!poke) return null;

  return {
    pokemon:  pokeName,
    nature:   getFormValue(prefix + 'Nature'),
    ability:  getFormValue(prefix + 'Ability'),
    item:     getFormValue(prefix + 'Item'),
    isBurned: getBoolValue(prefix + 'Burned'),
    isStatused: getBoolValue(prefix + 'Statused'),
    sp: {
      hp: getIntValue(prefix + 'SP_hp'),
      at: getIntValue(prefix + 'SP_at'),
      df: getIntValue(prefix + 'SP_df'),
      sa: getIntValue(prefix + 'SP_sa'),
      sd: getIntValue(prefix + 'SP_sd'),
      sp: getIntValue(prefix + 'SP_sp'),
    },
    boosts: {
      at: getIntValue(prefix + 'Boost_at'),
      df: getIntValue(prefix + 'Boost_df'),
      sa: getIntValue(prefix + 'Boost_sa'),
      sd: getIntValue(prefix + 'Boost_sd'),
      sp: getIntValue(prefix + 'Boost_sp'),
    },
    move:     getFormValue(prefix + 'Move'),
    isSpread: getBoolValue(prefix + 'Spread'),
    isCrit:   getBoolValue(prefix + 'Crit'),
    weather:  getFormValue('weather'),
    terrain:  getFormValue('terrain'),
    reflect:  getBoolValue('defReflect'),
    lightScreen: getBoolValue('defLightScreen'),
  };
}

function updateStats(prefix) {
  const pokeName = getFormValue(prefix + 'Pokemon');
  const poke = POKEMON[pokeName];
  if (!poke) return;

  const nature = getFormValue(prefix + 'Nature');
  const stats = ['hp','at','df','sa','sd','sp'];
  const labels = ['HP','Atk','Def','SpA','SpD','Spe'];

  stats.forEach((s, i) => {
    const sp = getIntValue(prefix + 'SP_' + s);
    const total = s === 'hp'
      ? calcHP(poke[s], sp)
      : calcStat(poke[s], sp, s, nature);
    const el = document.getElementById(prefix + 'Total_' + s);
    if (el) el.textContent = total;
  });
}

function updateMegaForm(prefix) {
  const item = getFormValue(prefix + 'Item');
  const mega = MEGA_STONE_TO_FORM[item];
  if (!mega) return;
  const pokeEl = document.getElementById(prefix + 'Pokemon');
  // Auto-switch if the mega form exists in our data
  if (POKEMON[mega]) {
    pokeEl.value = mega;
    updateStats(prefix);
  }
}

function runCalc() {
  const atk = buildPokemonData('atk');
  const def = buildPokemonData('def');
  if (!atk || !def) return;

  const result = calcDamage(atk, def);
  const out = document.getElementById('calcOutput');

  if (!result) {
    out.innerHTML = '<p>Select a damaging move to calculate.</p>';
    return;
  }
  if (result.typeEff === 0 || result.immune) {
    out.innerHTML = '<p class="calc-immune">It doesn\'t affect ' + def.pokemon + '...</p>';
    return;
  }

  const effLabel = result.typeEff > 1
    ? `<span class="calc-se">Super effective! (${result.typeEff}x)</span>`
    : result.typeEff < 1
      ? `<span class="calc-nve">Not very effective (${result.typeEff}x)</span>`
      : '';

  const rollsDisplay = result.rolls.map((r, i) => {
    const pct = (r / result.defHP * 100).toFixed(1);
    return `<span class="roll${i === 0 ? ' roll-min' : i === 15 ? ' roll-max' : ''}">${r}</span>`;
  }).join(' ');

  const stab = result.hasSTAB ? ' <span class="calc-stab">STAB</span>' : '';
  const spread = atk.isSpread ? ' <span class="calc-spread">Spread</span>' : '';
  const crit = atk.isCrit ? ' <span class="calc-crit">Crit</span>' : '';

  out.innerHTML = `
    <div class="calc-result">
      <div class="calc-header">
        <strong>${atk.pokemon}</strong>${stab}${spread}${crit}
        <span class="calc-arrow">→</span>
        <strong>${def.pokemon}</strong>
        ${effLabel}
      </div>
      <div class="calc-rolls">${rollsDisplay}</div>
      <div class="calc-range">
        <strong>${result.min}–${result.max}</strong>
        (${result.minPct}%–${result.maxPct}%)
        <span class="calc-hp">/ ${result.defHP} HP</span>
      </div>
      ${getKOChance(result.rolls, result.defHP)}
    </div>
  `;
}

function getKOChance(rolls, hp) {
  const ohkoCount = rolls.filter(r => r >= hp).length;
  if (ohkoCount === 16) return '<div class="calc-ko calc-ko-guaranteed">Guaranteed OHKO</div>';
  if (ohkoCount > 0)    return `<div class="calc-ko">${ohkoCount}/16 chance to OHKO</div>`;

  // 2HKO check (minimum roll * 2)
  const minRoll = rolls[0];
  if (minRoll * 2 >= hp) return '<div class="calc-ko calc-ko-guaranteed">Guaranteed 2HKO</div>';
  const maxRoll = rolls[15];
  if (maxRoll * 2 >= hp) {
    const twoHkoCount = rolls.filter(r => r * 2 >= hp).length;
    return `<div class="calc-ko">${twoHkoCount}/16 chance to 2HKO</div>`;
  }
  return '';
}

// ── Init ──────────────────────────────────────────────────────────────────────

function initCalc() {
  const pokeNames   = Object.keys(POKEMON).sort();
  const moveNames   = Object.keys(MOVES).sort();
  const natureNames = Object.keys(NATURES).sort();

  ['atk','def'].forEach(prefix => {
    populateSelect(prefix + 'Pokemon', pokeNames, prefix === 'atk' ? 'Charizard' : 'Venusaur');
    populateSelect(prefix + 'Move',    ['(No Move)', ...moveNames.filter(m => m !== '(No Move)')], '(No Move)');
    populateSelect(prefix + 'Nature',  natureNames, 'Hardy');
    populateSelect(prefix + 'Item',    ITEMS, '(None)');
    populateSelect(prefix + 'Ability', ABILITIES, '(None)');
    updateStats(prefix);

    // Live update triggers
    ['Pokemon','Nature','Item','Ability',
     'SP_hp','SP_at','SP_df','SP_sa','SP_sd','SP_sp',
     'Boost_at','Boost_df','Boost_sa','Boost_sd','Boost_sp',
     'Move','Spread','Crit','Burned','Statused'
    ].forEach(field => {
      const el = document.getElementById(prefix + field);
      if (!el) return;
      el.addEventListener('change', () => {
        if (field === 'Item') updateMegaForm(prefix);
        updateStats(prefix);
        runCalc();
      });
      el.addEventListener('input', () => { updateStats(prefix); runCalc(); });
    });
  });

  ['weather','terrain','defReflect','defLightScreen'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', runCalc);
  });

  runCalc();
}

// initCalc is called directly by the page after both scripts have loaded
