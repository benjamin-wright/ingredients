import IngredientType, { QuantityUnit } from "@/models/IngredientType";

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

            request.onerror = (event: any) => {
                reject(new Error("Database error: " + event.target.errorCode));
            };

            request.onsuccess = (event: any) => {
                resolve(event.target.result);
            };
        });
    }

    getAll(): Promise<IngredientType[]> {
        return this.db.then(db => {
            const req = db.transaction("ingredients", "readonly").objectStore("ingredients").getAll() as IDBRequest<IngredientType[]>;

            return new Promise((resolve, reject) => {
                req.onsuccess = (event: any) => {
                    resolve(event.target.result);
                };
                req.onerror = (event: any) => {
                    reject(new Error("Database error: " + event.target.errorCode));
                };
            });
        });
    }

    addIngredient(ingredient: IngredientType): Promise<void> {
        console.info(`re-instating ingredient: ${JSON.stringify(ingredient)}`);

        return this.db.then(db => {
            const req = db.transaction("ingredients", "readwrite").objectStore("ingredients").add({
                id: ingredient.id,
                name: ingredient.name,
                quantity: ingredient.quantity
            });

            return new Promise((resolve, reject) => {
                req.onsuccess = (event: any) => {
                    console.info(event.target);
                    resolve();
                };
                req.onerror = (event: any) => {
                    reject(new Error("Database error: " + event.target.errorCode));
                };
            });
        });
    }

    add(name: string, quantity: QuantityUnit ): Promise<IngredientType> {
        return this.db.then(db => {
            const req = db.transaction("ingredients", "readwrite").objectStore("ingredients").add({ name, quantity });

            return new Promise((resolve, reject) => {
                req.onsuccess = (event: any) => {
                    console.info(event.target);
                    resolve(new IngredientType(event.target.result, name, quantity));
                };
                req.onerror = (event: any) => {
                    reject(new Error("Database error: " + event.target.errorCode));
                };
            });
        });
    }

    put(ingredient: IngredientType): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("ingredients", "readwrite").objectStore("ingredients").put(ingredient);

            return new Promise((resolve, reject) => {
                req.onsuccess = () => {
                    resolve();
                };
                req.onerror = (event: any) => {
                    reject(new Error("Database error: " + event.target.errorCode));
                };
            });
        });
    }

    remove(ingredient: IngredientType): Promise<void> {
        console.info(`Removing ingredient ${JSON.stringify(ingredient)}`);
        return this.db.then(db => {
            const req = db.transaction("ingredients", "readwrite").objectStore("ingredients").delete(ingredient.id);

            return new Promise((resolve, reject) => {
                req.onsuccess = () => {
                    console.info(`Success!`);
                    resolve();
                };
                req.onerror = (event: any) => {
                    console.info(`Failure!`);
                    reject(new Error("Database error: " + event.target.errorCode));
                };
            });
        })
    }
}
