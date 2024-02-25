<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { useRouter } from 'vue-router';
  import FormTemplate from "@/components/FormTemplate.vue";
  import NewThing from "@/components/NewThing.vue";
  import PopUp from "@/components/PopUp.vue";

  import { getRecipie, type Recipie } from "@/database/models/recipie";
  import { getRecipieIngredients, deleteRecipieIngredient, type RecipieIngredient } from "@/database/models/recipie-ingredient";
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
  let toDelete: RecipieIngredient | null = null;
  const popup = ref(false);

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

  function remove(ingredient: RecipieIngredient) {
    toDelete = ingredient;
    popup.value = true;
  }

  function clear() {
    toDelete = null;
    popup.value = false;
  }
  
  async function confirmRemove() {
    if (toDelete) {
      await deleteRecipieIngredient(toDelete.recipieId, toDelete.ingredientId);
      ingredients.value.splice(ingredients.value.indexOf(toDelete), 1);
    }

    clear();
  }
</script>

<template>
  <template v-if="loading">loading...</template>
  <FormTemplate v-else cancelLabel="Back" :title="recipie.name + ' ingredients'" @cancel="back" no-submit>
    <ObjectList
      class="col1-3"
      :data="ingredients"
      :get-id="i => i.ingredientId"
      @edit="obj => router.push(`/recipies/${obj.recipieId}/ingredients/${obj.ingredientId}`)"
      @delete="remove"
    >
      <template #content="{ obj }">
        <h2>{{ obj.name }}: {{ obj.quantity }}{{ obj.quantity == 1 ? obj.unitSingular : obj.unitPlural }}</h2>
      </template>
    </ObjectList>
    <NewThing class="col1-3" :to="`/recipies/${recipieId }/ingredients/new`" />
  </FormTemplate>
  <PopUp
    v-if="popup"
    @cancel="() => clear()"
    @submit="() => confirmRemove()"
    :message="`Are you sure you want to remove ${toDelete?.name}?`"
  />
</template>

<style scoped>
h2 {
  text-transform: capitalize;
}

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