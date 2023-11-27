<script setup lang="ts" generic="T extends IListable">
import { ref } from 'vue';

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
  (event: "swap", object1: T, object2: T): void
}>()

let selected: HTMLElement | null = null;
let resize = ref(false);

function select(event: MouseEvent) {
  selected?.classList.remove("selected");
  selected?.classList.remove("drop");
  resize.value = false;

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

function onResize() {
  resize.value = true;
}

</script>

<template>
  <div class="object-list">
    <TransitionGroup name="list">
      <div class="parent"
        @click="select($event)"
        v-for="(obj, idx) in data"
        :key="obj.id"
      >
        <div class="object">
          <slot :obj="obj" name="content">
            <h2>{{ obj.id }}</h2>
          </slot>
          <div class="buttons" v-if="!resize">
            <button @click.stop="edit(obj)">
              <font-awesome-icon :icon="['fas', 'pencil']" />
            </button>
            <button class="delete" @click.stop="remove(obj)">
              <font-awesome-icon :icon="['fas', 'trash']" />
            </button>
            <button @click.stop="onResize()" v-if="reorder">
              <font-awesome-icon :icon="['fas', 'up-down']" />
            </button>
          </div>
          <div class="buttons" v-if="resize">
            <button class="up" @click.stop="emit('swap', obj, data[idx+1])" >
              <font-awesome-icon :icon="['fas', 'chevron-circle-down']" />
            </button>
            <button class="down" @click.stop="emit('swap', obj, data[idx-1])">
              <font-awesome-icon :icon="['fas', 'chevron-circle-up']" />
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
    width: 1em;
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
    gap: 0.75em;
  }

  .selected .buttons {
    display: flex;
  }

  h2 {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  h2.centered {
    text-align: center;
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

  .parent:first-child .down {
    display: none;
  }

  .parent:last-child .up {
    display: none;
  }
</style>
