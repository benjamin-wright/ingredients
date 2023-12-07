import { query } from "@/database/database";

export enum Day {
    Saturday = 1,
    Sunday,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
}

export function getDays(): Day[] {
    return [
        Day.Saturday,
        Day.Sunday,
        Day.Monday,
        Day.Tuesday,
        Day.Wednesday,
        Day.Thursday,
        Day.Friday,
    ];
}

export type DinnerPlan = {
    id: number;
    day: Day;
    recipieId: number;
    recipieName: string;
    servings: number;
}

export async function getDinnerPlans(): Promise<DinnerPlan[]> {
    const dinnerPlans = await query(
        /*sql*/`
            SELECT dp.id, dp.day, dp.servings, dp.recipie_id, r.name FROM dinner_plans as dp
            LEFT JOIN recipies as r ON dp.recipie_id = r.id
            ORDER BY dp.day;
        `,
        [], (values) => {
            return {
                id: values[0] as number,
                day: values[1] as Day,
                servings: values[2] as number,
                recipieId: values[3] as number,
                recipieName: values[4] as string,
            };
        }
    );

    return dinnerPlans;
}

export async function getDinnerPlan(id: number): Promise<DinnerPlan> {
    const dinnerPlans = await query(
        /*sql*/`
            SELECT dp.id, dp.day, dp.servings, dp.recipie_id, r.name FROM dinner_plans as dp
            LEFT JOIN recipies as r ON dp.recipie_id = r.id
            WHERE dp.id = ?;
        `,
        [id], (values) => {
            return {
                id: values[0] as number,
                day: values[1] as Day,
                servings: values[2] as number,
                recipieId: values[3] as number,
                recipieName: values[4] as string,
            };
        }
    );

    return dinnerPlans[0];
}

export async function deleteDinnerPlan(id: number): Promise<void> {
    await query(
        'DELETE FROM dinner_plans WHERE id = ?',
        [id]
    );
}

export async function updateDinnerPlan(id: number, day: Day, servings: number, recipieId: number): Promise<void> {
    await query(
        'UPDATE dinner_plans SET day = ?, servings = ?, recipie_id = ? WHERE id = ?',
        [day, servings, recipieId, id]
    );
}

export async function addDinnerPlan(day: number, servings: number, recipieId: number): Promise<number> {
    const result = await query(
        'INSERT INTO dinner_plans (day, servings, recipie_id) VALUES (?, ?, ?) RETURNING id',
        [day, servings, recipieId],
        (values) => values[0] as number
    );

    return result[0];
}
