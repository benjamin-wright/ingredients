<script setup lang="ts">
    import { useEventsStore, Event } from '@/stores/events';
    const events = useEventsStore();
    let eventsList = events.events;

    async function undo(event: Event) {
        await event.undo();
        events.remove(event);
    }
</script>

<template>
    <section>
        <TransitionGroup name="list" tag="div">
            <div class="event" v-for="event, id in eventsList" :key="id">
                <p>{{ event.message }}</p>
                <button @click.prevent="undo(event)">↶</button>
            </div>
        </TransitionGroup>
    </section>
</template>

<style scoped>
section {
    position: fixed;
    bottom: 0.5em;
    right: 0.5em;
}

.event {
    border: solid 1px var(--color-text);
    background: var(--color-background-soft);
    border-radius: 0.25em;
    padding: 0.5em 1em;

    display: flex;
    gap: 1em;
    align-items: center;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

button {
    background: none;
    color: var(--color-highlight);
    border: none;
    font-weight: bold;
    font-size: 1.5em;
}
</style>
