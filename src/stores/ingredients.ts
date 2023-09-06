import { defineStore } from 'pinia'
import { IngredientStorage } from '@/persistence/ingredient-storage'
import IngredientType, { QuantityUnit } from '@/models/IngredientType'
import { useEventsStore, type IEvent } from './events';

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
        async remove(ingredient: IngredientType) {
            await storage.remove(ingredient)
            const idx = this.ingredients.findIndex(a => a.id === ingredient.id);
            this.ingredients.splice(idx, 1);

            const events = useEventsStore();
            events.add(new RemoveIngredientEvent(ingredient));
        },
        async addIngredient(name: string, quantity: QuantityUnit) {
            const ingredient = await storage.add(name, quantity);
            this.ingredients.push(ingredient);
        }
    }
})

class RemoveIngredientEvent implements IEvent {
    message: string
    ingredient: IngredientType

    constructor(ingredient: IngredientType) {
        this.message = `Removed ingredient "${ingredient.name}"`;
        this.ingredient = ingredient;
    }

    async undo() {
        await storage.addIngredient(this.ingredient);
    }
}
