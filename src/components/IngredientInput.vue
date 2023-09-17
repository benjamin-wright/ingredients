<script setup lang="ts">
import type IngredientType from '@/models/IngredientType';
import type RecipieIngredient from '@/models/RecipieIngredient';
import { 
    QuantityUnit,
    VolumeUnit,
    WeightUnit,
    quantityUnitStrings,
    quantityFromString,
    volumeUnitStrings,
    volumeFromString,
    weightUnitStrings,
    weightFromString
} from '@/models/QuantityUnit';

let volumeUnit = VolumeUnit.Milliliter;
let weightUnit = WeightUnit.Gram;

defineProps<{
  id: string
  name: string
  ingredients: IngredientType[]
  required?: boolean
}>()

const emit = defineEmits<{
  (event: "delete"): void
}>()

const modelValue = defineModel<RecipieIngredient>({ required: true });
</script>

<template>
  <fieldset>
    <div class="content">
        <select v-model="modelValue.ingredient" id="{{ id }}" name="{{ name || id }}" :required="required" >
            <option v-for="ingredient in ingredients" :key="ingredient.id" :value="ingredient">{{ ingredient.name }}</option>
        </select>
        <p>by</p>
        <select v-model="modelValue.unit" id="{{ id }}" name="{{ name || id }}" :required="required" >
            <option v-for="unit in quantityUnitStrings()" :key="unit" :value="quantityFromString(unit)">{{ unit }}</option>
        </select>
        <input
            v-model="modelValue.quantity"
            type="number"
            id="{{ id }}"
            name="{{ name || id }}"
            :required="required"
            size="0"
        />
        <select class="skip" v-if="modelValue.unit === QuantityUnit.Volume" v-model="volumeUnit">
            <option v-for="unit in volumeUnitStrings()" :key="unit" :value="volumeFromString(unit)">{{ unit }}</option>
        </select>
        <select class="skip" v-if="modelValue.unit === QuantityUnit.Weight" v-model="weightUnit">
            <option v-for="unit in weightUnitStrings()" :key="unit" :value="weightFromString(unit)">{{ unit }}</option>
        </select>
    </div>
    <button @click.prevent="emit('delete')">-</button>
  </fieldset>
</template>

<style scoped>
fieldset {
  border-radius: 0.35rem;
  display: flex;
  justify-content: space-between;
  gap: 0.5em;
}

.content {
  display: grid;
  gap: 3px;

  grid-template-columns: 1fr auto 1fr;
}

input {
    width: 100%;
}

.skip {
    grid-column: 2 / span 2;
}
</style>