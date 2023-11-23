import Category from "../models/Category"

export class CategoryStorage {
    private db: Promise<IDBDatabase>;

    constructor() {
        this.db = new Promise((resolve, reject) => {
            const request = window.indexedDB.open("categories", 1);

            request.onupgradeneeded = (event: any) => {
                const db = event.currentTarget.result;
                if (!db.objectStoreNames.contains("categories")) {
                    db.createObjectStore("categories", { keyPath: "id", autoIncrement: true });
                }
            }

            request.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            request.onsuccess = (event: any) => resolve(event.target.result);
        });
    }

    clear(): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("categories", "readwrite").objectStore("categories").clear();

            return new Promise((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    getAll(): Promise<Category[]> {
        return this.db.then(db => {
            const req = db.transaction("categories", "readonly").objectStore("categories").getAll() as IDBRequest<Category[]>;

            return new Promise((resolve, reject) => {
                req.onsuccess = (event: any) => resolve(event.target.result);
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    new(name: string, position: number): Promise<Category> {
        return this.db.then(db => {
            const req = db.transaction("categories", "readwrite").objectStore("categories").add({ name, position });

            return new Promise((resolve, reject) => {
                req.onsuccess = (event: any) => resolve(new Category(event.target.result, position, name));
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    add(category: Category): Promise<Category> {
        return this.db.then(db => {
            const req = db.transaction("categories", "readwrite").objectStore("categories").add({
                id: category.id,
                position: category.position,
                name: category.name
            });

            return new Promise((resolve, reject) => {
                req.onsuccess = () => resolve(category);
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    remove(category: Category): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("categories", "readwrite").objectStore("categories").delete(category.id);

            return new Promise((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    put(category: Category): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("categories", "readwrite").objectStore("categories").put({
                id: category.id,
                position: category.position,
                name: category.name
            });

            return new Promise((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }
}