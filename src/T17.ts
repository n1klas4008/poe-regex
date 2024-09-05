const MORE_MONSTER_LIFE = "#% more Monster Life";
const MORE_MONSTER_LIFE_CANNOT_BE_STUNNED = "#% more Monster Life Monsters cannot be Stunned";
const PHYSICAL_TO_CHAOS_DAMAGE = "Monsters gain #% of their Physical Damage as Extra Chaos Damage";
const PHYSICAL_TO_CHAOS_DAMAGE_WITHER = "Monsters gain #% of their Physical Damage as Extra Chaos Damage Monsters Inflict Withered for 2 seconds on Hit";
const REFLECT_ELEMENTAL_DAMAGE = "Monsters reflect #% of Elemental Damage";
const REFLECT_PHYSICAL_DAMAGE = "Monsters reflect #% of Physical Damage";
const REFLECT_ALL_DAMAGE = "Monsters reflect #% of Physical Damage Monsters reflect #% of Elemental Damage";
const FIRE_2_ADDITIONAL_PROJECTILES = "Monsters fire 2 additional Projectiles";
const INCREASED_AOE = "Monsters have #% increased Area of Effect";
const INCREASED_AOE_AND_PROJECTILES = "Monsters have #% increased Area of Effect Monsters fire 2 additional Projectiles";
const POISON_ON_HIT = "Monsters Poison on Hit";
const POISON_ON_HIT_WITH_DURATION = "Monsters Poison on Hit All Damage from Monsters' Hits can Poison Monsters have #% increased Poison Duration";
const CURSED_WITH_ELEMENTAL_WEAKNESS = "Players are Cursed with Elemental Weakness";
const CURSED_WITH_TEMPORAL_CHAINS = "Players are Cursed with Temporal Chains";
const CURSED_WITH_VULNERABILITY = "Players are Cursed with Vulnerability";
const CURSED_WITH_ALL = "Players are Cursed with Vulnerability Players are Cursed with Temporal Chains Players are Cursed with Elemental Weakness";
const PHYSICAL_DAMAGE_REDUCTION = "+#% Monster Physical Damage Reduction";
const RESISTANCES_REDUCTION = "+#% Monster Chaos Resistance +#% Monster Elemental Resistances";
const ALL_RESISTANCES_AND_REDUCTION = "+#% Monster Physical Damage Reduction +#% Monster Chaos Resistance +#% Monster Elemental Resistances";
const FRENZY_CHARGE_ON_HIT = "Monsters gain a Frenzy Charge on Hit";
const MAX_FRENZY_CHARGES_AND_CHARGE_ON_HIT = "Monsters have +1 to Maximum Frenzy Charges Monsters gain a Frenzy Charge on Hit";
const POWER_CHARGE_ON_HIT = "Monsters gain a Power Charge on Hit";
const MAX_POWER_CHARGES_AND_CHARGE_ON_HIT = "Monsters have +1 to Maximum Power Charges Monsters gain a Power Charge on Hit";
const INCREASED_RARE_MONSTERS = "#% increased number of Rare Monsters";
const RARE_MONSTERS_AND_MODIFIERS = "#% increased number of Rare Monsters Rare Monsters each have 2 additional Modifiers";

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

export function upgrade(required: string[]): string[] {
    const set = new Set(required);
    const keys = Array.from(mapping.keys());

    for (const value of required) {
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