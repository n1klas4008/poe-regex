export class Blacklist {
    private readonly blacklist: Set<string> = new Set();

    public populate(arr: string[]) {
        for (let i = 0; i < arr.length; i++) {
            this.blacklist.add(arr[i].toLowerCase());
        }
    }

    public blacklisted(substring: string): boolean {
        for (let entry of this.blacklist) {
            if (entry.includes(substring.toLowerCase())) {
                return true;
            }
        }
        return false;
    }
}