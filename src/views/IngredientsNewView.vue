<script setup lang="ts">
  import { onMounted, onUnmounted, ref, computed } from "vue";
  import { useRouter } from 'vue-router';
  import FormTemplate from "@/components/FormTemplate.vue";
  import StringInput from "../components/StringInput.vue";
  import ObjectSelect from "@/components/ObjectSelect.vue";
  import URL from "@/utils/URL";

  import { useNewIngredientStore } from "@/stores/new-ingredient";
  import { type Category, getCategories } from "@/database/models/category";
  import { type Ingredient } from "@/database/models/ingredient";

  const router = useRouter();
  const store = useNewIngredientStore();

  const returnTo = computed(() => {
    let returnTo = router.currentRoute.value.query.return;
    if (Array.isArray(returnTo)) {
      returnTo = returnTo[0];
    }

    return returnTo;
  });

  const loading = ref(true);
  const title = `${ store.edit ? "Edit" : "New" } Ingredient`;
  const categories = ref([] as Category[]);

  onMounted(async () => {
    categories.value = await getCategories();
    const selected = categories.value.find(category => category.id === store.categoryId);
    if (!selected && categories.value.length > 0) {
      store.categoryId = categories.value[0].id;
    }
    loading.value = false;
  });

  onUnmounted(() => {
    store.clear();
  });

  async function submit() {
    const id = await store.submit();
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
  <template v-if="loading">Loading...</template>
  <FormTemplate v-else :title="title" :cancel-label="returnTo ? 'Return' : undefined" @cancel="navigate" @submit="submit" >
    <StringInput id="ingredient" name="ingredient" label="Name" v-model="store.name" required />
    <ObjectSelect
      id="category"
      name="category"
      label="Category"
      :options="categories"
      v-model="store.categoryId"
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