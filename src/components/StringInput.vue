<script setup lang="ts">
import { ref, onMounted } from 'vue'

const input = ref<HTMLInputElement | null>(null)

const props = defineProps<{
  id: string
  name: string
  label: string
  error: string
  modelValue: string
  validate?: (value: string) => string | null
}>()

const emit = defineEmits<{
  (e: 'input', modelValue: string): void
}>()

function updateValue(event: Event) {
  const target = event.target as HTMLInputElement
  const error = props.validate?(target.value);
  input.value?.setCustomValidity('oops');

  // emit('input', target.value)
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