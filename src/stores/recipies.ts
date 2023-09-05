import { defineStore } from 'pinia'
import Recipie from '../models/Recipie'

export const useRecipieStore = defineStore('recipies', {
    state: () => ({
        recipies: [] as Recipie[],
        loading: false,
        error: null
    }),
    getters: {
        recipiesCount: (state) => state.recipies.length
    },
    actions: {
        addRecipie(recipie: Recipie) {
            this.recipies.push(recipie)
        }
    }
})
