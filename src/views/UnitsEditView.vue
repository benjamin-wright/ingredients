<script setup lang="ts">
  import { computed, onMounted, ref } from "vue";
  import { useRouter } from 'vue-router';
  import FormTemplate from "@/components/FormTemplate.vue";
  import StringInput from "../components/StringInput.vue";
  import NumberInput from "@/components/NumberInput.vue";
  import EnumSelect from "@/components/EnumSelect.vue";
  import { Navigator } from "@/utils/navigator";
  import { idFromPath } from "@/utils/computed";
  import { UnitKind, getUnitKinds, addUnit, updateUnit, getUnit } from "@/database/models/unit";

  const router = useRouter();
  const navigator = new Navigator({
    router: router,
    default: "/units"
  });
  const unitId = computed(idFromPath(router, "id"));
  const title = `${ unitId.value !== null ? "Edit" : "New" } Unit`;
  const unit = ref({ name: "", singular: "", plural: "", kind: UnitKind.Mass, conversion: 1 });
  const loading = ref(true);

  onMounted(async () => {
    if (unitId.value !== null) {
      unit.value = await getUnit(unitId.value);
    }

    loading.value = false;
  });

  async function submit() {
    let id;
    const u = unit.value;
    if (unitId.value !== null) {
      await updateUnit(unitId.value, u.name, u.singular, u.plural, u.kind, u.conversion);
      id = unitId.value;
    } else {
      id = await addUnit(u.name, u.singular, u.plural, u.kind, u.conversion);
    }
    navigator.navigate({ "unit": id.toString() });
  }

  function conversionLabel() {
    switch (unit.value.kind) {
      case UnitKind.Mass:
        return "Grams";
      case UnitKind.Volume:
        return "Milliliters";
      case UnitKind.Collective:
        return "Count";
    }
  }
</script>

<template>
  <template v-if="loading">loading...</template>
  <FormTemplate
    v-else
    :title="title"
    :cancel-label="navigator.isReturner ? 'Return' : undefined"
    @cancel="() => navigator.navigate()"
    @submit="submit"
  >
    <StringInput id="name" name="name" label="Name" v-model="unit.name" required />
    <StringInput id="singular" name="singular" label="Singular" v-model="unit.singular" />
    <StringInput id="plural" name="plural" label="Plural" v-model="unit.plural" />
    <EnumSelect id="kind" name="kind" label="Kind" :options="getUnitKinds()" :convert="(u: UnitKind) => UnitKind[u]" v-model="unit.kind" required />
    <NumberInput v-if="unit.kind !== UnitKind.Collective" id="conversion" name="conversion" :label="conversionLabel()" v-model="unit.conversion" required />
  </FormTemplate>
</template>
