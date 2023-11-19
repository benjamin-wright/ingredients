import { defineStore } from 'pinia';
import { CustomItemStorage } from '@/persistence/custom-item-storage';
import CustomListItem from '@/models/CustomListItem';
import { useCategoriesStore } from './categories';
import { useEventsStore, Event } from './events';
import type Category from '@/models/Category';

const storage = new CustomItemStorage();

export const useCustomListStore = defineStore('custom-list', {
    state: () => ({
        items: [] as CustomListItem[],
        loading: true,
        error: null,
        selected: null as CustomListItem | null
    }),
    getters: {
        count: (state) => state.items.length
    },
    actions: {
        async load() {
            if (!this.loading) {
                return;
            }

            const categories = useCategoriesStore();
            await categories.load();

            this.items = await storage.getAll(categories.categories);

            this.loading = false;
        },
        async clear() {
            await storage.clear();
            this.items = [];
            this.loading = false;
            this.error = null;
        },
        async new(name: string, category: Category, need: boolean) {
            const item = await storage.new(name, category, need);
            this.items.push(item);
        },
        async update(item: CustomListItem) {
            await storage.update(item);
            const idx = this.items.findIndex(i => i.id === item.id);
            this.items[idx] = item;
        },
        async add(item: CustomListItem) {
            await storage.add(item);
            this.items.push(item);
        },
        select(item: CustomListItem) {
            this.selected = item;
        },
        deselect() {
            this.selected = null;
        },
        async remove(item: CustomListItem) {
            await storage.remove(item);
            this.items.splice(this.items.indexOf(item), 1);

            const events = useEventsStore();
            await events.add(new Event(`Item: ${item.name} removed`, async () => {
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
            await events.add(new Event(`Item: ${item.name} ${need ? "added" : "removed"}`, async () => {
                item.need = !need;
                await storage.update(item);
            }));
        },
    }
});