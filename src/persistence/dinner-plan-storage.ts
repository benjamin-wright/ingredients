import DinnerPlan, { PlanDay } from "@/models/DinnerPlan";
import Recipie from "@/models/Recipie";

type StoredPlan = {
    id: number,
    day: PlanDay,
    recipie: number,
    portions: number
}

export class DinnerPlanStorage {
    private db: Promise<IDBDatabase>;

    constructor() {
        this.db = new Promise((resolve, reject) => {
            const request = window.indexedDB.open("dinner-plans", 1);

            request.onupgradeneeded = (event: any) => {
                const db = event.currentTarget.result;
                if (!db.objectStoreNames.contains("dinner-plans")) {
                    db.createObjectStore("dinner-plans", { keyPath: "id", autoIncrement: true });
                }
            }

            request.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            request.onsuccess = (event: any) => resolve(event.target.result);
        });
    }

    clear(): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("dinner-plans", "readwrite").objectStore("dinner-plans").clear();

            return new Promise<void>((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    getAll(recipies: Recipie[]): Promise<DinnerPlan[]> {
        return this.db.then(db => {
            const req = db.transaction("dinner-plans", "readonly").objectStore("dinner-plans").getAll() as IDBRequest<StoredPlan[]>;

            return new Promise((resolve, reject) => {
                req.onsuccess = (event: any) => {
                    const stored = event.target.result as StoredPlan[]; 
                    const converted = stored.map(s => {
                        const recipie = recipies.find(r => r.id === s.recipie) as Recipie;
                        return new DinnerPlan(s.id, s.day, recipie, s.portions);
                    });

                    resolve(converted);
                };
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    addPlan(plan: DinnerPlan): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("dinner-plans", "readwrite").objectStore("dinner-plans").add({
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

    add(day: PlanDay, recipie: Recipie, portions: number): Promise<DinnerPlan> {
        return this.db.then(db => {
            const req = db.transaction("dinner-plans", "readwrite").objectStore("dinner-plans").add({
                day: day,
                recipie: recipie.id,
                portions: portions
            }) as IDBRequest<number>;

            return new Promise((resolve, reject) => {
                req.onsuccess = (event: any) => resolve(new DinnerPlan(event.target.result, day, recipie, portions));
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    remove(plan: DinnerPlan): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("dinner-plans", "readwrite").objectStore("dinner-plans").delete(plan.id);

            return new Promise((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    async put(plan: DinnerPlan): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("dinner-plans", "readwrite").objectStore("dinner-plans").put({
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
