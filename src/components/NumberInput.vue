<script setup lang="ts">

defineProps<{
  id: string
  name: string
  label: string
  required?: boolean
}>()

const modelValue = defineModel<number>({ required: true, local: true })

function increment() {
  modelValue.value++;
}

function decrement() {
  modelValue.value--;
}
</script>

<template>
  <fieldset>
    <div class="row">
      <label>{{ label }}:</label>
      <button @click.prevent="decrement()">
        <font-awesome-icon :icon="['fas', 'minus-square']" />
      </button>
      <input
        :placeholder="label"
        v-model="modelValue"
        type="number"
        pattern="[0-9]*"
        id="{{ id }}"
        name="{{ name || id }}"
        :required="required"
      />
      <button @click.prevent="increment()">
        <font-awesome-icon :icon="['fas', 'plus-square']" />
      </button>
    </div>
  </fieldset>
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
</style>