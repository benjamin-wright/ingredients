<script setup lang="ts">
  import { onMounted, ref, computed } from "vue";

  import { type ListItem } from "@/database/models/list";
  import CollapsibleSection from "@/components/CollapsibleSection.vue";

  const loading = ref(true);
  const got = ref(false);
  const items = ref([] as ListItem[]);

  const categorisedItems = computed(() => {
    const categories = new Map<string, ListItem[]>();
    for (const item of items.value) {
      if (item.got !== got.value) {
        continue;
      }

      if (!categories.has(item.category)) {
        categories.set(item.category, []);
      }
      categories.get(item.category)?.push(item);
    }
    return categories;
  });

  const nonEmptyCategories = computed(() => {
    const filtered: string[] = [];

    for (const key in categorisedItems.value.keys()) {
      if (categorisedItems.value.get(key)?.length) {
        filtered.push(key);
      }
    }

    return filtered;
  });

  onMounted(async () => {
    loading.value = false;
  });

  async function check(item: ListItem) {
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
              <li class="checkbox" v-for="item in categorisedItems.get(category)" :key="item.id">
                <label>{{ item.toString() }}</label>
                <button @click.stop="check(item)">
                  <font-awesome-icon :icon="['fas', item.got ? 'check-square' : 'square']" />
                </button>
              </li>
            </ul>
          </CollapsibleSection>
        </li>
      </ul>
      <div class="button-pair">
        <button type="button" @click.stop="got = !got">{{ got ? "Need" : "Got" }}</button>
        <button type="reset" @click.stop="console.log('hi')">Reset</button>
      </div>
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
