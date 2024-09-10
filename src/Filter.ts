import {Modifier} from "./Modifier";
import {Blacklist} from "./Blacklist";
import {MapAssociation} from "./MapAssociation";

export abstract class Filter {

    protected readonly modifiers: Modifier[];
    protected readonly blacklist: Blacklist;
    protected readonly t17: boolean;

    constructor(t17: boolean, modifiers: Modifier[], blacklist: Blacklist) {
        this.modifiers = modifiers;
        this.blacklist = blacklist;
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
}