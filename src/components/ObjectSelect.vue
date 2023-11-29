<script setup lang="ts" generic="T extends IListable, U">
export interface IListable {
  id: number
}

defineProps<{
  options: T[],
  id: string,
  name: string,
  required?: boolean,
  label?: string,
  add?: boolean
  toValue?: (option: T) => U
}>()

const emits = defineEmits(['new']);

const modelValue = defineModel<U>({ required: true })
</script>

<template>
  <label class="col1" v-if="label" :for="id">{{ label }}:</label>
  <select :class="add ? 'col2' : 'col2-3'" v-model="modelValue" :id="id" :name="name || id" :required="required" >
    <option v-for="option in options" :key="option.id" :value="toValue ? toValue(option) : option">
      <slot :option="option" />
    </option>
  </select>
  <button class="col3" v-if="add"  @click.prevent="emits('new')">
    <font-awesome-icon :icon="['fas', 'plus-square']" />
  </button>
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

button {
  padding-right: 0;
}
</style>
