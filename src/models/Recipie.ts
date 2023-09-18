import RecipieIngredient from "./RecipieIngredient"

export default class Recipie {
    public id: number
    public name: string
    public description: string
    public ingredients: RecipieIngredient[]
    public steps: string[]
    public portions: number

    constructor(id: number, name: string, description: string, portions: number, ingredients: RecipieIngredient[], steps: string[]) {
        this.id = id
        this.name = name
        this.description = description
        this.portions = portions
        this.ingredients = ingredients
        this.steps = steps
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
