import { query } from "@/database/database";

export type RecipieStep = {
    id: number;
    recipieId: number;
    position: number;
    text: string;
}

export async function getRecipieSteps(recipieId: number): Promise<RecipieStep[]> {
    const recipieSteps = await query(
        /*sql*/`SELECT id, recipie_id, position, text FROM recipie_steps WHERE recipie_id = ? ORDER BY position ASC`,
        [recipieId], (values) => {
            return {
                id: values[0] as number,
                recipieId: values[1] as number,
                position: values[2] as number,
                text: values[3] as string,
            };
        }
    );

    return recipieSteps;
}

export async function deleteRecipieStep(id: number): Promise<void> {
    await query(
        /*sql*/`DELETE FROM recipie_steps WHERE id = ?`,
        [id]
    );
}

export async function addRecipieStep(recipieId: number, position: number, text: string): Promise<number> {
    const result = await query(
        /*sql*/`INSERT INTO recipie_steps (recipie_id, position, text) VALUES (?, ?, ?) RETURNING id`,
        [recipieId, position, text],
        (values) => values[0] as number
    );

    return result[0];
}

export async function updateRecipieStep(id: number, position: number, text: string): Promise<void> {
    await query(
        /*sql*/`UPDATE recipie_steps SET position = ?, text = ? WHERE id = ?`,
        [position, text, id]
    );
}

export async function swapRecipieSteps(id1: number, id2: number): Promise<void> {
    const result = await query(
        /*sql*/`SELECT id, position FROM recipie_steps WHERE id IN [?, ?]`,
        [id1, id2],
        (values) => {
            return {
                id: values[0] as number,
                position: values[1] as number,
            };
        }
    );
    const position1 = result.find((r) => r.id === id1)?.position;
    const position2 = result.find((r) => r.id === id2)?.position;

    await query(
        /*sql*/`UPDATE recipie_steps SET position = ? WHERE id = ?`,
        [position1, id2]
    );

    await query(
        /*sql*/`UPDATE recipie_steps SET position = ? WHERE id = ?`,
        [position2, id1]
    );
}