<script setup lang="ts">
  import { useNewRecipieStore } from "@/stores/new-recipie";
  import { useRouter } from 'vue-router';
  import FormTemplate from "@/components/FormTemplate.vue";
  import StringInput from "@/components/StringInput.vue";
  import NumberInput from "@/components/NumberInput.vue";

  const router = useRouter();
  const store = useNewRecipieStore();

  const title = `${store.edit ? 'Edit' : 'New'} Recipie`

  async function submit() {
    const id = await store.submit();
    router.push(`/recipies/${id}/ingredients`);
  }

  function cancel() {
    store.clear();
    router.push("/recipies");
  }
</script>

<template>
  <FormTemplate :title="title" submitLabel="Next" @cancel="cancel" @submit="submit">
    <StringInput id="name" name="name" label="Name" v-model="store.name" required />
    <StringInput id="description" name="description" label="Description" v-model="store.description" required multiline />
    <NumberInput id="servings" name="servings" label="Servings" v-model="store.servings" required />
  </FormTemplate>
</template>