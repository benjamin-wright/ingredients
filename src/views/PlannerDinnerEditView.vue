<script setup lang="ts">
  import { onMounted, computed, ref } from "vue";
  import { useRouter } from 'vue-router';
  import FormTemplate from "@/components/FormTemplate.vue";
  import NumberInput from "../components/NumberInput.vue";
  import ObjectSelect from "../components/ObjectSelect.vue";

  import { idFromPath } from "@/utils/computed";
  import { type Recipie, getRecipies } from "@/database/models/recipie";
  import { type DinnerPlan, Day, getDays, getDinnerPlan, updateDinnerPlan, addDinnerPlan } from "@/database/models/dinner-plans";
  import EnumSelect from "@/components/EnumSelect.vue";

  const router = useRouter();
  const dinnerId = computed(idFromPath(router, "id"));
  const loading = ref(true);
  const recipies = ref([] as Recipie[]);
  const plan = ref({
    id: 0,
    day: Day.Monday,
    recipieId: 0,
    servings: 1,
  } as DinnerPlan);
  const title = `${ dinnerId.value !== null ? "Edit" : "New" } Dinner`

  onMounted(async () => {
    recipies.value = await getRecipies();

    if (dinnerId.value !== null) {
      plan.value = await getDinnerPlan(dinnerId.value);
    } else if (recipies.value.length) {
      plan.value.recipieId = recipies.value[0].id;
    } else {
      plan.value.recipieId = 0;
    }

    loading.value = false;
  });

  async function submit() {
    if (dinnerId.value === null) {
      await addDinnerPlan(plan.value.day, plan.value.recipieId, plan.value.servings);
    } else {
      await updateDinnerPlan(dinnerId.value, plan.value.day, plan.value.recipieId, plan.value.servings);
    }

    router.push("/planner");
  }

  function cancel() {
    router.push("/planner");
  }
</script>

<template>
  <FormTemplate :title="title" @cancel="cancel" @submit="submit" >
    <EnumSelect id="kind" name="kind" label="Kind" :options="getDays()" :convert="(u: Day) => Day[u]" v-model="plan.day" required />
    <ObjectSelect id="recipie" name="recipie" label="Recipie" :options="recipies" :to-value="r => r.id" v-model="plan.recipieId" required>
      <template #default="{ option }">
        <span>{{ option.name }}</span>
      </template>
    </ObjectSelect>
    <NumberInput id="servings" name="servings" label="Servings" v-model="plan.servings" required />
  </FormTemplate>
</template>
