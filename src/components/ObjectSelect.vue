<script setup lang="ts" generic="T extends IListable">
export interface IListable {
  id: number
}

defineProps<{
  options: T[],
  id: string,
  name: string,
  required?: boolean
}>()

const modelValue = defineModel<T>({ required: true })
</script>

<template>
  <select v-model="modelValue" id="{{ id }}" name="{{ name || id }}" :required="required" >
    <option v-for="option in options" :key="option.id" :value="option">
      <slot :option="option" />
    </option>
  </select>
</template>

<style scoped>
</style>
