# Damage Calculator

Pokemon Champions damage calculator. Level 50, 31 IVs, Stat Points (SP) replace EVs.
Each SP adds +1 to the final stat. Max 32 SP per stat, 66 SP total.

<link rel="stylesheet" href="../css/champions-calc.css">

---

<!-- Field Conditions -->
<div class="calc-field-panel">
  <div class="field-group">
    <label>Weather</label>
    <select id="weather">
      <option value="">None</option>
      <option value="Sun">Sun</option>
      <option value="Rain">Rain</option>
      <option value="Sand">Sand</option>
      <option value="Snow">Snow</option>
    </select>
  </div>
  <div class="field-group">
    <label>Terrain</label>
    <select id="terrain">
      <option value="">None</option>
      <option value="Electric">Electric</option>
      <option value="Grassy">Grassy</option>
      <option value="Psychic">Psychic</option>
      <option value="Misty">Misty</option>
    </select>
  </div>
  <div class="field-group">
    <label>Defender Screens</label>
    <div class="checkbox-row" style="margin-top:0.4rem">
      <label><input type="checkbox" id="defReflect"> Reflect</label>
      <label><input type="checkbox" id="defLightScreen"> Light Screen</label>
    </div>
  </div>
</div>

<!-- Attacker / Defender panels -->
<div class="calc-wrapper">

  <!-- Attacker -->
  <div class="calc-panel">
    <h3>⚔ Attacker</h3>

    <label>Pokemon</label>
    <select id="atkPokemon"></select>

    <label>Nature</label>
    <select id="atkNature"></select>

    <label>Ability</label>
    <select id="atkAbility"></select>

    <label>Item</label>
    <select id="atkItem"></select>

    <label>Stat Points (SP) — max 32 per stat, 66 total</label>
    <div class="sp-grid">
      <div class="sp-cell"><label>HP</label><input type="number" id="atkSP_hp" min="0" max="32" value="0"></div>
      <div class="sp-cell"><label>Atk</label><input type="number" id="atkSP_at" min="0" max="32" value="0"></div>
      <div class="sp-cell"><label>Def</label><input type="number" id="atkSP_df" min="0" max="32" value="0"></div>
      <div class="sp-cell"><label>SpA</label><input type="number" id="atkSP_sa" min="0" max="32" value="0"></div>
      <div class="sp-cell"><label>SpD</label><input type="number" id="atkSP_sd" min="0" max="32" value="0"></div>
      <div class="sp-cell"><label>Spe</label><input type="number" id="atkSP_sp" min="0" max="32" value="0"></div>
    </div>

    <label>Final Stats</label>
    <div class="stat-totals">
      <div class="stat-cell"><span class="stat-name">HP</span><span class="stat-val" id="atkTotal_hp">—</span></div>
      <div class="stat-cell"><span class="stat-name">Atk</span><span class="stat-val" id="atkTotal_at">—</span></div>
      <div class="stat-cell"><span class="stat-name">Def</span><span class="stat-val" id="atkTotal_df">—</span></div>
      <div class="stat-cell"><span class="stat-name">SpA</span><span class="stat-val" id="atkTotal_sa">—</span></div>
      <div class="stat-cell"><span class="stat-name">SpD</span><span class="stat-val" id="atkTotal_sd">—</span></div>
      <div class="stat-cell"><span class="stat-name">Spe</span><span class="stat-val" id="atkTotal_sp">—</span></div>
    </div>

    <label>Stat Boosts (in-battle)</label>
    <div class="boost-grid">
      <div class="boost-cell"><label>Atk</label><input type="number" id="atkBoost_at" min="-6" max="6" value="0"></div>
      <div class="boost-cell"><label>Def</label><input type="number" id="atkBoost_df" min="-6" max="6" value="0"></div>
      <div class="boost-cell"><label>SpA</label><input type="number" id="atkBoost_sa" min="-6" max="6" value="0"></div>
      <div class="boost-cell"><label>SpD</label><input type="number" id="atkBoost_sd" min="-6" max="6" value="0"></div>
      <div class="boost-cell"><label>Spe</label><input type="number" id="atkBoost_sp" min="-6" max="6" value="0"></div>
    </div>

    <label>Move</label>
    <select id="atkMove"></select>

    <div class="checkbox-row" style="margin-top:0.6rem">
      <label><input type="checkbox" id="atkSpread"> Spread (doubles 0.75x)</label>
      <label><input type="checkbox" id="atkCrit"> Critical Hit</label>
      <label><input type="checkbox" id="atkBurned"> Burned</label>
    </div>
  </div>

  <!-- Defender -->
  <div class="calc-panel">
    <h3>🛡 Defender</h3>

    <label>Pokemon</label>
    <select id="defPokemon"></select>

    <label>Nature</label>
    <select id="defNature"></select>

    <label>Ability</label>
    <select id="defAbility"></select>

    <label>Item</label>
    <select id="defItem"></select>

    <label>Stat Points (SP)</label>
    <div class="sp-grid">
      <div class="sp-cell"><label>HP</label><input type="number" id="defSP_hp" min="0" max="32" value="0"></div>
      <div class="sp-cell"><label>Atk</label><input type="number" id="defSP_at" min="0" max="32" value="0"></div>
      <div class="sp-cell"><label>Def</label><input type="number" id="defSP_df" min="0" max="32" value="0"></div>
      <div class="sp-cell"><label>SpA</label><input type="number" id="defSP_sa" min="0" max="32" value="0"></div>
      <div class="sp-cell"><label>SpD</label><input type="number" id="defSP_sd" min="0" max="32" value="0"></div>
      <div class="sp-cell"><label>Spe</label><input type="number" id="defSP_sp" min="0" max="32" value="0"></div>
    </div>

    <label>Final Stats</label>
    <div class="stat-totals">
      <div class="stat-cell"><span class="stat-name">HP</span><span class="stat-val" id="defTotal_hp">—</span></div>
      <div class="stat-cell"><span class="stat-name">Atk</span><span class="stat-val" id="defTotal_at">—</span></div>
      <div class="stat-cell"><span class="stat-name">Def</span><span class="stat-val" id="defTotal_df">—</span></div>
      <div class="stat-cell"><span class="stat-name">SpA</span><span class="stat-val" id="defTotal_sa">—</span></div>
      <div class="stat-cell"><span class="stat-name">SpD</span><span class="stat-val" id="defTotal_sd">—</span></div>
      <div class="stat-cell"><span class="stat-name">Spe</span><span class="stat-val" id="defTotal_sp">—</span></div>
    </div>

    <label>Stat Boosts (in-battle)</label>
    <div class="boost-grid">
      <div class="boost-cell"><label>Atk</label><input type="number" id="defBoost_at" min="-6" max="6" value="0"></div>
      <div class="boost-cell"><label>Def</label><input type="number" id="defBoost_df" min="-6" max="6" value="0"></div>
      <div class="boost-cell"><label>SpA</label><input type="number" id="defBoost_sa" min="-6" max="6" value="0"></div>
      <div class="boost-cell"><label>SpD</label><input type="number" id="defBoost_sd" min="-6" max="6" value="0"></div>
      <div class="boost-cell"><label>Spe</label><input type="number" id="defBoost_sp" min="-6" max="6" value="0"></div>
    </div>

    <label>Move (for reference only — damage is calculated from attacker's move)</label>
    <select id="defMove"></select>

    <div class="checkbox-row" style="margin-top:0.6rem">
      <label><input type="checkbox" id="defSpread"> Spread</label>
      <label><input type="checkbox" id="defCrit"> Critical Hit</label>
      <label><input type="checkbox" id="defBurned"> Burned</label>
      <label><input type="checkbox" id="defStatused"> Statused</label>
    </div>
  </div>

</div>

<!-- Output -->
<div id="calcOutput">
  <p style="color:#888">Loading calculator...</p>
</div>

<script src="../js/champions-data.js"></script>
<script src="../js/champions-calc.js"></script>
