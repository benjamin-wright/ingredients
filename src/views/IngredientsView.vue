<script setup lang="ts">
  import { computed, onMounted } from "vue";
  import { useRouter } from 'vue-router';
  import { useIngredientsStore } from "../stores/ingredients";
  import IngredientsList from "../components/IngredientsList.vue";
  import NewThing from "@/components/NewThing.vue";
  import type IngredientType from "@/models/IngredientType";

  const router = useRouter();
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

  function edit(ingredient: IngredientType) {
    store.select(ingredient);
    router.push("/ingredients/new");
  }
</script>

<template>
  <div class="ingredients">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <template v-else>
      <IngredientsList :ingredients="ingredients" @delete="remove" @edit="edit" />
      <NewThing to="/ingredients/new" />
    </template>
  </div>
</template>

<style>
  .ingredients {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    padding-top: 1em;
  }
</style>
