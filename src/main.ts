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

function generate() {
    const checkbox = document.getElementById('t17') as HTMLInputElement;
    let exclude = new ExcludeFilter(checkbox.checked, modifiers, blacklist);
    let regex = "";
    if (exclusive.length > 0) {
        let result: Set<string> = new Set<string>();
        let association = new MapAssociation(modifiers);
        try {
            exclude.create(association, result, exclusive);

            regex = Array.from(result).join("|").replace(/#/g, "\\d+");
            regex = `"!${regex}"`;

        } catch (error) {
            console.error(error);
        }
    }

    let quantity = (document.getElementById('quantity') as HTMLInputElement).value;
    let e1 = generateRegularExpression(quantity, (document.getElementById('optimize-quantity') as HTMLInputElement).checked, true);

    let pack = (document.getElementById('pack-size') as HTMLInputElement).value;
    let e2 = generateRegularExpression(pack, (document.getElementById('optimize-pack') as HTMLInputElement).checked, true);

    /*
        this does not work sadly
        // re-use expression if numbers are identical to save more space
        if (e1 && e2 && quantity === pack) {
            regex += ' "(m q|iz).*' + e1 + '%"'
        }
    */

    if (e1) {
        regex += ' "m q.*' + e1 + '%"'
    }
    if (e2) {
        regex += ' "iz.*' + e2 + '%"'
    }

    document.getElementById('regex')!.innerText = regex;
    document.getElementById('hint')!.innerText = regex.length > 0 ? `length: ${regex.length} / 50` : '';

    modal(false);
}

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
        document.getElementById('regex')!.innerText = "";
        document.getElementById('hint')!.innerText = "";
        setTimeout(generate, 100);
        modal(true);
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
            checkboxes.forEach(checkbox => {
                if (checkbox.classList.contains(group) && checkbox !== checkbox) {
                    checkbox.checked = false;
                }
            });
        } else {
            const groupCheckboxes = Array.from(checkboxes).filter(checkbox =>
                checkbox.classList.contains(group)
            );
            const anyChecked = groupCheckboxes.some(checkbox => checkbox.checked);
            if (!anyChecked) {
                checkbox.checked = true;
            }
        }
    }
}