<script setup lang="ts">
  import { onUnmounted, computed } from "vue";
  import { useRouter } from 'vue-router';
  import { useNewUnitStore } from "@/stores/new-unit";
  import FormTemplate from "@/components/FormTemplate.vue";
  import StringInput from "../components/StringInput.vue";
  import NumberInput from "@/components/NumberInput.vue";
  import EnumSelect from "@/components/EnumSelect.vue";
  import URL from "@/utils/URL";
  import { UnitKind } from "@/database/models/unit";

  const router = useRouter();
  const store = useNewUnitStore();
  const returnTo = computed(() => {
    let returnTo = router.currentRoute.value.query.return;
    if (Array.isArray(returnTo)) {
      returnTo = returnTo[0];
    }

    return returnTo;
  });

  const title = `${ store.edit ? "Edit" : "New" } Unit`;

  onUnmounted(() => {
    store.clear();
  });

  async function submit() {
    const id = await store.submit();
    navigate(id);
  }

  function navigate(id?: number) {
    if (returnTo.value) {
      const url = new URL(returnTo.value);

      if (id) {
        url.addParam("unit", id.toString());
      }
      router.push(url.fullPath());
    } else {
      router.push("/units");
    }
  }

  function conversionLabel() {
    switch (store.kind) {
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
  <FormTemplate :title="title" :cancel-label="returnTo ? 'Return' : undefined" @cancel="navigate" @submit="submit" >
    <StringInput id="name" name="name" label="Name" v-model="store.name" required />
    <StringInput id="singular" name="singular" label="Singular" v-model="store.singular" />
    <StringInput id="plural" name="plural" label="Plural" v-model="store.plural" />
    <EnumSelect id="kind" name="kind" label="Kind" :options="[UnitKind.Mass, UnitKind.Volume, UnitKind.Collective]" :convert="(u: UnitKind) => UnitKind[u]" v-model="store.kind" required />
    <NumberInput v-if="store.kind !== UnitKind.Collective" id="conversion" name="conversion" :label="conversionLabel()" v-model="store.conversion" required />
  </FormTemplate>
</template>@/utils/URL@/database/models/Unit@/database/models/unit