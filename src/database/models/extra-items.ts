import { query } from '@/database/database';

export type ExtraItem = {
    id: number;
    name: string;
    categoryId: number;
    quantity: number;
    unitId: number;
    unitSingular: string;
    unitPlural: string;
};

export async function getExtraItems(): Promise<ExtraItem[]> {
    const extraItems = await query(
        /*sql*/`
            SELECT ei.id, ei.name, ei.category_id, ei.quantity, ei.unit_id, u.singular, u.plural FROM extra_items as ei
            LEFT JOIN units as u ON ei.unit_id = u.id;
        `,
        [], (values) => {
            return {
                id: values[0] as number,
                name: values[1] as string,
                categoryId: values[2] as number,
                quantity: values[3] as number,
                unitId: values[4] as number,
                unitSingular: values[5] as string,
                unitPlural: values[6] as string,
            };
        }
    );

    return extraItems;
}

export async function getExtraItem(id: number): Promise<ExtraItem> {
    const extraItems = await query(
        /*sql*/`
            SELECT ei.id, ei.name, ei.category_id, ei.quantity, ei.unit_id, u.singular, u.plural FROM extra_items as ei
            LEFT JOIN units as u ON ei.unit_id = u.id
            WHERE ei.id = ?;
        `,
        [id], (values) => {
            return {
                id: values[0] as number,
                name: values[1] as string,
                categoryId: values[2] as number,
                quantity: values[3] as number,
                unitId: values[4] as number,
                unitSingular: values[5] as string,
                unitPlural: values[6] as string,
            };
        }
    );

    return extraItems[0];
}

export async function deleteExtraItem(id: number): Promise<void> {
    await query(
        /*sql*/`DELETE FROM extra_items WHERE id = ?`,
        [id]
    );
}

export async function addExtraItem(name: string, categoryId: number, quantity: number, unitId: number): Promise<number> {
    const result = await query(
        /*sql*/`INSERT INTO extra_items (name, category_id, quantity, unit_id) VALUES (?, ?, ?, ?) RETURNING id`,
        [name, categoryId, quantity, unitId],
        (values) => values[0] as number
    );

    return result[0];
}

export async function updateExtraItem(id: number, name: string, categoryId: number, quantity: number, unitId: number): Promise<void> {
    await query(
        /*sql*/`UPDATE extra_items SET name = ?, category_id = ?, quantity = ?, unit_id = ? WHERE id = ?`,
        [name, categoryId, quantity, unitId, id]
    );
}

export async function clearExtraItems(): Promise<void> {
    await query(
        /*sql*/`DELETE FROM extra_items`,
        []
    );
}
