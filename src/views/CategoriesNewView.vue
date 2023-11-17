<script setup lang="ts">
  import { onMounted, onUnmounted } from "vue";
  import { useRouter } from 'vue-router';
  import { useCategoriesStore } from "@/stores/categories";
  import FormTemplate from "@/components/FormTemplate.vue";
  import StringInput from "../components/StringInput.vue";
  import Category from "@/models/Category";

  const router = useRouter();
  const store = useCategoriesStore();
  const selected = store.selected;

  let category = selected?.name || "";
  const title = `${ selected ? "Edit" : "New" } Category`

  onMounted(async () => {
    await store.load();
  });

  onUnmounted(() => {
    store.deselect();
  });

  async function submit() {
    if (selected) {
      await store.update(new Category(
        selected.id,
        selected.position,
        category
      ));
    } else {
      await store.add(category);
    }
    router.push("/categories");
  }

  function cancel() {
    router.push("/categories");
  }
</script>

<template>
  <FormTemplate :title="title" @cancel="cancel" @submit="submit" >
    <StringInput id="category" name="category" label="Name" v-model="category" required />
  </FormTemplate>
</template>