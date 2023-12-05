<script setup lang="ts">
  import { onMounted, onUnmounted, computed, ref } from "vue";
  import { useRouter } from 'vue-router';
  import FormTemplate from "@/components/FormTemplate.vue";
  import NumberInput from "../components/NumberInput.vue";
  import ObjectSelect from "../components/ObjectSelect.vue";
  
  import { idFromPath } from "@/utils/computed";
  import { type Recipie } from "@/database/models/recipie";

  const router = useRouter();
  const dinnerId = computed(idFromPath(router, "id"));
  const loading = ref(true);
  const recipied = ref([] as Recipie[]);
  const title = `${ dinnerId.value !== null ? "Edit" : "New" } Dinner`

  onMounted(() => {

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