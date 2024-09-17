import {Modifier} from "./Modifier";
import {ModifierType} from "./ModifierType";
import {FilterModifierAny} from "./FilterModifierAny";
import {FilterModifierAll} from "./FilterModifierAll";
import {Blacklist} from "./Blacklist";
import {associations} from "./Global";
import {MapAssociation} from "./MapAssociation";
import {generateRegularExpression} from "./MinNumRegex";

const call = performance.now();

let selection: Map<ModifierType, Modifier[]> = new Map<ModifierType, Modifier[]>();
let cache: Map<ModifierType, string> = new Map<ModifierType, string>();
let blacklist = new Blacklist();
let modifiers: Modifier[] = [];
let exclusive: Modifier[] = [];
let inclusive: Modifier[] = [];


document.addEventListener('DOMContentLoaded', () => {
    const entries = [
        "./league/settler/map.name.config",
        "./league/settler/map.affix.config",
        "./league/settler/map.general.config",
        "./league/settler/map.blacklist.config"
    ];
    read(entries)
        .then(responses => initialize(responses))
        .then(list => {
            blacklist = list;
            load().then(() => setup()).then(() => tracker());
        })
        .catch(error => exceptional(error));
});

function modal(id: string, status: boolean) {
    const overlay = document.getElementById('overlay')!;
    const modal = document.getElementById(id)!;
    const body = document.body!;

    overlay.classList.toggle('hidden', !status);
    modal.classList.toggle('hidden', !status);
    body.classList.toggle('no-scroll', status);
}

function tracker() {
    const time = performance.now() - call;
    console.log(`build-time ${time}ms`)
}

async function load() {
    read(["./league/settler/map.mods.config"])
        .then(responses => responses[0])
        .then(response => build(response))
}


async function read(urls: string[]): Promise<string[]> {
    const requests = urls.map(url => fetch(url).then(response => {
        if (!response.ok) {
            throw new Error(`Failed to load ${url}: ${response.status} ${response.statusText}`);
        }
        return response.text();
    }));
    return Promise.all(requests);
}

function initialize(array: string[]): Blacklist {
    const blacklist = new Blacklist();
    for (let i = 0; i < array.length; i++) {
        let content = array[i];
        let lines = content.split("\n");
        blacklist.populate(lines);
    }
    return blacklist;
}

function build(config: string) {
    let line = config.split("\n");
    let targets = document.querySelectorAll(".mod-container")
    for (let i = 0; i < line.length; i++) {
        let modifier = line[i].trim();
        let index = modifier.indexOf("(T17)");
        if (index != -1) modifier = modifier.substring(6);
        const mod = new Modifier(modifier, index != -1);
        modifiers.push(mod);
        for (let j = 0; j < targets.length; j++) {
            let type = j == 0 ? ModifierType.EXCLUSIVE : ModifierType.INCLUSIVE;
            targets[j].appendChild(createSelectableContainer(i, type, mod));
        }
    }
}

function createSelectableContainer(index: number, type: ModifierType, modifier: Modifier): HTMLDivElement {
    const div = document.createElement("div");

    div.classList.add("selectable");
    if (modifier.isT17()) {
        div.classList.add("t17");
        div.style.display = "none";
    }
    div.dataset.mod = index.toString();
    div.dataset.t17 = modifier.isT17().toString();
    div.textContent = modifier.getModifier();
    div.addEventListener('click', (event) => {
        let element = (event.target as HTMLElement);
        if (element.classList.contains('disabled-item')) return;
        element.classList.toggle('selected-item');
        let active = element.classList.contains('selected-item');
        let array = type == ModifierType.EXCLUSIVE ? exclusive : inclusive;
        disableCounterpartContainer(index, active, type, modifier);
        handleModifierSelection(active, array, modifier);
        toggleChildContainer(index, active);
        construct();
    });

    return div;
}

function handleModifierSelection(active: boolean, array: Modifier[], modifier: Modifier) {
    if (active) {
        array.push(modifier);
    } else {
        const index = array.indexOf(modifier);
        if (index > -1) {
            array.splice(index, 1);
        }
    }
}

function toggleChildContainer(index: number, active: boolean) {
    const types = Object.values(ModifierType).filter(value => typeof value === 'number');
    for (const mapping of associations) {
        if (mapping[0] === index) {
            let children = mapping[1];
            for (const child of children) {
                for (const type of types) {
                    let target = ModifierType[type].toLowerCase();
                    let element = document.querySelector(`#${target} .selectable[data-mod="${child}"]`)!;
                    if (active) {
                        element.classList.add('disabled-item');
                    } else {
                        element.classList.remove('disabled-item');
                    }
                }
            }
            break;
        }
    }
}

function disableCounterpartContainer(index: number, active: boolean, type: ModifierType, modifier: Modifier) {
    let target = type == ModifierType.EXCLUSIVE ? 'inclusive' : 'exclusive';
    let element = document.querySelector(`#${target} .selectable[data-mod="${index}"]`)!;
    if (active) {
        element.classList.add('disabled-item');
        // remove mod from opposite selection if somehow already present
        let array = type == ModifierType.EXCLUSIVE ? inclusive : exclusive;
        handleModifierSelection(!active, array, modifier);
    } else {
        element.classList.remove('disabled-item');
    }
}

