import { query } from "@/database/database";

export type Recipie = {
    id: number;
    name: string;
    description: string;
    servings: number;
}

export async function getRecipies(): Promise<Recipie[]> {
    const recipies = await query(
        /*sql*/`SELECT id, name, description, servings FROM recipies ORDER BY name ASC`,
        [], (values) => {
            return {
                id: values[0] as number,
                name: values[1] as string,
                description: values[2] as string,
                servings: values[3] as number,
            };
        }
    );

    return recipies;
}

export async function getRecipie(id: number): Promise<Recipie> {
    const recipies = await query(
        /*sql*/`SELECT id, name, description, servings FROM recipies WHERE id = ?`,
        [id], (values) => {
            return {
                id: values[0] as number,
                name: values[1] as string,
                description: values[2] as string,
                servings: values[3] as number,
            };
        }
    );

    return recipies[0];
}

export async function deleteRecipie(id: number): Promise<void> {
    await query(
        /*sql*/`DELETE FROM recipies WHERE id = ?`,
        [id]
    );
}

export async function addRecipie(name: string, description: string, servings: number): Promise<number> {
    const result = await query(
        /*sql*/`INSERT INTO recipies (name, description, servings) VALUES (?, ?, ?) RETURNING id`,
        [name, description, servings],
        (values) => values[0] as number
    );

    return result[0];
}

export async function updateRecipie(id: number, name: string, description: string, servings: number): Promise<void> {
    await query(
        /*sql*/`UPDATE recipies SET name = ?, description = ?, servings = ? WHERE id = ?`,
        [name, description, servings, id]
    );
}
