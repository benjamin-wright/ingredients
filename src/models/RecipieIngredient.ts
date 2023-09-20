import type IngredientType from "./IngredientType";
import { QuantityUnit } from "./QuantityUnit";

export default class RecipieIngredient {
    public ingredient: IngredientType
    public unit: QuantityUnit
    public quantity: number

    constructor(ingredient: IngredientType, unit: QuantityUnit, quantity: number) {
        this.ingredient = ingredient;
        this.unit = unit;
        this.quantity = quantity;
    }

    toString(): string {
        return `${this.quantity} ${QuantityUnit[this.unit]}s ${this.ingredient.name}`;
    }
}
