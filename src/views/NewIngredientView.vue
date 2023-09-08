<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from "vue";
  import { useIngredientsStore } from "../stores/ingredients";
  import { useRouter } from 'vue-router';
  import IngredientType, { quantityUnitStrings, quantityFromString, QuantityUnit } from "@/models/IngredientType";
  import StringInput from "../components/StringInput.vue";
  import ListInput from "../components/ListInput.vue";

  const form = ref<HTMLFormElement | null>(null);
  const router = useRouter();
  const store = useIngredientsStore();
  const selected = store.selected;

  const quantities = quantityUnitStrings();
  let ingredient = selected?.name || "";
  let quantity = selected ? quantities.find(s => s === QuantityUnit[selected.quantity]) || quantities[0] : quantities[0];

  console.info(`quantity: ${quantity}`);
  console.info(`quantity: ${selected?.quantity}`);

  onMounted(() => {
    store.load();
  });

  onUnmounted(() => {
    store.deselect();
  });

  async function newIngredient() {
    if (!form.value?.checkValidity()) {
      form.value?.reportValidity();
      return;
    }

    if (selected) {
      await store.updateIngredient(new IngredientType(
        selected.id,
        ingredient,
        quantityFromString(quantity)
      ));
    } else {
      await store.addIngredient(ingredient, quantityFromString(quantity));
    }
    router.push("/ingredients");
  }

  function cancel() {
    router.push("/ingredients");
  }
</script>

<template>
  <form class="ingredients" ref="form">
    <h2>{{ selected ? "Edit" : "New" }} Ingredient</h2>
    <StringInput id="ingredient" name="ingredient" label="Name" v-model="ingredient" required />
    <ListInput id="quantity" name="quantity" label="Quantity" :options="quantities" v-model="quantity" />
    <div class="buttons">
      <button type="button" @click.prevent="cancel">Cancel</button>
      <button type="submit" @click.prevent="newIngredient">{{ selected ? "Update" : "Add" }}</button>
    </div>
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
  background-color: var(--color-text-ok);
  color: var(--color-background);
  border: none;
  border-radius: 0.25rem;
  font-size: 1em;
}

button[type="button"] {
  background-color: var(--color-text-cancel);
}

.buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 0.5em;
}

</style>
