import { defineStore } from 'pinia';
import type RecipieIngredient from '@/models/RecipieIngredient';
import { useRecipieStore } from './recipies';
import { Event, useEventsStore } from './events';
import type Recipie from '@/models/Recipie';

export const useNewRecipieStore = defineStore('new-recipie', {
    state: () => ({
        loading: true,
        edit: false,
        id: 0,
        name: '',
        description: '',
        portions: 1,
        ingredients: [] as RecipieIngredient[],
        steps: [] as {content: string, id: number}[]
    }),
    actions: {
        load(recipie: Recipie) {
            this.edit = true;
            this.id = recipie.id;
            this.name = recipie.name;
            this.description = recipie.description;
            this.ingredients = recipie.ingredients;
            this.portions = recipie.portions;
            this.steps = recipie.steps.map((s: string, i: number) => ({content: s, id: i}));
        },
        addStep() {
            this.steps.push({content: '', id: this.steps.length});
        },
        removeStep(id: number) {
            const idx = this.steps.findIndex(s => s.id === id);
            const step = this.steps[idx];
            this.steps.splice(idx, 1);

            const events = useEventsStore();
            events.add(new Event(`Removed step ${id + 1}`, async () => {
                this.steps.splice(idx, 0, step);
            }));
        },
        swapStep(a: number, b: number) {
            const step = this.steps[a];
            const other = this.steps[b];
            this.steps[a] = other;
            this.steps[b] = step;
        },
        async submit() {
            const store = useRecipieStore();
            if (this.edit) {
                await store.update(this.id, this.name, this.description, this.portions, this.ingredients, this.steps.map(s => s.content));
                this.clear();
                return;
            }
            
            await store.new(this.name, this.description, this.portions, this.ingredients, this.steps.map(s => s.content));
            this.clear();
        },
        clear() {
            this.edit = false;
            this.portions = 1;
            this.id = 0;
            this.name = '';
            this.description = '';
            this.ingredients = [];
            this.steps = [];
        }
    },
    persist: true
})