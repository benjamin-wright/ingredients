import { defineStore } from 'pinia';
import { type Category, addCategory, updateCategory } from '@/database/models/category';

export const useNewCategoryStore = defineStore('new-category', {
    persist: true,
    state: () => ({
        edit: false,
        id: 0,
        name: '',
    }),
    actions: {
        select(category: Category) {
            this.edit = true;
            this.id = category.id;
            this.name = category.name;
        },
        async submit() {
            if (this.edit) {
                await updateCategory(this.id, this.name);
                return this.id;
            } else {
                return await addCategory(this.name);
            }
        },
        clear() {
            this.edit = false;
            this.id = 0;
            this.name = '';
        }
    },
})