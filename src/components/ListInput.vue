<script setup lang="ts">
  defineProps<{
    id: string
    name: string
    label: string
    options: string[]
    required?: boolean
    multiple?: boolean
  }>()

  const modelValue = defineModel<string | string[]>({ required: true })
</script>

<template>
  <fieldset>
    <label for="{{ id }}">{{ label }}</label>
    <select v-model="modelValue" id="{{ id }}" name="{{ name || id }}" :required="required" :multiple="multiple" >
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
