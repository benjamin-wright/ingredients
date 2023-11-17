<script setup lang="ts" generic="T extends IListable">
export interface IListable {
  id: number
}

defineProps<{
  options: T[],
  id: string,
  name: string,
  required?: boolean,
  label?: string
}>()

const modelValue = defineModel<T>({ required: true })
</script>

<template>
  <div class="row">
    <label v-if="label" :for="id">{{ label }}:</label>
    <select v-model="modelValue" id="{{ id }}" name="{{ name || id }}" :required="required" >
      <option v-for="option in options" :key="option.id" :value="option">
        <slot :option="option" />
      </option>
    </select>  
  </div>
</template>

<style scoped>
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5em;
}

.row select {
  flex-grow: 1;
}
</style>
