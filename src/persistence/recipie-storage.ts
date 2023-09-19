import type IngredientType from "@/models/IngredientType";
import Recipie from "@/models/Recipie";
import RecipieIngredient from "@/models/RecipieIngredient";

type StoredIngredient = {
    ingredient: number,
    unit: number, 
    quantity: number
}

type StoredRecipie = {
    id: number,
    name: string,
    description: string,
    portions: number,
    ingredients: StoredIngredient[],
    steps: string[]
}

export class RecipieStorage {
    private db: Promise<IDBDatabase>;

    constructor() {
        this.db = new Promise((resolve, reject) => {
            const request = window.indexedDB.open("recipies", 1);

            request.onupgradeneeded = (event: any) => {
                const db = event.currentTarget.result;
                if (!db.objectStoreNames.contains("recipies")) {
                    db.createObjectStore("recipies", { keyPath: "id", autoIncrement: true });
                }
            }

            request.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            request.onsuccess = (event: any) => resolve(event.target.result);
        });
    }

    getAll(ingredients: IngredientType[]): Promise<Recipie[]> {
        return this.db.then(db => {
            const req = db.transaction("recipies", "readonly").objectStore("recipies").getAll() as IDBRequest<StoredRecipie[]>;

            return new Promise((resolve, reject) => {
                req.onsuccess = (event: any) => {
                    const stored = event.target.result as StoredRecipie[]; 
                    const converted = stored.map(s => {
                        const converted: RecipieIngredient[] = s.ingredients.map(i => {
                            return new RecipieIngredient(ingredients.find(ing => ing.id === i.ingredient) as IngredientType, i.unit, i.quantity);
                        });

                        return new Recipie(s.id, s.name, s.description, s.portions, converted, s.steps);
                    });

                    resolve(converted);
                };
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    addRecipie(recipie: Recipie): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("recipies", "readwrite").objectStore("recipies").add({
                id: recipie.id,
                name: recipie.name,
                description: recipie.description,
                portions: recipie.portions,
                ingredients: recipie.ingredients.map(i => ({
                    ingredient: i.ingredient.id,
                    unit: i.unit,
                    quantity: i.quantity
                })),
                steps: [...recipie.steps]
            });

            return new Promise((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    add(name: string, description: string, portions: number, ingredients: RecipieIngredient[], steps: string[]): Promise<Recipie> {
        return this.db.then(db => {
            const req = db.transaction("recipies", "readwrite").objectStore("recipies").add({
                name,
                description,
                portions,
                ingredients: ingredients.map(i => ({
                    ingredient: i.ingredient.id,
                    unit: i.unit,
                    quantity: i.quantity
                })),
                steps
            });

            return new Promise((resolve, reject) => {
                req.onsuccess = (event: any) => resolve(new Recipie(event.target.result, name, description, portions, ingredients, steps));
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    put(recipie: Recipie): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("recipies", "readwrite").objectStore("recipies").put({
                id: recipie.id,
                name: recipie.name,
                description: recipie.description,
                portions: recipie.portions,
                ingredients: recipie.ingredients.map(i => ({
                    ingredient: i.ingredient.id,
                    unit: i.unit,
                    quantity: i.quantity
                })),
                steps: recipie.steps
            });

            return new Promise((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    remove(recipie: Recipie): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("recipies", "readwrite").objectStore("recipies").delete(recipie.id);

            return new Promise((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        })
    }
}
