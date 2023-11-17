import Category from "./Category"

export default class IngredientType {
    public id: number
    public name: string
    public category: Category

    constructor(id: number, name: string, category: Category) {
        this.id = id
        this.name = name
        this.category = category
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
