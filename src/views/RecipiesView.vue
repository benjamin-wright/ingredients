<script lang="ts">
import { computed, onMounted } from "vue";
import { useRecipieStore } from "../stores/recipies";
import Recipie from "@/models/Recipie";
import RecipieList from "../components/RecipieList.vue";

export default {
  name: "RecipiesView",
  setup() {
    const store = useRecipieStore();
    
    const recipies = computed(() => store.recipies);
    const loading = computed(() => store.loading);
    const error = computed(() => store.error);

    onMounted(() => {
    });

    return {
      store,
      recipies,
      loading,
      error,
    };
  },
  methods: {
    newRecipie() {
      this.store.addRecipie(new Recipie(1, "New Recipie", 1, []));
    },
  },
  components: {
    RecipieList,
  },
};
</script>

<template>
  <div class="recipies">
    <h1>This is the recipies page</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <p>Num recipies: {{ store.recipiesCount }}</p>
      <RecipieList :recipies="store.recipies" />
      <button @click="newRecipie()">This</button>
    </div>
  </div>
</template>
