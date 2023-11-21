<script setup lang="ts">
const model = defineModel<boolean>({required: true});
</script>

<template>
  <button v-if="model" @click.stop="model = false">
    <font-awesome-icon :icon="['fas', 'minus-square']" />
  </button>
  <button v-else @click.stop="model = true">
    <font-awesome-icon :icon="['fas', 'plus-square']" />
  </button>
</template>