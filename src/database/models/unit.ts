import { query } from "@/database/database";

export enum UnitKind {
    Mass = 1,
    Volume,
    Collective
}

export function getUnitKinds(): UnitKind[] {
    return [
        UnitKind.Mass,
        UnitKind.Volume,
        UnitKind.Collective,
    ];
}

export type Unit = {
    id: number;
    name: string;
    singular: string;
    plural: string;
    kind: UnitKind;
    conversion: number;
}

export async function getUnits(): Promise<Unit[]> {
    const names = await query(
        'SELECT id, name, singular, plural, kind, conversion FROM units',
        [], (values) => {
            return {
                id: values[0] as number,
                name: values[1] as string,
                singular: values[2] as string,
                plural: values[3] as string,
                kind: values[4] as UnitKind,
                conversion: values[5] as number,
            };
        }
    );

    return names;
}

export async function getUnit(id: number): Promise<Unit> {
    const names = await query(
        'SELECT id, name, singular, plural, kind, conversion FROM units WHERE id = ?',
        [id], (values) => {
            return {
                id: values[0] as number,
                name: values[1] as string,
                singular: values[2] as string,
                plural: values[3] as string,
                kind: values[4] as UnitKind,
                conversion: values[5] as number,
            };
        }
    );

    if (names.length == 0) {
        throw new Error(`No unit with id ${id}`);
    }

    return names[0];
}

export async function deleteUnit(id: number): Promise<void> {
    await query(
        'DELETE FROM units WHERE id = ?',
        [id]
    );
}

export async function addUnit(name: string, singular: string, plural: string, kind: UnitKind, conversion: number): Promise<number> {
    const result = await query(
        'INSERT INTO units (name, singular, plural, kind, conversion) VALUES (?, ?, ?, ?, ?) RETURNING id',
        [name, singular, plural, kind, conversion],
        (values) => values[0] as number
    );

    return result[0];
}

export async function updateUnit(id: number, name: string, singular: string, plural: string, kind: UnitKind, conversion: number): Promise<void> {
    await query(
        'UPDATE units SET name = ?, singular = ?, plural = ?, kind = ?, conversion = ? WHERE id = ?',
        [name, singular, plural, kind, conversion, id]
    );
}

export function getBaseUnit(units: Unit[], unit: Unit): Unit {
    switch (unit.kind) {
        case UnitKind.Mass:
            return units.find((u: Unit) => u.name === "grams") as Unit;
        case UnitKind.Volume:
            return units.find((u: Unit) => u.name === "millilitres") as Unit;
        case UnitKind.Collective:
            return unit;
    }
}
