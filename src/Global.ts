import {Blacklist} from "./Blacklist";

export function substrings(mod: string, blacklist: Blacklist): string[] {
    let set: string[] = [];
    let information = mod.toLowerCase();
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