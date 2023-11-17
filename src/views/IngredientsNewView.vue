<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from "vue";
  import { useIngredientsStore } from "../stores/ingredients";
  import { useRouter } from 'vue-router';
  import FormTemplate from "@/components/FormTemplate.vue";
  import IngredientType from "@/models/IngredientType";
  import StringInput from "../components/StringInput.vue";
  import ObjectSelect from "@/components/ObjectSelect.vue";
  import { useCategoriesStore } from "@/stores/categories";

  const router = useRouter();
  const store = useIngredientsStore();
  const categories = useCategoriesStore();
  const selected = store.selected;

  let ingredient = selected?.name || "";
  let category = ref(selected?.category || categories.categories[0]);
  const title = `${ selected ? "Edit" : "New" } Ingredient`

  onMounted(async () => {
    await categories.load();
    await store.load();

    category.value = selected?.category || categories.categories[0];
  });

  onUnmounted(() => {
    store.deselect();
  });

  async function submit() {
    if (selected) {
      await store.update(new IngredientType(
        selected.id,
        ingredient,
        category.value
      ));
    } else {
      await store.add(ingredient, category.value);
    }
    router.push("/ingredients");
  }

  function cancel() {
    router.push("/ingredients");
  }
</script>

<template>
  <FormTemplate :title="title" @cancel="cancel" @submit="submit" >
    <StringInput id="ingredient" name="ingredient" label="Name" v-model="ingredient" required />
    <ObjectSelect id="category" name="category" label="Category" :options="categories.categories" v-model="category" required>
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