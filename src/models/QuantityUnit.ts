export enum QuantityUnit {
    Count = 1,
    Gram,
    Kilogram,
    Ounce,
    Pound,
    Milliliter,
    Liter,
    Teaspoon,
    Tablespoon,
    Cup,
    Pint,
    Quart,
    Gallon
}

export function quantityUnits(): string[] {
    return Object.keys(QuantityUnit).filter(k => typeof QuantityUnit[k as any] === "number")
}

export function quantityUnitFromString(unit: string): QuantityUnit {
    return QuantityUnit[unit as keyof typeof QuantityUnit]
}