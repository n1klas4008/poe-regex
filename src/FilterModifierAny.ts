import {substrings} from "./Global";
import {Modifier} from "./Modifier";
import {MapAssociation} from "./MapAssociation";
import {Filter} from "./Filter";

export class FilterModifierAny extends Filter {

    protected check(substring: string, modifiers: Modifier[], result: Set<string>): boolean {
        for (let i = 0; i < this.modifiers.length; i++) {
            let modifier = this.modifiers[i];
            let info = modifier.getModifier().toLowerCase();
            // one of the other mods contains this string
            if (info.includes(substring)) {
                // is this perhaps a T17 mod that we can ignore
                if (modifier.isT17() && !this.t17) {
                    continue;
                }
                // if the matched mod is not part of what we need this substring becomes unusable
                // unless we already have a matching result for it

                let match = false;
                for (const regex of result) {
                    if (modifier.getModifier().toLowerCase().includes(regex)) {
                        match = true;
                    }
                }

                // ignore this mod since we have already matched it anyway with something else
                if (match) continue;

                if (!this.includes(modifier, modifiers)) {
                    return false;
                }
            }
        }
        return true;
    }

    create(association: MapAssociation, result: Set<string>, required: Modifier[], failsafe: number) {
        // stop if we don't require anything
        if (required.length === 0) return;

        // stop if we are endlessly looping
        if (failsafe > this.modifiers.length) {
            throw new Error("Infinite Recursion has been prevented")
        }

        // upgrade the required mods to ensure there is no overlap to other mods
        // e.g. the mod "% more Monster Life" will never find a unique match
        // due to the other mod "% more Monster Life Monsters cannot be Stunned"
        // to prevent this upgrade pools in those mods to the mods we require
        // otherwise it would be unable to find anything unique for the substring
        // and since we can use substrings for more than one mod this solves the issue
        required = association.upgrade(this.t17, required, result);

        // generate a list of substrings for all required mods
        let options: Set<string> = new Set();
        for (let i = 0; i < required.length; i++) {
            let modifier = required[i];
            let list = substrings(modifier, this.blacklist);
            list.forEach(item => options.add(item));
        }

        const map: Map<string, number> = new Map<string, number>();

        const sorted: string[] = Array.from(options)
            .filter(option => option.length >= 2)
            .sort((a, b) => a.length - b.length);

        for (const substring of sorted) {
            // stop if the substrings become to long to save time
            if (substring.length >= 20) break;
            // ensure substring is unique and not part of any other mod other than the ones we need
            if (!this.check(substring, required, result)) continue;
            // keep track how many of the mods we need, we can match with this one substring
            for (const modifier of required) {
                if (!modifier.getModifier().toLowerCase().includes(substring.toLowerCase())) continue;
                if (!map.has(substring)) {
                    map.set(substring, 0);
                }
                map.set(substring, (map.get(substring) || 0) + 1);
            }
        }

        // sort entries so that the ones matching the most with the least amount of characters is the first entry
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

        // pick the best result and remove all mods it matches from the required list
        const ideal = entries[0][0];
        required = required.filter(modifier => !modifier.getModifier().toLowerCase().includes(ideal));
        // add substring to the result set
        result.add(ideal);

        // repeat for remaining required elements
        this.create(association, result, required, failsafe + 1);
    }
}