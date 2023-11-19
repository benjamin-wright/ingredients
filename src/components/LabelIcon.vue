<script setup lang="ts">
  const params = defineProps<{
    value: string | number
  }>()
</script>

<template>
    <div>
        <span>{{ params.value }}</span>
    </div>
</template>

<style scoped>
    div {
        background: var(--color-text);
        color: var(--color-background);
        width: 1.5em;
        min-width: 1.5em;
        height: 1.5em;
        min-height: 1.5em;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
    }
</style>