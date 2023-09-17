<script setup lang="ts">
  import { computed, onMounted } from "vue";
  import { useRecipieStore } from "../stores/recipies";
  import RecipieList from "../components/RecipieList.vue";
  import NewThing from "@/components/NewThing.vue";

  const store = useRecipieStore();

  onMounted(() => {
    store.load();
  });

  const recipies = computed(() => store.recipies);
  const loading = computed(() => store.loading);
  const error = computed(() => store.error);
</script>

<template>
  <div class="recipies">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <RecipieList :recipies="recipies" />
      <NewThing to="/recipies/new/name" />
    </div>
  </div>
</template>

<style scoped>
  .recipies {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    padding-top: 1em;
  }
</style>
