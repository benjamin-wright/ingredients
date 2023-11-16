import { defineStore } from 'pinia';
import type RecipieIngredient from '@/models/RecipieIngredient';
import { useRecipieStore } from './recipies';
import type Recipie from '@/models/Recipie';

export const useNewRecipieStore = defineStore('new-recipie', {
    state: () => ({
        loading: true,
        edit: false,
        id: 0,
        name: '',
        description: '',
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
            this.steps = recipie.steps.map((s: string, i: number) => ({content: s, id: i}));
        },
        async submit() {
            const store = useRecipieStore();
            if (this.edit) {
                await store.update(this.id, this.name, this.description, 1, this.ingredients, this.steps.map(s => s.content));
                this.clear();
                return;
            }
            
            await store.new(this.name, this.description, 1, this.ingredients, this.steps.map(s => s.content));
            this.clear();
        },
        clear() {
            this.edit = false;
            this.id = 0;
            this.name = '';
            this.description = '';
            this.ingredients = [];
            this.steps = [];
        }
    },
    persist: true
})