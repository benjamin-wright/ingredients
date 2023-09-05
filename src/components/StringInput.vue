<script setup lang="ts">
defineProps<{
  id: string
  name: string
  label: string
  required?: boolean
}>()

const modelValue = defineModel<string>({ required: true })
</script>

<template>
  <fieldset>
    <label for="{{ id }}">{{ label }}</label>
    <input
      v-model="modelValue"
      type="text"
      id="{{ id }}"
      name="{{ name || id }}"
      :required="required"
    />
  </fieldset>
</template>

<style scoped>
fieldset {
  display: flex;
  flex-direction: column;
  border-radius: 0.35rem;
}
</style>