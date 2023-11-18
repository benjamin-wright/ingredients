<script setup lang="ts">
  import { onMounted, onUnmounted } from "vue";
  import { useDinnerPlanStore } from "../stores/dinner-plans";
  import { useRecipieStore } from "../stores/recipies";
  import { useRouter } from 'vue-router';
  import { PlanDay } from "@/models/DinnerPlan";
  import FormTemplate from "@/components/FormTemplate.vue";
  import NumberInput from "../components/NumberInput.vue";
  import ObjectSelect from "../components/ObjectSelect.vue";

  const router = useRouter();
  const store = useDinnerPlanStore();
  const recipies = useRecipieStore();
  const selected = store.selected;

  let day = selected?.day || PlanDay.Monday;
  let portions = selected?.portions || 1;
  let recipie = selected?.recipie || recipies.recipies[0];
  const title = `${ selected ? "Edit" : "New" } Plan Day`

  onMounted(() => {
    store.load();
  });

  onUnmounted(() => {
    store.deselect();
  });

  async function submit() {
    if (selected) {
      await store.update(selected.id, day, recipie, portions);
    } else {
      await store.new(day, recipie, portions);
    }
    router.push("/planner");
  }

  function cancel() {
    router.push("/planner");
  }
</script>

<template>
  <FormTemplate :title="title" @cancel="cancel" @submit="submit" >
    <select
      id="day"
      name="day"
      v-model="day"
      required
    >
      <option v-for="day in Object.values(PlanDay)" :key="day" :value="day">
        {{ day }}
      </option>
    </select>
    <ObjectSelect id="recipie" name="recipie" label="Recipie" :options="recipies.recipies" v-model="recipie" required>
      <template #default="{ option }">
        <span>{{ option.name }}</span>
      </template>
    </ObjectSelect> 
    <NumberInput id="portions" name="portions" label="Portions" v-model="portions" required />
  </FormTemplate>
</template>
@/models/DinnerPlan