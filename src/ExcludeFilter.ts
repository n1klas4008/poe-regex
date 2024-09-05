import {substrings} from "./Global";
import {Modifier} from "./Modifier";
import {upgrade} from "./T17";
import {Blacklist} from "./Blacklist";

export class ExcludeFilter {

    private readonly modifiers: Modifier[];
    private readonly blacklist: Blacklist;

    constructor(modifiers: Modifier[], blacklist: Blacklist) {
        this.modifiers = modifiers;
        this.blacklist = blacklist;
    }

    private match(substring: string, modifiers: string[]): boolean {
        for (let i = 0; i < this.modifiers.length; i++) {
            let modifier = this.modifiers[i];
            if (modifier.getModifier().toLowerCase().includes(substring) && !modifiers.includes(modifier.getModifier())) {
                return false;
            }
        }
        return true;
    }

    public create(result: Set<string>, required: string[]) {
        let options: Set<string> = new Set();

        for (let i = 0; i < required.length; i++) {
            let modifier = required[i];
            let list = substrings(modifier, this.blacklist);
            list.forEach(item => options.add(item));
        }

        const map: Map<string, number> = new Map<string, number>();
        let count = 2;
        let any = false;
        while (required.length > 0) {
            const size = count;
            const list: string[] = Array.from(options).filter(option => option.length === size);

            if (list.length === 0 && any) break;

            for (const substring of list) {
                if (substring.length >= 20) break;
                if (!this.match(substring, required)) continue;
                for (const modifier of required) {
                    if (!modifier.toLowerCase().includes(substring.toLowerCase())) continue;
                    if (!map.has(substring)) {
                        map.set(substring, 0);
                    }
                    map.set(substring, (map.get(substring) || 0) + 1);
                    if (!any) any = true;
                }
            }

            count += 1;
        }

        let entries: [string, number][] = Array.from(map.entries());
        entries.sort((e1, e2) => {
            const comparison = e2[1] - e1[1];
            if (comparison !== 0) {
                return comparison;
            }

            const length1 = e1[0].length + (e1[0].includes("#") ? 2 : 0);
            const length2 = e2[0].length + (e2[0].includes("#") ? 2 : 0);

            return length1 - length2;
        });

        const ideal = entries[0][0];
        required = required.filter(modifier => !modifier.toLowerCase().includes(ideal));
        result.add(ideal);
        if (required.length === 0) return;
        upgrade(required);
        this.create(result, required);
    }
}