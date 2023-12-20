import { query } from '../database';

export type ListItemInput = {
    name: string;
    category_id: number;
    quantity: number;
    unit_id: number;
};

export async function generateList(): Promise<void> {
    await generateMealList();
    // await generateExtrasList();
}

async function generateExtrasList(): Promise<void> {
    const items = await query(
        // convert the items from the extra_list_items table into the format of the shopping_list_items table
        /*sql*/`
            SELECT
                ei.name,
                ei.category_id,
                SUM(ei.quantity * u.conversion),
                CASE u.kind
                    WHEN 1 THEN 1
                    WHEN 2 THEN 3
                    ELSE u.id
                END as unit_id
            FROM extra_items as ei
            LEFT JOIN
                units as u ON ei.unit_id = u.id
            GROUP BY
                ei.name, ei.category_id, unit_id;
        `,
        [], (values) => {
            return {
                name: values[0] as string,
                category_id: values[1] as number,
                quantity: values[2] as number,
                unit_id: values[3] as number,
            };
        }
    );

    for (const item of items) {
        await query(
            /*sql*/`
                INSERT INTO shopping_list_items (name, category_id, quantity, unit_id, got)
                VALUES (?, ?, ?, ?, false);
            `,
            [item.name, item.category_id, item.quantity, item.unit_id]
        );
    }
}

async function generateMealList(): Promise<void> {
    const ingredients = await query(
        /*sql*/`
            SELECT
                c.name,
                c.category_id,
                SUM(c.quantity),
                c.unit_id
            FROM
            (
                SELECT
                    i.name,
                    i.category_id,
                    SUM(ri.quantity * u.conversion * p.servings / r.servings) as quantity,
                    CASE u.kind
                        WHEN 1 THEN 1
                        WHEN 2 THEN 3
                        ELSE u.id
                    END as unit_id
                FROM (
                    SELECT dp.recipie_id, dp.servings FROM dinner_plans as dp
                    UNION
                    SELECT ndp.recipie_id, ndp.servings FROM non_dinner_plans as ndp
                ) as p
                INNER JOIN
                    recipie_ingredients as ri ON p.recipie_id = ri.recipie_id
                LEFT JOIN
                    recipies as r ON ri.recipie_id = r.id
                LEFT JOIN
                    ingredients as i ON ri.ingredient_id = i.id
                LEFT JOIN
                    units as u ON ri.unit_id = u.id
                GROUP BY
                    i.name, i.category_id, unit_id
                UNION
                SELECT
                    ei.name,
                    ei.category_id,
                    SUM(ei.quantity * u.conversion) as quantity,
                    CASE u.kind
                        WHEN 1 THEN 1
                        WHEN 2 THEN 3
                        ELSE u.id
                    END as unit_id
                FROM extra_items as ei
                LEFT JOIN
                    units as u ON ei.unit_id = u.id
                GROUP BY
                    ei.name, ei.category_id, unit_id
            ) as c
            GROUP BY c.name, c.category_id, c.unit_id;
        `,
        [], (values) => {
            return {
                name: values[0] as string,
                category_id: values[1] as number,
                quantity: values[2] as number,
                unit_id: values[3] as number,
            };
        }
    );

    for (const ingredient of ingredients) {
        await query(
            /*sql*/`
                INSERT INTO shopping_list_items (name, category_id, quantity, unit_id, got)
                VALUES (?, ?, ?, ?, false);
            `,
            [ingredient.name, ingredient.category_id, ingredient.quantity, ingredient.unit_id]
        );
    }
}

export type ListItem = {
    id: number;
    name: string;
    category: string;
    quantity: number;
    unitSingular: string;
    unitPlural: string;
    got: boolean;
};

export async function getListItems(): Promise<ListItem[]> {
    const items = await query(
        /*sql*/`
            SELECT li.id, li.name, c.name, li.quantity, u.singular, u.plural, li.got FROM shopping_list_items as li
            LEFT JOIN categories as c ON li.category_id = c.id
            LEFT JOIN units as u ON li.unit_id = u.id;
        `,
        [], (values) => {
            return {
                id: values[0] as number,
                name: values[1] as string,
                category: values[2] as string,
                quantity: values[3] as number,
                unitSingular: values[4] as string,
                unitPlural: values[5] as string,
                got: values[6] as boolean,
            };
        }
    );

    return items;
}

export async function addListItem(name: string, category: number, quantity: number, unit: number): Promise<void> {
    await query(
        /*sql*/`
            INSERT INTO shopping_list_items (name, category_id, quantity, unit_id, got)
            VALUES (?, ?, ?, ?, false);
        `,
        [name, category, quantity, unit]
    );
}

export async function deleteListItem(id: number): Promise<void> {
    await query(
        /*sql*/`
            DELETE FROM shopping_list_items WHERE id = ?;
        `,
        [id]
    );
}

export async function checkListItem(id: number, got: boolean): Promise<void> {
    await query(
        /*sql*/`
            UPDATE shopping_list_items SET got = ? WHERE id = ?;
        `,
        [got, id]
    );
}

export async function clearList(): Promise<void> {
    await query(
        /*sql*/`
            DELETE FROM shopping_list_items;
        `,
        []
    );
}
