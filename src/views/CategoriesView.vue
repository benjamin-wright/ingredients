<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { useRouter } from 'vue-router';
  import ObjectList from "../components/ObjectList.vue";
  import NewThing from "@/components/NewThing.vue";
  import { getCategories, deleteCategory, swapCategories, type Category } from "@/database/models/category";
  import { useNewCategoryStore } from "@/stores/new-category";

  const router = useRouter();
  const store = useNewCategoryStore();

  const loading = ref(true);
  const categories = ref([] as Category[]);

  onMounted(async () => {
    categories.value = await getCategories();
    loading.value = false;
  });

  async function remove(category: Category) {
    await deleteCategory(category.id);
    categories.value.splice(categories.value.indexOf(category), 1);
  }

  function edit(category: Category) {
    store.select(category);
    router.push("/categories/new");
  }

  async function swap(category1: Category, category2: Category) {
    await swapCategories(category1, category2);
    categories.value = await getCategories();
  }
</script>

<template>
  <main>
    <template v-if="loading">Loading...</template>
    <template v-else>
      <h1>Categories</h1>
      <ObjectList
        :data="categories"
        @delete="remove"
        @edit="edit"
        @swap="swap"
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