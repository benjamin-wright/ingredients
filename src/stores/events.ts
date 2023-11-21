import { defineStore } from 'pinia'

export const EVENT_BOUNCE_TIME = 5000;

export class Event {
    id: number = 0
    createdAt: number
    message: string
    paused: boolean = false
    timeout: NodeJS.Timeout | undefined
    undo: () => Promise<void>

    constructor(message: string, undo: () => Promise<void>) {
        this.createdAt = Date.now();
        this.message = message;
        this.undo = undo;
    }

    pause(): void {
        this.paused = true;
    }

    resume(): void {
        this.paused = false;
        this.createdAt = Date.now();
    }
}

let nextId = 0;

export const useEventsStore = defineStore('events', {
    state: () => ({
        events: [] as Event[]
    }),
    actions: {
        clear() {
            this.events = [];
        },
        add(event: Event) {
            console.log(`Added event ${event.message}`);
            nextId++;
            event.id = nextId;
            event.timeout = setTimeout(() => {
                this.remove(event);
            }, EVENT_BOUNCE_TIME);

            this.events.push(event);
        },
        pause(event: Event) {
            clearTimeout(event.timeout);
            delete event.timeout;
            event.pause();
        },
        resume(event: Event) {
            event.resume();
            event.timeout = setTimeout(() => {
                this.remove(event);
            }, EVENT_BOUNCE_TIME);
        },
        remove(event: Event) {
            const index = this.events.findIndex(e => e.id === event.id);
            if (index >= 0) {
                this.events.splice(index, 1);
            }
        }
    }
})
