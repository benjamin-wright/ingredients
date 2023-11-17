import Category from "@/models/Category";
import IngredientType from "@/models/IngredientType";

class StoredIngredientType {
    public id: number;
    public name: string;
    public category: number;

    constructor(id: number, name: string, category: number) {
        this.id = id;
        this.name = name;
        this.category = category;
    }
}

export class IngredientStorage {
    private db: Promise<IDBDatabase>;

    constructor() {
        this.db = new Promise((resolve, reject) => {
            const request = window.indexedDB.open("ingredients", 1);

            request.onupgradeneeded = (event: any) => {
                const db = event.currentTarget.result;
                if (!db.objectStoreNames.contains("ingredients")) {
                    db.createObjectStore("ingredients", { keyPath: "id", autoIncrement: true });
                }
            }

            request.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            request.onsuccess = (event: any) => resolve(event.target.result);
        });
    }

    clear(): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("ingredients", "readwrite").objectStore("ingredients").clear();

            return new Promise<void>((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    getAll(categories: Category[]): Promise<IngredientType[]> {
        return this.db.then(db => {
            const req = db.transaction("ingredients", "readonly").objectStore("ingredients").getAll() as IDBRequest<StoredIngredientType[]>;

            return new Promise((resolve, reject) => {
                req.onsuccess = (event: any) => {
                    const stored = event.target.result as StoredIngredientType[];
                    const converted = stored.map(s => {
                        const category = categories.find(c => c.id === s.category) as Category;
                        return new IngredientType(s.id, s.name, category);
                    });

                    resolve(converted);
                };
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    addIngredient(ingredient: IngredientType): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("ingredients", "readwrite").objectStore("ingredients").add({
                id: ingredient.id,
                name: ingredient.name,
                category: ingredient.category.id
            });

            return new Promise((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    add(name: string, category: Category): Promise<IngredientType> {
        return this.db.then(db => {
            const req = db.transaction("ingredients", "readwrite").objectStore("ingredients").add({
                name,
                category: category.id
            });

            return new Promise((resolve, reject) => {
                req.onsuccess = (event: any) => resolve(new IngredientType(event.target.result, name, category));
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    put(ingredient: IngredientType): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("ingredients", "readwrite").objectStore("ingredients").put({
                id: ingredient.id,
                name: ingredient.name,
                category: ingredient.category.id
            });

            return new Promise((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    remove(ingredient: IngredientType): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("ingredients", "readwrite").objectStore("ingredients").delete(ingredient.id);

            return new Promise((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        })
    }
}
