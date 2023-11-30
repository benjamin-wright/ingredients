import { query } from "@/database/database";

export type RecipieIngredient = {
    recipieId: number;
    ingredientId: number;
    name: string;
    quantity: number;
    unit_id: number;
}

export async function getRecipieIngredients(recipieId: number): Promise<RecipieIngredient[]> {
    const recipieIngredients = await query(
        /*sql*/`
            SELECT ri.recipie_id, ri.ingredient_id, i.name, ri.quantity, ri.unit_id FROM recipie_ingredients as ri
            LEFT JOIN ingredients as i ON ri.ingredient_id = i.id
            WHERE ri.recipie_id = ?;            
        `,
        [recipieId], (values) => {
            return {
                recipieId: values[0] as number,
                ingredientId: values[1] as number,
                name: values[2] as string,
                quantity: values[3] as number,
                unit_id: values[4] as number,
            };
        }
    );

    return recipieIngredients;
}

export async function deleteRecipieIngredient(recipieId: number, ingredientId: number): Promise<void> {
    await query(
        /*sql*/`DELETE FROM recipie_ingredients WHERE recipie_id = ? AND ingredient_id = ?`,
        [recipieId, ingredientId]
    );
}

export async function addRecipieIngredient(recipieId: number, ingredientId: number, quantity: number, unit_id: number): Promise<void> {
    await query(
        /*sql*/`INSERT INTO recipie_ingredients (recipie_id, ingredient_id, quantity, unit_id) VALUES (?, ?, ?, ?)`,
        [recipieId, ingredientId, quantity, unit_id]
    );
}

export async function updateRecipieIngredient(recipieId: number, ingredientId: number, quantity: number, unit_id: number): Promise<void> {
    await query(
        /*sql*/`UPDATE recipie_ingredients SET quantity = ?, unit_id = ? WHERE recipie_id = ? AND ingredient_id = ?`,
        [quantity, unit_id, recipieId, ingredientId]
    );
}