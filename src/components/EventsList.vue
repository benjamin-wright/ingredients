<script setup lang="ts">
import { useEventsStore } from '@/stores/events';
const events = useEventsStore();
</script>

<template>
<div v-for="event, id in events.events" :key="id">
    <h1>{{ event.message }}</h1>
</div>
</template>

<style scoped>
</style>
