<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { useRouter } from 'vue-router';
  import { useNewIngredientStore } from "../stores/new-ingredient";
  import { type Ingredient, getIngredients, deleteIngredient } from "@/database/models/ingredient";
  import ObjectList from "../components/ObjectList.vue";
  import NewThing from "@/components/NewThing.vue";

  const router = useRouter();
  const store = useNewIngredientStore();

  const loading = ref(true);
  const ingredients = ref([] as Ingredient[]);

  onMounted(async () => {
    ingredients.value = await getIngredients();
    loading.value = false;
  });

  async function remove(ingredient: Ingredient) {
    await deleteIngredient(ingredient.id);
    ingredients.value.splice(ingredients.value.indexOf(ingredient), 1);
  }

  function edit(ingredient: Ingredient) {
    store.select(ingredient);
    router.push("/ingredients/new");
  }
</script>

<template>
  <main>
    <template v-if="loading">Loading...</template>
    <template v-else>
      <h1>Ingredients</h1>
      <ObjectList :data="ingredients" :get-id="i => i.id" @delete="remove" @edit="edit">
        <template #content="content">
          <h2>{{ content.obj.name }}</h2>
        </template>
      </ObjectList>
      <NewThing to="/ingredients/new" />
    </template>
  </main>
</template>

<style scoped>
  h2 {
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>