<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { useRouter } from 'vue-router';

  import ObjectList from "@/components/ObjectList.vue";
  import NewThing from "@/components/NewThing.vue";
  import PopUp from "@/components/PopUp.vue";

  import { type DinnerPlan, Day, getDinnerPlans, deleteDinnerPlan, clearDinnerPlans } from "@/database/models/dinner-plans";
  import { type NonDinnerPlan, getBreakfastPlans, getLunchPlans, deleteBreakfastPlan, deleteLunchPlan, clearNonDinnerPlans } from "@/database/models/non-dinner-plans";
  import { type ExtraItem, getExtraItems, deleteExtraItem, clearExtraItems } from "@/database/models/extra-items";

  const router = useRouter();

  const popup = ref(false);
  const loading = ref(true);

  const breakfasts = ref([] as NonDinnerPlan[]);
  const lunches = ref([] as NonDinnerPlan[]);
  const dinners = ref([] as DinnerPlan[]);
  const extras = ref([] as ExtraItem[]);

  onMounted(async () => {
    breakfasts.value = await getBreakfastPlans();
    lunches.value = await getLunchPlans();
    dinners.value = await getDinnerPlans();
    extras.value = await getExtraItems();
    loading.value = false;
  });

  async function deletePlan(id: number) {
    await deleteDinnerPlan(id);
    dinners.value = dinners.value.filter(d => d.id !== id);
  }

  async function deleteBreakfast(id: number) {
    await deleteBreakfastPlan(id);
    breakfasts.value = breakfasts.value.filter(d => d.id !== id);
  }

  async function deleteLunch(id: number) {
    await deleteLunchPlan(id);
    lunches.value = lunches.value.filter(d => d.id !== id);
  }

  async function deleteExtra(id: number) {
    await deleteExtraItem(id);
    extras.value = extras.value.filter(d => d.id !== id);
  }

  async function clear() {
    await clearDinnerPlans();
    await clearNonDinnerPlans();
    await clearExtraItems();
    breakfasts.value = [];
    lunches.value = [];
    dinners.value = [];
    extras.value = [];
    popup.value = false;
  }
</script>

<template>
  <main>
    <template v-if="loading">Loading...</template>
    <template v-else>
      <div class="big-window">
        <h1>Meal Plans</h1>
        <section>
          <h1>Breakfast</h1>
          <ObjectList
            :data="breakfasts"
            :get-id="d => d.id"
            @delete="p => deleteBreakfast(p.id)"
            @edit="p => router.push(`/planner/breakfasts/${ p.id }`)"
            dropdown
          >
            <template #content="{ obj }">
              <h2>{{ obj.recipieName }}</h2>
            </template>
            <template #select-dropdown="{ obj }">
              <article>
                <p>Servings: {{ obj.servings }}</p>
              </article>
            </template>
          </ObjectList>
          <NewThing to="/planner/breakfasts/new" />
        </section>
        <section>
          <h1>Lunch</h1>
          <ObjectList
            :data="lunches"
            :get-id="d => d.id"
            @delete="p => deleteLunch(p.id)"
            @edit="p => router.push(`/planner/lunches/${ p.id }`)"
            dropdown
          >
            <template #content="{ obj }">
              <h2>{{ obj.recipieName }}</h2>
            </template>
            <template #select-dropdown="{ obj }">
              <article>
                <p>Servings: {{ obj.servings }}</p>
              </article>
            </template>
          </ObjectList>
          <NewThing to="/planner/lunches/new" />
        </section>
        <section>
          <h1>Dinner</h1>
          <ObjectList
            :data="dinners"
            :get-id="d => d.id"
            @delete="p => deletePlan(p.id)"
            @edit="p => router.push(`/planner/dinners/${ p.id }`)"
            dropdown
          >
            <template #content="{ obj }">
              <h2>{{ Day[obj.day] }}: {{ obj.recipieName }}</h2>
            </template>
            <template #select-dropdown="{ obj }">
              <article>
                <p>Servings: {{ obj.servings }}</p>
              </article>
            </template>
          </ObjectList>
          <NewThing to="/planner/dinners/new" />
        </section>
        <section>
          <h1>Extras</h1>
          <ObjectList
            :data="extras"
            :get-id="e => e.id"
            @delete="e => deleteExtra(e.id)"
            @edit="e => router.push(`/planner/extras/${ e.id }`)"
          >
            <template #content="{ obj }">
              <h2>{{ obj.name }}: {{ obj.quantity }}{{ obj.quantity === 1 ? obj.unitSingular : obj.unitPlural }}</h2>
            </template>
          </ObjectList>
          <NewThing to="/planner/extras/new" />
        </section>
      </div>
      <button type="reset" @click.stop="popup = !popup">Reset</button>
      <PopUp v-if="popup" message="Delete you meal plans?" @submit="clear()" @cancel="popup = !popup" />
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
