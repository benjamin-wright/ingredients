import { defineStore } from 'pinia';
import { type Unit, UnitType } from '@/models/Unit';

export const useNewUnitStore = defineStore('new-unit', {
    persist: true,
    state: () => ({
        edit: false,
        id: 0,
        name: '',
        type: UnitType.Mass,
        conversion: 1
    }),
    actions: {
        select(unit: Unit) {
            this.edit = true;
            this.id = unit.id;
            this.name = unit.name;
            this.type = unit.type;
            this.conversion = unit.conversion;
        },
        async submit() {
        },
        clear() {
            this.edit = false;
            this.id = 0;
            this.name = '';
            this.type = UnitType.Mass;
            this.conversion = 1;
        }
    },
})