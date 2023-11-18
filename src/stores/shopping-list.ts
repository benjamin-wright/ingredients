import { defineStore } from 'pinia';
import { ShoppingListStorage } from '@/persistence/shopping-list-storage';
import { useIngredientsStore } from './ingredients';
import { useDinnerPlanStore } from './dinner-plans';
import { useNonDinnerPlanStore } from './non-dinner-plans';
import { useEventsStore, Event } from './events';
import ShoppingListItem from '@/models/ShoppingListItem';

const storage = new ShoppingListStorage();

export const useShoppingListStore = defineStore('shopping-list', {
    state: () => ({
        items: [] as ShoppingListItem[],
        loading: true,
        error: null
    }),
    getters: {
        count: (state) => state.items.length
    },
    actions: {
        async load() {
            if (!this.loading) {
                return;
            }

            const ingredients = useIngredientsStore();
            await ingredients.load();

            this.items = await storage.getAll(ingredients.ingredients);

            this.loading = false;
        },
        async clear() {
            await storage.clear();
            this.items = [];
            this.loading = false;
            this.error = null;
        },
        async generate() {
            const ingredients = useIngredientsStore();
            await ingredients.load();

            const dinnerPlans = useDinnerPlanStore();
            await dinnerPlans.load();

            for (const plan of dinnerPlans.plans) {
                for (const ingredients of plan.getIngredients()) {
                    const existing = this.items.find(i => i.item.id === ingredients.ingredient.id);
                    if (existing) {
                        existing.quantity += ingredients.quantity;
                        await storage.update(existing);
                    } else {
                        const item = await storage.new(ingredients.ingredient, ingredients.quantity, ingredients.unit);
                        this.items.push(item);
                    }
                }
            }

            const nonDinnerPlans = useNonDinnerPlanStore();
            await nonDinnerPlans.load();

            for (const plan of nonDinnerPlans.plans) {
                for (const ingredients of plan.getIngredients()) {
                    const existing = this.items.find(i => i.item.id === ingredients.ingredient.id);
                    if (existing) {
                        existing.quantity += ingredients.quantity;
                        await storage.update(existing);
                    } else {
                        const item = await storage.new(ingredients.ingredient, ingredients.quantity, ingredients.unit);
                        this.items.push(item);
                    }
                }
            }
        },
        async add(item: ShoppingListItem) {
            await storage.add(item);
            this.items.push(item);
        },
        async remove(item: ShoppingListItem) {
            await storage.delete(item);
            this.items.splice(this.items.indexOf(item), 1);

            const events = useEventsStore();
            await events.add(new Event(`Item: ${item.item.name} removed`, async () => {
                await storage.add(item);
                this.items.push(item);
            }));
        },
        async toggle(id: number, need: boolean) {
            const item = this.items.find(i => i.id === id);
            if (!item) {
                throw new Error("Item not found");
            }

            if (item.need === need) {
                return;
            }

            item.need = need;
            await storage.update(item);

            const events = useEventsStore();
            await events.add(new Event(`Item: ${item.item.name} ${need ? "added" : "removed"}`, async () => {
                item.need = !need;
                await storage.update(item);
            }));
        },
    }
});