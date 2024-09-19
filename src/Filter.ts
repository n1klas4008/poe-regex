import {Modifier} from "./Modifier";
import {Blacklist} from "./Blacklist";
import {MapAssociation} from "./MapAssociation";

export abstract class Filter {

    protected readonly modifiers: Modifier[];
    protected readonly blacklist: Blacklist;
    protected readonly excludes: Blacklist;
    protected readonly vaal: boolean;
    protected readonly t17: boolean;

    constructor(t17: boolean, vaal: boolean, modifiers: Modifier[], excludes: Blacklist, blacklist: Blacklist) {
        this.modifiers = modifiers;
        this.blacklist = blacklist;
        this.excludes = excludes;
        this.vaal = vaal;
        this.t17 = t17;
    }

    public abstract create(association: MapAssociation, result: Set<string>, required: Modifier[], failsafe: number): void;

    protected abstract check(substring: string, modifiers: Modifier[], result: Set<string>): boolean;

    protected includes(modifier: Modifier, modifiers: Modifier[]): boolean {
        for (const mod of modifiers) {
            if (mod.equals(modifier)) {
                return true;
            }
        }
        return false;
    }

    protected substrings(mod: Modifier, blacklist: Blacklist): string[] {
        let set: string[] = [];
        let modifier = mod.getModifier().toLowerCase();
        let data = modifier.split("\\n");
        for (let i = 0; i < data.length; i++) {
            let information = data[i];
            for (let j = 0; j < information.length; j++) {
                for (let k = j + 1; k <= information.length; k++) {
                    let substring = information.substring(j, k);
                    if (substring.length == 1) continue;
                    let forbidden = blacklist.blacklisted(substring);
                    if (forbidden) continue;
                    set.push(substring);
                }
            }
        }

        // manually bypass blacklist with pte
        if (modifier === 'corrupted') set.push("pte");

        set.sort((a, b) => a.length - b.length);
        return set;
    }
}