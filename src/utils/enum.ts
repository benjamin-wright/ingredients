export function keysOf(e: any): string[] {
    return Object.keys(e).filter(k => typeof e[k as any] === "number")
}

export function fromKey<E>(key: string, e: any): E {
    return e[key as keyof E]
}