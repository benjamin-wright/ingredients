<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from "vue";
  import { useIngredientsStore } from "../stores/ingredients";
  import { useRouter } from 'vue-router';
  import IngredientType from "@/models/IngredientType";
  import StringInput from "../components/StringInput.vue";

  const form = ref<HTMLFormElement | null>(null);
  const router = useRouter();
  const store = useIngredientsStore();
  const selected = store.selected;

  let ingredient = selected?.name || "";

  onMounted(() => {
    store.load();
  });

  onUnmounted(() => {
    store.deselect();
  });

  async function submit() {
    if (!form.value?.checkValidity()) {
      form.value?.reportValidity();
      return;
    }

    if (selected) {
      await store.updateIngredient(new IngredientType(
        selected.id,
        ingredient
      ));
    } else {
      await store.addIngredient(ingredient);
    }
    router.push("/ingredients");
  }

  function cancel() {
    router.push("/ingredients");
  }
</script>

<template>
  <form ref="form">
    <h2>{{ selected ? "Edit" : "New" }} Ingredient</h2>
    <StringInput id="ingredient" name="ingredient" label="Name" v-model="ingredient" required />
    <div class="button-pair">
      <button type="reset" @click.prevent="cancel">Cancel</button>
      <button type="submit" @click.prevent="submit">{{ selected ? "Update" : "Add" }}</button>
    </div>
  </form>
</template>
