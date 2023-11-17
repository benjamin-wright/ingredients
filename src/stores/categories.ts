import { defineStore } from 'pinia'
import { CategoryStorage } from '@/persistence/category-storage'
import Category from '@/models/Category'
import { useEventsStore, Event } from './events';

const storage = new CategoryStorage();

export const useCategoriesStore = defineStore('categories', {
    state: () => ({
        categories: [] as Category[],
        loading: true,
        error: null as Error | null,
        selected: null as Category | null
    }),
    getters: {
        count: (state) => state.categories.length
    },
    actions: {
        async load() {
            if (!this.loading) {
                return;
            }

            const categories = await storage.getAll();
            this.categories = categories.sort(Category.Compare);
            this.loading = false;
        },
        select(category: Category) {
            this.selected = category;
        },
        deselect() {
            this.selected = null;
        },
        sort() {
            this.categories.sort(Category.Compare);
            this.categories.forEach((_, idx) => this.categories[idx].position = idx);
        },
        async clear() {
            await storage.clear();
            const defaultCategory = await storage.new('None', 0);
            this.categories = [defaultCategory];
            this.loading = false;
        },
        async remove(category: Category) {
            await storage.remove(category)
            const idx = this.categories.findIndex(a => a.id === category.id);
            this.categories.splice(idx, 1);

            const events = useEventsStore();
            events.add(new Event(`Removed category: "${category.name}"`, async () => {
                await storage.add(category);
                this.categories.push(category);
                this.sort();
            }));
        },
        async add(name: string) {
            const category = await storage.new(name, this.categories.length);
            this.categories.push(category);
            this.sort();
        },
        async update(category: Category) {
            await storage.put(category);
            const index = this.categories.findIndex(i => i.id === category.id);
            this.categories[index].name = category.name;
            this.sort();
        }
    }
});