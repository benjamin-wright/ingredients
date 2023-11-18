import IngredientType from "@/models/IngredientType";
import type { QuantityUnit } from "@/models/QuantityUnit";
import ShoppingListItem from "@/models/ShoppingListItem";

export class ShoppingListStorage {
    private db: Promise<IDBDatabase>;

    constructor() {
        this.db = new Promise((resolve, reject) => {
            const request = window.indexedDB.open("shopping-list", 1);

            request.onupgradeneeded = (event: any) => {
                const db = event.currentTarget.result;
                if (!db.objectStoreNames.contains("shopping-list")) {
                    db.createObjectStore("shopping-list", { keyPath: "id", autoIncrement: true });
                }
            }

            request.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            request.onsuccess = (event: any) => resolve(event.target.result);
        });
    }

    clear(): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("shopping-list", "readwrite").objectStore("shopping-list").clear();

            return new Promise<void>((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    getAll(ingredients: IngredientType[]): Promise<ShoppingListItem[]> {
        return this.db.then(db => {
            const req = db.transaction("shopping-list", "readonly").objectStore("shopping-list").getAll() as IDBRequest<ShoppingListItem[]>;

            return new Promise((resolve, reject) => {
                req.onsuccess = (event: any) => {
                    const stored = event.target.result as ShoppingListItem[]; 
                    const converted = stored.map(s => {
                        return new ShoppingListItem(s.id, ingredients.find(ing => ing.id === s.item.id) as IngredientType, s.quantity, s.unit);
                    });
                    resolve(converted);
                };
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    add(item: ShoppingListItem): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("shopping-list", "readwrite").objectStore("shopping-list").add(item);

            return new Promise<void>((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    new(item: IngredientType, quantity: number, unit: QuantityUnit): Promise<ShoppingListItem> {
        return this.db.then(db => {
            const req = db.transaction("shopping-list", "readwrite").objectStore("shopping-list").add({
                item: item.id,
                quantity: quantity,
                unit: unit,
                need: true
            });

            return new Promise((resolve, reject) => {
                req.onsuccess = (event: any) => {
                    resolve(new ShoppingListItem(event.target.result, item, quantity, unit));
                };
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    update(item: ShoppingListItem): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("shopping-list", "readwrite").objectStore("shopping-list").put(item);

            return new Promise<void>((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    delete(item: ShoppingListItem): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("shopping-list", "readwrite").objectStore("shopping-list").delete(item.id);

            return new Promise<void>((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }
}
