import { defineStore } from 'pinia'

export const EVENT_BOUNCE_TIME = 5000;

export class Event {
    id: number = 0
    createdAt: Date
    message: string
    undo: () => Promise<void>

    constructor(message: string, undo: () => Promise<void>) {
        this.createdAt = new Date();
        this.message = message;
        this.undo = undo;
    }
}

let nextId = 0;

export const useEventsStore = defineStore('events', {
    state: () => ({
        events: [] as Event[]
    }),
    actions: {
        add(event: Event) {
            nextId++;
            event.id = nextId;

            this.events.push(event);
            setTimeout(() => {
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
