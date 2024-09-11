import {Modifier} from "./Modifier";
import {Blacklist} from "./Blacklist";
import {MapAssociation} from "./MapAssociation";

export abstract class Filter {

    protected readonly modifiers: Modifier[];
    protected readonly blacklist: Blacklist;
    protected readonly excludes: Blacklist;
    protected readonly t17: boolean;

    constructor(t17: boolean, modifiers: Modifier[], excludes: Blacklist, blacklist: Blacklist) {
        this.modifiers = modifiers;
        this.blacklist = blacklist;
        this.excludes = excludes;
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
        let information = mod.getModifier().toLowerCase();
        for (let i = 0; i < information.length; i++) {
            for (let j = i + 1; j <= information.length; j++) {
                let substring = information.substring(i, j);
                if (substring.length == 1) continue;
                let forbidden = blacklist.blacklisted(substring);
                if (forbidden) continue;
                set.push(substring);
            }
        }
        set.sort((a, b) => a.length - b.length);
        return set;
    }
}