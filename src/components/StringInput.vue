<script setup lang="ts">
defineProps<{
  id: string
  name: string
  label: string
  required?: boolean
  multiline?: boolean
  remove?: () => void
}>()

const modelValue = defineModel<string>({ required: true })
</script>

<template>
  <label class="col1" :for="id">{{ label }}:</label>
  <div :class="'grower ' + (remove ? 'col2' : 'col2-3' )" :data-replicated-value="modelValue" v-if="multiline">
    <textarea
      :placeholder="label"
      v-model="modelValue"
      :id="id"
      :name="name || id"
      :required="required"
    ></textarea>
  </div>
  <input
    v-else
    :class="remove ? 'col2' : 'col2-3'"
    :placeholder="label"
    v-model="modelValue"
    type="text"
    :id="id"
    :name="name || id"
    :required="required"
  />
  <button class="delete col3" v-if="remove" @click.prevent="remove()">
    <font-awesome-icon :icon="['fas', 'minus-square']" />
  </button>
</template>

<style scoped>
.grower {
  display: grid;
  flex-grow: 1;
}

.grower::after {
  content: attr(data-replicated-value) " ";
  white-space: pre-wrap;
  visibility: hidden;
}

.grower > textarea {
  resize: none;
  overflow: hidden;
}

.grower > textarea,
.grower::after {
  border: 1px solid black;
  padding: 0.5rem;
  font: inherit;
  grid-area: 1 / 1 / 2 / 2;
}

.row {
  display: flex;
  flex-direction: row;
  gap: 0.5em;
}
</style>