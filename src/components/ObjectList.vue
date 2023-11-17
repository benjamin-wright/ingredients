<script setup lang="ts" generic="T extends IListable">
export interface IListable {
  id: number
}

const props = defineProps<{
  data: T[]
  dropdown?: boolean
  reorder?: boolean
}>()

const emit = defineEmits<{
  (event: "delete", object: T): void
  (event: "edit", object: T): void
  (event: "move-up", object: T): void
  (event: "move-down", object: T): void
}>()

let selected: HTMLElement | null = null;

function select(event: MouseEvent) {
  selected?.classList.remove("selected");
  selected?.classList.remove("drop");

  const element = event.currentTarget as HTMLElement;
  if (selected == element) {
    selected = null;
    return
  }

  selected = element;
  element.classList.add("selected");
  if (props.dropdown) {
    element.classList.add("drop");
  }
}

function remove(object: T) {
  emit("delete", object);

  selected?.classList.remove("selected");
  selected?.classList.remove("drop");
  selected = null;
}

function edit(object: T) {
  emit("edit", object);

  selected?.classList.remove("selected");
  selected?.classList.remove("drop");
  selected = null;
}

function moveUp(object: T) {
  emit("move-up", object);
}

function moveDown(object: T) {
  emit("move-down", object);
}
</script>

<template>
  <div class="object-list">
    <TransitionGroup name="list">
      <div
        @click="select($event)"
        v-for="obj in data"
        :key="obj.id"
      >
        <div class="object" v-if="reorder">
          <div class="buttons">
            <button @click.stop="moveUp(obj)" >
              <font-awesome-icon :icon="['fas', 'chevron-circle-down']" />
            </button>
            <button @click.stop="moveDown(obj)">
              <font-awesome-icon :icon="['fas', 'chevron-circle-up']" />
            </button>
          </div>
          <slot :obj="obj" name="content">
            <h2>{{ obj.id }}</h2>
          </slot>
          <div class="buttons">
            <button @click.stop="edit(obj)">
              <font-awesome-icon :icon="['fas', 'pencil']" />
            </button>
            <button class="delete" @click.stop="remove(obj)">
              <font-awesome-icon :icon="['fas', 'trash']" />
            </button>
          </div>
        </div>
        <div class="select-dropdown">
          <slot :obj="obj" name="select-dropdown" />
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

  .drop .object {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  button {
    padding: 0;
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

  .buttons {
    display: none;
  }

  .selected .buttons {
    display: flex;
  }

  .buttons > :nth-child(1) {
    margin-right: 0.75em;
  }

  h2 {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .select-dropdown {
    height: 0;
    overflow: hidden;
  }

  .drop .select-dropdown {
    height: auto;
    border: solid 2px var(--color-border);
    border-top: none;
    border-radius: 0.3em;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
</style>
