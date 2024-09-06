import {Modifier} from "./Modifier";
import {ModifierType} from "./ModifierType";
import {ExcludeFilter} from "./ExcludeFilter";
import {Blacklist} from "./Blacklist";
import {MapAssociation} from "./MapAssociation";
import {generateRegularExpression} from "./MinNumRegex";

const call = performance.now();

let blacklist = new Blacklist();
let modifiers: Modifier[] = [];
let exclusive: Modifier[] = [];
let inclusive: Modifier[] = [];
let previous: Modifier[] = [];
let cache: string = "";

document.addEventListener('DOMContentLoaded', () => {
    const entries = [
        "./league/settler/map.name.config",
        "./league/settler/map.affix.config",
        "./league/settler/map.general.config"
    ];
    read(entries)
        .then(responses => initialize(responses))
        .then(list => {
            blacklist = list;
            load().then(() => setup()).then(() => tracker());
        })
        .catch(error => exceptional(error));
});

function modal(status: boolean) {
    const overlay = document.getElementById('overlay')!;
    const modal = document.getElementById('modal')!;
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
            targets[j].appendChild(createSelectableContainer(type, mod));
        }
    }
}

function createSelectableContainer(type: ModifierType, modifier: Modifier): HTMLDivElement {
    const div = document.createElement("div");

    div.classList.add("selectable");
    if (modifier.isT17()) {
        div.classList.add("t17");
        div.style.display = "none";
    }
    div.dataset.t17 = modifier.isT17().toString();
    div.textContent = modifier.getModifier();
    div.addEventListener('click', (event) => {
        let element = (event.target as HTMLElement);
        element.classList.toggle('selected-item');
        let active = element.classList.contains('selected-item');
        let array = type == ModifierType.EXCLUSIVE ? exclusive : inclusive;
        if (active) {
            array.push(modifier);
        } else {
            const index = array.indexOf(modifier);
            if (index > -1) {
                array.splice(index, 1);
            }
        }
        construct();
    });

    return div;
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
        let modifier = buildModifierExpression();
        let utility = buildUtilityExpression();
        let map = buildMapExpression();

        let regex = (modifier + utility + map).trim();

        document.getElementById('regex')!.innerText = regex;

        let element = document.getElementById('hint')!;

        element.innerText = regex.length > 0 ? `length: ${regex.length} / 50` : '';
        element.style.color = (regex.length > 50) ? '#ff4d4d' : '#e0e0e0';

        modal(false);
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

function buildModifierExpression(): string {
    const checkbox = document.getElementById('t17') as HTMLInputElement;
    let exclude = new ExcludeFilter(checkbox.checked, modifiers, blacklist);

    let regex = "";
    if (!compare(previous, exclusive)) {
        let result: Set<string> = new Set<string>();
        let association = new MapAssociation(modifiers);
        try {
            exclude.create(association, result, exclusive);
            previous = [...exclusive];

            regex = Array.from(result).join("|").replace(/#/g, "\\d+");
            cache = regex.length > 0 ? (regex = `"!${regex}"`) : "";
        } catch (error) {
            console.error(error);
        }
    } else {
        regex = cache;
    }
    return regex;
}

function buildUtilityExpression(): string {
    let quantity = (document.getElementById('quantity') as HTMLInputElement).value;
    let e1 = generateRegularExpression(quantity, (document.getElementById('optimize-quantity') as HTMLInputElement).checked, true);

    let pack = (document.getElementById('pack-size') as HTMLInputElement).value;
    let e2 = generateRegularExpression(pack, (document.getElementById('optimize-pack') as HTMLInputElement).checked, true);

    let expression = "";

    if (e1) expression += ' "m q.*' + e1 + '%"'
    if (e2) expression += ' "iz.*' + e2 + '%"'

    return expression;
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

    document.getElementById('generate')!.addEventListener('click', () => {
        modal(true);
        construct();
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