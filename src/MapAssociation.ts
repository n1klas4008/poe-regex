import {Modifier} from "./Modifier";



const MORE_MONSTER_LIFE = new Modifier("#% more Monster Life", false); // 94
const MORE_MONSTER_LIFE_CANNOT_BE_STUNNED = new Modifier("#% more Monster Life Monsters cannot be Stunned", false); // 95
const PHYSICAL_TO_CHAOS_DAMAGE = new Modifier("Monsters gain #% of their Physical Damage as Extra Chaos Damage", true); // 22
const PHYSICAL_TO_CHAOS_DAMAGE_WITHER = new Modifier("Monsters gain #% of their Physical Damage as Extra Chaos Damage Monsters Inflict Withered for 2 seconds on Hit", false); // 64
const REFLECT_ELEMENTAL_DAMAGE = new Modifier("Monsters reflect #% of Elemental Damage", false); // 53
const REFLECT_PHYSICAL_DAMAGE = new Modifier("Monsters reflect #% of Physical Damage", false); // 54
const REFLECT_ALL_DAMAGE = new Modifier("Monsters reflect #% of Physical Damage Monsters reflect #% of Elemental Damage", true); // 31
const FIRE_2_ADDITIONAL_PROJECTILES = new Modifier("Monsters fire 2 additional Projectiles", false); // 65
const INCREASED_AOE = new Modifier("Monsters have #% increased Area of Effect", false); // 68
const INCREASED_AOE_AND_PROJECTILES = new Modifier("Monsters have #% increased Area of Effect Monsters fire 2 additional Projectiles", true); // 29
const POISON_ON_HIT = new Modifier("Monsters Poison on Hit", false); // 70
const POISON_ON_HIT_WITH_DURATION = new Modifier("Monsters Poison on Hit All Damage from Monsters' Hits can Poison Monsters have #% increased Poison Duration", true); // 18
const CURSED_WITH_ELEMENTAL_WEAKNESS = new Modifier("Players are Cursed with Elemental Weakness", false); // 76
const CURSED_WITH_TEMPORAL_CHAINS = new Modifier("Players are Cursed with Temporal Chains", false); // 78
const CURSED_WITH_VULNERABILITY = new Modifier("Players are Cursed with Vulnerability", false); // 79
const CURSED_WITH_ALL = new Modifier("Players are Cursed with Vulnerability Players are Cursed with Temporal Chains Players are Cursed with Elemental Weakness", true); // 37
const PHYSICAL_DAMAGE_REDUCTION = new Modifier("+#% Monster Physical Damage Reduction", false); // 90
const RESISTANCES_REDUCTION = new Modifier("+#% Monster Chaos Resistance +#% Monster Elemental Resistances", false); // 96
const ALL_RESISTANCES_AND_REDUCTION = new Modifier("+#% Monster Physical Damage Reduction +#% Monster Chaos Resistance +#% Monster Elemental Resistances", true); // 5
const FRENZY_CHARGE_ON_HIT = new Modifier("Monsters gain a Frenzy Charge on Hit", false); // 106
const MAX_FRENZY_CHARGES_AND_CHARGE_ON_HIT = new Modifier("Monsters have +1 to Maximum Frenzy Charges Monsters gain a Frenzy Charge on Hit", true); // 25
const POWER_CHARGE_ON_HIT = new Modifier("Monsters gain a Power Charge on Hit", false); // 107
const MAX_POWER_CHARGES_AND_CHARGE_ON_HIT = new Modifier("Monsters have +1 to Maximum Power Charges Monsters gain a Power Charge on Hit", true); // 26
const INCREASED_RARE_MONSTERS = new Modifier("#% increased number of Rare Monsters", false); // 129
const RARE_MONSTERS_AND_MODIFIERS = new Modifier("#% increased number of Rare Monsters Rare Monsters each have 2 additional Modifiers", true); // 3

