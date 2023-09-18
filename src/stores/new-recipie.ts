import { defineStore } from 'pinia';
import type RecipieIngredient from '@/models/RecipieIngredient';
import { useRecipieStore } from './recipies';

export const useNewRecipieStore = defineStore('new-recipie', {
    state: () => ({
        loading: true,
        name: '',
        description: '',
        ingredients: [] as RecipieIngredient[],
        steps: [] as {content: string, id: number}[]
    }),
    actions: {
        async submit() {
            const store = useRecipieStore();
            await store.newRecipie(this.name, this.description, 1, this.ingredients, this.steps.map(s => s.content));
            this.clear();
        },
        clear() {
            this.name = '';
            this.description = '';
            this.ingredients = [];
            this.steps = [];
        }
    },
    persist: true
})