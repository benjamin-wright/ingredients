export default class IngredientType {
    public id: number
    public name: String

    constructor(id: number, name: string) {
        this.id = id
        this.name = name
    }

    static Compare(a: IngredientType, b: IngredientType): number {
        if (a.name < b.name) {
            return -1;
        }

        if (a.name > b.name) {
            return 1;
        }

        return 0;
    }
}
