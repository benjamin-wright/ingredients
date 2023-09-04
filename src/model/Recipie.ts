import type IngredientType from "./IngredientType"

export default class Recipie {
    public name: string
    public ingredients: RecipieIngredient[]
    public portions: number

    constructor(name: string, portions: number, ingredients: RecipieIngredient[]) {
        this.name = name
        this.portions = portions
        this.ingredients = ingredients
    }

    getIngredients(portions: number): RecipieIngredient[] {
        return this.ingredients.map((i) => new RecipieIngredient(i.ingredient, i.quantity * portions / this.portions))
    }
}

export class RecipieIngredient {
    public ingredient: IngredientType
    public quantity: number

    constructor(ingredient: IngredientType, quantity: number) {
        this.ingredient = ingredient
        this.quantity = quantity
    }
}
