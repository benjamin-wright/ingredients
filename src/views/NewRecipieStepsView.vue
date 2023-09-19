<script setup lang="ts">
  import { useNewRecipieStore } from "@/stores/new-recipie";
  import { useRouter } from 'vue-router';
  import FormTemplate from "@/components/FormTemplate.vue";
  import StringInput from "@/components/StringInput.vue";
  import NewThing from "@/components/NewThing.vue";

  const router = useRouter();
  const store = useNewRecipieStore();

  const title = `${store.edit ? 'Edit' : 'New'} Recipie Steps`;

  function cancel() {
    router.push("/recipies/new/ingredients");
  }

  async function submit() {
    await store.submit();
    router.push("/recipies");
  }

  let count = 0;

  function add() {
    store.steps.push({ content: "", id: count++});
  }

  function remove(idx: number) {
    store.steps.splice(idx, 1);
  }
</script>

<template>
  <FormTemplate :title="title" cancelLabel="Back" submitLabel="Save" @cancel="cancel" @submit="submit">
    <TransitionGroup name="list">
      <StringInput
          v-for="step, idx in store.steps"
          :key="step.id"
          v-model="store.steps[idx].content"
          :id="'step-' + idx"
          :name="'step-' + idx"
          :remove="() => remove(idx)"
          required
          multiline
      />
    </TransitionGroup>
    <NewThing @click="add" />
  </FormTemplate>
</template>

<style scoped>

.input-row {
  display: flex;
  justify-content: stretch;
  align-items: stretch;
}

.input-row *:first-child {
  flex-grow: 1;
}

</style>
