<script setup lang="ts">
  import { onMounted, onUnmounted } from "vue";
  import { useIngredientsStore } from "../stores/ingredients";
  import { useRouter } from 'vue-router';
  import FormTemplate from "@/components/FormTemplate.vue";
  import IngredientType from "@/models/IngredientType";
  import StringInput from "../components/StringInput.vue";

  const router = useRouter();
  const store = useIngredientsStore();
  const selected = store.selected;

  let ingredient = selected?.name || "";
  const title = `${ selected ? "Edit" : "New" } Ingredient`

  onMounted(() => {
    store.load();
  });

  onUnmounted(() => {
    store.deselect();
  });

  async function submit() {
    if (selected) {
      await store.update(new IngredientType(
        selected.id,
        ingredient
      ));
    } else {
      await store.add(ingredient);
    }
    router.push("/ingredients");
  }

  function cancel() {
    router.push("/ingredients");
  }
</script>

<template>
  <FormTemplate :title="title" @cancel="cancel" @submit="submit" >
    <StringInput id="ingredient" name="ingredient" label="Name" v-model="ingredient" required />
  </FormTemplate>
</template>
