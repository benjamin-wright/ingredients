import { type LocationQueryValue, type Router } from 'vue-router'

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

export function idFromQuery(r: Router, param: string): () => number | null {
    return () => {
        const id = r.currentRoute.value.query[param];
        if (id === undefined) {
            return null;
        }

        let value: LocationQueryValue;
        if (Array.isArray(id)) {
            value = id[0];
        } else {
            value = id;
        }

        if (value === null) {
            return null;
        }

        return parseInt(value);
    }
}