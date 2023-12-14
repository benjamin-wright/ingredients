<script setup lang="ts">
  import { onMounted, computed, ref } from "vue";

  import { type Unit, getUnits } from "@/database/models/unit";

  const title = "New Extra";
  const units = ref([] as Unit[]);
</script>

<template>
  <FormTemplate :title="title" @cancel="cancel" @submit="submit" >
    <EnumSelect id="day" name="day" label="Day" :options="getDays()" :convert="(u: Day) => Day[u]" v-model="plan.day" required />
    <ObjectSelect id="recipie" name="recipie" label="Recipie" :options="recipies" :to-value="r => r.id" v-model="plan.recipieId" required>
      <template #default="{ option }">
        <span>{{ option.name }}</span>
      </template>
    </ObjectSelect>
    <NumberInput id="servings" name="servings" label="Servings" v-model="plan.servings" required />
  </FormTemplate>
</template>
