<script setup lang="ts">
  import { useDinnerPlanStore } from '@/stores/dinner-plans';
  import { useNewRecipieStore } from '@/stores/new-recipie';
  import { useRecipieStore } from '@/stores/recipies';
  import { useIngredientsStore } from '@/stores/ingredients';
  import { useCategoriesStore } from '@/stores/categories';
  import { useEventsStore } from '@/stores/events';

  async function clear() {
    await useDinnerPlanStore().clear();
    await useNewRecipieStore().clear();
    await useRecipieStore().clear();
    await useIngredientsStore().clear();
    await useCategoriesStore().clear();
    useEventsStore().clear();
  }
</script>

<template>
  <main>
    <h1>This is the home page</h1>
    <button @click.prevent="clear()">Reset</button>
  </main>
</template>
