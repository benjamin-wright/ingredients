<script setup lang="ts">
  import { onMounted, onUnmounted, computed } from "vue";
  import { useRouter } from 'vue-router';
  import { useCategoriesStore } from "@/stores/categories";
  import FormTemplate from "@/components/FormTemplate.vue";
  import StringInput from "../components/StringInput.vue";
  import Category from "@/models/Category";
  import URL from "@/utils/URL";

  const router = useRouter();
  const store = useCategoriesStore();
  const selected = store.selected;
  const returnTo = computed(() => {
    let returnTo = router.currentRoute.value.query.return;
    if (Array.isArray(returnTo)) {
      returnTo = returnTo[0];
    }

    return returnTo;
  });

  let category = selected?.name || "";
  const title = `${ selected ? "Edit" : "New" } Category`

  onMounted(async () => {
    await store.load();
  });

  onUnmounted(() => {
    store.deselect();
  });

  async function submit() {
    let id: number;
    if (selected) {
      await store.update(new Category(
        selected.id,
        selected.position,
        category
      ));

      id = selected.id;
    } else {
      id = await store.add(category);
    }
    navigate(id);
  }

  function navigate(id?: number) {
    if (returnTo.value) {
      const url = new URL(returnTo.value);

      if (id) {
        url.addParam("category", id.toString());
      }
      router.push(url.fullPath());
    } else {
      router.push("/categories");
    }
  }
</script>

<template>
  <FormTemplate :title="title" :cancel-label="returnTo ? 'Return' : undefined" @cancel="navigate" @submit="submit" >
    <StringInput id="category" name="category" label="Name" v-model="category" required />
  </FormTemplate>
</template>@/utils/URL