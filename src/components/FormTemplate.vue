<script setup lang="ts">
  import { ref } from "vue";
  const form = ref<HTMLFormElement | null>(null);

  const props = defineProps<{
    title: string
    submitLabel?: string
    cancelLabel?: string
  }>()

  const emit = defineEmits(['submit', 'cancel'])
  const resetType = props.cancelLabel ? 'button' : 'reset';
  const submitType = props.submitLabel ? 'button' : 'submit';

  function submit() {
    if (!form.value?.checkValidity()) {
      form.value?.reportValidity();
      return;
    }

    emit('submit')
  }
</script>

<template>
  <main>
    <h2>{{ title }}</h2>
    <form ref="form" class="multi-input" @submit.prevent="submit">
      <slot></slot>
    </form>
    <div class="button-pair">
      <button :type=resetType @click.prevent="$emit('cancel')">{{ cancelLabel || "Cancel" }}</button>
      <button :type=submitType @click.prevent="submit">{{ submitLabel || "Save" }}</button>
    </div>
  </main>
</template>