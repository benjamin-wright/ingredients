<script setup lang="ts">
import { computed } from 'vue';

defineProps<{
  id: string
  name: string
  label: string
  required?: boolean
}>()

const modelValue = defineModel<number>({ required: true, local: true });
const convertedValue = computed({
  get: () => modelValue.value,
  set: (value) => {
    modelValue.value = Number(value);
  },
});

function increment() {
  modelValue.value++;
}

function decrement() {
  modelValue.value--;
}
</script>

<template>
  <label class="col1">{{ label }}:</label>
  <div class="row col2-3">
    <button @click.prevent="decrement()">
      <font-awesome-icon :icon="['fas', 'minus-square']" />
    </button>
    <input
      :placeholder="label"
      v-model="convertedValue"
      type="text"
      inputmode="decimal"
      :id="id"
      :name="name || id"
      :required="required"
    />
    <button @click.prevent="increment()">
      <font-awesome-icon :icon="['fas', 'plus-square']" />
    </button>
  </div>
</template>

<style scoped>
fieldset {
  display: flex;
  flex-direction: column;
  border-radius: 0.35rem;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: inherit 0;
}

.row input {
  flex-grow: 1;
}

.row button {
  background: none;
  border: none;
  color: var(--color-text-ok);
  font-weight: bold;
  width: fit-content;

  text-indent: 1px;
  text-overflow: '';
}

.row button:first-child {
  padding-left: 0;
}

.row button:last-child {
  padding-right: 0;
}
</style>