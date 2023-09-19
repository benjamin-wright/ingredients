<script setup lang="ts">
defineProps<{
  id: string
  name: string
  label?: string
  required?: boolean
  multiline?: boolean
  remove?: () => void
}>()

const modelValue = defineModel<string>({ required: true })
</script>

<template>
  <fieldset>
    <label v-if="label" for="{{ id }}">{{ label }}</label>
    <div class="row">
      <div class="grower" v-if="multiline">
        <textarea
          v-model="modelValue"
          id="{{ id }}"
          name="{{ name || id }}"
          :required="required"
          oninput="this.parentNode.dataset.replicatedValue = this.value"
        ></textarea>
      </div>
      <input
        v-else
        v-model="modelValue"
        type="text"
        id="{{ id }}"
        name="{{ name || id }}"
        :required="required"
      />
      <button class="delete" v-if="remove" @click.prevent="remove()">
        <font-awesome-icon :icon="['fas', 'minus-square']" />
      </button>
    </div>
  </fieldset>
</template>

<style scoped>
fieldset {
  display: flex;
  flex-direction: column;
  border-radius: 0.35rem;
}

.grower {
  display: grid;
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

.row *:first-child {
  flex-grow: 1;
}
</style>