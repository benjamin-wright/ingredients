import { defineStore } from 'pinia'
import Recipie from '../models/Recipie'
import { RecipieStorage } from '../persistence/recipie-storage'
import { useIngredientsStore } from './ingredients'
import { useEventsStore, Event } from './events';
import type RecipieIngredient from '@/models/RecipieIngredient';

const storage = new RecipieStorage();

export const useRecipieStore = defineStore('recipies', {
    state: () => ({
        recipies: [] as Recipie[],
        loading: true,
        error: null,
    }),
    getters: {
        count: (state) => state.recipies.length
    },
    actions: {
        async load() {
            if (!this.loading) {
                return;
            }

            const ingredients = useIngredientsStore();
            await ingredients.load();
            this.recipies = await storage.getAll(ingredients.ingredients);
            this.recipies.sort(Recipie.Compare);

            this.loading = false;
        },
        async new(name: string, description: string, portions: number, ingredients: RecipieIngredient[], steps: string[]) {
            const recipie = await storage.add(name, description, portions, ingredients, steps);

            this.recipies.push(recipie);
            this.recipies.sort(Recipie.Compare);
        },
        async add(recipie: Recipie) {
            await storage.addRecipie(recipie);

            this.recipies.push(recipie);
            this.recipies.sort(Recipie.Compare);
        },
        async update(id: number, name: string, description: string, portions: number, ingredients: RecipieIngredient[], steps: string[]) {
            await storage.put(new Recipie(id, name, description, portions, ingredients, steps));

            const idx = this.recipies.findIndex(r => r.id === id);
            this.recipies[idx].name = name;
            this.recipies[idx].description = description;
            this.recipies[idx].portions = portions;
            this.recipies[idx].ingredients = ingredients;
            this.recipies[idx].steps = steps;
            this.recipies.sort(Recipie.Compare);
        },
        async remove(recipie: Recipie) {
            await storage.remove(recipie);
            const idx = this.recipies.findIndex(r => r.id === recipie.id);
            this.recipies.splice(idx, 1);

            const events = useEventsStore();
            events.add(new Event(`Recipie ${recipie.name} removed`, async () => {
                await storage.addRecipie(recipie);
                this.recipies.push(recipie);
                this.recipies.sort(Recipie.Compare);
            }));
        },
    }
});
