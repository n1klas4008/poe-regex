export class Modifier {
    private readonly mod: string;
    private readonly t17: boolean;

    constructor(mod: string, t17: boolean) {
        this.mod = mod;
        this.t17 = t17;
    }

    public getModifier(): string {
        return this.mod;
    }

    public isT17(): boolean {
        return this.t17;
    }
}