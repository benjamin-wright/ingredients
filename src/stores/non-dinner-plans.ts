import { defineStore } from 'pinia';
import NonDinnerPlan, { Meal } from '../models/NonDinnerPlan';
import Recipie from '../models/Recipie';
import { NonDinnerPlanStorage } from '../persistence/non-dinner-plan-storage';
import { useRecipieStore } from './recipies';
import { useEventsStore, Event } from './events';


const storage = new NonDinnerPlanStorage();

export const useNonDinnerPlanStore = defineStore('non-dinner-plans', {
    state: () => ({
        plans: [] as NonDinnerPlan[],
        loading: true,
        error: null,
        selected: null as NonDinnerPlan | null
    }),
    getters: {
        count: (state) => state.plans.length
    },
    actions: {
        async load() {
            if (!this.loading) {
                return;
            }

            const recipies = useRecipieStore();
            await recipies.load();
            this.plans = await storage.getAll(recipies.recipies);
            this.loading = false;
        },
        async clear() {
            await storage.clear();
            this.plans = [];
            this.loading = false;
            this.error = null;
            this.selected = null;
        },
        select(plan: NonDinnerPlan) {
            this.selected = plan;
        },
        deselect() {
            this.selected = null;
        },
        async new(meal: Meal, days: number, people: number, recipie: Recipie) {
            const plan = await storage.add(meal, days, people, recipie);
            this.plans.push(plan);
        },
        async add(plan: NonDinnerPlan) {
            await storage.addPlan(plan);
            this.plans.push(plan);
        },
        async update(id: number, meal: Meal, days: number, people: number, recipie: Recipie) {
            await storage.put(new NonDinnerPlan(id, meal, days, people, recipie));

            const idx = this.plans.findIndex(r => r.id === id);
            this.plans[idx].meal = meal;
            this.plans[idx].days = days;
            this.plans[idx].people = people;
            this.plans[idx].recipie = recipie;
        },
        async remove(plan: NonDinnerPlan) {
            await storage.remove(plan);
            const idx = this.plans.findIndex(r => r.id === plan.id);
            this.plans.splice(idx, 1);

            const events = useEventsStore();
            events.add(new Event(`Plan "${plan.recipie.name}" removed`, async () => {
                await storage.addPlan(plan);
                this.plans.push(plan);
            }));
        }
    }
});