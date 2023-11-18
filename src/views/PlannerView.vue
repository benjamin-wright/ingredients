<script setup lang="ts">
  import { onMounted } from "vue";
  import { useRouter } from 'vue-router';
  import { useDinnerPlanStore } from "@/stores/dinner-plans";
  import ObjectList from "@/components/ObjectList.vue";
  import NewThing from "@/components/NewThing.vue";
  import DinnerPlan from "@/models/DinnerPlan";

  const router = useRouter();
  const store = useDinnerPlanStore();

  onMounted(() => {
    store.load();
  });

  async function remove(plan: DinnerPlan) {
    await store.remove(plan);
  }

  function edit(plan: DinnerPlan) {
    store.select(plan);
    router.push("/planner/dinners/new");
  }
</script>

<template>
  <main>
    <template v-if="store.loading">Loading...</template>
    <template v-else-if="store.error">{{ store.error }}</template>
    <template v-else>
      <section>
        <h1>Breakfast</h1>
      </section>
      <section>
        <h1>Lunch</h1>
      </section>
      <section>
        <h1>Dinner</h1>
        <ObjectList :data="store.plans" @delete="remove" @edit="edit" dropdown>
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