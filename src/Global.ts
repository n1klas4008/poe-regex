import {Blacklist} from "./Blacklist";
import {Modifier} from "./Modifier";

// no need to check for upper/lowercase, blacklist defaults lowercase so does this function
export function substrings(mod: Modifier, blacklist: Blacklist): string[] {
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