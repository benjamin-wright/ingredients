import { defineStore } from 'pinia';
import { type Ingredient, updateIngredient, addIngredient } from '@/database/models/ingredient';

export const useNewIngredientStore = defineStore('new-ingredient', {
    persist: true,
    state: () => ({
        edit: false,
        id: 0,
        name: '',
        categoryId: 0,
    }),
    actions: {
        select(ingredient: Ingredient) {
            this.edit = true;
            this.id = ingredient.id;
            this.name = ingredient.name;
            this.categoryId = ingredient.categoryId;
        },
        async submit() {
            if (this.edit) {
                await updateIngredient(this.id, this.name, this.categoryId);
                return this.id;
            } else {
                return await addIngredient(this.name, this.categoryId);
            }
        },
        clear() {
            this.edit = false;
            this.id = 0;
            this.name = '';
            this.categoryId = 0;
        }
    },
})