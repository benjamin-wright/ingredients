export enum QuantityUnit {
    Count = 1,
    Tin,
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
    Gallon,
    Pinch,
}

export function quantityUnits(): string[] {
    return Object.keys(QuantityUnit).filter(k => typeof QuantityUnit[k as any] === "number")
}

export function quantityUnitFromString(unit: string): QuantityUnit {
    return QuantityUnit[unit as keyof typeof QuantityUnit]
}

export function humanise(unit: QuantityUnit, quantity: number): string {
    if (unit === QuantityUnit.Count) {
        return `${quantity}`;
    }

    const unitString = QuantityUnit[unit];
    const plural = quantity !== 1 ? "s" : "";
    return `${quantity} ${unitString}${plural}`;
}