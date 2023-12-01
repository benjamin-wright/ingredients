<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { useRouter } from 'vue-router';
  import ObjectList from "../components/ObjectList.vue";
  import NewThing from "@/components/NewThing.vue";
  import { getUnits, deleteUnit, type Unit } from "@/database/models/unit";
  import { useNewUnitStore } from "@/stores/new-unit";

  const router = useRouter();
  const store = useNewUnitStore();
 
  const loading = ref(true);
  const error = ref("" as any);
  const units = ref([] as Unit[]);

  onMounted(async () => {
    try {
      units.value = await getUnits();
    } catch (err: any) {
      error.value = err;
    }
    loading.value = false;
  });

  async function remove(unit: Unit) {
    await deleteUnit(unit.id);
    units.value.splice(units.value.indexOf(unit), 1);
  }

  function edit(unit: Unit) {
    store.select(unit);
    router.push("/units/new");
  }
</script>

<template>
  <main>
    <template v-if="loading">Loading...</template>
    <template v-else-if="error">Error: {{ error }}</template>
    <template v-else>
      <h1>Units</h1>
      <ObjectList
        :data="units"
        :get-id="u => u.id"
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
</style>@/database/models/Unit@/database/models/unit