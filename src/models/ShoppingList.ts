import type IngredientType from "./IngredientType"

export default class ShoppingList {
    public ingredients: ShoppingListIngredient[]

    constructor() {
        this.ingredients = [];
    }

    addIngredient(ingredient: IngredientType, quantity: number) {
        const existing = this.ingredients.findIndex((i) => i.ingredient.name === ingredient.name);
        if (existing >= 0) {
            this.ingredients[existing].quantity += quantity;
            return;
        }

        this.ingredients.push(new ShoppingListIngredient(ingredient, quantity))
    }
}

export class ShoppingListIngredient {
    public ingredient: IngredientType
    public quantity: number

    constructor(ingredient: IngredientType, quantity: number) {
        this.ingredient = ingredient
        this.quantity = quantity
    }
}