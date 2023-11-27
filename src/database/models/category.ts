import { query } from "@/database/database";

export type Category = {
    id: number;
    position: number;
    name: string;
}

export async function getCategories(): Promise<Category[]> {
    const names = await query(
        'SELECT id, position, name FROM categories ORDER BY position ASC',
        [], (values) => {
            return {
                id: values[0] as number,
                position: values[1] as number,
                name: values[2] as string,
            };
        }
    );

    return names;
}

export async function deleteCategory(id: number): Promise<void> {
    await query(
        'DELETE FROM categories WHERE id = ?',
        [id]
    );
}

export async function addCategory(name: string): Promise<number> {
    let result = await query(
        'SELECT MAX(position) FROM categories',
        [],
        (values) => values[0] as number
    );
    const position = result[0] + 1 ?? 1;

    result = await query(
        'INSERT INTO categories (name, position) VALUES (?, ?) RETURNING id',
        [name, position],
        (values) => values[0] as number
    );

    return result[0];
}

export async function updateCategory(id: number, name: string): Promise<void> {
    await query(
        'UPDATE categories SET name = ? WHERE id = ?',
        [name, id]
    );
}

export async function swapCategories(a: Category, b: Category): Promise<void> {
    await query(
        'UPDATE categories SET position = ? WHERE id = ?',
        [b.position, a.id]
    );
    await query(
        'UPDATE categories SET position = ? WHERE id = ?',
        [a.position, b.id]
    );
}