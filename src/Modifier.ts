export class Modifier {
    private readonly mod: string;
    private readonly index: number;
    private readonly args: string[];
    private readonly active: boolean;
    private readonly t17: boolean = false;
    private readonly vaal: boolean = false;

    constructor(mod: string, args: string[]) {
        this.mod = mod;
        this.args = args;
        this.index = Number(args[0]);
        this.active = Boolean(args[1]);
        for (const arg of args) {
            switch (arg) {
                case 't17':
                    this.t17 = true;
                    break
                case 'vaal':
                    this.vaal = true;
                    break
            }
        }
    }

    public getMetadata(): string[] {
        return [...this.args];
    }

    public getModifier(): string {
        return this.mod;
    }

    public getIndex(): number {
        return this.index;
    }

    public isActive(): boolean {
        return this.active;
    }

    public isVaal(): boolean {
        return this.vaal;
    }

    public isT17(): boolean {
        return this.t17;
    }

    public equals(modifier: Modifier): boolean {
        if (this === modifier) {
            return true;
        }
        if (!modifier) {
            return false;
        }
        return this.mod === modifier.getModifier() &&
            this.active === modifier.isActive() &&
            this.index === modifier.getIndex() &&
            this.vaal === modifier.isVaal() &&
            this.t17 === modifier.isT17();
    }
}