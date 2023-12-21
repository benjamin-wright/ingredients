<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { useRouter } from 'vue-router';
  import ObjectList from "../components/ObjectList.vue";
  import NewThing from "@/components/NewThing.vue";
  import { getCategories, deleteCategory, swapCategories, type Category } from "@/database/models/category";

  const router = useRouter();

  const loading = ref(true);
  const error = ref("");
  const categories = ref([] as Category[]);

  onMounted(async () => {
    error.value = "loading.....";
    loading.value = false;
    try {
      error.value = "loading categories....."
      categories.value = await getCategories();
      error.value = ""
    } catch (err: any) {
      error.value = err.toString();
    }
  });

  async function remove(category: Category) {
    await deleteCategory(category.id);
    categories.value.splice(categories.value.indexOf(category), 1);
  }

  async function swap(category1: Category, category2: Category) {
    await swapCategories(category1, category2);
    categories.value = await getCategories();
  }
</script>

<template>
  <main>
    <template v-if="loading">Loading...</template>
    <template v-else-if="error">{{ error }}</template>
    <template v-else>
      <h1>Categories</h1>
      <ObjectList
        :data="categories"
        :get-id="c => c.id"
        @delete="remove"
        @edit="c => router.push(`/categories/${c.id}`)"
        @swap="swap"
        confirmation-message="This will also delete all ingredients in this category."
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