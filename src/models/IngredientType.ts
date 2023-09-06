export default class IngredientType {
    public id: number
    public name: string
    public quantity: QuantityUnit

    constructor(id: number, name: string, quantity: QuantityUnit) {
        this.id = id
        this.name = name
        this.quantity = quantity
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

export enum QuantityUnit {
    Piece = 1,
    Gram,
    Kilogram,
    Liter,
    Milliliter
}

export function quantityUnitStrings(): string[] {
    return Object.keys(QuantityUnit).filter(k => typeof QuantityUnit[k as any] === "number")
}

export function quantityFromString(s: string): QuantityUnit {
    return QuantityUnit[s as keyof typeof QuantityUnit]
}
