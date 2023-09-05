<script lang="ts">
import { onMounted } from "vue";
import { useIngredientsStore } from "../stores/ingredients";
import { QuantityUnit, quantityUnitStrings, quantityFromString } from "@/models/IngredientType";
import StringInput from "../components/StringInput.vue";
import ListInput from "../components/ListInput.vue";

export default {
  name: "NewIngredientView",
  data() {
    return {
      ingredient: "",
      quantity: QuantityUnit.Piece.toString(),
      quantities: quantityUnitStrings()
    };
  },
  setup() {
    const store = useIngredientsStore();

    onMounted(() => {
      store.load();
    });

    return {
      store,
    };
  },
  methods: {
    async newIngredient(event: Event) {
      event.preventDefault();
  
      await this.store.addIngredient(this.ingredient, quantityFromString(this.quantity));
      this.$router.push("/ingredients");
    },
  },
  components: {
    StringInput,
    ListInput
  },
};
</script>

<template>
  <form class="ingredients" >
    <h2>New Ingredient</h2>
    <StringInput id="ingredient" name="ingredient" label="Name" v-model="ingredient" error="" />
    <ListInput id="quantity" name="quantity" label="Quantity" :options="quantities" v-model="quantity" />
    <button type="submit" v-on:click="e => newIngredient(e)">Add</button>
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
