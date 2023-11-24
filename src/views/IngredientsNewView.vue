<script setup lang="ts">
  import { onMounted, onUnmounted, ref, computed } from "vue";
  import { useIngredientsStore } from "../stores/ingredients";
  import { useRouter } from 'vue-router';
  import FormTemplate from "@/components/FormTemplate.vue";
  import IngredientType from "@/models/IngredientType";
  import StringInput from "../components/StringInput.vue";
  import ObjectSelect from "@/components/ObjectSelect.vue";
  import { useCategoriesStore } from "@/stores/categories";
  import Category from "@/models/Category";
  import URL from "@/utils/URL";

  const router = useRouter();
  const store = useIngredientsStore();
  const categories = useCategoriesStore();
  const selected = store.selected;
  const returnTo = computed(() => {
    let returnTo = router.currentRoute.value.query.return;
    if (Array.isArray(returnTo)) {
      returnTo = returnTo[0];
    }

    return returnTo;
  });

  let ingredient = selected?.name || "";
  let category = ref(getCategory());
  const title = `${ selected ? "Edit" : "New" } Ingredient`

  onMounted(async () => {
    await categories.load();
    await store.load();

    category.value = getCategory();
  });

  onUnmounted(() => {
    store.deselect();
  });

  function getCategory(): Category {
    if (router.currentRoute.value.query.category) {
      try {
        const id = parseInt(router.currentRoute.value.query.category as string);
        const category = categories.categories.find(cat => cat.id == id);
        if (category) {
          return category;
        }
      } catch (err) {
        console.error(`Failed to parse category id: ${err}`);
      }
    }

    return selected?.category || categories.categories[0]
  }

  async function submit() {
    let id: number;
    if (selected) {
      await store.update(new IngredientType(
        selected.id,
        ingredient,
        category.value
      ));
      id = selected.id;
    } else {
      id = await store.add(ingredient, category.value);
    }
    navigate(id);
  }

  function navigate(id?: number) {
    if (returnTo.value) {
      const url = new URL(returnTo.value);
      if (id) {
        url.addParam("ingredient", id.toString());
      }
      router.push(url.fullPath())
    } else {
      router.push("/ingredients");
    }
  }
</script>

<template>
  <FormTemplate :title="title" :cancel-label="returnTo ? 'Return' : undefined" @cancel="navigate" @submit="submit" >
    <StringInput id="ingredient" name="ingredient" label="Name" v-model="ingredient" required />
    <ObjectSelect
      id="category"
      name="category"
      label="Category"
      :options="categories.categories"
      v-model="category"
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
</style>@/utils/URL