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

export enum WeightUnit {
    Gram = 1,
    Kilogram,
    Ounce,
    Pound
}

export function weightUnitStrings(): string[] {
    return Object.keys(WeightUnit).filter(k => typeof WeightUnit[k as any] === "number")
}

export function weightFromString(s: string): WeightUnit {
    return WeightUnit[s as keyof typeof WeightUnit]
}

export enum VolumeUnit {
    Milliliter = 1,
    Liter,
    Teaspoon,
    Tablespoon,
    Cup,
    Pint,
    Quart,
    Gallon
}

export function volumeUnitStrings(): string[] {
    return Object.keys(VolumeUnit).filter(k => typeof VolumeUnit[k as any] === "number")
}

export function volumeFromString(s: string): VolumeUnit {
    return VolumeUnit[s as keyof typeof VolumeUnit]
}
