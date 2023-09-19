<script setup lang="ts">
  import { onMounted } from "vue";
  import { useRecipieStore } from "../stores/recipies";
  import ObjectList from "../components/ObjectList.vue";
  import NewThing from "@/components/NewThing.vue";
import type Recipie from "@/models/Recipie";

  const store = useRecipieStore();

  onMounted(() => {
    store.load();
  });

  async function remove(recipie: Recipie) {
    await store.removeRecipie(recipie);
  }

  function edit(recipie: Recipie) {
    console.info(`Edit ${recipie.name}`);
    // store.select(recipie);
    // router.push("/recipies/new/name");
  }
</script>

<template>
  <main>
    <template v-if="store.loading">Loading...</template>
    <template v-else-if="store.error">{{ store.error }}</template>
    <template v-else>
      <ObjectList :data="store.recipies" @delete="remove" @edit="edit" v-slot="slotProps">
        <h2>{{ slotProps.obj.name }}</h2>
      </ObjectList>
      <NewThing to="/recipies/new/name" />
    </template>
  </main>
</template>
