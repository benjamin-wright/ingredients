<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useIngredientsStore } from "../stores/ingredients";
import IngredientsList from "../components/IngredientsList.vue";
import type IngredientType from "@/models/IngredientType";

const store = useIngredientsStore();
const ingredients = computed(() => store.ingredients);
const loading = computed(() => store.loading);
const error = computed(() => store.error);

onMounted(() => {
  store.load();
});

async function remove(ingredient: IngredientType) {
  await store.remove(ingredient);
}
</script>

<template>
  <div class="ingredients">
    <h1>Ingredients</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <IngredientsList :ingredients="ingredients" @delete="remove" />
      <RouterLink to="/ingredients/new">Add New</RouterLink>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .ingredients {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
