import { defineStore } from 'pinia';
import DinnerPlan, { PlanDay } from '../models/DinnerPlan';
import Recipie from '../models/Recipie';
import { DinnerPlanStorage } from '../persistence/dinner-plan-storage';
import { useRecipieStore } from './recipies';
import { useEventsStore, Event } from './events';


const storage = new DinnerPlanStorage();

export const useDinnerPlanStore = defineStore('dinner-plans', {
    state: () => ({
        plans: [] as DinnerPlan[],
        loading: true,
        error: null,
        selected: null as DinnerPlan | null
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
            this.plans.sort(DinnerPlan.Compare);

            this.loading = false;
        },
        async clear() {
            await storage.clear();
            this.plans = [];
            this.loading = false;
            this.error = null;
            this.selected = null;
        },
        select(plan: DinnerPlan) {
            this.selected = plan;
        },
        deselect() {
            this.selected = null;
        },
        async new(day: PlanDay, recipie: Recipie, portions: number) {
            const plan = await storage.add(day, recipie, portions);

            this.plans.push(plan);
            this.plans.sort(DinnerPlan.Compare);
        },
        async add(plan: DinnerPlan) {
            await storage.addPlan(plan);

            this.plans.push(plan);
            this.plans.sort(DinnerPlan.Compare);
        },
        async update(id: number, day: PlanDay, recipie: Recipie, portions: number) {
            await storage.put(new DinnerPlan(id, day, recipie, portions));

            const idx = this.plans.findIndex(r => r.id === id);
            this.plans[idx].day = day;
            this.plans[idx].recipie = recipie;
            this.plans[idx].portions = portions;
            this.plans.sort(DinnerPlan.Compare);
        },
        async remove(plan: DinnerPlan) {
            await storage.remove(plan);
            const idx = this.plans.findIndex(r => r.id === plan.id);
            this.plans.splice(idx, 1);

            const events = useEventsStore();
            events.add(new Event(`Plan "${plan.day}" removed`, async () => {
                await storage.addPlan(plan);
                this.plans.push(plan);
                this.plans.sort(DinnerPlan.Compare);
            }));
        }
    }
});