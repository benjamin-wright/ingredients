import { defineStore } from 'pinia';
import { type Unit, UnitKind, addUnit, updateUnit } from '@/database/models/unit';

export const useNewUnitStore = defineStore('new-unit', {
    persist: true,
    state: () => ({
        edit: false,
        id: 0,
        name: '',
        singular: '',
        plural: '',
        kind: UnitKind.Mass,
        conversion: 1
    }),
    actions: {
        select(unit: Unit) {
            this.edit = true;
            this.id = unit.id;
            this.name = unit.name;
            this.singular = unit.singular;
            this.plural = unit.plural;
            this.kind = unit.kind;
            this.conversion = unit.conversion;
        },
        async submit() {
            if (this.edit) {
                await updateUnit(this.id, this.name, this.singular, this.plural, this.kind, this.conversion);
                return this.id;
            } else {
                return await addUnit(this.name, this.singular, this.plural, this.kind, this.conversion);
            }
        },
        clear() {
            this.edit = false;
            this.id = 0;
            this.name = '';
            this.singular = '';
            this.plural = '';
            this.kind = UnitKind.Mass;
            this.conversion = 1;
        }
    },
})