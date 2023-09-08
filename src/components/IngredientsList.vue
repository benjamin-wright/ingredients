<script setup lang="ts">
import IngredientType from "../models/IngredientType";

defineProps<{
  ingredients: IngredientType[]
}>()

const emit = defineEmits<{
  (event: "delete", ingredient: IngredientType): void
  (event: "edit", ingredient: IngredientType): void
}>()

let selected: HTMLElement | null = null;

function select(event: MouseEvent) {
  selected?.classList.remove("selected");

  const element = event.currentTarget as HTMLElement;
  if (selected == element) {
    selected = null;
    return
  }

  selected = element;
  element.classList.add("selected");
}

function remove(ingredient: IngredientType) {
  emit("delete", ingredient);

  selected?.classList.remove("selected");
  selected = null;
}

function edit(ingredient: IngredientType) {
  emit("edit", ingredient)

  selected?.classList.remove("selected");
  selected = null;
}
</script>

<template>
<div class="ingredient-list">
  <div @click="select($event)" class="ingredient" v-for="ingredient in ingredients" :key="ingredient.id">
    <h2>{{ ingredient.name }}</h2>
    <div class="buttons">
      <button @click.stop="edit(ingredient)">
        ✎
      </button>
      <button @click.stop="remove(ingredient)">
        🗑
      </button>
    </div>
  </div>
</div>
</template>

<style scoped>
  .ingredient {
    margin: 0.2em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
  }

  button {
    display: none;
    border: none;
    background: none;
    color: yellow;
    padding: 0.5em;
  }

  button:hover {
    background: var(--color-background-soft);
  }

  .selected {
    background: var(--color-background-mute);
  }

  .selected button {
    display: inline;
  }
</style>
