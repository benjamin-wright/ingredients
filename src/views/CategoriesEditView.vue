<script setup lang="ts">
  import { computed, onMounted, onBeforeUpdate, ref, inject } from "vue";
  import { useRouter } from 'vue-router';
  import FormTemplate from "@/components/FormTemplate.vue";
  import StringInput from "../components/StringInput.vue";
  import { type Category, type ICategoryProvider } from "@/database/models/category";
  import { getIdFromPath } from "@/utils/computed";
  import { Navigator } from "@/utils/navigator";

  const provider: ICategoryProvider = (() => {
    let provider = inject<ICategoryProvider>("categories");
    if (!provider) {
      throw new Error("No category provider found");
    }
    return provider;
  })();
  const router = useRouter();
  const categoryId = ref(null as number | null);
  const navigator = new Navigator({
    router: router,
    default: "/categories"
  });

  onMounted(async () => {
    categoryId.value = getIdFromPath(router, "id");

    if (categoryId.value !== null) {
      category.value = await provider.getCategory(categoryId.value);
    }

    loading.value = false;
  });

  const title = computed(() => `${ categoryId.value !== null ? "Edit" : "New" } Category`);
  const category = ref({ name: "" } as Category);
  const loading = ref(true);

  async function submit() {
    let id;
    if (categoryId.value !== null) {
      await provider.updateCategory(categoryId.value, category.value.name);
      id = categoryId.value;
    } else {
      id = await provider.addCategory(category.value.name);
    }

    navigator.navigate({ "category": id.toString() });
  }
</script>

<template>
  <template v-if="loading">loading...</template>
  <FormTemplate
    v-else
    :title="title"
    :cancel-label="navigator.isReturner ? 'Return' : undefined"
    @cancel="() => navigator.navigate()"
    @submit="submit"
  >
    <StringInput id="category" name="category" label="Name" v-model="category.name" required />
  </FormTemplate>
</template>@/utils/URL