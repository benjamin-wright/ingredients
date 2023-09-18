<script setup lang="ts">
  import { ref } from "vue";
  import { useNewRecipieStore } from "@/stores/new-recipie";
  import { useRouter } from 'vue-router';
  import StringInput from "@/components/StringInput.vue";

  const form = ref<HTMLFormElement | null>(null);
  const router = useRouter();
  const store = useNewRecipieStore();

  async function submit() {
    if (!form.value?.checkValidity()) {
      form.value?.reportValidity();
      return;
    }

    await store.submit();
    router.push("/recipies");
  }

  function cancel() {
    router.push("/recipies/new/ingredients");
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
  <form class="recipies" ref="form">
    <h1>Steps for "{{ store.name }}"</h1>
    <TransitionGroup name="list" tag="div">
      <div class="input-row" v-for="step, idx in store.steps" :key="step.id">
        <StringInput
            v-model="store.steps[idx].content"
            :id="'step-' + idx"
            :name="'step-' + idx"
            :label="'Step ' + (idx + 1)"
            required
            multiline
        />
        <button @click.prevent="remove(idx)">-</button>
      </div>
    </TransitionGroup>
    <button @click.prevent="add">+</button>
    <div class="buttons">
      <button type="reset" @click.prevent="cancel">Back</button>
      <button type="submit" @click.prevent="submit">Add</button>
    </div>
  </form>
</template>

<style scoped>
.recipies {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1em;
  justify-content: center;
  flex-grow: 1;
}

.buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 0.5em;
}

.input-row {
    display: flex;
    justify-content: stretch;
    align-items: stretch;
    gap: 0.5em;
}

.input-row *:first-child {
    flex-grow: 1;
}

</style>