function wipe() {
    document.querySelectorAll('.selected-item, .disabled-item').forEach((element) => {
        element.classList.remove('selected-item', 'disabled-item');
    });
}

function exceptional(error: any) {
    console.error(error);
}

function filter(element: HTMLElement) {
    const query = (element as HTMLInputElement).value;
    const container = (element as HTMLElement).closest('.container-search')?.nextElementSibling as HTMLElement;
    const t17 = document.getElementById('t17') as HTMLInputElement;
    if (container && container.classList.contains('mod-container')) {
        let children = container.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i] as HTMLElement;
            if (child.textContent && child.textContent.toLowerCase().includes(query.toLowerCase())) {
                if ((t17.checked && child.dataset.t17 === 'true') || child.dataset.t17 === 'false') {
                    child.style.display = '';
                }
            } else {
                child.style.display = 'none';
            }
        }
    }
}

// not sure if not having a button and doing this is a better solution, leaving this in here for now
function debounce<T extends (...args: Parameters<T>) => void>(this: ThisParameterType<T>, f: T, delay = 300) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            f.apply(this, args);
        }, delay);
    };
}

function construct() {
    document.getElementById('regex')!.innerText = "crunching numbers...";
    document.getElementById('hint')!.innerText = "";
    setTimeout(() => {
        let any = (document.getElementById('any')! as HTMLInputElement).checked;

        let exclusive = buildModifierExpression(true, ModifierType.EXCLUSIVE);
        let inclusive = buildModifierExpression(any, ModifierType.INCLUSIVE);
        let utility = buildUtilityExpression();
        let map = buildMapExpression();

        let base = exclusive + (exclusive.length > 0 ? ' ' : '') + inclusive + (inclusive.length > 0 ? ' ' : '')
        let regex = (base + utility + map).trim();

        document.getElementById('regex')!.innerText = regex;

        let element = document.getElementById('hint')!;

        element.innerText = regex.length > 0 ? `length: ${regex.length} / 50` : '';
        element.style.color = (regex.length > 50) ? '#ff4d4d' : '#e0e0e0';
    }, 100);
    //if (!compare(previous, exclusive) || (cache.length == 0 && exclusive.length > 0)) modal(true);
}

