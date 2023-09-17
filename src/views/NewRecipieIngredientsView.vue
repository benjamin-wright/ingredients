<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { useNewRecipieStore } from "@/stores/new-recipie";
  import { useIngredientsStore } from "@/stores/ingredients";
  import { useRouter } from 'vue-router';
  import IngredientInput from "@/components/IngredientInput.vue";
  import RecipieIngredient from "@/models/RecipieIngredient";
  import { QuantityUnit } from "@/models/QuantityUnit";

  const form = ref<HTMLFormElement | null>(null);
  const router = useRouter();
  const ingredients = useIngredientsStore();
  const store = useNewRecipieStore();

  onMounted(async () => {
    await ingredients.load();
  });

  async function submit() {
    if (!form.value?.checkValidity()) {
      form.value?.reportValidity();
      return;
    }

    router.push("/recipies/new/steps");
  }

  function cancel() {
    router.push("/recipies/new/name");
  }

  function add() {
    store.ingredients.push(new RecipieIngredient(ingredients.ingredients[0], QuantityUnit.Count, 0));
  }
</script>

<template>
  <h1>Ingredients for {{ store.name }}</h1>
  <form class="recipies" ref="form">
    <IngredientInput
      v-for="ingredient, idx in store.ingredients"
      :key="idx"
      id="ingredient-{{ idx }}"
      name="ingredient-{{ id }}"
      v-model="store.ingredients[idx]"
      :ingredients="ingredients.ingredients"
      @delete="store.ingredients.splice(idx, 1)"
    />
    <button @click.prevent="add">+</button>
    <div class="buttons">
      <button type="reset" @click.prevent="cancel">Back</button>
      <button type="submit" @click.prevent="submit">Next</button>
    </div>
  </form>
</template>

<style scoped>
.recipies {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1em;
  justify-content: center;
  flex-grow: 1;
}

.buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 0.5em;
}

</style>
