<script setup lang="ts">
import type IngredientType from '@/models/IngredientType';
import type RecipieIngredient from '@/models/RecipieIngredient';
import {
  quantityUnitFromString,
  quantityUnits
} from '@/models/QuantityUnit';

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
    <select v-model="modelValue.ingredient" id="{{ id }}" name="{{ name || id }}" :required="required" >
        <option v-for="ingredient in ingredients" :key="ingredient.id" :value="ingredient">{{ ingredient.name }}</option>
    </select>
    <p>:</p>
    <input
        v-model="modelValue.quantity"
        type="number"
        id="{{ id }}"
        name="{{ name || id }}"
        :required="required"
    />
    <select v-model="modelValue.unit" id="{{ id }}-unit" name="{{ name || id }}" :required="required" >
        <option v-for="unit in quantityUnits()" :key="unit" :value="quantityUnitFromString(unit)">{{ unit }}</option>
    </select>
    <button class="delete" @click.prevent="emit('delete')">
      <font-awesome-icon :icon="['fas', 'minus-square']" />
    </button>
  </fieldset>
</template>

<style scoped>
select {
  background: none;
  border: none;
  width:fit-content;
}

fieldset {
  border-radius: 0.35rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5em;
}

.content {
  display: flex;
  gap: 3px;
}

input {
  flex-grow: 1;
}
</style>