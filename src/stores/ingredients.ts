import { defineStore } from 'pinia'
import { IngredientStorage } from '@/persistence/ingredient-storage'
import IngredientType, { QuantityUnit } from '@/models/IngredientType'
import { useEventsStore, Event } from './events';

const storage = new IngredientStorage();

export const useIngredientsStore = defineStore('ingredients', {
    state: () => ({
        ingredients: [] as IngredientType[],
        selected: null as IngredientType | null,
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
        select(ingredient: IngredientType) {
            this.selected = ingredient;
        },
        deselect() {
            this.selected = null;
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
        },
        async updateIngredient(ingredient: IngredientType) {
            await storage.put(ingredient);
            const index = this.ingredients.findIndex(i => i.id === ingredient.id);
            this.ingredients[index].name = ingredient.name;
            this.ingredients[index].quantity = ingredient.quantity;
            this.ingredients.sort(IngredientType.Compare);
        }
    }
})

class RemoveIngredientEvent extends Event {
    ingredient: IngredientType

    constructor(ingredient: IngredientType, undo: () => Promise<void>) {
        super(`Removed ingredient: "${ingredient.name}"`, undo);
        this.ingredient = ingredient;
    }
}
