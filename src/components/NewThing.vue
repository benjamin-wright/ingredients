<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps<{
  to?: string,
  click?: () => void,
}>()

const router = useRouter();

function handler() {
    if (props.to) {
        router.push(props.to);
    }

    if (props.click) {
        props.click();
    }
}
</script>

<template>
    <button @click.prevent="handler">
        +
    </button>
</template>

<style scoped>
button {
    box-sizing: border-box;
    border: 2px dashed var(--color-border);
    border-radius: 0.2em;
    background-color: var(--color-background);
    color: var(--color-text);
    padding: 0.5em;
    font-size: 1.5em;
    cursor: pointer;
    width: 100%;
}
</style>