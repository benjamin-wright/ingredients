import RecipieIngredient from "./RecipieIngredient"

export default class Recipie {
    public id: number
    public name: string
    public ingredients: RecipieIngredient[]
    public portions: number

    constructor(id: number, name: string, portions: number, ingredients: RecipieIngredient[]) {
        this.id = id;
        this.name = name
        this.portions = portions
        this.ingredients = ingredients
    }

    getIngredients(portions: number): RecipieIngredient[] {
        return this.ingredients.map((i) => new RecipieIngredient(i.ingredient, i.unit, i.quantity * portions / this.portions))
    }

    static Compare(a: Recipie, b: Recipie): number {
        if (a.name < b.name) {
            return -1;
        }

        if (a.name > b.name) {
            return 1;
        }

        return 0;
    }
}
