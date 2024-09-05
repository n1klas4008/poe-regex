export const blacklist: string[] = [
    "Travel to this Map by using it in a personal Map Device. Maps can only be used once.",
    "Modifiable only with Chaos Orbs, Vaal Orbs, Delirium Orbs and Chisels",
    "Players in Area are #% Delirious (enchant)",
    "Monster Pack Size:",
    "Item Class: Maps",
    "Monster Level:",
    "Item Quantity:",
    "Rarity: Unique",
    "Rarity: Normal",
    "Rarity: Magic",
    "Rarity: Rare",
    "Item Rarity:",
    "Item Level:",
    "Map Tier:"
];

function blacklisted(substring: string): boolean {
    return blacklist.some(entry => entry.toLowerCase().includes(substring));
}

export function substrings(mod: string): string[] {
    let set: string[] = [];
    let information = mod.toLowerCase();
    for (let i = 0; i < information.length; i++) {
        for (let j = i + 1; j <= information.length; j++) {
            let substring = information.substring(i, j);
            if (substring.length == 1) continue;
            let forbidden = blacklisted(substring);
            if (forbidden) continue;
            set.push(substring);
        }
    }
    set.sort((a, b) => a.length - b.length);
    return set;
}