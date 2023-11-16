<script setup lang="ts">
  import { onMounted } from "vue";
  import { useRouter } from 'vue-router';
  import { usePlanStore } from "@/stores/plans";
  import ObjectList from "@/components/ObjectList.vue";
  import NewThing from "@/components/NewThing.vue";
  import Plan from "@/models/Plan";

  const router = useRouter();
  const store = usePlanStore();

  onMounted(() => {
    store.load();
  });

  async function remove(plan: Plan) {
    await store.remove(plan);
  }

  function edit(plan: Plan) {
    store.select(plan);
    router.push("/planner/new");
  }
</script>

<template>
  <main>
    <template v-if="store.loading">Loading...</template>
    <template v-else-if="store.error">{{ store.error }}</template>
    <template v-else>
      <ObjectList :data="store.plans" @delete="remove" @edit="edit">
        <template #content="{ obj }">
          <h2>{{ obj.day }}: {{ obj.recipie.name }} ({{ obj.portions }})</h2>
        </template>
      </ObjectList>
      <NewThing to="/planner/new" />
    </template>
  </main>
</template>

<style scoped>
  h2 {
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>