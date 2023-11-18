import { defineStore } from 'pinia';
import { ShoppingListStorage } from '@/persistence/shopping-list-storage';
import { useIngredientsStore } from './ingredients';
import { useEventsStore, Event } from './events';
import type ShoppingListItem from '@/models/ShoppingListItem';

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