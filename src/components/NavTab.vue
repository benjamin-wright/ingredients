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
    border-bottom-left-radius: 0.2em;
    border-bottom-right-radius: 0.2em;
}

a.router-link-active {
    padding-top: 0.5em;
}
</style>