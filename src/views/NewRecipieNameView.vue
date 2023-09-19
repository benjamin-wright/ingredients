<script setup lang="ts">
  import { useNewRecipieStore } from "@/stores/new-recipie";
  import { useRouter } from 'vue-router';
  import FormTemplate from "@/components/FormTemplate.vue";
  import StringInput from "../components/StringInput.vue";

  const router = useRouter();
  const store = useNewRecipieStore();

  const title = `${store.edit ? 'Edit' : 'New'} Recipie`

  async function submit() {
    router.push("/recipies/new/ingredients");
  }

  function cancel() {
    store.clear();
    router.push("/recipies");
  }
</script>

<template>
  <FormTemplate :title="title" cancelLabel="Cancel" submitLabel="Next" @cancel="cancel" @submit="submit">
    <StringInput id="name" name="name" label="Name" v-model="store.name" required />
    <StringInput id="description" name="description" label="Description" v-model="store.description" required multiline />
  </FormTemplate>
</template>