function compare(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

function buildSuitableExcludeList(type: ModifierType): Blacklist {
    let clone = new Blacklist();
    if (type == ModifierType.EXCLUSIVE) {
        clone.populate([...inclusive].map(o => o.getModifier()))
    }
    if (type == ModifierType.INCLUSIVE) {
        clone.populate([...exclusive].map(o => o.getModifier()))
    }
    return clone;
}

function buildModifierExpression(any: boolean, type: ModifierType): string {
    const checkbox = document.getElementById('t17') as HTMLInputElement;
    let excludes = buildSuitableExcludeList(type);
    let filter = any ?
        new FilterModifierAny(checkbox.checked, modifiers, excludes, blacklist) :
        new FilterModifierAll(checkbox.checked, modifiers, excludes, blacklist);
    let target = type == ModifierType.EXCLUSIVE ? exclusive : inclusive;
    let previous = selection.get(type) || [];

    let regex = "";
    if (!compare(previous, target)) {
        let result: Set<string> = new Set<string>();
        let association = new MapAssociation(modifiers);
        try {
            filter.create(association, result, target, 0);
            selection.set(type, [...target]);

            if (any) {
                regex = Array.from(result).join("|").replace(/#/g, "\\d+");
                regex = regex.length > 0 ? `"${type == ModifierType.EXCLUSIVE ? '!' : ''}${regex}"` : "";
            } else {
                let builder = "";
                for (const mod of result) {
                    let value = mod.replace(/#/g, "\\d+");
                    builder += mod.includes(" ") ? `"${value}" ` : `${value} `;
                }
                regex = builder;
            }
            cache.set(type, regex);
        } catch (error) {
            console.error(error);
        }
    } else {
        regex = cache.get(type) || "";
    }
    return regex;
}

function buildSpecificUtilityExpression(main: string, secondary: string, unique: string) {
    let quantity = (document.getElementById(main) as HTMLInputElement).value;
    let expression = generateRegularExpression(quantity, (document.getElementById(secondary) as HTMLInputElement).checked, true);
    if (expression === null) return null;
    if (expression === '') {
        return `"${unique}" `;
    } else {
        return `"${unique}.*${expression}%" `;
    }
}

function buildUtilityExpression(): string {
    let e1 = buildSpecificUtilityExpression('quantity', 'optimize-quantity', 'm q');
    let e2 = buildSpecificUtilityExpression('pack-size', 'optimize-pack', 'iz');
    let e3 = buildSpecificUtilityExpression('scarabs', 'optimize-scarab', 'abs');
    let e4 = buildSpecificUtilityExpression('maps', 'optimize-maps', 'ps:');
    let e5 = buildSpecificUtilityExpression('currency', 'optimize-currency', 'urr');

    let expression = "";

    if (e1) expression += e1;
    if (e2) expression += e2;
    if (e3) expression += e3;
    if (e4) expression += e4;
    if (e5) expression += e5;

    return expression;
}

function cleanup(array: Modifier[]): Modifier[] {
    return array.filter(mod => !mod.getModifier().includes("Corrupted"));
}

function buildMapExpression(): string {
    let type = (document.getElementById('maps-include') as HTMLInputElement).checked ?
        ModifierType.INCLUSIVE :
        ModifierType.EXCLUSIVE;

    let maps: string[] = [];
    if ((document.getElementById('map-normal') as HTMLInputElement)!.checked) maps.push("n");
    if ((document.getElementById('map-rare') as HTMLInputElement)!.checked) maps.push("r");
    if ((document.getElementById('map-magic') as HTMLInputElement)!.checked) maps.push("m");

    let inclusive = type == ModifierType.INCLUSIVE && maps.length != 3 && maps.length != 0;
    let exclusive = type == ModifierType.EXCLUSIVE && maps.length != 0;

    return (inclusive || exclusive) ?
        ` "${type == ModifierType.EXCLUSIVE ? '!' : ''}y: ${mapExpressionHelper(maps)}"` :
        '';
}

function mapExpressionHelper(maps: string[]): string {
    if (maps.length == 1) {
        return maps[0];
    } else {
        return `(${maps.join('|')})`;
    }
}

function setup() {
    document.querySelectorAll('.container-search').forEach(element => {
        element.addEventListener('input', (event) => {
            filter(event.target as HTMLElement);
        });
    });

    document.getElementById('t17')!.addEventListener('change', (event: Event) => {
        const target = event.target as HTMLInputElement;
        const elements = document.querySelectorAll('[data-t17="true"]');
        elements.forEach((e) => {
            let element = (e as HTMLElement);
            element.style.display = target.checked ? 'block' : 'none';
            if (!target.checked) element.classList.remove("selected-item");
        });
        document.querySelectorAll('.container-search').forEach(element => {
            filter(element as HTMLElement);
        });
    });

    document.getElementById('clear')!.addEventListener('click', () => {
        document.getElementById('regex')!.innerText = '';
        document.getElementById('hint')!.innerText = '';
        exclusive.length = 0;
        inclusive.length = 0;
        selection.clear();
        cache.clear()
        wipe();
    });

    // thanks to Ycrew for this little snippet
    document.getElementById('copy')!.addEventListener('click', () => {
        let copyText: string = document.getElementById('regex')!.innerText;
        navigator.clipboard.writeText(copyText);
    });

    document.getElementById('import')!.addEventListener('click', () => {
        modal('import-modal', true);
    });

    document.querySelectorAll('.close-modal').forEach(element => {
        element.addEventListener('click', function (event) {
            const content = (event.target as HTMLElement).closest('.modal-content');
            if (content && content.parentElement && content.parentElement.id) {
                let id = content.parentElement.id;
                modal(id, false);
            }
        });
    });

    document.querySelectorAll('.trigger-0').forEach(element => {
        element.addEventListener('change', (event) => {
            construct();
        })
    });

    document.querySelectorAll('.trigger-1').forEach(element => {
        element.addEventListener('input', (event) => {
            construct();
        })
    });

    document.querySelectorAll('.trigger-2').forEach(element => {
        element.addEventListener('input', (event) => {
            selection.delete(ModifierType.INCLUSIVE);
        })
    });

    document.querySelectorAll('.trigger-3').forEach(element => {
        element.addEventListener('input', (event) => {

            exclusive = cleanup(exclusive);
            inclusive = cleanup(inclusive);

            let target = event.target as HTMLElement;
            let type: ModifierType | null = null;

            switch (target.id) {
                case 'corrupted-include':
                    type = ModifierType.INCLUSIVE;
                    break;
                case 'corrupted-exclude':
                    type = ModifierType.EXCLUSIVE;
                    break;
                default:
                    break;
            }

            if (type != null) {
                let mod = new Modifier("Corrupted", false);
                let array = type === ModifierType.EXCLUSIVE ? exclusive : inclusive;
                array.push(mod);
            }

            construct();
        })
    });

    const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            handleCheckboxChange(checkbox);
        });
    });

    function handleCheckboxChange(checkbox: HTMLInputElement): void {
        const classes = checkbox.classList;
        let group = "";

        for (const klass of classes) {
            if (klass.includes("btn-group-")) {
                group = klass;
                break;
            }
        }

        if (group.length == 0) return;

        if (checkbox.checked) {
            checkboxes.forEach(box => {
                if (box.classList.contains(group) && box !== checkbox) {
                    box.checked = false;
                }
            });
        } else {
            const groups = Array.from(checkboxes).filter(box =>
                box.classList.contains(group)
            );
            const checked = groups.some(box => box.checked);
            if (!checked) {
                checkbox.checked = true;
            }
        }
    }
}