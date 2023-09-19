<script setup lang="ts">
  import { ref } from "vue";
  const form = ref<HTMLFormElement | null>(null);

  defineProps<{
    title: string
    submitLabel?: string
    cancelLabel?: string
  }>()

  const emit = defineEmits(['submit', 'cancel'])

  function submit() {
    console.log(form.value);

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
    <form ref="form">
      <slot></slot>
    </form>
    <div class="button-pair">
      <button type="reset" @click.prevent="$emit('cancel')">{{ cancelLabel || "Cancel" }}</button>
      <button type="submit" @click.prevent="submit">{{ submitLabel || "Submit" }}</button>
    </div>
  </main>
</template>