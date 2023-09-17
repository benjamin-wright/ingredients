import { defineStore } from 'pinia';
import type RecipieIngredient from '@/models/RecipieIngredient';

export const useNewRecipieStore = defineStore('new-recipie', {
    state: () => ({
        loading: true,
        name: '',
        description: '',
        ingredients: [] as RecipieIngredient[],
    }),
    actions: {
        clear() {
            this.name = '';
            this.description = '';
            this.ingredients = [];
        }
    },
    persist: true
})