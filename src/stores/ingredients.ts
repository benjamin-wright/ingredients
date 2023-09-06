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
            this.ingredients = ingredients.sort(IngredientType.Compare);
            this.loading = false;
        },
        async remove(ingredient: IngredientType) {
            await storage.remove(ingredient)
            const idx = this.ingredients.findIndex(a => a.id === ingredient.id);
            this.ingredients.splice(idx, 1);

            const events = useEventsStore();
            events.add(new RemoveIngredientEvent(ingredient, async () => {
                await storage.addIngredient(ingredient);
                this.ingredients.push(ingredient);
                this.ingredients.sort(IngredientType.Compare);
            }));
        },
        async addIngredient(name: string, quantity: QuantityUnit) {
            const ingredient = await storage.add(name, quantity);
            this.ingredients.push(ingredient);
            this.ingredients.sort(IngredientType.Compare);
        }
    }
})

class RemoveIngredientEvent implements IEvent {
    message: string
    ingredient: IngredientType
    undo: () => Promise<void>

    constructor(ingredient: IngredientType, undo: () => Promise<void>) {
        this.message = `Removed ingredient "${ingredient.name}"`;
        this.ingredient = ingredient;
        this.undo = undo;
    }
}
