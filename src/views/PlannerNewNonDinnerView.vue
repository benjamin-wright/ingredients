<script setup lang="ts">
  import { onMounted, onUnmounted } from "vue";
  import { useNonDinnerPlanStore } from "../stores/non-dinner-plans";
  import { useRecipieStore } from "../stores/recipies";
  import { useRouter, useRoute } from 'vue-router';
  import { Meal } from "@/models/NonDinnerPlan";
  import FormTemplate from "@/components/FormTemplate.vue";
  import NumberInput from "../components/NumberInput.vue";
  import ObjectSelect from "../components/ObjectSelect.vue";

  const router = useRouter();
  const route = useRoute();
  const store = useNonDinnerPlanStore();
  const recipies = useRecipieStore();
  const selected = store.selected;

  let days = selected?.days || 1;
  let people = selected?.people || 1;
  let recipie = selected?.recipie || recipies.recipies[0];
  const meal = route.params.meal === "lunches" ? Meal.Lunch : Meal.Breakfast;
  const title = `${ selected ? "Edit" : "New" } ${ meal === Meal.Lunch ? "Lunch" : "Breakfast" }`

  onMounted(() => {
    store.load();
  });

  onUnmounted(() => {
    store.deselect();
  });

  async function submit() {
    if (selected) {
      await store.update(selected.id, selected.meal, days, people, recipie);
    } else {
      await store.new(meal, days, people, recipie);
    }
    router.push("/planner");
  }

  function cancel() {
    router.push("/planner");
  }
</script>

<template>
  <FormTemplate :title="title" @cancel="cancel" @submit="submit" >
    <NumberInput id="days" name="days" label="days" v-model="days" required />
    <NumberInput id="people" name="people" label="people" v-model="people" required />
    <ObjectSelect id="recipie" name="recipie" label="Recipie" :options="recipies.recipies" v-model="recipie" required>
      <template #default="{ option }">
        <span>{{ option.name }}</span>
      </template>
    </ObjectSelect> 
  </FormTemplate>
</template>