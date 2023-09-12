import IngredientType from "@/models/IngredientType";

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

    getAll(): Promise<IngredientType[]> {
        return this.db.then(db => {
            const req = db.transaction("ingredients", "readonly").objectStore("ingredients").getAll() as IDBRequest<IngredientType[]>;

            return new Promise((resolve, reject) => {
                req.onsuccess = (event: any) => resolve(event.target.result);
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    addIngredient(ingredient: IngredientType): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("ingredients", "readwrite").objectStore("ingredients").add({
                id: ingredient.id,
                name: ingredient.name
            });

            return new Promise((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    add(name: string): Promise<IngredientType> {
        return this.db.then(db => {
            const req = db.transaction("ingredients", "readwrite").objectStore("ingredients").add({ name });

            return new Promise((resolve, reject) => {
                req.onsuccess = (event: any) => resolve(new IngredientType(event.target.result, name));
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    put(ingredient: IngredientType): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("ingredients", "readwrite").objectStore("ingredients").put({
                id: ingredient.id,
                name: ingredient.name
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
