import { query } from "@/database/database";

export type Ingredient = {
    id: number;
    name: string;
    categoryId: number;
}

export async function getIngredients(): Promise<Ingredient[]> {
    const ingredients = await query(
        /*sql*/`SELECT id, name, category_id FROM ingredients ORDER BY name ASC`,
        [], (values) => {
            return {
                id: values[0] as number,
                name: values[1] as string,
                categoryId: values[2] as number,
            };
        }
    );

    return ingredients;
}

export async function getIngredient(id: number): Promise<Ingredient> {
    const ingredients = await query(
        /*sql*/`SELECT id, name, category_id FROM ingredients WHERE id = ?`,
        [id], (values) => {
            return {
                id: values[0] as number,
                name: values[1] as string,
                categoryId: values[2] as number,
            };
        }
    );

    return ingredients[0];
}

export async function deleteIngredient(id: number): Promise<void> {
    await query(
        /*sql*/`DELETE FROM ingredients WHERE id = ?`,
        [id]
    );
}

export async function addIngredient(name: string, categoryId: number): Promise<number> {
    const result = await query(
        /*sql*/`INSERT INTO ingredients (name, category_id) VALUES (?, ?) RETURNING id`,
        [name.toLowerCase(), categoryId],
        (values) => values[0] as number
    );

    return result[0];
}

export async function updateIngredient(id: number, name: string, categoryId: number): Promise<void> {
    await query(
        /*sql*/`UPDATE ingredients SET name = ?, category_id = ? WHERE id = ?`,
        [name.toLowerCase(), categoryId, id]
    );
}