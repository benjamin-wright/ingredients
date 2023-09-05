<script setup lang="ts">
import IngredientType from "../models/IngredientType"

defineProps<{
  ingredients: IngredientType[]
}>()
</script>

<template>
<div class="ingredient-list">
  <div v-for="ingredient in ingredients" :key="ingredient.id">
    <h2>{{ ingredient.name }}</h2>
  </div>
</div>
</template>