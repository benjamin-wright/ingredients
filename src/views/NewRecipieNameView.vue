<script setup lang="ts">
  import { computed, onMounted, ref } from "vue";
  import { useNewRecipieStore } from "@/stores/new-recipie";
  import { useRouter } from 'vue-router';
  import StringInput from "../components/StringInput.vue";

  const form = ref<HTMLFormElement | null>(null);
  const router = useRouter();
  const store = useNewRecipieStore();

  async function submit() {
    if (!form.value?.checkValidity()) {
      form.value?.reportValidity();
      return;
    }

    router.push("/recipies/new/ingredients");
  }

  function cancel() {
    store.clear();
    router.push("/recipies");
  }
</script>

<template>
  <form class="recipies" ref="form">
    <h2>New Recipie</h2>
    <StringInput id="name" name="name" label="Name" v-model="store.name" required />
    <StringInput id="description" name="description" label="Description" v-model="store.description" required multiline />
    <div class="buttons">
      <button type="reset" @click.prevent="cancel">Cancel</button>
      <button type="submit" @click.prevent="submit">Next</button>
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

</style>
