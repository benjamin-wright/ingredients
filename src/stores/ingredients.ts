import { defineStore } from 'pinia'
import { IngredientStorage } from '@/persistence/ingredient-storage'
import IngredientType, { QuantityUnit } from '@/models/IngredientType'

const storage = new IngredientStorage();

export const useIngredientsStore = defineStore('ingredients', {
    state: () => ({
        ingredients: [] as IngredientType[],
        loading: true,
        error: null as Error | null
    }),
    getters: {
        ingredientsCount: (state) => state.ingredients.length
    },
    actions: {
        async load() {
            if (!this.loading) {
                return;
            }

            const ingredients = await storage.getAll();
            this.ingredients = ingredients;
            this.loading = false;
        },
        async addIngredient(name: string, quantity: QuantityUnit) {
            const ingredient = await storage.add(name, quantity);
            this.ingredients.push(ingredient);
        }
    }
})
