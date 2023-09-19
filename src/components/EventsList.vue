<script setup lang="ts">
    import { useEventsStore, Event, EVENT_BOUNCE_TIME } from '@/stores/events';
    const events = useEventsStore();
    let eventsList = events.events;

    async function undo(event: Event) {
        await event.undo();
        events.remove(event);
    }

    function click(event: Event) {
        if (event.paused) {
            events.resume(event);
        } else {
            events.pause(event);
        }
    }

    function clear(event: Event) {
        events.remove(event);
    }

    function getClass(event: Event): string {
        return event.paused ? "event paused" : "event"
    }
</script>

<template>
    <section>
        <TransitionGroup name="list" tag="ul">
            <li :class="getClass(event)" @click.stop="click(event)" v-for="event, id in eventsList" :key="id">
                <p>{{ event.message }}</p>
                <button class="delete" v-if="event.paused" @click.stop="undo(event)">
                    <font-awesome-icon :icon="['fas', 'undo']" />
                </button>
                <button class="delete" v-if="!event.paused" @click.stop="clear(event)">
                    <font-awesome-icon :icon="['fas', 'xmark-circle']" />
                </button>
                <div v-if="!event.paused" class="elapsed" :style="{
                    animation: `${EVENT_BOUNCE_TIME / 1000}s linear grow`,
                }"></div>
            </li>
        </TransitionGroup>
    </section>
</template>

<style>
@keyframes grow {
    0% {
        width: 0%;
    }

    100% {
        width: 100%;
    }
}

@keyframes glow {
    0%,100% {
        background-color: var(--color-background-soft);
    }

    50% {
        background-color: var(--color-background-high);
    }
}

section {
    position: fixed;
    bottom: 0.5em;
    right: 0.5em;
}

.elapsed {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-bottom-left-radius: 0.25em;
    height: 0.3em;
    background-color: red;
}

.event {
    user-select: none;
    position: relative;
    border: solid 1px var(--color-text);
    background: var(--color-background-soft);
    border-radius: 0.25em;
    padding: 0.5em 1em;

    display: flex;
    gap: 1em;
    align-items: center;
}

.event.paused {
    animation: 2s linear infinite glow;
}

ul {
    display: flex;
    flex-direction: column;
    gap: 0.3em;
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
</style>
