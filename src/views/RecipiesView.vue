<script setup lang="ts">
  import { onMounted } from "vue";
  import { useRouter } from 'vue-router';
  import { useRecipieStore } from "../stores/recipies";
  import { useNewRecipieStore } from "../stores/new-recipie";
  import ObjectList from "../components/ObjectList.vue";
  import NewThing from "@/components/NewThing.vue";
  import type Recipie from "@/models/Recipie";

  const store = useRecipieStore();
  const router = useRouter();

  onMounted(() => {
    store.load();
  });

  async function remove(recipie: Recipie) {
    await store.remove(recipie);
  }

  function edit(recipie: Recipie) {
    const newRecipieStore = useNewRecipieStore();
    newRecipieStore.load(recipie);
    router.push("/recipies/new/name");
  }
</script>

<template>
  <main>
    <template v-if="store.loading">Loading...</template>
    <template v-else-if="store.error">{{ store.error }}</template>
    <template v-else>
      <ObjectList :data="store.recipies" @delete="remove" @edit="edit" dropdown>
        <template #content="content">
          <h2 :title="content.obj.name">{{ content.obj.name }}</h2>
        </template>
        <template #select-dropdown="data">
          <article>
            <p>Ingredients:</p>
            <p v-for="ingredient in data.obj.ingredients" :key="ingredient.ingredient.id">
              - {{ ingredient.toString() }}
            </p>
          </article>
        </template>
      </ObjectList>
      <NewThing to="/recipies/new/name" />
    </template>
  </main>
</template>

<style scoped>
  h2 {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  article {
    padding: 0.5em;
  }
</style>