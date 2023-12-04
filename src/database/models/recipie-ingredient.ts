import { query } from "@/database/database";

export type RecipieIngredient = {
    recipieId: number;
    ingredientId: number;
    name: string;
    quantity: number;
    unitId: number;
    unitSingular: string;
    unitPlural: string;
}

export async function getRecipieIngredients(recipieId: number): Promise<RecipieIngredient[]> {
    const recipieIngredients = await query(
        /*sql*/`
            SELECT ri.recipie_id, ri.ingredient_id, i.name, ri.quantity, ri.unit_id, u.singular, u.plural FROM recipie_ingredients as ri
            LEFT JOIN ingredients as i ON ri.ingredient_id = i.id
            LEFT JOIN units as u ON ri.unit_id = u.id
            WHERE ri.recipie_id = ?;            
        `,
        [recipieId], (values) => {
            return {
                recipieId: values[0] as number,
                ingredientId: values[1] as number,
                name: values[2] as string,
                quantity: values[3] as number,
                unitId: values[4] as number,
                unitSingular: values[5] as string,
                unitPlural: values[6] as string,
            };
        }
    );

    return recipieIngredients;
}

export async function getRecipieIngredient(recipieId: number, ingredientId: number): Promise<RecipieIngredient> {
    const recipieIngredients = await query(
        /*sql*/`
            SELECT ri.recipie_id, ri.ingredient_id, i.name, ri.quantity, ri.unit_id, u.singular, u.plural FROM recipie_ingredients as ri
            LEFT JOIN ingredients as i ON ri.ingredient_id = i.id
            LEFT JOIN units as u ON ri.unit_id = u.id
            WHERE ri.recipie_id = ? AND ri.ingredient_id = ?;            
        `,
        [recipieId, ingredientId], (values) => {
            return {
                recipieId: values[0] as number,
                ingredientId: values[1] as number,
                name: values[2] as string,
                quantity: values[3] as number,
                unitId: values[4] as number,
                unitSingular: values[5] as string,
                unitPlural: values[6] as string,
            };
        }
    );

    return recipieIngredients[0];
}

export async function deleteRecipieIngredient(recipieId: number, ingredientId: number): Promise<void> {
    await query(
        /*sql*/`DELETE FROM recipie_ingredients WHERE recipie_id = ? AND ingredient_id = ?`,
        [recipieId, ingredientId]
    );
}

export async function addRecipieIngredient(recipieId: number, ingredientId: number, quantity: number, unitId: number): Promise<number> {
    const result = await query(
        /*sql*/`INSERT INTO recipie_ingredients (recipie_id, ingredient_id, quantity, unit_id) VALUES (?, ?, ?, ?) RETURNING ingredient_id`,
        [recipieId, ingredientId, quantity, unitId],
        (values) => values[0] as number
    );

    return result[0];
}

export async function updateRecipieIngredient(recipieId: number, ingredientId: number, quantity: number, unitId: number): Promise<void> {
    await query(
        /*sql*/`UPDATE recipie_ingredients SET quantity = ?, unit_id = ? WHERE recipie_id = ? AND ingredient_id = ?`,
        [quantity, unitId, recipieId, ingredientId]
    );
}