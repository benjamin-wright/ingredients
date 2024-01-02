import { query } from "@/database/database";

export type Category = {
    id: number;
    position: number;
    name: string;
}

export interface ICategoryProvider {
    getCategories(): Promise<Category[]>;
    getCategory(id: number): Promise<Category>;
    deleteCategory(id: number): Promise<void>;
    addCategory(name: string): Promise<number>;
    updateCategory(id: number, name: string): Promise<void>;
    swapCategories(a: number, b: number): Promise<void>;
}

export class CategoryProvider implements ICategoryProvider {
    async getCategories(): Promise<Category[]> {
        const categories = await query(
            /*sql*/`SELECT id, position, name FROM categories ORDER BY position ASC`,
            [], (values) => {
                return {
                    id: values[0] as number,
                    position: values[1] as number,
                    name: values[2] as string,
                };
            }
        );
    
        return categories;
    }

    async getCategory(id: number): Promise<Category> {
        const categories = await query(
            /*sql*/`SELECT id, position, name FROM categories WHERE id = ?`,
            [id], (values) => {
                return {
                    id: values[0] as number,
                    position: values[1] as number,
                    name: values[2] as string,
                };
            }
        );
    
        if (categories.length == 0) {
            throw new Error(`No category with id ${id}`);
        }
    
        return categories[0];
    }

    async deleteCategory(id: number): Promise<void> {
        await query(
            /*sql*/`DELETE FROM categories WHERE id = ?`,
            [id]
        );
    }

    async addCategory(name: string): Promise<number> {
        let result = await query(
            /*sql*/`SELECT MAX(position) FROM categories`,
            [],
            (values) => values[0] as number
        );
        const position = (result[0] || 0) + 1 ?? 1;
    
        result = await query(
            /*sql*/`INSERT INTO categories (name, position) VALUES (?, ?) RETURNING id`,
            [name.toLowerCase(), position],
            (values) => values[0] as number
        );
    
        return result[0];
    }

    async updateCategory(id: number, name: string): Promise<void> {
        await query(
            /*sql*/`UPDATE categories SET name = ? WHERE id = ?`,
            [name.toLowerCase(), id]
        );
    }

    async swapCategories(a: number, b: number): Promise<void> {
        const rows = await query(
            /*sql*/`SELECT id, position FROM categories WHERE id IN (?, ?)`,
            [a, b],
            (values) => {
                return {
                    id: values[0] as number,
                    position: values[1] as number,
                };
            }
        );
    
        if (rows.length != 2) {
            throw new Error(`Expected 2 categories, got ${rows.length}`);
        }
    
        await query(
            /*sql*/`UPDATE categories SET position = ? WHERE id = ?`,
            [rows[1].position, rows[0].id]
        );
        await query(
            /*sql*/`UPDATE categories SET position = ? WHERE id = ?`,
            [rows[0].position, rows[1].id]
        );
    }
}