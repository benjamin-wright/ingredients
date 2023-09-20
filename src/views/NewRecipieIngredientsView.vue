<script setup lang="ts">
  import { onMounted } from "vue";
  import { useNewRecipieStore } from "@/stores/new-recipie";
  import { useIngredientsStore } from "@/stores/ingredients";
  import { useRouter } from 'vue-router';
  import FormTemplate from "@/components/FormTemplate.vue";
  import IngredientInput from "@/components/IngredientInput.vue";
  import RecipieIngredient from "@/models/RecipieIngredient";
  import NewThing from "@/components/NewThing.vue";
  import { QuantityUnit } from "@/models/QuantityUnit";

  const router = useRouter();
  const ingredients = useIngredientsStore();
  const store = useNewRecipieStore();

  const title = `${store.edit ? 'Edit' : 'New'} Recipie Ingredients`;

  onMounted(async () => {
    await ingredients.load();
  });

  async function submit() {
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
  <FormTemplate :title="title" cancelLabel="Back" submitLabel="Next" @cancel="cancel" @submit="submit">
    <TransitionGroup name="list">
      <IngredientInput
        v-for="ingredient, idx in store.ingredients"
        :key="idx"
        id="ingredient-{{ idx }}"
        name="ingredient-{{ id }}"
        v-model="store.ingredients[idx]"
        :ingredients="ingredients.ingredients"
        @delete="store.ingredients.splice(idx, 1)"
      />
    </TransitionGroup>
    <NewThing @click="add" />
  </FormTemplate>
</template>
