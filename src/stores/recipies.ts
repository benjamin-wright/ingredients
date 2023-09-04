import { defineStore } from 'pinia'
import Recipie from '../model/Recipie'

export const useCounterStore = defineStore('counter', {
    state: () => ({
        recipies: [] as Recipie[]
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
