import { query } from "@/database/database";

export enum MealType {
    Breakfast = 1,
    Lunch,
}

export type NonDinnerPlan = {
    id: number;
    mealType: MealType;
    servings: number;
    recipieId: number;
    recipieName: string;
}

export async function getBreakfastPlans(): Promise<NonDinnerPlan[]> {
    const breakfastPlans = await query(
        /*sql*/`
            SELECT ndp.id, ndp.meal_type, ndp.servings, ndp.recipie_id, r.name FROM non_dinner_plans as ndp
            LEFT JOIN recipies as r ON ndp.recipie_id = r.id
            WHERE ndp.meal_type = 1
            ORDER BY ndp.id;
        `,
        [], (values) => {
            return {
                id: values[0] as number,
                mealType: values[1] as MealType,
                servings: values[2] as number,
                recipieId: values[3] as number,
                recipieName: values[4] as string,
            };
        }
    );

    return breakfastPlans;
}

export async function getBreakfastPlan(id: number): Promise<NonDinnerPlan> {
    const breakfastPlans = await query(
        /*sql*/`
            SELECT ndp.id, ndp.meal_type, ndp.servings, ndp.recipie_id, r.name FROM non_dinner_plans as ndp
            LEFT JOIN recipies as r ON ndp.recipie_id = r.id
            WHERE ndp.id = ? AND ndp.meal_type = 1;
        `,
        [id], (values) => {
            return {
                id: values[0] as number,
                mealType: values[1] as MealType,
                servings: values[2] as number,
                recipieId: values[3] as number,
                recipieName: values[4] as string,
            };
        }
    );

    return breakfastPlans[0];
}

export async function getLunchPlans(): Promise<NonDinnerPlan[]> {
    const lunchPlans = await query(
        /*sql*/`
            SELECT ndp.id, ndp.meal_type, ndp.servings, ndp.recipie_id, r.name FROM non_dinner_plans as ndp
            LEFT JOIN recipies as r ON ndp.recipie_id = r.id
            WHERE ndp.meal_type = 2
            ORDER BY ndp.id;
        `,
        [], (values) => {
            return {
                id: values[0] as number,
                mealType: values[1] as MealType,
                servings: values[2] as number,
                recipieId: values[3] as number,
                recipieName: values[4] as string,
            };
        }
    );

    return lunchPlans;
}

export async function getLunchPlan(id: number): Promise<NonDinnerPlan> {
    const lunchPlans = await query(
        /*sql*/`
            SELECT ndp.id, ndp.meal_type, ndp.servings, ndp.recipie_id, r.name FROM non_dinner_plans as ndp
            LEFT JOIN recipies as r ON ndp.recipie_id = r.id
            WHERE ndp.id = ? AND ndp.meal_type = 2;
        `,
        [id], (values) => {
            return {
                id: values[0] as number,
                mealType: values[1] as MealType,
                servings: values[2] as number,
                recipieId: values[3] as number,
                recipieName: values[4] as string,
            };
        }
    );

    return lunchPlans[0];
}

export async function addBreakfastPlan(servings: number, recipieId: number): Promise<number> {
    const result = await query(
        /*sql*/`
            INSERT INTO non_dinner_plans (meal_type, servings, recipie_id)
            VALUES (1, ?, ?)
            RETURNING id;
        `,
        [servings, recipieId]
    );

    return result[0] as number;
}

export async function addLunchPlan(servings: number, recipieId: number): Promise<number> {
    const result = await query(
        /*sql*/`
            INSERT INTO non_dinner_plans (meal_type, servings, recipie_id)
            VALUES (2, ?, ?)
            RETURNING id;
        `,
        [servings, recipieId]
    );

    return result[0] as number;
}

export async function deleteBreakfastPlan(id: number): Promise<void> {
    await query(
        /*sql*/`
            DELETE FROM non_dinner_plans
            WHERE id = ? AND meal_type = 1;
        `,
        [id]
    );
}

export async function deleteLunchPlan(id: number): Promise<void> {
    await query(
        /*sql*/`
            DELETE FROM non_dinner_plans
            WHERE id = ? AND meal_type = 2;
        `,
        [id]
    );
}

export async function updateBreakfastPlan(id: number, servings: number, recipieId: number): Promise<void> {
    await query(
        /*sql*/`
            UPDATE non_dinner_plans
            SET servings = ?, recipie_id = ?
            WHERE id = ? AND meal_type = 1;
        `,
        [servings, recipieId, id]
    );
}

export async function updateLunchPlan(id: number, servings: number, recipieId: number): Promise<void> {
    await query(
        /*sql*/`
            UPDATE non_dinner_plans
            SET servings = ?, recipie_id = ?
            WHERE id = ? AND meal_type = 2;
        `,
        [servings, recipieId, id]
    );
}

export async function clearNonDinnerPlans(): Promise<void> {
    await query(
        /*sql*/`
            DELETE FROM non_dinner_plans;
        `
    );
}