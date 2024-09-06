export class Blacklist {
    private readonly blacklist: Set<string> = new Set();

    // add everything and make sure its lowercased
    public populate(arr: string[]) {
        for (let i = 0; i < arr.length; i++) {
            this.blacklist.add(arr[i].toLowerCase());
        }
    }

    public blacklisted(substring: string): boolean {
        for (let entry of this.blacklist) {
            if (entry.includes(substring)) {
                return true;
            }
        }
        return false;
    }
}