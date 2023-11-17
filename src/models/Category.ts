export default class Category {
    public id: number
    public position: number
    public name: string

    constructor(id: number, position: number, name: string) {
        this.id = id;
        this.position = position;
        this.name = name;
    }

    static Compare(a: Category, b: Category): number {
        return a.position - b.position;
    }
}