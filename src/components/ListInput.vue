<script setup lang="ts">
defineProps<{
  id: string
  name: string
  label: string
  options: string[]
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'input', modelValue: string): void
}>()

function updateValue(event: Event) {
  const target = event.target as HTMLInputElement
  emit('input', target.value)
}
</script>

<template>
  <fieldset>
    <label for="{{ id }}">{{ label }}</label>
    <select v-bind:value="modelValue" v-on:change="updateValue($event)" type="combo" id="{{ id }}" name="{{ name || id }}" >
      <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
    </select>
  </fieldset>
</template>

<style scoped>
fieldset {
  display: flex;
  flex-direction: column;
  border-radius: 0.35rem;
}
</style>