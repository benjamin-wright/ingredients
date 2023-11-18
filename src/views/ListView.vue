<script setup lang="ts">
  import { onMounted } from "vue";
  import { useShoppingListStore } from '@/stores/shopping-list'

  const store = useShoppingListStore()

  onMounted(() => {
    store.load()
  });
</script>

<template>
  <main>
    <template v-if="store.loading">Loading...</template>
    <template v-else-if="store.error">{{ store.error }}</template>
    <template v-else>
      <h1>Shopping List</h1>
      <p>Ingredients:</p>
      <ul>
        <li v-for="item in store.items" :key="item.id">
          {{ item.item.name }} - {{ item.toString() }}
        </li>
      </ul>
    </template>
  </main>
</template>
