import {Modifier} from "./Modifier";

export class MapAssociation {

    // array structure, index in map.mods.config, index of shared mods
    private readonly array: any[] = [
        [91, [92]],
        [92, [91]],
        [19, [61]],
        [61, [19]],
        [50, [51, 28]],
        [51, [50, 28]],
        [28, [50, 51]],
        [62, [65, 26]],
        [65, [62, 26]],
        [26, [62, 65]],
        [67, [15]],
        [15, [67]],
        [73, [75, 76, 34]],
        [75, [73, 76, 34]],
        [76, [73, 75, 34]],
        [34, [73, 75, 76]],
        [87, [93, 2]],
        [93, [87, 2]],
        [2, [87, 93]],
        [103, [22]],
        [22, [103]],
        [104, [23]],
        [23, [104]],
        [126, [1]],
        [1, [126]],
    ];

    private mapping: Map<Modifier, Modifier[]> = new Map<Modifier, Modifier[]>();

    constructor(modifiers: Modifier[]) {
        let builder = new Map<number, Modifier>();
        // create a local set with all indices and modifiers
        for (let i = 0; i < this.array.length; i++) {
            let array = this.array[i];

            let target = array[0];
            let mod = modifiers[target];
            let modifier = new Modifier(mod.getModifier(), mod.isT17());

            builder.set(target, modifier);
        }
        // iterate again to properly build mapping
        for (let i = 0; i < this.array.length; i++) {
            let array = this.array[i];

            let target = array[0];
            let indices = array[1];

            let modifier = builder.get(target);

            let arr: Modifier[] = [];
            for (let j = 0; j < indices.length; j++) {
                let index = indices[j];
                let mod = builder.get(index);
                if (mod) {
                    arr.push(mod);
                }
            }

            if (modifier && arr) {
                this.mapping.set(modifier, arr);
            }
        }
    }

    // fill array with any mod that is associated to one of the present and required mods
    public upgrade(t17: boolean, required: Modifier[]): Modifier[] {
        const set = new Set(required);
        const keys = Array.from(this.mapping.keys());

        for (const modifier of required) {
            for (const key of keys) {
                if (modifier.equals(key)) {
                    let associations = this.mapping.get(key) || [];
                    for (const association of associations) {
                        if (!association.isT17() || t17) {
                            set.add(association);
                        }
                    }
                }
            }
        }

        return Array.from(set);
    }
}