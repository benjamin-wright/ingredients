<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { useRouter } from 'vue-router';
  import { getProvider } from "@/utils/computed";
  import ObjectList from "../components/ObjectList.vue";
  import NewThing from "@/components/NewThing.vue";
  import { type ICategoryProvider, type Category } from "@/database/models/category";

  const router = useRouter();
  const provider = getProvider<ICategoryProvider>("categories");

  const loading = ref(true);
  const error = ref("");
  const categories = ref([] as Category[]);

  onMounted(async () => {
    try {
      error.value = "loading categories....."
      categories.value = await provider.getCategories();
      error.value = ""
      loading.value = false;
    } catch (err: any) {
      error.value = err.toString();
      loading.value = false;
    }
  });

  async function remove(category: Category) {
    await provider.deleteCategory(category.id);
    categories.value.splice(categories.value.indexOf(category), 1);
  }

  async function swap(category1: Category, category2: Category) {
    await provider.swapCategories(category1.id, category2.id);
    categories.value = await provider.getCategories();
  }
</script>

<template>
  <main>
    <template v-if="loading">Loading...</template>
    <template v-else-if="error">Failed to load: {{ error }}</template>
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
    text-transform: capitalize;
  }
</style>