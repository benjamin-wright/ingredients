import type Category from "@/models/Category";
import CustomListItem from "@/models/CustomListItem";

class StoredItem {
    id: number;
    name: string;
    category: number;
    need: boolean;

    constructor(id: number, name: string, category: number, need: boolean) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.need = need;
    }
}

export class CustomItemStorage {
    private db: Promise<IDBDatabase>;

    constructor() {
        this.db = new Promise((resolve, reject) => {
            const request = window.indexedDB.open("custom-items", 1);

            request.onupgradeneeded = (event: any) => {
                const db = event.currentTarget.result;
                if (!db.objectStoreNames.contains("custom-items")) {
                    db.createObjectStore("custom-items", { keyPath: "id", autoIncrement: true });
                }
            }

            request.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            request.onsuccess = (event: any) => resolve(event.target.result);
        });
    }

    clear(): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("custom-items", "readwrite").objectStore("custom-items").clear();

            return new Promise<void>((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    getAll(categories: Category[]): Promise<CustomListItem[]> {
        return this.db.then(db => {
            const req = db.transaction("custom-items", "readonly").objectStore("custom-items").getAll() as IDBRequest<CustomListItem[]>;

            return new Promise((resolve, reject) => {
                req.onsuccess = (event: any) => {
                    const stored = event.target.result as StoredItem[];
                    const converted = stored.map(s => {
                        return new CustomListItem(
                            s.id,
                            s.name,
                            categories.find(c => c.id === s.category)!,
                            s.need
                        );
                    });

                    resolve(converted);
                };
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    add(item: CustomListItem): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("custom-items", "readwrite").objectStore("custom-items").add({
                id: item.id,
                name: item.name,
                category: item.category.id,
                need: item.need
            });

            return new Promise<void>((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    new(name: string, category: Category, need: boolean): Promise<CustomListItem> {
        return this.db.then(db => {
            const req = db.transaction("custom-items", "readwrite").objectStore("custom-items").add({
                name,
                category: category.id,
                need
            }) as IDBRequest<number>;

            return new Promise<CustomListItem>((resolve, reject) => {
                req.onsuccess = (event: any) => {
                    resolve(new CustomListItem(event.target.result, name, category));
                };
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    update(item: CustomListItem): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("custom-items", "readwrite").objectStore("custom-items").put({
                id: item.id,
                name: item.name,
                category: item.category.id,
                need: item.need
            });

            return new Promise<void>((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    remove(item: CustomListItem): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("custom-items", "readwrite").objectStore("custom-items").delete(item.id);

            return new Promise<void>((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }
}