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
    <div>
      <select class="big" v-model="modelValue.ingredient" id="{{ id }}" name="{{ name || id }}" :required="required" >
          <option v-for="ingredient in ingredients" :key="ingredient.id" :value="ingredient">{{ ingredient.name }}</option>
      </select>
      <div class="row">
        <input
          v-model="modelValue.quantity"
          type="number"
          pattern="[0-9]*"
          id="{{ id }}"
          name="{{ name || id }}"
          :required="required"
        />
        <select v-model="modelValue.unit" id="{{ id }}-unit" name="{{ name || id }}" :required="required" >
            <option v-for="unit in quantityUnits()" :key="unit" :value="quantityUnitFromString(unit)">{{ unit }}</option>
        </select>
      </div>
    </div>    
    <button class="delete" @click.prevent="emit('delete')">
      <font-awesome-icon :icon="['fas', 'minus-square']" />
    </button>
  </fieldset>
</template>

<style scoped>
select {
  background: none;
  border: none;
  color: var(--color-text-ok);
  font-weight: bold;
  width: fit-content;

  -webkit-appearance: none;
  -moz-appearance: none;
  text-indent: 1px;
  text-overflow: '';
}

select:focus-visible {
  outline: none;
}

fieldset {
  border-radius: 0.35rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5em;
}

.big {
  font-size: 1.5em;
}

.row {
  display: flex;
  flex-direction: row;
  gap: 0.5em;
}

input {
  min-width: 0;
  width: 7em;
}
</style>