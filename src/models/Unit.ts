import { query } from "@/database/database";

export enum UnitType {
    Mass = 1,
    Volume,
    Collective
}

export type Unit = {
    id: number;
    name: string;
    type: UnitType;
    conversion: number;
}

export async function getUnits(): Promise<Unit[]> {
    const names = await query(
        'SELECT id, name, type, conversion FROM units',
        [], (values) => {
            return {
                id: values[0] as number,
                name: values[1] as string,
                type: values[2] as UnitType,
                conversion: values[3] as number,
            };
        }
    );

    return names;
}

export async function deleteUnit(id: number): Promise<void> {
    await query(
        'DELETE FROM units WHERE id = ?',
        [id]
    );
}

export async function addUnit(name: string, type: UnitType, conversion: number): Promise<number> {
    const result = await query(
        'INSERT INTO units (name, type, conversion) VALUES (?, ?, ?) RETURNING id',
        [name, type, conversion],
        (values) => values[0] as number
    );

    return result[0];
}