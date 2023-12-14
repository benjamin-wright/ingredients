<script setup lang="ts">
  import { onMounted, ref } from "vue";

  import NewThing from "@/components/NewThing.vue";
  import PopUp from "@/components/PopUp.vue";
  import ExpanderButton from "@/components/ExpanderButton.vue";

  const loading = ref(true);
  const err = ref("");
  const collapsed = ref({} as Record<string, boolean>);
  const need = ref(true);
  const popup = ref(false);

  onMounted(async () => {

  });

  async function reset() {
    popup.value = !popup.value;
  }

</script>

<template>
  <main>
    <template v-if="loading">Loading...</template>
    <template v-else-if="err">{{ err }}</template>
    <template v-else>
      <h1>Shopping List</h1>
      <ul class="big-window">
        <li v-for="category in nonEmptyCategories" :key="category.id">
          <span class="horizontal">
            <ExpanderButton v-model="collapsed[category.name]" />
            <h2 @click.prevent="collapsed[category.name] = !collapsed[category.name]">
              {{ category.name }}{{ collapsed[category.name] ? ` (${categorisedItems[category.name].length + categorisedCustomItems[category.name].length})` : '' }}
            </h2>
          </span>
          <ul v-if="!collapsed[category.name]">
            <li class="checkbox" v-for="item in categorisedItems[category.name]" :key="item.id">
              <label>{{ item.toString() }}</label>
              <button @click.stop="check(item)">
                <font-awesome-icon :icon="['fas', item.need ? 'square' : 'check-square']" />
              </button>
            </li>
            <li class="checkbox" v-for="item in categorisedCustomItems[category.name]" :key="item.id">
              <label>{{ item.name }}</label>
              <button @click.stop="checkCustom(item)">
                <font-awesome-icon :icon="['fas', item.need ? 'square' : 'check-square']" />
              </button>
            </li>
          </ul>
        </li>
        <li v-if="need">
          <NewThing to="/list/custom" />
        </li>
      </ul>
      <div class="button-pair">
        <button type="button" @click.stop="need = !need">{{ need ? "Got" : "Need" }}</button>
        <button type="reset" @click.stop="popup = !popup">Reset</button>
      </div>
      <PopUp v-if="popup" message="Are you sure?" @submit="reset()" @cancel="popup = !popup" />
    </template>
  </main>
</template>

<style scoped>

.checkbox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5em;
  background: var(--color-background-soft);
  border-radius: 0.25em;
  padding: 0 0.5em;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

</style>
