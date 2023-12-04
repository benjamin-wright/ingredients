<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { useRouter } from 'vue-router';
  import ObjectList from "../components/ObjectList.vue";
  import NewThing from "@/components/NewThing.vue";
  import { type Recipie, getRecipies, deleteRecipie } from "@/database/models/recipie";
  import { type RecipieIngredient, getRecipieIngredients } from "@/database/models/recipie-ingredient";

  const router = useRouter();
  
  const recipies = ref([] as Recipie[]);
  const ingredients = ref({} as Record<number, RecipieIngredient[]>);
  const loading = ref(true);

  onMounted(async () => {
    recipies.value = await getRecipies();
    loading.value = false;

    for (const recipie of recipies.value) {
      ingredients.value[recipie.id] = await getRecipieIngredients(recipie.id);
    }
  });

  async function remove(recipie: Recipie) {
    await deleteRecipie(recipie.id);
    recipies.value.splice(recipies.value.indexOf(recipie), 1);
  }

  function edit(recipie: Recipie) {
    router.push(`/recipies/${recipie.id}`);
  }
</script>

<template>
  <main>
    <template v-if="loading">Loading...</template>
    <template v-else>
      <h1>Recipies</h1>
      <ObjectList :data="recipies" :get-id="r => r.id" @delete="remove" @edit="edit" dropdown>
        <template #content="{ obj }">
          <h2 :title="obj.name">{{ obj.name }}</h2>
        </template>
        <template #select-dropdown="{ obj }">
          <article class="grid">
            <p class="col1-2">Serves: {{ obj.servings }}</p>
            <p class="col1-2">Ingredients:</p>
            <ul class="col1">
              <li v-for="ingredient in ingredients[obj.id]" :key="ingredient.ingredientId">
              - {{ ingredient.name }}: {{ ingredient.quantity }}{{ ingredient.quantity == 1 ? ingredient.unitSingular : ingredient.unitPlural  }}
              </li>
            </ul>
            <button class="col2" @click.prevent="router.push(`/recipies/${obj.id}/ingredients`)">
              <font-awesome-icon :icon="['fas', 'pencil']" />
            </button>
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

  .grid {
    display: grid;
    grid-template-columns: 1fr auto;
  }

  .col1 {
    grid-column: 1;
  }

  .col1-2 {
    grid-column: 1 / 3;
  }
</style>