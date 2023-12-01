import { type Router } from 'vue-router'

export function idFromPath(r: Router, prop: string): () => number | null {
    return () => {
        const id = r.currentRoute.value.params[prop];
        if (id === undefined) {
            return null;
        }
    
        if (Array.isArray(id)) {
            return parseInt(id[0]);
        } else {
            return parseInt(id);
        }
    }
}