<script setup lang="ts">
  import { onMounted } from "vue";
  import { useRouter } from 'vue-router';
  import { useIngredientsStore } from "../stores/ingredients";
  import ObjectList from "../components/ObjectList.vue";
  import NewThing from "@/components/NewThing.vue";
  import type IngredientType from "@/models/IngredientType";

  const router = useRouter();
  const store = useIngredientsStore();

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
  <main>
    <template v-if="store.loading">Loading...</template>
    <template v-else-if="store.error">{{ store.error }}</template>
    <template v-else>
      <ObjectList :data="store.ingredients" @delete="remove" @edit="edit" v-slot="slotProps">
        <h2>{{ slotProps.obj.name }}</h2>
      </ObjectList>
      <NewThing to="/ingredients/new" />
    </template>
  </main>
</template>
