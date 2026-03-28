# EV Spread Philosophy

EV spreads in VGC are not about maximizing stats — they're about hitting specific **benchmarks** that matter in real games.

## The Core Question

> What does this Pokemon need to survive, outspeed, or KO in the matchups I expect to face?

Bulk investment is wasted if the spread doesn't let you survive a specific attack. Speed investment is wasted if you don't hit or beat a relevant tier.

## Defensive Benchmarks

Work backwards: find the attack you're trying to survive, then calculate the EVs required. Common targets:

- Surviving Kyogre's max Water Spout in rain
- Surviving Zacian's Play Rough at +1
- Surviving Flutter Mane's Moonblast after Tera Fairy

Use [Damage Calc](https://calc.pokemonshowdown.com/) to find the exact number, then invest just enough.

!!! tip
    Once you hit a bulk benchmark, redirect remaining EVs to offense or speed. Don't over-invest.

## Speed Tiers

Speed ties are real and losing them loses games. Know the key tiers:

| Speed | Pokemon |
|---|---|
| 130 | Zacian-Crowned (base) |
| 110 | Flutter Mane (base) |
| 100 | Miraidon, Calyrex-Shadow (base) |
| 85 | Landorus-T (base) |
| 60 | Incineroar (base) |
| 30 | Calyrex-Ice (base) |

**Creeping** is common at key tiers — running 1-3 extra EVs to beat other Pokemon trying to hit the same benchmark.

## Offensive Benchmarks

Same logic: find the threshold that secures a KO on a common target.

Examples:

- Flutter Mane Moonblast KOing standard Incineroar after chip
- Kyogre Water Spout 2HKOing Zacian-Crowned in rain with Tera Water
- Calyrex-Ice Glacial Lance OHKOing 4 HP Landorus-T

## Practical Starting Point

For most Pokemon without a clear required benchmark:

```
252 Atk / 4 Def / 252 Spe   (physical attacker)
252 SpA / 4 SpD / 252 Spe   (special attacker)
252 HP / 252 Def / 4 SpD    (physical wall)
252 HP / 4 Def / 252 SpD    (special wall)
```

These are a starting point — refine once you know what matchups matter.

!!! warning "Nature reminder"
    Natures affect the final stat by ±10%. Always factor nature in when doing damage calc math. A +Atk nature is not interchangeable with a neutral nature spread that's 10 EVs higher.
