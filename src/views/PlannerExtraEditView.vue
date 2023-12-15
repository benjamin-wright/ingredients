<script setup lang="ts">
  import { onMounted, computed, ref } from "vue";
  import { useRouter } from 'vue-router';

  import { type Unit, getUnits } from "@/database/models/unit";
  import { type ExtraItem, getExtraItem, addExtraItem, updateExtraItem } from "@/database/models/extra-items";
  import { idFromPath } from "@/utils/computed";

  import FormTemplate from "@/components/FormTemplate.vue";
  import ObjectSelect from "@/components/ObjectSelect.vue";
  import NumberInput from "@/components/NumberInput.vue";
  import StringInput from "@/components/StringInput.vue";

  const router = useRouter();
  const loading = ref(true);
  const units = ref([] as Unit[]);
  const itemId = computed(idFromPath(router, "id"));
  const title = `${itemId.value ? 'Edit' : 'New' } Extra Item`;
  const extraItem = ref({
    id: 0,
    name: "",
    unitId: 0,
    quantity: 1,
  } as ExtraItem);

  onMounted(async () => {
    units.value = await getUnits();

    if (itemId.value !== null) {
      extraItem.value = await getExtraItem(itemId.value);
    } else if (units.value.length) {
      extraItem.value.unitId = units.value.find(u => u.name === "count")?.id ?? units.value[0].id;
    } else {
      extraItem.value.unitId = 0;
    }

    loading.value = false;
  });

  function cancel() {
    router.push("/planner");
  }

  async function submit() {
    if (itemId.value === null) {
      await addExtraItem(extraItem.value.name, extraItem.value.quantity, extraItem.value.unitId);
    } else {
      await updateExtraItem(itemId.value, extraItem.value.name, extraItem.value.quantity, extraItem.value.unitId);
    }

    router.push("/planner");
  }
</script>

<template>
  <template v-if="loading">
    <p>Loading...</p>
  </template>
  <FormTemplate v-else :title="title" @cancel="cancel" @submit="submit" >
    <StringInput id="name" name="name" label="Name" v-model="extraItem.name" required />
    <ObjectSelect
      id="unit"
      name="unit"
      label="Unit"
      :options="units"
      :to-value="u => u.id"
      v-model="extraItem.unitId"
      required
    >
      <template #default="{ option }">
        <span>{{ option.name }}</span>
      </template>
    </ObjectSelect>
    <NumberInput id="quantity" name="quantity" label="Quantity" v-model="extraItem.quantity" required />
  </FormTemplate>
</template>
