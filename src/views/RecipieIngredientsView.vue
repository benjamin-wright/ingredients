<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { useRouter } from 'vue-router';
  import FormTemplate from "@/components/FormTemplate.vue";
  import NewThing from "@/components/NewThing.vue";

  import { getRecipieIngredients, type RecipieIngredient } from "@/database/models/recipie-ingredient";

  const router = useRouter();
  const recipieId = getId();
  const ingredients = ref([] as RecipieIngredient[]);

  const title = "Recipie Ingredients";

  function getId(): number {
    const id = router.currentRoute.value.params.id;
    if (Array.isArray(id)) {
      return parseInt(id[0]);
    } else {
      return parseInt(id);
    }
  }

  onMounted(async () => {
    ingredients.value = await getRecipieIngredients(recipieId);
  });

  async function submit() {
    router.push(`/recipies/${recipieId}/steps`);
  }

  function cancel() {
    router.push("/recipies");
  }

  function add() {
    store.ingredients.push(new RecipieIngredient(ingredients.ingredients[0], QuantityUnit.Count, 0));
  }
</script>

<template>
  <FormTemplate :title="title" cancelLabel="Back" submitLabel="Next" @cancel="cancel" @submit="submit">
    <TransitionGroup name="list">
      <fieldset v-for="ingredient in ingredients" :key="ingredient.id">
        <div>
          <button @click.prevent="router.push('/ingredients/new?return=' + encodeURIComponent(router.currentRoute.value.fullPath))">
            <font-awesome-icon :icon="['fas', 'plus-square']" />
          </button>
          <select class="big" v-model="store.ingredients[idx].ingredient" id="ingredient-{{ idx }}" name="ingredient-{{ idx }}" required >
            <option v-for="opt in ingredients.ingredients" :key="opt.id" :value="opt">{{ opt.name }}</option>
          </select>
          <div class="row">
            <input
              v-model="store.ingredients[idx].quantity"
              type="number"
              inputmode="decimal"
              id="ingredient-{{ idx }}-count"
              name="ingredient-{{ idx }}-count"
              required
            />
            <select v-model="store.ingredients[idx].unit" id="ingredient-{{ idx }}-unit" name="ingredient-{{ idx }}-unit" required >
                <option v-for="unit in quantityUnits()" :key="unit" :value="quantityUnitFromString(unit)">{{ unit }}</option>
            </select>
          </div>
        </div>    
        <button class="delete" @click.prevent="store.ingredients.splice(idx, 1)">
          <font-awesome-icon :icon="['fas', 'minus-square']" />
        </button>
      </fieldset>
    </TransitionGroup>
    <NewThing @click="add" />
  </FormTemplate>
</template>

<style scoped>
select {
  background: none;
  border: none;
  color: var(--color-text-ok);
  font-weight: bold;
  width: fit-content;

  text-indent: 1px;
  text-overflow: '';
}

select:focus-visible {
  outline: none;
}

fieldset {
  border-radius: 0.35rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5em;
}

.big {
  font-size: 1.5em;
}

.row {
  display: flex;
  flex-direction: row;
  gap: 0.5em;
}

input {
  min-width: 0;
  width: 7em;
}
</style>