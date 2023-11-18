<script setup lang="ts">
  import { onMounted } from "vue";
  import { useRouter } from 'vue-router';
  import { useCategoriesStore } from "../stores/categories";
  import ObjectList from "../components/ObjectList.vue";
  import NewThing from "@/components/NewThing.vue";
  import Category from "@/models/Category";

  const router = useRouter();
  const store = useCategoriesStore();

  onMounted(() => {
    store.load();
  });

  async function remove(category: Category) {
    await store.remove(category);
  }

  function edit(category: Category) {
    store.select(category);
    router.push("/categories/new");
  }

  function swap(category: Category, direction: number) {
    store.move(category, direction);
  }
</script>

<template>
  <main>
    <template v-if="store.loading">Loading...</template>
    <template v-else-if="store.error">{{ store.error }}</template>
    <template v-else>
      <ObjectList
        :data="store.categories"
        @delete="remove"
        @edit="edit"
        @move-up="(obj: Category) => swap(obj, 1)"
        @move-down="(obj: Category) => swap(obj, -1)"
        reorder
      >
        <template #content="content">
          <h2>{{ content.obj.name }}</h2>
        </template>
      </ObjectList>
      <NewThing to="/categories/new" />
    </template>
  </main>
</template>

<style scoped>
  h2 {
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>