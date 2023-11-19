<script setup lang="ts">
  import { onMounted, computed, ref } from "vue";
  import { useRouter } from 'vue-router';
  import { useDinnerPlanStore } from "@/stores/dinner-plans";
  import { useNonDinnerPlanStore } from "@/stores/non-dinner-plans";
  import ObjectList from "@/components/ObjectList.vue";
  import NewThing from "@/components/NewThing.vue";
  import DinnerPlan from "@/models/DinnerPlan";
  import NonDinnerPlan from "@/models/NonDinnerPlan";
  import { Meal } from "@/models/NonDinnerPlan";
  import PopUp from "@/components/PopUp.vue";

  const router = useRouter();
  const dinnerStore = useDinnerPlanStore();
  const nonDinnerStore = useNonDinnerPlanStore();

  const breakfasts = computed(() => nonDinnerStore.plans.filter(plan => plan.meal == Meal.Breakfast));
  const lunches = computed(() => nonDinnerStore.plans.filter(plan => plan.meal == Meal.Lunch));
  const popup = ref(false);

  onMounted(() => {
    dinnerStore.load();
    nonDinnerStore.load();
  });

  async function remove(plan: DinnerPlan | NonDinnerPlan) {
    if (plan instanceof DinnerPlan) {
      await dinnerStore.remove(plan as DinnerPlan);
    } else {
      await nonDinnerStore.remove(plan as NonDinnerPlan);
    }
  }

  function edit(plan: DinnerPlan | NonDinnerPlan) {
    if (plan instanceof DinnerPlan) {
      dinnerStore.select(plan as DinnerPlan);
      router.push(`/planner/dinners/new`);
    } else {
      nonDinnerStore.select(plan as NonDinnerPlan);
      router.push(`/planner/${plan.meal == Meal.Breakfast ? "breakfasts" : "lunches"}/new`);
    }
  }

  function reset() {
    popup.value = !popup.value;
    dinnerStore.clear();
    nonDinnerStore.clear();
  }
</script>

<template>
  <main>
    <template v-if="dinnerStore.loading">Loading...</template>
    <template v-else-if="dinnerStore.error">{{ dinnerStore.error }}</template>
    <template v-else>
      <div class="big-window">
        <section>
          <h1>Breakfast</h1>
          <ObjectList :data="breakfasts" @delete="remove" @edit="edit" dropdown>
            <template #content="{ obj }">
              <h2>{{ obj.recipie.name }}</h2>
            </template>
            <template #select-dropdown="{ obj }">
              <article>
                <p>Days: {{ obj.days }}</p>
                <p>People: {{ obj.people }}</p>
              </article>
            </template>
          </ObjectList>
          <NewThing to="/planner/breakfasts/new" />
        </section>
        <section>
          <h1>Lunch</h1>
          <ObjectList :data="lunches" @delete="remove" @edit="edit" dropdown>
            <template #content="{ obj }">
              <h2>{{ obj.recipie.name }}</h2>
            </template>
            <template #select-dropdown="{ obj }">
              <article>
                <p>Days: {{ obj.days }}</p>
                <p>People: {{ obj.people }}</p>
              </article>
            </template>
          </ObjectList>
          <NewThing to="/planner/lunches/new" />
        </section>
        <section>
          <h1>Dinner</h1>
          <ObjectList :data="dinnerStore.plans" @delete="remove" @edit="edit" dropdown>
            <template #content="{ obj }">
              <h2>{{ obj.day }}: {{ obj.recipie.name }}</h2>
            </template>
            <template #select-dropdown="{ obj }">
              <article>
                <p>Portions: {{ obj.portions }}</p>
              </article>
            </template>
          </ObjectList>
          <NewThing to="/planner/dinners/new" />
        </section>
      </div>
      <button type="reset" @click.stop="popup = !popup">Reset</button>
      <PopUp v-if="popup" message="Delete you meal plans?" @submit="reset()" @cancel="popup = !popup" /> 
    </template>
  </main>
</template>

<style scoped>
  h2 {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  article {
    padding: 0.5em;
  }
</style>