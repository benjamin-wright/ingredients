<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { useIngredientsStore } from "../stores/ingredients";
  import { useRouter } from 'vue-router';
  import { quantityUnitStrings, quantityFromString } from "@/models/IngredientType";
  import StringInput from "../components/StringInput.vue";
  import ListInput from "../components/ListInput.vue";

  const form = ref<HTMLFormElement | null>(null);
  
  const router = useRouter()
  const quantities = quantityUnitStrings();
  let ingredient = "";
  let quantity = quantities[0];
  
  const store = useIngredientsStore();

  onMounted(() => {
    store.load();
  });

  async function newIngredient() {
    if (!form.value?.checkValidity()) {
      form.value?.reportValidity();
      return;
    }

    await store.addIngredient(ingredient, quantityFromString(quantity));
    router.push("/ingredients");
  }
</script>

<template>
  <form class="ingredients" ref="form">
    <h2>New Ingredient</h2>
    <StringInput id="ingredient" name="ingredient" label="Name" v-model="ingredient" required />
    <ListInput id="quantity" name="quantity" label="Quantity" :options="quantities" v-model="quantity" />
    <button type="submit" @click.prevent="newIngredient">Add</button>
  </form>
</template>

<style scoped>
.ingredients {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1em;
  justify-content: center;
  flex-grow: 1;
}

button {
  padding: 0.5rem;
  background-color: var(--color-text);
  color: var(--color-background);
  border: none;
  border-radius: 0.25rem;
}
</style>
