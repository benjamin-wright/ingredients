<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { useRouter } from 'vue-router';
  import FormTemplate from "@/components/FormTemplate.vue";
  import StringInput from "@/components/StringInput.vue";
  import NumberInput from "@/components/NumberInput.vue";
  import { type Recipie, getRecipie, addRecipie, updateRecipie } from "@/database/models/recipie";

  const router = useRouter();
  const recipieId = getId();
  const loading = ref(true);
  const recipie = ref({
    name: "",
    description: "",
    servings: 1,
  } as Recipie);

  onMounted(async () => {
    if (recipieId) {
      recipie.value = await getRecipie(recipieId);
    }
    loading.value = false;
  });

  function getId(): number | null {
    const id = router.currentRoute.value.params.id;
    if (id === undefined) {
      return null;
    }

    if (Array.isArray(id)) {
      return parseInt(id[0]);
    } else {
      return parseInt(id);
    }
  }

  const title = `${ recipieId !== null ? 'Edit' : 'New'} Recipie`

  async function submit() {
    if (recipieId !== null) {
      await updateRecipie(recipieId, recipie.value.name, recipie.value.description, recipie.value.servings);
      router.push(`/recipies`);
    } else {
      const id = await addRecipie(recipie.value.name, recipie.value.description, recipie.value.servings);
      router.push(`/recipies/${id}/ingredients`);
    }
  }

  function cancel() {
    router.push("/recipies");
  }
</script>

<template>
  <template v-if="loading">loading...</template>
  <FormTemplate v-else :title="title" @cancel="cancel" @submit="submit">
    <StringInput id="name" name="name" label="Name" v-model="recipie.name" required />
    <StringInput id="description" name="description" label="Description" v-model="recipie.description" required multiline />
    <NumberInput id="servings" name="servings" label="Servings" v-model="recipie.servings" required />
  </FormTemplate>
</template>