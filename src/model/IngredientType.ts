export default class IngredientType {
    public name: string
    public quantity: QuantityUnit

    constructor(name: string, quantity: QuantityUnit) {
        this.name = name
        this.quantity = quantity
    }
}

export const enum QuantityUnit {
    Piece = 1,
    Gram,
    Kilogram,
    Liter,
    Milliliter
}