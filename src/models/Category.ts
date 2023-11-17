export default class Category {
    public id: number
    public name: string

    constructor(id: number, name: string) {
        this.id = id
        this.name = name
    }

    static Compare(a: Category, b: Category): number {
        if (a.name < b.name) {
            return -1;
        }

        if (a.name > b.name) {
            return 1;
        }

        return 0;
    }
}