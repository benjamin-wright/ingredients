<script setup lang="ts" generic="T">
defineProps<{
  id: string
  name: string
  label: string
  options: T[]
  convert: (value: T) => string
  required?: boolean
}>()

const modelValue = defineModel<T>({ required: true })
</script>

<template>
  <label class="col1" :for="id">{{ label }}</label>
  <select class="col2-3" v-model="modelValue" :id="id" :name="name || id" :required="required" >
    <option v-for="option in options" :key="convert(option)" :value="option">{{ convert(option) }}</option>
  </select>
</template>