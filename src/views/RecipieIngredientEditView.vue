<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { Navigator } from "@/utils/navigator";
  import { type Ingredient, getIngredients } from '@/database/models/ingredient';
  import { type Unit, getUnits } from '@/database/models/unit';
  import { type Recipie, getRecipie } from '@/database/models/recipie';
  import { type RecipieIngredient, getRecipieIngredient, updateRecipieIngredient, addRecipieIngredient, deleteRecipieIngredient } from '@/database/models/recipie-ingredient';
  import { idFromPath } from '@/utils/computed';
  import FormTemplate from '@/components/FormTemplate.vue';
  import NumberInput from '@/components/NumberInput.vue';
  import ObjectSelect from '@/components/ObjectSelect.vue';

  const router = useRouter();
  const navigator = new Navigator({
    router,
    default: "/recipies/" + router.currentRoute.value.params.recipieId + "/ingredients",
  });

  const loading = ref(true);
  const recipieId = computed(idFromPath(router, "recipieId"));
  const recipie = ref({
    id: 0,
    name: "",
    servings: 0,
  } as Recipie);
  const ingredientId = computed(idFromPath(router, "ingredientId"));
  const ingredients = ref([] as Ingredient[]);
  const units = ref([] as Unit[]);

  const ingredient = ref({
    recipieId: recipieId.value,
    ingredientId: 0,
    name: "",
    quantity: 0,
    unitId: 0,
  } as RecipieIngredient);

  onMounted(async () => {
    ingredients.value = await getIngredients();
    units.value = await getUnits();

    if (recipieId.value !== null) {
      recipie.value = await getRecipie(recipieId.value);
    } else {
      throw new Error("recipieId is null");
    }

    if (ingredientId.value !== null) {
      ingredient.value = await getRecipieIngredient(recipie.value.id, ingredientId.value);
    } else {
      if (ingredients.value.length) {
        ingredient.value.ingredientId |= ingredients.value[0].id;
      }
      if (units.value.length) {
        ingredient.value.unitId |= units.value[0].id;
      }
    }

    loading.value = false;
  });

  async function submit() {
    if (recipieId.value === null) {
      throw new Error("recipieId is null");
    }

    let id: number;
    if (ingredientId.value !== null) {
      if (ingredientId.value !== ingredient.value.ingredientId) {
        await deleteRecipieIngredient(recipieId.value, ingredientId.value);
        id = await addRecipieIngredient(recipieId.value, ingredient.value.ingredientId, ingredient.value.quantity, ingredient.value.unitId);
      } else {
        await updateRecipieIngredient(recipieId.value, ingredient.value.ingredientId, ingredient.value.quantity, ingredient.value.unitId);
        id = ingredientId.value;
      }
    } else {
      id = await addRecipieIngredient(recipieId.value, ingredient.value.ingredientId, ingredient.value.quantity, ingredient.value.unitId);
    }
    navigator.navigate({
      "ingredient": id.toString(),
    });
  }
</script>

<template>
  <template v-if="loading">Loading...</template>
  <FormTemplate
    v-else
    :title="`${ingredientId !== null ? 'Edit' : 'New'} ${recipie.name} Ingredient`"
    :cancel-label="navigator.isReturner ? 'Return' : undefined"
    @cancel="() => navigator.navigate()"
    @submit="submit"
  >
    <ObjectSelect
      id="ingredient"
      name="ingredient"
      label="Ingredient"
      :options="ingredients"
      :to-value="i => i.id"
      v-model="ingredient.ingredientId"
      add
      @new="() => navigator.navigateAndReturn('/ingredients/new')"
      required
    >
      <template #default="{ option }">
        <span>{{ option.name }}</span>
      </template>
    </ObjectSelect>
    <NumberInput id="quantity" name="quantity" label="Quantity" v-model="ingredient.quantity" required />
    <ObjectSelect
      id="unit"
      name="unit"
      label="Unit"
      :options="units"
      :to-value="u => u.id"
      v-model="ingredient.unitId"
      add
      @new="() => navigator.navigateAndReturn('/units/new')"
      required
    >
      <template #default="{ option }">
        <span>{{ option.name }}</span>
      </template>
    </ObjectSelect>
  </FormTemplate>
</template>