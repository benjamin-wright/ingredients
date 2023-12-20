<script setup lang="ts">
  import { ref } from "vue";
  import ExpanderButton from "@/components/ExpanderButton.vue";

  const props = defineProps<{
    title: string
    expanded?: boolean
  }>();

  const _expanded = ref(props.expanded);
</script>

<template>
  <section>
    <span class="horizontal" @click.stop="_expanded = !_expanded">
      <h2>{{ props.title }}</h2>
      <ExpanderButton v-model="_expanded" />
    </span>
    <template v-if="_expanded">
      <slot></slot>
    </template>
  </section>
</template>

<style scoped>
  h2 {
    flex-grow: 1
  }
</style>
