<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { useRouter } from 'vue-router';
  import ObjectList from "../components/ObjectList.vue";
  import NewThing from "@/components/NewThing.vue";
  import { type Recipie, getRecipies, deleteRecipie } from "@/database/models/recipie";
  import { useNewRecipieStore } from "@/stores/new-recipie";

  const store = useNewRecipieStore();
  const router = useRouter();
  
  const recipies = ref([] as Recipie[]);
  const loading = ref(true);

  onMounted(async () => {
    recipies.value = await getRecipies();
    loading.value = false;
  });

  async function remove(recipie: Recipie) {
    await deleteRecipie(recipie.id);
  }

  function edit(recipie: Recipie) {
    store.select(recipie);
    router.push("/recipies/new");
  }
</script>

<template>
  <main>
    <template v-if="loading">Loading...</template>
    <template v-else>
      <h1>Recipies</h1>
      <ObjectList :data="recipies" @delete="remove" @edit="edit" dropdown>
        <template #content="{ obj }">
          <h2 :title="obj.name">{{ obj.name }}</h2>
        </template>
        <template #select-dropdown="{ obj }">
          <article>
            <!-- <p>Ingredients:</p> -->
            <!-- <p v-for="ingredient in obj.ingredients" :key="ingredient.id">
              - {{ ingredient.name }}: {{ ingredient.amount }} {{ ingredient.amount === 1 ? ingredient.unit.singular : ingredient.unit.plural }}
            </p> -->
            <p>Serves: {{ obj.servings }}</p>
          </article>
        </template>
      </ObjectList>
      <NewThing to="/recipies/new" />
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