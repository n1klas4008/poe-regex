import {Modifier} from "./Modifier";

export class MapAssociation {

    // array structure, index in map.mods.config, index of shared mods
    private readonly array: any[] = [
        [90, [91]],
        [91, [90]],
        [18, [60]],
        [60, [18]],
        [40, [52]],
        [52, [40]],
        [49, [50, 27]],
        [50, [49, 27]],
        [27, [49, 50]],
        [61, [64, 25]],
        [64, [61, 25]],
        [25, [61, 64]],
        [66, [14]],
        [14, [66]],
        [72, [74, 75, 33]],
        [74, [72, 75, 33]],
        [75, [72, 74, 33]],
        [33, [72, 74, 75]],
        [86, [92, 2]],
        [92, [86, 2]],
        [2, [86, 92]],
        [102, [21]],
        [21, [102]],
        [103, [22]],
        [22, [103]],
        [125, [1]],
        [1, [125]],
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
    // only add the t17 mods into the pool from the mapping since we don't want to create
    // a regex that matches more than what we need, would be extra characters
    // if t17 mode is enabled then we need to add everything, for this case we also need
    // to know the current result set to avoid endlessly adding things we have already matched
    public upgrade(t17: boolean, required: Modifier[], result: Set<string>): Modifier[] {
        const set = new Set(required);
        const keys = Array.from(this.mapping.keys());

        for (const modifier of required) {
            for (const key of keys) {
                if (modifier.equals(key)) {
                    let associations = this.mapping.get(key) || [];
                    for (const association of associations) {
                        if (t17 || association.isT17() || association.getModifier().includes("#% more Monster Life")) {
                            // check if we have this matched already, assume no by default
                            let matched = false;
                            for (const expression of result) {
                                if (association.getModifier().toLowerCase().includes(expression)) {
                                    matched = true;
                                    break;
                                }
                            }
                            // only add if it's not already matched by a result
                            if (!matched) {
                                console.log("+ " + key.getModifier())
                                console.log("> " + association.getModifier())
                                console.log("---")
                                set.add(association);
                            }
                        }
                    }
                }
            }
        }

        return Array.from(set);
    }
}