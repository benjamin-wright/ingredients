<script lang="ts">
import { computed, onMounted } from "vue";
import { useIngredientsStore } from "../stores/ingredients";
import { QuantityUnit } from "@/models/IngredientType";
import IngredientsList from "../components/IngredientsList.vue";

export default {
  name: "IngredientTypesView",
  setup() {
    const store = useIngredientsStore();
    
    const ingredients = computed(() => store.ingredients);
    const loading = computed(() => store.loading);
    const error = computed(() => store.error);

    onMounted(() => {
      store.load();
    });

    return {
      store,
      ingredients,
      loading,
      error,
    };
  },
  methods: {
    newIngredientType() {
      this.store.addIngredient("New IngredientType", QuantityUnit.Piece);
    },
  },
  components: {
    IngredientsList,
  },
};
</script>

<template>
  <div class="ingredients">
    <h1>This is the ingredients page</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <IngredientsList :ingredients="store.ingredients" />
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
