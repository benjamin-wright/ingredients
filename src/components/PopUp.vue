<script setup lang="ts">
import { defineEmits, defineProps } from "vue";

const props = defineProps<{
  message: string
}>();

const emits = defineEmits(["cancel", "submit"]);
</script>

<template>
    <section>
        <form>
            <h1>{{ props.message }}</h1>
            <div class="button-pair">
                <button type="reset" @click.prevent="emits('cancel')">Cancel</button>
                <button type="submit" @click.prevent="emits('submit')">OK</button>
            </div>
        </form>
    </section>
</template>

<style scoped>
    section {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: var(--color-background-overlay);
    }

    form {
        flex-grow: 0;
        align-items: center;
        background: var(--color-background);
        padding: 2em;
        border-radius: 1em;
    }
</style>