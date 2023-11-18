import NonDinnerPlan, { Meal } from "@/models/NonDinnerPlan";
import Recipie from "@/models/Recipie";

type StoredPlan = {
    id: number,
    meal: Meal,
    days: number,
    people: number,
    recipie: number
}

export class NonDinnerPlanStorage {
    private db: Promise<IDBDatabase>;

    constructor() {
        this.db = new Promise((resolve, reject) => {
            const request = window.indexedDB.open("non-dinner-plans", 1);

            request.onupgradeneeded = (event: any) => {
                const db = event.currentTarget.result;
                if (!db.objectStoreNames.contains("non-dinner-plans")) {
                    db.createObjectStore("non-dinner-plans", { keyPath: "id", autoIncrement: true });
                }
            }

            request.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            request.onsuccess = (event: any) => resolve(event.target.result);
        });
    }

    clear(): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("non-dinner-plans", "readwrite").objectStore("non-dinner-plans").clear();

            return new Promise<void>((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    getAll(recipies: Recipie[]): Promise<NonDinnerPlan[]> {
        return this.db.then(db => {
            const req = db.transaction("non-dinner-plans", "readonly").objectStore("non-dinner-plans").getAll() as IDBRequest<StoredPlan[]>;

            return new Promise((resolve, reject) => {
                req.onsuccess = (event: any) => {
                    const stored = event.target.result as StoredPlan[]; 
                    const converted = stored.map(s => {
                        const recipie = recipies.find(r => r.id === s.recipie) as Recipie;
                        return new NonDinnerPlan(s.id, s.meal, s.days, s.people, recipie);
                    });

                    resolve(converted);
                };
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    addPlan(plan: NonDinnerPlan): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("non-dinner-plans", "readwrite").objectStore("non-dinner-plans").add({
                id: plan.id,
                meal: plan.meal,
                days: plan.days,
                people: plan.people,
                recipie: plan.recipie.id
            }) as IDBRequest<number>;

            return new Promise((resolve, reject) => {
                req.onsuccess = () => {
                    resolve();
                };
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    add(meal: Meal, days: number, people: number, recipie: Recipie): Promise<NonDinnerPlan> {
        return this.db.then(db => {
            const req = db.transaction("non-dinner-plans", "readwrite").objectStore("non-dinner-plans").add({
                meal: meal,
                days: days,
                people: people,
                recipie: recipie.id
            }) as IDBRequest<number>;

            return new Promise((resolve, reject) => {
                req.onsuccess = (event: any) => resolve(new NonDinnerPlan(event.target.result, meal, days, people, recipie));
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    remove(plan: NonDinnerPlan): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("non-dinner-plans", "readwrite").objectStore("non-dinner-plans").delete(plan.id);

            return new Promise((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }

    async put(plan: NonDinnerPlan): Promise<void> {
        return this.db.then(db => {
            const req = db.transaction("non-dinner-plans", "readwrite").objectStore("non-dinner-plans").put({
                id: plan.id,
                meal: plan.meal,
                days: plan.days,
                people: plan.people,
                recipie: plan.recipie.id
            });

            return new Promise((resolve, reject) => {
                req.onsuccess = () => resolve();
                req.onerror = (event: any) => reject(new Error("Database error: " + event.target.errorCode));
            });
        });
    }
}
