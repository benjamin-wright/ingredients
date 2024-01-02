<script setup lang="ts">
  import { onMounted, ref, computed, inject } from "vue";
  import { useRouter } from 'vue-router';
  import FormTemplate from "@/components/FormTemplate.vue";
  import StringInput from "../components/StringInput.vue";
  import ObjectSelect from "@/components/ObjectSelect.vue";

  import { type Category, type ICategoryProvider } from "@/database/models/category";
  import { getIngredient, updateIngredient, addIngredient } from "@/database/models/ingredient"; 
  import { Navigator } from "@/utils/navigator";
  import { idFromPath, idFromQuery } from "@/utils/computed";

  const provider = inject<ICategoryProvider>("categories");
  const router = useRouter();
  const navigator = new Navigator({
    router: router,
    default: "/ingredients"
  });
  const ingredientId = computed(idFromPath(router, "id"));
  const categoryId = computed(idFromQuery(router, "category"));
  
  const ingredient = ref({ name: "", categoryId: 0 });
  const title = `${ ingredientId.value !== null ? "Edit" : "New" } Ingredient`;
  const categories = ref([] as Category[]);
  const loading = ref(true);
  
  onMounted(async () => {
    categories.value = await provider?.getCategories() || categories.value;
    if (ingredientId.value !== null) {
      ingredient.value = await getIngredient(ingredientId.value);
      ingredient.value.categoryId = categoryId.value || ingredient.value.categoryId
    } else if (categories.value.length) {
      ingredient.value.categoryId = categoryId.value || categories.value[0].id;
    } else {
      ingredient.value.categoryId = categoryId.value || 0;
    }
    loading.value = false;
  });

  async function submit() {
    let id;
    if (ingredientId.value !== null) {
      await updateIngredient(ingredientId.value, ingredient.value.name, ingredient.value.categoryId);
      id = ingredientId.value;
    } else {
      id = await addIngredient(ingredient.value.name, ingredient.value.categoryId);
    }
    navigator.navigate({ "ingredient": id.toString() });
  }
</script>

<template>
  <template v-if="loading">Loading...</template>
  <FormTemplate
    v-else
    :title="title"
    :cancel-label="navigator.isReturner ? 'Return' : undefined"
    @cancel="() => navigator.navigate()"
    @submit="submit"
  >
    <StringInput id="ingredient" name="ingredient" label="Name" v-model="ingredient.name" required />
    <ObjectSelect
      id="category"
      name="category"
      label="Category"
      :options="categories"
      v-model="ingredient.categoryId"
      :to-value="category => category.id"
      add
      required
      @new="router.push('/categories/new?return=' + encodeURIComponent(router.currentRoute.value.fullPath))"
    >
      <template #default="{ option }">
        <span>{{ option.name }}</span>
      </template>
    </ObjectSelect>
  </FormTemplate>
</template>

<style scoped>
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .row select {
    flex-grow: 1;
  }

  .row button {
    padding-right: 0;
    background: none;
    border: none;
    color: var(--color-text-ok);
    font-weight: bold;
    width: fit-content;

    text-indent: 1px;
    text-overflow: '';
  }
</style>