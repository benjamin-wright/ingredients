<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from "vue";
  import { useRouter } from 'vue-router';
  import { useCategoriesStore } from "@/stores/categories";
  import { useCustomListStore } from "@/stores/custom-list";
  import FormTemplate from "@/components/FormTemplate.vue";
  import StringInput from "../components/StringInput.vue";
  import CustomListItem from "@/models/CustomListItem";
  import ObjectSelect from "@/components/ObjectSelect.vue";

  const router = useRouter();
  const store = useCustomListStore();
  const categories = useCategoriesStore();
  const selected = store.selected;

  let item = ref(selected?.name || "");
  let category = ref(selected?.category || categories.categories[0]);
  const title = `${ selected ? "Edit" : "New" } Custom Item`

  onMounted(async () => {
    await store.load();
    await categories.load();

    if (!selected) {
      category.value = categories.categories[0];
    }
  });

  onUnmounted(() => {
    store.deselect();
  });

  async function submit() {
    if (selected) {
      await store.update(new CustomListItem(
        selected.id,
        item.value,
        category.value,
        true
      ));
    } else {
      await store.new(item.value, category.value, true);
    }
    router.push("/list");
  }

  function cancel() {
    router.push("/list");
  }
</script>

<template>
  <FormTemplate :title="title" @cancel="cancel" @submit="submit" >
    <StringInput id="item" name="item" label="Name" v-model="item" required />
    <ObjectSelect id="category" name="category" label="Category" v-model="category" :options="categories.categories" add @new="router.push('/categories/new?return=' + encodeURIComponent(router.currentRoute.value.fullPath))" required >
      <template #default="{ option }">
        {{ option.name }}
      </template>
    </ObjectSelect>
  </FormTemplate>
</template>