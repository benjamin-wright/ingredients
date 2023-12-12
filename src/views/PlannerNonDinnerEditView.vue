<script setup lang="ts">
  import { onMounted, ref, computed } from "vue";
  import { useRouter } from 'vue-router';
  import { idFromPath } from "@/utils/computed";

  import { type NonDinnerPlan, MealType, addBreakfastPlan, addLunchPlan, updateBreakfastPlan, updateLunchPlan, getBreakfastPlan, getLunchPlan } from "@/database/models/non-dinner-plans";
  import { type Recipie, getRecipies } from "@/database/models/recipie";
  
  import FormTemplate from "@/components/FormTemplate.vue";
  import NumberInput from "../components/NumberInput.vue";
  import ObjectSelect from "../components/ObjectSelect.vue";

  const props = defineProps<{
    mealType: "lunch" | "breakfast";
  }>();
  
  const router = useRouter();
  const id = computed(idFromPath(router, "id"));
  const title = `${ id.value !== null ? "Edit" : "New" } ${ props.mealType === "lunch" ? "Lunch" : "Breakfast" }`;

  const recipies = ref([] as Recipie[]);
  const nonDinnerMeal = ref({
    id: 0,
    mealType: props.mealType === "lunch" ? MealType.Lunch : MealType.Breakfast,
    servings: 1,
    recipieId: 0,
    recipieName: ""
  } as NonDinnerPlan);

  const loading = ref(true);

  onMounted(async () => {
    recipies.value = await getRecipies();

    if (id.value !== null) {
      nonDinnerMeal.value = props.mealType === "lunch" ? await getLunchPlan(id.value) : await getBreakfastPlan(id.value);
    } else {
      nonDinnerMeal.value.mealType = props.mealType === "lunch" ? MealType.Lunch : MealType.Breakfast;

      if (recipies.value.length) {
        nonDinnerMeal.value.recipieId = recipies.value[0].id;
      } else {
        nonDinnerMeal.value.recipieId = 0;
      }
    }
    
    loading.value = false;
  });

  async function submit() {
    if (id.value === null) {
      switch (props.mealType) {
        case "lunch":
          await addLunchPlan(nonDinnerMeal.value.servings, nonDinnerMeal.value.recipieId);
          break;
        case "breakfast":
          await addBreakfastPlan(nonDinnerMeal.value.servings, nonDinnerMeal.value.recipieId);
          break;
      }
    } else {
      switch (props.mealType) {
        case "lunch":
          await updateLunchPlan(id.value, nonDinnerMeal.value.servings, nonDinnerMeal.value.recipieId);
          break;
        case "breakfast":
          await updateBreakfastPlan(id.value, nonDinnerMeal.value.servings, nonDinnerMeal.value.recipieId);
          break;
      }
    }

    router.push("/planner");
  }

  function cancel() {
    router.push("/planner");
  }
</script>

<template>
  <template v-if="loading">loading...</template>
  <FormTemplate v-else :title="title" @cancel="cancel" @submit="submit" >
    <ObjectSelect
      id="recipie"
      name="recipie"
      label="Recipie"
      :options="recipies"
      :to-value="r => r.id" v-model="nonDinnerMeal.recipieId"
      required
    >
      <template #default="{ option }">
        <span>{{ option.name }}</span>
      </template>
    </ObjectSelect>
    <NumberInput id="servings" name="servings" label="Servings" v-model="nonDinnerMeal.servings" required />
  </FormTemplate>
</template>