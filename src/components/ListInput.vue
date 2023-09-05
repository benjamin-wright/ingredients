<script setup lang="ts">
  defineProps<{
    id: string
    name: string
    label: string
    options: string[]
    required?: boolean
  }>()

  const modelValue = defineModel<string>({ required: true })
</script>

<template>
  <fieldset>
    <label for="{{ id }}">{{ label }}</label>
    <select v-model="modelValue" type="combo" id="{{ id }}" name="{{ name || id }}" :required="required" >
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