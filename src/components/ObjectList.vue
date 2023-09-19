<script setup lang="ts" generic="T extends IListable">
export interface IListable {
  id: number
}

defineProps<{
  data: T[]
}>()

const emit = defineEmits<{
  (event: "delete", object: T): void
  (event: "edit", object: T): void
}>()

let selected: HTMLElement | null = null;

function select(event: MouseEvent) {
  selected?.classList.remove("selected");

  const element = event.currentTarget as HTMLElement;
  if (selected == element) {
    selected = null;
    return
  }

  selected = element;
  element.classList.add("selected");
}

function remove(object: T) {
  emit("delete", object);

  selected?.classList.remove("selected");
  selected = null;
}

function edit(object: T) {
  emit("edit", object)

  selected?.classList.remove("selected");
  selected = null;
}
</script>

<template>
  <div class="object-list">
    <TransitionGroup name="list">
      <div @click="select($event)" class="object" v-for="obj in data" :key="obj.id">
        <slot :obj="obj">
          <h2>{{ obj.id }}</h2>
        </slot>
        <div class="buttons">
          <button @click.stop="edit(obj)">
            ✎
          </button>
          <button @click.stop="remove(obj)">
            🗑
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
  .object-list {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }

  .object {
    padding: 0.5em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    border: solid 2px var(--color-border);
    border-radius: 0.3em;
  }

  button {
    display: none;
    border: none;
    background: none;
    color: yellow;
    padding: 0.1em;
  }

  button:hover {
    background: var(--color-background-soft);
  }

  .selected {
    background: var(--color-background-mute);
  }

  .selected button {
    display: inline;
  }

  .buttons :nth-child(1) {
    margin-right: 0.2em;
  }
</style>
