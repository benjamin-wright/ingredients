<script setup lang="ts">
  import { useNewRecipieStore } from "@/stores/new-recipie";
  import { useRouter } from 'vue-router';
  import FormTemplate from "@/components/FormTemplate.vue";
  import StringInput from "@/components/StringInput.vue";
  import NewThing from "@/components/NewThing.vue";
  import LabelIcon from "@/components/LabelIcon.vue";

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
  <FormTemplate :title="title" cancelLabel="Back" @cancel="cancel" @submit="submit">
    <TransitionGroup name="list">
      <div class="horizontal" v-for="step, idx in store.steps" :key="step.id">
        <LabelIcon :value="idx + 1" />
        <StringInput
            class="input"
            :label="`Step ${idx + 1}`"
            v-model="store.steps[idx].content"
            :id="'step-' + idx"
            :name="'step-' + idx"
            required
            multiline
        />
        <button class="delete" @click.prevent="remove(idx)">
          <font-awesome-icon :icon="['fas', 'minus-square']" />
        </button>
      </div>
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

.input {
  flex-grow: 1;
}

</style>
