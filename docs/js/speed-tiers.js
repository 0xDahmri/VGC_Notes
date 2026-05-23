(function () {
  if (!document.getElementById('st-container')) return;

  const SPR = 'https://cdn.pikalytics.com/images/championssprites/';

  const RAW = [
    {name:'Mega Aerodactyl',        spriteKey:'aerodactyl_mega',        base:150},
    {name:'Mega Alakazam',          spriteKey:'alakazam_mega',          base:150},
    {name:'Mega Beedrill',          spriteKey:'beedrill_mega',          base:145},
    {name:'Dragapult',              spriteKey:'dragapult',              base:142},
    {name:'Mega Greninja',          spriteKey:'greninja_mega',          base:142},
    {name:'Mega Lopunny',           spriteKey:'lopunny_mega',           base:135},
    {name:'Mega Manectric',         spriteKey:'manectric_mega',         base:135},
    {name:'Mega Delphox',           spriteKey:'delphox_mega',           base:134},
    {name:'Aerodactyl',             spriteKey:'aerodactyl',             base:130},
    {name:'Jolteon',                spriteKey:'jolteon',                base:130},
    {name:'Mega Gengar',            spriteKey:'gengar_mega',            base:130},
    {name:'Talonflame',             spriteKey:'talonflame',             base:126},
    {name:'Weavile',                spriteKey:'weavile',                base:125},
    {name:'Mega Meowstic',          spriteKey:'meowstic_mega',          base:124},
    {name:'Meowscarada',            spriteKey:'meowscarada',            base:123},
    {name:'Noivern',                spriteKey:'noivern',                base:123},
    {name:'Greninja',               spriteKey:'greninja',               base:122},
    {name:'Mega Pidgeot',           spriteKey:'pidgeot_mega',           base:121},
    {name:'Alakazam',               spriteKey:'alakazam',               base:120},
    {name:'Mega Froslass',          spriteKey:'froslass_mega',          base:120},
    {name:'Mega Starmie',           spriteKey:'starmie_mega',           base:120},
    {name:'Sneasler',               spriteKey:'sneasler',               base:120},
    {name:'Hawlucha',               spriteKey:'hawlucha',               base:118},
    {name:'Mega Hawlucha',          spriteKey:'hawlucha_mega',          base:118},
    {name:'Salazzle',               spriteKey:'salazzle',               base:117},
    {name:'Whimsicott',             spriteKey:'whimsicott',             base:116},
    {name:'Mega Absol',             spriteKey:'absol_mega',             base:115},
    {name:'Mega Houndoom',          spriteKey:'houndoom_mega',          base:115},
    {name:'Starmie',                spriteKey:'starmie',                base:115},
    {name:'Serperior',              spriteKey:'serperior',              base:113},
    {name:'Lycanroc',               spriteKey:'lycanroc',               base:112},
    {name:'Mega Lucario',           spriteKey:'lucario_mega',           base:112},
    {name:'Maushold',               spriteKey:'maushold',               base:111},
    {name:'Espeon',                 spriteKey:'espeon',                 base:110},
    {name:'Froslass',               spriteKey:'froslass',               base:110},
    {name:'Gengar',                 spriteKey:'gengar',                 base:110},
    {name:'Mega Gallade',           spriteKey:'gallade_mega',           base:110},
    {name:'Mega Skarmory',          spriteKey:'skarmory_mega',          base:110},
    {name:'Raichu',                 spriteKey:'raichu',                 base:110},
    {name:'Raichu-Alola',           spriteKey:'raichu_alola',           base:110},
    {name:'Tauros',                 spriteKey:'tauros',                 base:110},
    {name:'Zoroark-Hisui',          spriteKey:'zoroark_hisui',          base:110},
    {name:'Heliolisk',              spriteKey:'heliolisk',              base:109},
    {name:'Ninetales-Alola',        spriteKey:'ninetales_alola',        base:109},
    {name:'Infernape',              spriteKey:'infernape',              base:108},
    {name:'Liepard',                spriteKey:'liepard',                base:106},
    {name:'Espathra',               spriteKey:'espathra',               base:105},
    {name:'Lopunny',                spriteKey:'lopunny',                base:105},
    {name:'Manectric',              spriteKey:'manectric',              base:105},
    {name:'Mega Pinsir',            spriteKey:'pinsir_mega',            base:105},
    {name:'Mega Sharpedo',          spriteKey:'sharpedo_mega',          base:105},
    {name:'Zoroark',                spriteKey:'zoroark',                base:105},
    {name:'Delphox',                spriteKey:'delphox',                base:104},
    {name:'Meowstic',               spriteKey:'meowstic',               base:104},
    {name:'Emolga',                 spriteKey:'emolga',                 base:103},
    {name:'Mega Excadrill',         spriteKey:'excadrill_mega',         base:103},
    {name:'Floette-Eternal-Mega',   spriteKey:'floetteeternalmega',     base:102},
    {name:'Furfrou',                spriteKey:'furfrou',                base:102},
    {name:'Garchomp',               spriteKey:'garchomp',               base:102},
    {name:'Dedenne',                spriteKey:'dedenne',                base:101},
    {name:'Mega Glimmora',          spriteKey:'glimmora_mega',          base:101},
    {name:'Pidgeot',                spriteKey:'pidgeot',                base:101},
    {name:'Simipour',               spriteKey:'simipour',               base:101},
    {name:'Simisage',               spriteKey:'simisage',               base:101},
    {name:'Simisear',               spriteKey:'simisear',               base:101},
    {name:'Charizard',              spriteKey:'charizard',              base:100},
    {name:'Mega Charizard X',       spriteKey:'charizard_megax',        base:100},
    {name:'Mega Charizard Y',       spriteKey:'charizard_megay',        base:100},
    {name:'Mega Dragonite',         spriteKey:'dragonite_mega',         base:100},
    {name:'Mega Gardevoir',         spriteKey:'gardevoir_mega',         base:100},
    {name:'Mega Glalie',            spriteKey:'glalie_mega',            base:100},
    {name:'Mega Kangaskhan',        spriteKey:'kangaskhan_mega',        base:100},
    {name:'Mega Medicham',          spriteKey:'medicham_mega',          base:100},
    {name:'Ninetales',              spriteKey:'ninetales',              base:100},
    {name:'Palafin',                spriteKey:'palafin',                base:100},
    {name:'Tauros-Paldea',          spriteKey:'tauros_paldeacombat',    base:100},
    {name:'Typhlosion',             spriteKey:'typhlosion',             base:100},
    {name:'Volcarona',              spriteKey:'volcarona',              base:100},
    {name:'Hydreigon',              spriteKey:'hydreigon',              base:98},
    {name:'Morpeko',                spriteKey:'morpeko',                base:97},
    {name:'Mimikyu',                spriteKey:'mimikyu',                base:96},
    {name:'Arcanine',               spriteKey:'arcanine',               base:95},
    {name:'Gliscor',                spriteKey:'gliscor',                base:95},
    {name:'Houndoom',               spriteKey:'houndoom',               base:95},
    {name:'Leafeon',                spriteKey:'leafeon',                base:95},
    {name:'Sharpedo',               spriteKey:'sharpedo',               base:95},
    {name:'Typhlosion-Hisui',       spriteKey:'typhlosion_hisui',       base:95},
    {name:'Tinkaton',               spriteKey:'tinkaton',               base:94},
    {name:'Floette-Eternal',        spriteKey:'floette_eternal',        base:92},
    {name:'Krookodile',             spriteKey:'krookodile',             base:92},
    {name:'Mega Garchomp',          spriteKey:'garchomp_mega',          base:92},
    {name:'Rotom',                  spriteKey:'rotom',                  base:91},
    {name:'Arcanine-Hisui',         spriteKey:'arcanine_hisui',         base:90},
    {name:'Kangaskhan',             spriteKey:'kangaskhan',             base:90},
    {name:'Lucario',                spriteKey:'lucario',                base:90},
    {name:'Mega Chandelure',        spriteKey:'chandelure_mega',        base:90},
    {name:'Pikachu',                spriteKey:'pikachu',                base:90},
    {name:'Roserade',               spriteKey:'roserade',               base:90},
    {name:'Vivillon',               spriteKey:'vivillon',               base:89},
    {name:'Excadrill',              spriteKey:'excadrill',              base:88},
    {name:'Glimmora',               spriteKey:'glimmora',               base:86},
    {name:'Rotom-Fan',              spriteKey:'rotom_fan',              base:86},
    {name:'Rotom-Frost',            spriteKey:'rotom_frost',            base:86},
    {name:'Rotom-Heat',             spriteKey:'rotom_heat',             base:86},
    {name:'Rotom-Mow',              spriteKey:'rotom_mow',              base:86},
    {name:'Rotom-Wash',             spriteKey:'rotom_wash',             base:86},
    {name:'Archaludon',             spriteKey:'archaludon',             base:85},
    {name:'Ceruledge',              spriteKey:'ceruledge',              base:85},
    {name:'Heracross',              spriteKey:'heracross',              base:85},
    {name:'Kleavor',                spriteKey:'kleavor',                base:85},
    {name:'Kommo-o',                spriteKey:'kommo_o',                base:85},
    {name:'Pinsir',                 spriteKey:'pinsir',                 base:85},
    {name:'Quaquaval',              spriteKey:'quaquaval',              base:85},
    {name:'Samurott-Hisui',         spriteKey:'samurott_hisui',         base:85},
    {name:'Toxicroak',              spriteKey:'toxicroak',              base:85},
    {name:'Gourgeist',              spriteKey:'gourgeist',              base:84},
    {name:'Gyarados',               spriteKey:'gyarados',               base:81},
    {name:'Mega Gyarados',          spriteKey:'gyarados_mega',          base:81},
    {name:'Milotic',                spriteKey:'milotic',                base:81},
    {name:'Altaria',                spriteKey:'altaria',                base:80},
    {name:'Arbok',                  spriteKey:'arbok',                  base:80},
    {name:'Chandelure',             spriteKey:'chandelure',             base:80},
    {name:'Dragonite',              spriteKey:'dragonite',              base:80},
    {name:'Gallade',                spriteKey:'gallade',                base:80},
    {name:'Gardevoir',              spriteKey:'gardevoir',              base:80},
    {name:'Glalie',                 spriteKey:'glalie',                 base:80},
    {name:'Goodra',                 spriteKey:'goodra',                 base:80},
    {name:'Mamoswine',              spriteKey:'mamoswine',              base:80},
    {name:'Medicham',               spriteKey:'medicham',               base:80},
    {name:'Mega Altaria',           spriteKey:'altaria_mega',           base:80},
    {name:'Mega Meganium',          spriteKey:'meganium_mega',          base:80},
    {name:'Mega Venusaur',          spriteKey:'venusaur_mega',          base:80},
    {name:'Meganium',               spriteKey:'meganium',               base:80},
    {name:'Passimian',              spriteKey:'passimian',              base:80},
    {name:'Venusaur',               spriteKey:'venusaur',               base:80},
    {name:'Vanilluxe',              spriteKey:'vanilluxe',              base:79},
    {name:'Basculegion',            spriteKey:'basculegion',            base:78},
    {name:'Basculegion-F',          spriteKey:'basculegionf',           base:78},
    {name:'Blastoise',              spriteKey:'blastoise',              base:78},
    {name:'Diggersby',              spriteKey:'diggersby',              base:78},
    {name:'Feraligatr',             spriteKey:'feraligatr',             base:78},
    {name:'Mega Blastoise',         spriteKey:'blastoise_mega',         base:78},
    {name:'Mega Feraligatr',        spriteKey:'feraligatr_mega',        base:78},
    {name:'Watchog',                spriteKey:'watchog',                base:77},
    {name:'Absol',                  spriteKey:'absol',                  base:75},
    {name:'Armarouge',              spriteKey:'armarouge',              base:75},
    {name:'Beedrill',               spriteKey:'beedrill',               base:75},
    {name:'Florges',                spriteKey:'florges',                base:75},
    {name:'Garbodor',               spriteKey:'garbodor',               base:75},
    {name:'Klefki',                 spriteKey:'klefki',                 base:75},
    {name:'Mega Banette',           spriteKey:'banette_mega',           base:75},
    {name:'Mega Emboar',            spriteKey:'emboar_mega',            base:75},
    {name:'Mega Heracross',         spriteKey:'heracross_mega',         base:75},
    {name:'Mega Scizor',            spriteKey:'scizor_mega',            base:75},
    {name:'Mega Scovillain',        spriteKey:'scovillain_mega',        base:75},
    {name:'Scovillain',             spriteKey:'scovillain',             base:75},
    {name:'Slurpuff',               spriteKey:'slurpuff',               base:72},
    {name:'Tsareena',               spriteKey:'tsareena',               base:72},
    {name:'Mega Tyranitar',         spriteKey:'tyranitar_mega',         base:71},
    {name:'Sandaconda',             spriteKey:'sandaconda',             base:71},
    {name:'Tyrantrum',              spriteKey:'tyrantrum',              base:71},
    {name:'Castform',               spriteKey:'castform',               base:70},
    {name:'Decidueye',              spriteKey:'decidueye',              base:70},
    {name:'Flapple',                spriteKey:'flapple',                base:70},
    {name:'Luxray',                 spriteKey:'luxray',                 base:70},
    {name:'Mega Clefable',          spriteKey:'clefable_mega',          base:70},
    {name:'Mega Victreebel',        spriteKey:'victreebel_mega',        base:70},
    {name:'Mr. Rime',               spriteKey:'mrrime',                 base:70},
    {name:'Politoed',               spriteKey:'politoed',               base:70},
    {name:'Polteageist',            spriteKey:'polteageist',            base:70},
    {name:'Samurott',               spriteKey:'samurott',               base:70},
    {name:'Sinistcha',              spriteKey:'sinistcha',              base:70},
    {name:'Skarmory',               spriteKey:'skarmory',               base:70},
    {name:'Victreebel',             spriteKey:'victreebel',             base:70},
    {name:'Corviknight',            spriteKey:'corviknight',            base:67},
    {name:'Skeledirge',             spriteKey:'skeledirge',             base:66},
    {name:'Banette',                spriteKey:'banette',                base:65},
    {name:'Chimecho',               spriteKey:'chimecho',               base:65},
    {name:'Emboar',                 spriteKey:'emboar',                 base:65},
    {name:'Flareon',                spriteKey:'flareon',                base:65},
    {name:'Glaceon',                spriteKey:'glaceon',                base:65},
    {name:'Mega Chimecho',          spriteKey:'chimecho_mega',          base:65},
    {name:'Orthworm',               spriteKey:'orthworm',               base:65},
    {name:'Pelipper',               spriteKey:'pelipper',               base:65},
    {name:'Scizor',                 spriteKey:'scizor',                 base:65},
    {name:'Umbreon',                spriteKey:'umbreon',                base:65},
    {name:'Vaporeon',               spriteKey:'vaporeon',               base:65},
    {name:'Wyrdeer',                spriteKey:'wyrdeer',                base:65},
    {name:'Alcremie',               spriteKey:'alcremie',               base:64},
    {name:'Chesnaught',             spriteKey:'chesnaught',             base:64},
    {name:'Tyranitar',              spriteKey:'tyranitar',              base:61},
    {name:'Abomasnow',              spriteKey:'abomasnow',              base:60},
    {name:'Aegislash',              spriteKey:'aegislash',              base:60},
    {name:'Clefable',               spriteKey:'clefable',               base:60},
    {name:'Decidueye-Hisui',        spriteKey:'decidueye_hisui',        base:60},
    {name:'Empoleon',               spriteKey:'empoleon',               base:60},
    {name:'Farigiraf',              spriteKey:'farigiraf',              base:60},
    {name:'Goodra-Hisui',           spriteKey:'goodra_hisui',           base:60},
    {name:'Incineroar',             spriteKey:'incineroar',             base:60},
    {name:'Oranguru',               spriteKey:'oranguru',               base:60},
    {name:'Primarina',              spriteKey:'primarina',              base:60},
    {name:'Sylveon',                spriteKey:'sylveon',                base:60},
    {name:'Toucannon',              spriteKey:'toucannon',              base:60},
    {name:'Clawitzer',              spriteKey:'clawitzer',              base:59},
    {name:'Aurorus',                spriteKey:'aurorus',                base:58},
    {name:'Pangoro',                spriteKey:'pangoro',                base:58},
    {name:'Rampardos',              spriteKey:'rampardos',              base:58},
    {name:'Torterra',               spriteKey:'torterra',               base:56},
    {name:'Trevenant',              spriteKey:'trevenant',              base:56},
    {name:'Ampharos',               spriteKey:'ampharos',               base:55},
    {name:'Golurk',                 spriteKey:'golurk',                 base:55},
    {name:'Machamp',                spriteKey:'machamp',                base:55},
    {name:'Mega Golurk',            spriteKey:'golurk_mega',            base:55},
    {name:'Aggron',                 spriteKey:'aggron',                 base:50},
    {name:'Audino',                 spriteKey:'audino',                 base:50},
    {name:'Azumarill',              spriteKey:'azumarill',              base:50},
    {name:'Beartic',                spriteKey:'beartic',                base:50},
    {name:'Kingambit',              spriteKey:'kingambit',              base:50},
    {name:'Mega Aggron',            spriteKey:'aggron_mega',            base:50},
    {name:'Sableye',                spriteKey:'sableye',                base:50},
    {name:'Ditto',                  spriteKey:'ditto',                  base:48},
    {name:'Hippowdon',              spriteKey:'hippowdon',              base:47},
    {name:'Bellibolt',              spriteKey:'bellibolt',              base:45},
    {name:'Conkeldurr',             spriteKey:'conkeldurr',             base:45},
    {name:'Mega Ampharos',          spriteKey:'ampharos_mega',          base:45},
    {name:'Hydrapple',              spriteKey:'hydrapple',              base:44},
    {name:'Mega Chesnaught',        spriteKey:'chesnaught_mega',        base:44},
    {name:'Crabominable',           spriteKey:'crabominable',           base:43},
    {name:'Araquanid',              spriteKey:'araquanid',              base:42},
    {name:'Ariados',                spriteKey:'ariados',                base:40},
    {name:'Camerupt',               spriteKey:'camerupt',               base:40},
    {name:'Forretress',             spriteKey:'forretress',             base:40},
    {name:'Rhyperior',              spriteKey:'rhyperior',              base:40},
    {name:'Avalugg-Hisui',          spriteKey:'avalugg_hisui',          base:38},
    {name:'Drampa',                 spriteKey:'drampa',                 base:36},
    {name:'Mega Drampa',            spriteKey:'drampa_mega',            base:36},
    {name:'Garganacl',              spriteKey:'garganacl',              base:35},
    {name:'Mudsdale',               spriteKey:'mudsdale',               base:35},
    {name:'Spiritomb',              spriteKey:'spiritomb',              base:35},
    {name:'Toxapex',                spriteKey:'toxapex',                base:35},
    {name:'Mega Crabominable',      spriteKey:'crabominable_mega',      base:33},
    {name:'Stunfisk',               spriteKey:'stunfisk',               base:32},
    {name:'Stunfisk-Galar',         spriteKey:'stunfisk_galar',         base:32},
    {name:'Appletun',               spriteKey:'appletun',               base:30},
    {name:'Bastiodon',              spriteKey:'bastiodon',              base:30},
    {name:'Cofagrigus',             spriteKey:'cofagrigus',             base:30},
    {name:'Mega Abomasnow',         spriteKey:'abomasnow_mega',         base:30},
    {name:'Mega Slowbro',           spriteKey:'slowbro_mega',           base:30},
    {name:'Mega Steelix',           spriteKey:'steelix_mega',           base:30},
    {name:'Reuniclus',              spriteKey:'reuniclus',              base:30},
    {name:'Runerigus',              spriteKey:'runerigus',              base:30},
    {name:'Slowbro',                spriteKey:'slowbro',                base:30},
    {name:'Slowbro-Galar',          spriteKey:'slowbro_galar',          base:30},
    {name:'Slowking',               spriteKey:'slowking',               base:30},
    {name:'Slowking-Galar',         spriteKey:'slowking_galar',         base:30},
    {name:'Snorlax',                spriteKey:'snorlax',                base:30},
    {name:'Steelix',                spriteKey:'steelix',                base:30},
    {name:'Aromatisse',             spriteKey:'aromatisse',             base:29},
    {name:'Hatterene',              spriteKey:'hatterene',              base:29},
    {name:'Avalugg',                spriteKey:'avalugg',                base:28},
    {name:'Mega Camerupt',          spriteKey:'camerupt_mega',          base:20},
    {name:'Mega Sableye',           spriteKey:'sableye_mega',           base:20},
    {name:'Torkoal',                spriteKey:'torkoal',                base:20},
  ];

  /* ── Speed calculation (Champions: Level 50, 31 IVs, SP adds directly to final stat) ── */
  function calc(base) {
    const s   = Math.floor((2 * base + 31) * 0.5 + 5);
    const n32 = s + 32;
    const max = Math.floor(n32 * 1.1);
    return {
      neutral0:       s,
      neutral32:      n32,
      minus0:         Math.floor(s * 0.9),
      maxSpeed:       max,
      scarfMax:       Math.floor(max * 1.5),
      scarfNeutral32: Math.floor(n32 * 1.5),
    };
  }

  const ROWS = RAW.map(r => ({ ...r, ...calc(r.base) }));

  const COLS = [
    { key: 'base',           label: 'BASE SPE',            cls: '' },
    { key: 'maxSpeed',       label: 'MAX SPEED',           cls: 'st-max' },
    { key: 'neutral32',      label: 'NEUTRAL +32 SP',      cls: '' },
    { key: 'neutral0',       label: 'NEUTRAL 0 SP',        cls: '' },
    { key: 'minus0',         label: '−SPE 0 SP',      cls: '' },
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
        <div><div class="st-pname">${r.name}</div><div class="st-bspe">Base ${r.base}</div></div>
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
