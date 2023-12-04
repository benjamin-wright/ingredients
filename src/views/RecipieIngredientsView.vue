<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { useRouter } from 'vue-router';
  import FormTemplate from "@/components/FormTemplate.vue";
  import NewThing from "@/components/NewThing.vue";

  import { getRecipie, type Recipie } from "@/database/models/recipie";
  import { getRecipieIngredients, type RecipieIngredient } from "@/database/models/recipie-ingredient";
  import ObjectList from "@/components/ObjectList.vue";

  const router = useRouter();
  const recipieId = getId();
  const recipie = ref({
    id: recipieId,
    name: "",
    servings: 0,
  } as Recipie);
  const ingredients = ref([] as RecipieIngredient[]);
  const loading = ref(true);

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
    recipie.value = await getRecipie(recipieId);
    loading.value = false;
  });

  function back() {
    router.push("/recipies");
  }
</script>

<template>
  <template v-if="loading">loading...</template>
  <FormTemplate v-else cancelLabel="Back" :title="recipie.name + ' ingredients'" @cancel="back" no-submit>
    <ObjectList class="col1-3" :data="ingredients" :get-id="i => i.ingredientId" @edit="obj => router.push(`/recipies/${obj.recipieId}/ingredients/${obj.ingredientId}`)">
      <template #content="{ obj }">
        <h2>{{ obj.name }}: {{ obj.quantity }}{{ obj.quantity == 1 ? obj.unitSingular : obj.unitPlural }}</h2>
      </template>
    </ObjectList>
    <NewThing class="col1-3" :to="`/recipies/${recipieId }/ingredients/new`" />
  </FormTemplate>
  <!-- <FormTemplate :title="title" cancelLabel="Back" submitLabel="Next" @cancel="cancel" @submit="submit">
    <TransitionGroup class="col1-3" name="list">
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
  </FormTemplate> -->
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