const mapping: Map<string, string[]> = new Map([
    [MORE_MONSTER_LIFE, [MORE_MONSTER_LIFE, MORE_MONSTER_LIFE_CANNOT_BE_STUNNED]],
    [MORE_MONSTER_LIFE_CANNOT_BE_STUNNED, [MORE_MONSTER_LIFE, MORE_MONSTER_LIFE_CANNOT_BE_STUNNED]],

    [PHYSICAL_TO_CHAOS_DAMAGE, [PHYSICAL_TO_CHAOS_DAMAGE, PHYSICAL_TO_CHAOS_DAMAGE_WITHER]],
    [PHYSICAL_TO_CHAOS_DAMAGE_WITHER, [PHYSICAL_TO_CHAOS_DAMAGE, PHYSICAL_TO_CHAOS_DAMAGE_WITHER]],

    [REFLECT_ELEMENTAL_DAMAGE, [REFLECT_ELEMENTAL_DAMAGE, REFLECT_ALL_DAMAGE]],
    [REFLECT_PHYSICAL_DAMAGE, [REFLECT_PHYSICAL_DAMAGE, REFLECT_ALL_DAMAGE]],
    [REFLECT_ALL_DAMAGE, [REFLECT_ELEMENTAL_DAMAGE, REFLECT_PHYSICAL_DAMAGE, REFLECT_ALL_DAMAGE]],

    [FIRE_2_ADDITIONAL_PROJECTILES, [FIRE_2_ADDITIONAL_PROJECTILES, INCREASED_AOE_AND_PROJECTILES]],
    [INCREASED_AOE, [INCREASED_AOE, INCREASED_AOE_AND_PROJECTILES]],
    [INCREASED_AOE_AND_PROJECTILES, [INCREASED_AOE, FIRE_2_ADDITIONAL_PROJECTILES, INCREASED_AOE_AND_PROJECTILES]],

    [POISON_ON_HIT, [POISON_ON_HIT, POISON_ON_HIT_WITH_DURATION]],
    [POISON_ON_HIT_WITH_DURATION, [POISON_ON_HIT, POISON_ON_HIT_WITH_DURATION]],

    [CURSED_WITH_ELEMENTAL_WEAKNESS, [CURSED_WITH_ELEMENTAL_WEAKNESS, CURSED_WITH_ALL]],
    [CURSED_WITH_VULNERABILITY, [CURSED_WITH_VULNERABILITY, CURSED_WITH_ALL]],
    [CURSED_WITH_TEMPORAL_CHAINS, [CURSED_WITH_TEMPORAL_CHAINS, CURSED_WITH_ALL]],
    [CURSED_WITH_ALL, [CURSED_WITH_ELEMENTAL_WEAKNESS, CURSED_WITH_VULNERABILITY, CURSED_WITH_TEMPORAL_CHAINS]],

    [PHYSICAL_DAMAGE_REDUCTION, [PHYSICAL_DAMAGE_REDUCTION, RESISTANCES_REDUCTION, ALL_RESISTANCES_AND_REDUCTION]],
    [RESISTANCES_REDUCTION, [PHYSICAL_DAMAGE_REDUCTION, RESISTANCES_REDUCTION, ALL_RESISTANCES_AND_REDUCTION]],
    [ALL_RESISTANCES_AND_REDUCTION, [PHYSICAL_DAMAGE_REDUCTION, RESISTANCES_REDUCTION, ALL_RESISTANCES_AND_REDUCTION]],

    [FRENZY_CHARGE_ON_HIT, [FRENZY_CHARGE_ON_HIT, MAX_FRENZY_CHARGES_AND_CHARGE_ON_HIT]],
    [MAX_FRENZY_CHARGES_AND_CHARGE_ON_HIT, [FRENZY_CHARGE_ON_HIT, MAX_FRENZY_CHARGES_AND_CHARGE_ON_HIT]],

    [POWER_CHARGE_ON_HIT, [POWER_CHARGE_ON_HIT, MAX_POWER_CHARGES_AND_CHARGE_ON_HIT]],
    [MAX_POWER_CHARGES_AND_CHARGE_ON_HIT, [POWER_CHARGE_ON_HIT, MAX_POWER_CHARGES_AND_CHARGE_ON_HIT]],

    [INCREASED_RARE_MONSTERS, [INCREASED_RARE_MONSTERS, RARE_MONSTERS_AND_MODIFIERS]],
    [RARE_MONSTERS_AND_MODIFIERS, [INCREASED_RARE_MONSTERS, RARE_MONSTERS_AND_MODIFIERS]],
]);

export function upgrade(required: Modifier[]): string[] {
    const set = new Set(required);
    const keys = Array.from(mapping.keys());

    for (const modifier of required) {
        let value = modifier.getModifier();
        const matchedKeys = keys.filter(key => value === key);
        for (const key of matchedKeys) {
            const additions = mapping.get(key) || [];
            for (const addition of additions) {
                set.add(addition);
            }
        }
    }

    return Array.from(set);
}