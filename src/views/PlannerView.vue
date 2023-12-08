<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { useRouter } from 'vue-router';

  import ObjectList from "@/components/ObjectList.vue";
  import NewThing from "@/components/NewThing.vue";
  import PopUp from "@/components/PopUp.vue";

  import { type DinnerPlan, Day, getDinnerPlans, deleteDinnerPlan } from "@/database/models/dinner-plans";

  const router = useRouter();

  const popup = ref(false);
  const loading = ref(true);

  const dinners = ref([] as DinnerPlan[]);

  onMounted(async () => {
    dinners.value = await getDinnerPlans();
    loading.value = false;
  });

  async function deletePlan(id: number) {
    await deleteDinnerPlan(id);
    dinners.value = dinners.value.filter(d => d.id !== id);
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
          <NewThing to="/planner/breakfasts/new" />
        </section>
        <section>
          <h1>Lunch</h1>
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
      </div>
      <button type="reset" @click.stop="popup = !popup">Reset</button>
      <PopUp v-if="popup" message="Delete you meal plans?" @submit="console.log(`reset`)" @cancel="popup = !popup" />
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
