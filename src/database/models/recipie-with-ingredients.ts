import { query } from "@/database/database";

export type RecipieWithIngredients = {
    id: number;
    name: string;
    description: string;
    servings: number;
    ingredients: {
        id: number;
        name: string;
        categoryId: number;
        categoryName: string;
        amount: number;
        unit: string;
    }[];
}

export async function getRecipiesWithIngredients(): Promise<RecipieWithIngredients[]> {
    const recipies = await query(
        /*sql*/`
            SELECT r.id, r.name, r.description, r.servings, ARRAY_AGG(i.name), ARRAY_AGG(ri.amount), ARRAY_AGG(ri.unit)
            FROM recipies r
            LEFT JOIN recipie_ingredients ri ON r.id = ri.recipieId
            LEFT JOIN ingredients i ON ri.ingredientId = i.id
            GROUP BY r.id
        `,
        [], (values) => {
            return {
                id: values[0] as number,
                name: values[1] as string,
                description: values[2] as string,
                servings: values[3] as number,
            };
        }
    );

    return recipiesWithIngredients;
}