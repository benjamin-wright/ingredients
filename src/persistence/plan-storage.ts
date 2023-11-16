import Plan from "@/models/Plan";
import Recipie from "@/models/Recipie";

type StoredPlan = {
    day: string,
    recipie: number,
    portions: number
}

export class PlanStorage {
    private db: Promise<IDBDatabase>;

    constructor() {
        this.db = new Promise((resolve, reject) => {
            const request = window.indexedDB.open("plans", 1);

            request.onupgradeneeded = (event: any) => {
                const db = event.currentTarget.result;
                if (!db.objectStoreNames.contains("plans")) {
                    db.createObjectStore("plans", { keyPath: "id", autoIncrement: true });
                }
            }

            request.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            request.onsuccess = (event: any) => resolve(event.target.result);
        });
    }

    getAll(recipies: Recipie[]): Promise<Plan[]> {
        return this.db.then(db => {
            const req = db.transaction("plans", "readonly").objectStore("plans").getAll() as IDBRequest<StoredPlan[]>;

            return new Promise((resolve, reject) => {
                req.onsuccess = (event: any) => {
                    const stored = event.target.result as StoredPlan[]; 
                    const converted = stored.map(s => {
                        const recipie = recipies.find(r => r.id === s.recipie) as Recipie;
                        return new Plan(s.id, s.day, recipie, s.portions);
                    });

                    resolve(converted);
                };
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    addPlan(plan: Plan): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("plans", "readwrite").objectStore("plans").add({
                id: plan.id,
                day: plan.day,
                recipie: plan.recipie.id,
                portions: plan.portions
            }) as IDBRequest<number>;

            return new Promise((resolve, reject) => {
                req.onsuccess = () => {
                    resolve();
                };
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    add(day: string, recipie: Recipie, portions: number): Promise<Plan> {
        return this.db.then(db => {
            const req = db.transaction("plans", "readwrite").objectStore("plans").add({
                day: day,
                recipie: recipie.id,
                portions: portions
            }) as IDBRequest<number>;

            return new Promise((resolve, reject) => {
                req.onsuccess = (event: any) => resolve(new Plan(event.target.result, day, recipie, portions));
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    remove(plan: Plan): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("plans", "readwrite").objectStore("plans").delete(plan.id);

            return new Promise((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    async put(plan: Plan): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("plans", "readwrite").objectStore("plans").put({
                id: plan.id,
                day: plan.day,
                recipie: plan.recipie.id,
                portions: plan.portions
            });

            return new Promise((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }
}
