import type IngredientType from "./IngredientType"

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
}

export enum QuantityUnit {
    Count = 1,
    Weight,
    Volume,
}

export function quantityUnitStrings(): string[] {
    return Object.keys(QuantityUnit).filter(k => typeof QuantityUnit[k as any] === "number")
}

export function quantityFromString(s: string): QuantityUnit {
    return QuantityUnit[s as keyof typeof QuantityUnit]
}

export class RecipieIngredient {
    public ingredient: IngredientType
    public unit: QuantityUnit
    public quantity: number

    constructor(ingredient: IngredientType, unit: QuantityUnit, quantity: number) {
        this.ingredient = ingredient;
        this.unit = unit;
        this.quantity = quantity;
    }
}
