<script setup lang="ts">
  import { onMounted, computed, ref } from "vue";
  import { useShoppingListStore } from '@/stores/shopping-list';
  import { useCategoriesStore } from "@/stores/categories";
  import type ShoppingListItem from "@/models/ShoppingListItem";

  const store = useShoppingListStore();
  const categories = useCategoriesStore();
  let collapsed = ref({} as Record<string, boolean>);

  onMounted(() => {
    store.load();
    categories.load();
  });

  async function reset() {
    await store.clear();
    await store.generate();
  }

  const categorisedItems = computed(() => categories.categories.reduce((map: Record<string, ShoppingListItem[]>, category) => {
    map[category.name] = store.items.filter(item => item.item.category.id === category.id && item.need);
    return map;
  }, {}));

  const nonEmptyCategories = computed(() => categories.categories.filter(category => categorisedItems.value[category.name].length > 0));

  function collapse(category: string) {
    collapsed.value[category] = true;
  }

  function expand(category: string) {
    collapsed.value[category] = false;
  }

  function check(item: ShoppingListItem) {
    store.toggle(item.id, !item.need);
  }
</script>

<template>
  <main>
    <template v-if="store.loading">Loading...</template>
    <template v-else-if="store.error">{{ store.error }}</template>
    <template v-else>
      <ul class="big-window">
        <li v-for="category in nonEmptyCategories" :key="category.id">
          <span class="horizontal">
            <button v-if="collapsed[category.name]" @click.stop="expand(category.name)">
              <font-awesome-icon :icon="['fas', 'plus-square']" />
            </button>
            <button v-else @click.stop="collapse(category.name)">
              <font-awesome-icon :icon="['fas', 'minus-square']" />
            </button>
            <h2>{{ category.name }}{{ collapsed[category.name] ? ` (${categorisedItems[category.name].length})` : '' }}</h2>
          </span>
          <ul v-if="!collapsed[category.name]">
            <li class="checkbox" v-for="item in categorisedItems[category.name]" :key="item.id">
              <label>{{ item.toString() }}</label>
              <button @click.stop="check(item)">
                <font-awesome-icon :icon="['fas', item.need ? 'square' : 'check-square']" />
              </button>
            </li>
          </ul>
        </li>
      </ul>
      <button type="reset" @click.stop="reset()">Reset</button>
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

</style>