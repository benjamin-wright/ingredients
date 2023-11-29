import { defineStore } from 'pinia';
import { type Recipie, addRecipie, updateRecipie } from '@/database/models/recipie';

export const useNewRecipieStore = defineStore('new-recipie', {
    persist: true,
    state: () => ({
        edit: false,
        id: 0,
        name: '',
        description: '',
        servings: 1
    }),
    actions: {
        select(recipie: Recipie) {
            this.edit = true;
            this.id = recipie.id;
            this.name = recipie.name;
            this.servings = recipie.servings;
        },
        async submit(): Promise<number> {
            if (this.edit) {
                await updateRecipie(this.id, this.name, this.description, this.servings);
                return this.id;
            } else {
                return await addRecipie(this.name, this.description, this.servings);
            }
        },
        clear() {
            this.edit = false;
            this.servings = 1;
            this.id = 0;
            this.name = '';
            this.description = '';
        }
    }
})