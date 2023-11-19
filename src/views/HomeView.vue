<script setup lang="ts">
  import { ref } from 'vue';
  import { useDinnerPlanStore } from '@/stores/dinner-plans';
  import { useNewRecipieStore } from '@/stores/new-recipie';
  import { useRecipieStore } from '@/stores/recipies';
  import { useIngredientsStore } from '@/stores/ingredients';
  import { useCategoriesStore } from '@/stores/categories';
  import { useEventsStore } from '@/stores/events';
  import PopUp from '@/components/PopUp.vue';

  async function clear() {
    await useDinnerPlanStore().clear();
    await useNewRecipieStore().clear();
    await useRecipieStore().clear();
    await useIngredientsStore().clear();
    await useCategoriesStore().clear();
    useEventsStore().clear();
  }

  const popup = ref(false);
</script>

<template>
  <main>
    <h1>This is the home page</h1>
    <button @click.prevent="popup = !popup">Reset</button>
    <PopUp v-if="popup" message="This will delete everything..." @submit="clear()" @cancel="popup = !popup" />
  </main>
</template>
