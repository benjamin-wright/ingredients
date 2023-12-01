<script setup lang="ts">
  import { computed, onMounted, ref } from "vue";
  import { useRouter } from 'vue-router';
  import FormTemplate from "@/components/FormTemplate.vue";
  import StringInput from "../components/StringInput.vue";
  import { type Category, addCategory, updateCategory, getCategory } from "@/database/models/category";
  import { idFromPath } from "@/utils/computed";
  import { Navigator } from "@/utils/navigator";

  const router = useRouter();
  const categoryId = computed(idFromPath(router, "id"));
  const navigator = new Navigator({
    router: router,
    default: "/categories"
  });

  onMounted(async () => {
    if (categoryId.value !== null) {
      category.value = await getCategory(categoryId.value);
    }
    loading.value = false;
  });

  const title = `${ categoryId.value !== null ? "Edit" : "New" } Category`
  const category = ref({ name: "" } as Category);
  const loading = ref(true);

  async function submit() {
    let id;
    if (categoryId.value !== null) {
      await updateCategory(categoryId.value, category.value.name);
      id = categoryId.value;
    } else {
      id = await addCategory(category.value.name);
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