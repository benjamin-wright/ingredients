<script setup lang="ts">
  import { onMounted, computed, ref, inject } from "vue";
  import { useRouter } from 'vue-router';

  import { type Unit, getUnits } from "@/database/models/unit";
  import { type Category, type ICategoryProvider } from "@/database/models/category";
  import { type ExtraItem, getExtraItem, addExtraItem, updateExtraItem } from "@/database/models/extra-items";
  import { idFromPath, idFromQuery } from "@/utils/computed";

  import FormTemplate from "@/components/FormTemplate.vue";
  import ObjectSelect from "@/components/ObjectSelect.vue";
  import NumberInput from "@/components/NumberInput.vue";
  import StringInput from "@/components/StringInput.vue";

  const provider = inject<ICategoryProvider>("categories");
  const router = useRouter();
  const loading = ref(true);
  const units = ref([] as Unit[]);
  const categories = ref([] as Category[]);
  const itemId = computed(idFromPath(router, "id"));
  const categoryId = computed(idFromQuery(router, "category"));
  const unitId = computed(idFromQuery(router, "unit"));
  const title = `${itemId.value ? 'Edit' : 'New' } Extra Item`;
  const extraItem = ref({
    id: 0,
    name: "",
    categoryId: 0,
    unitId: 0,
    quantity: 1,
  } as ExtraItem);

  onMounted(async () => {
    units.value = await getUnits();
    categories.value = await provider?.getCategories() || [];

    if (itemId.value !== null) {
      extraItem.value = await getExtraItem(itemId.value);
    } else {
      if (unitId.value !== null) {
        extraItem.value.unitId = unitId.value;
      } else if (units.value.length) {
        extraItem.value.unitId = units.value.find(u => u.name === "count")?.id ?? units.value[0].id;
      } else {
        extraItem.value.unitId = 0;
      }

      if (categoryId.value !== null) {
        extraItem.value.categoryId = categoryId.value;
      } else if (categories.value.length) {
        extraItem.value.categoryId = categories.value[0].id;
      } else {
        extraItem.value.categoryId = 0;
      }
    }

    loading.value = false;
  });

  function cancel() {
    router.push("/planner");
  }

  async function submit() {
    if (itemId.value === null) {
      await addExtraItem(extraItem.value.name, extraItem.value.categoryId, extraItem.value.quantity, extraItem.value.unitId);
    } else {
      await updateExtraItem(itemId.value, extraItem.value.name, extraItem.value.categoryId, extraItem.value.quantity, extraItem.value.unitId);
    }

    router.push("/planner");
  }
</script>

<template>
  <template v-if="loading">
    <p>Loading...</p>
  </template>
  <FormTemplate v-else :title="title" @cancel="cancel" @submit="submit" >
    <ObjectSelect
      id="category"
      name="category"
      label="Category"
      :options="categories"
      :to-value="c => c.id"
      v-model="extraItem.categoryId"
      required
      add
      @new="router.push('/categories/new?return=' + encodeURIComponent(router.currentRoute.value.fullPath))"
    >
      <template #default="{ option }">
        <span>{{ option.name }}</span>
      </template>
    </ObjectSelect>
    <StringInput id="name" name="name" label="Name" v-model="extraItem.name" required />
    <ObjectSelect
      id="unit"
      name="unit"
      label="Unit"
      :options="units"
      :to-value="u => u.id"
      v-model="extraItem.unitId"
      required
      add
      @new="router.push('/units/new?return=' + encodeURIComponent(router.currentRoute.value.fullPath))"
    >
      <template #default="{ option }">
        <span>{{ option.name }}</span>
      </template>
    </ObjectSelect>
    <NumberInput id="quantity" name="quantity" label="Quantity" v-model="extraItem.quantity" required />
  </FormTemplate>
</template>
