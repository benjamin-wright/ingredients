<script setup lang="ts">
  import { onMounted, onUnmounted, computed } from "vue";
  import { useRouter } from 'vue-router';
  import FormTemplate from "@/components/FormTemplate.vue";
  import StringInput from "../components/StringInput.vue";
  import URL from "@/utils/URL";
  import { type Category } from "@/database/models/category";
  import { useNewCategoryStore } from "@/stores/new-category";

  const router = useRouter();
  const store = useNewCategoryStore();

  const returnTo = computed(() => {
    let returnTo = router.currentRoute.value.query.return;
    if (Array.isArray(returnTo)) {
      returnTo = returnTo[0];
    }

    return returnTo;
  });

  const title = `${ store.edit ? "Edit" : "New" } Category`

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
    <StringInput id="category" name="category" label="Name" v-model="store.name" required />
  </FormTemplate>
</template>@/utils/URL