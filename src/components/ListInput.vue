<script setup lang="ts">
  defineProps<{
    id: string
    name: string
    label: string
    options: string[]
    required?: boolean
  }>()

  interface Stringable {
    toString(): string
  }

  const modelValue = defineModel<Stringable>({ required: true })
</script>

<template>
  <label class="col1" for="{{ id }}">{{ label }}</label>
  <select class="col2-3" v-model="modelValue" id="{{ id }}" name="{{ name || id }}" :required="required" >
    <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
  </select>
</template>
