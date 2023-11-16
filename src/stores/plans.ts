import { defineStore } from 'pinia';
import Plan, { PlanDay } from '../models/Plan';
import Recipie from '../models/Recipie';
import { PlanStorage } from '../persistence/plan-storage';
import { useRecipieStore } from './recipies';
import { useEventsStore, Event } from './events';


const storage = new PlanStorage();

export const usePlanStore = defineStore('plans', {
    state: () => ({
        plans: [] as Plan[],
        loading: true,
        error: null,
        selected: null as Plan | null
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
            this.plans.sort(Plan.Compare);

            this.loading = false;
        },
        select(plan: Plan) {
            this.selected = plan;
        },
        deselect() {
            this.selected = null;
        },
        async new(day: PlanDay, recipie: Recipie, portions: number) {
            const plan = await storage.add(day, recipie, portions);

            this.plans.push(plan);
            this.plans.sort(Plan.Compare);
        },
        async add(plan: Plan) {
            await storage.addPlan(plan);

            this.plans.push(plan);
            this.plans.sort(Plan.Compare);
        },
        async update(id: number, day: PlanDay, recipie: Recipie, portions: number) {
            await storage.put(new Plan(id, day, recipie, portions));

            const idx = this.plans.findIndex(r => r.id === id);
            this.plans[idx].day = day;
            this.plans[idx].recipie = recipie;
            this.plans[idx].portions = portions;
            this.plans.sort(Plan.Compare);
        },
        async remove(plan: Plan) {
            await storage.remove(plan);
            const idx = this.plans.findIndex(r => r.id === plan.id);
            this.plans.splice(idx, 1);

            const events = useEventsStore();
            events.add(new Event(`Plan "${plan.day}" removed`, async () => {
                await storage.addPlan(plan);
                this.plans.push(plan);
                this.plans.sort(Plan.Compare);
            }));
        }
    }
});