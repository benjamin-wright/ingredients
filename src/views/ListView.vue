<script setup lang="ts">
  import { onMounted, ref, computed, inject } from "vue";

  import { type ListItem, getListItems, checkListItem } from "@/database/models/list";
  import CollapsibleSection from "@/components/CollapsibleSection.vue";
  import { type Category, type ICategoryProvider } from "@/database/models/category";

  const provider = inject<ICategoryProvider>("categories");
  const loading = ref(true);
  const got = ref(false);
  const items = ref([] as ListItem[]);
  const categories = ref([] as Category[]);

  const categorisedItems = computed(() => {
    const categories: Record<string, ListItem[]> = {};
    for (const item of items.value) {
      if (item.got != got.value) {
        continue;
      }

      if (!categories[item.category]) {
        categories[item.category] = [];
      }

      categories[item.category].push(item);
    }
    return categories;
  });

  const nonEmptyCategories = computed(() => {
    const filtered: string[] = [];

    categories.value.forEach(category => {
      if (categorisedItems.value[category.name]?.length) {
        filtered.push(category.name);
      }
    });

    return filtered;
  });

  onMounted(async () => {
    categories.value = await provider?.getCategories() || [];
    items.value = await getListItems();
    loading.value = false;
  });

  async function check(item: ListItem) {
    await checkListItem(item.id, !item.got);
    item.got = !item.got;
  }
</script>

<template>
  <main>
    <template v-if="loading">Loading...</template>
    <template v-else>
      <h1>Shopping List</h1>
      <ul class="big-window">
        <li v-for="category in nonEmptyCategories" :key="category">
          <CollapsibleSection
            :title="category"
            expanded
          >
            <ul>
              <li class="checkbox" v-for="item in categorisedItems[category]" :key="item.id">
                <label>{{ item.name }}: {{ item.quantity }}{{ item.quantity === 0 ? item.unitSingular : item.unitPlural }}</label>
                <button @click.stop="check(item)">
                  <font-awesome-icon :icon="['fas', item.got ? 'check-square' : 'square']" />
                </button>
              </li>
            </ul>
          </CollapsibleSection>
        </li>
      </ul>
      <button type="button" @click.stop="got = !got">{{ got ? "Need" : "Got" }}</button>
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

h1, li {
  text-transform: capitalize;
}

</style>
