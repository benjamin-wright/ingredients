<script setup lang="ts">
import { ref } from 'vue'

const input = ref<HTMLInputElement | null>(null)

const props = defineProps<{
  id: string
  name: string
  label: string
  modelValue: string
  validate?: (value: string) => string
}>()

const emit = defineEmits<{
  (e: 'input', modelValue: string): void
}>()

function updateValue(event: Event) {
  const target = event.target as HTMLInputElement
  const error = props.validate ? props.validate(target.value) : "";
  input.value?.setCustomValidity(error);
  
  emit('input', target.value)
}
</script>

<template>
  <fieldset>
    <label for="{{ id }}">{{ label }}</label>
    <input ref="input" v-bind:value="modelValue" v-on:input="updateValue($event)" type="text" id="{{ id }}" name="{{ name || id }}" />
  </fieldset>
</template>

<style scoped>
fieldset {
  display: flex;
  flex-direction: column;
  border-radius: 0.35rem;
}
</style>