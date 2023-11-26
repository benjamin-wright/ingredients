<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { useRouter } from 'vue-router';
  import ObjectList from "../components/ObjectList.vue";
  import NewThing from "@/components/NewThing.vue";
  import { getUnits, deleteUnit, type Unit } from "@/models/Unit";
  import { useNewUnitStore } from "@/stores/new-unit";

  const router = useRouter();
  const store = useNewUnitStore();
 
  const loading = ref(true);
  const units = ref([] as Unit[]);

  onMounted(async () => {
    units.value = await getUnits();
    loading.value = false;
  });

  async function remove(unit: Unit) {
    await deleteUnit(unit.id);
  }

  function edit(unit: Unit) {
    store.select(unit);
    router.push("/units/new");
  }
</script>

<template>
  <main>
    <template v-if="loading">Loading...</template>
    <template v-else>
      <h1>Units</h1>
      <ObjectList
        :data="units"
        @delete="remove"
        @edit="edit"
      >
        <template #content="{ obj }">
          <h2>{{ obj.name }}</h2>
        </template>
      </ObjectList>
      <NewThing to="/units/new" />
    </template>
  </main>
</template>

<style scoped>
  h2 {
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>