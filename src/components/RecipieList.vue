<script setup lang="ts">
import Recipie from "../models/Recipie"

defineProps<{
  recipies: Recipie[]
}>()
</script>

<template>
<div class="recipie-list">
  <div v-for="recipie in recipies" :key="recipie.id">
    <h2>{{ recipie.name }}</h2>
  </div>
</div>
</template>