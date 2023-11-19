<script setup lang="ts">
  import { useNewRecipieStore } from "@/stores/new-recipie";
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import FormTemplate from "@/components/FormTemplate.vue";
  import StringInput from "@/components/StringInput.vue";
  import NewThing from "@/components/NewThing.vue";
  import LabelIcon from "@/components/LabelIcon.vue";

  const router = useRouter();
  const store = useNewRecipieStore();

  const selected = ref(null as number | null);

  const title = `${store.edit ? 'Edit' : 'New'} Recipie Steps`;

  function cancel() {
    router.push("/recipies/new/ingredients");
  }

  async function submit() {
    await store.submit();
    router.push("/recipies");
  }

  function add() {
    store.addStep();
  }

  function select(idx: number) {
    selected.value = idx;
  }

  function deselect() {
    selected.value = null;
  }

  function remove(idx: number) {
    store.removeStep(idx);
  }

  function swap(a: number, b: number) {
    store.swapStep(a, b);
    selected.value = b;
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
        <div v-if="selected===idx" class="tight-list">
          <button v-if="idx > 0" @click.prevent="swap(idx, idx - 1)">
            <font-awesome-icon :icon="['fas', 'chevron-circle-up']" />
          </button>
          <button @click.prevent="deselect()">
            <font-awesome-icon :icon="['fas', 'ellipsis']" />
          </button>
          <button v-if="idx < store.steps.length - 1" @click.prevent="swap(idx, idx + 1)">
            <font-awesome-icon :icon="['fas', 'chevron-circle-down']" />
          </button>
        </div>
        <div v-if="selected!==idx" class="tight-list">
          <button class="delete" @click.prevent="remove(idx)">
            <font-awesome-icon :icon="['fas', 'minus-square']" />
          </button>
          <button @click.prevent="select(idx)">
            <font-awesome-icon :icon="['fas', 'ellipsis']" />
          </button>
        </div>
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

.tight-list {
  margin: 0 0.5em;
}

</style>
