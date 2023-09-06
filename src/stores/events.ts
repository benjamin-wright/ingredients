import { defineStore } from 'pinia'

export interface IEvent {
    message: string
    undo: () => Promise<void>
}

export const useEventsStore = defineStore('events', {
    state: () => ({
        events: [] as IEvent[]
    }),
    actions: {
        add(event: IEvent) {
            this.events.push(event);
        },
        remove(event: IEvent) {
            const index = this.events.findIndex(e => e === event);
            this.events.splice(index, 1);
        }
    }
})
