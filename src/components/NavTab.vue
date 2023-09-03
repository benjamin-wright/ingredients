<script setup lang="ts">
defineProps<{
  to: string,
  content: string
}>()
</script>

<template>
    <RouterLink :to=to >{{ content }}</RouterLink>
</template>

<style scoped>
a {
    border-left: 1px solid var(--color-text);
    border-right: 1px solid var(--color-text);
    border-bottom: 1px solid var(--color-text);
}

a.router-link-active {
    padding-top: 0.5em;
}
</style>