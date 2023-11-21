<script setup lang="ts">
  import { ref } from 'vue';
  import { useDinnerPlanStore } from '@/stores/dinner-plans';
  import { useNewRecipieStore } from '@/stores/new-recipie';
  import { useRecipieStore } from '@/stores/recipies';
  import { useIngredientsStore } from '@/stores/ingredients';
  import { useCategoriesStore } from '@/stores/categories';
  import { useEventsStore } from '@/stores/events';
  import PopUp from '@/components/PopUp.vue';
import ExpanderButton from '@/components/ExpanderButton.vue';

  async function clear() {
    await useDinnerPlanStore().clear();
    await useNewRecipieStore().clear();
    await useRecipieStore().clear();
    await useIngredientsStore().clear();
    await useCategoriesStore().clear();
    useEventsStore().clear();
    popup.value = false;
  }

  const popup = ref(false);
  const expanded = ref(false);
</script>

<template>
  <main>
    <section class="scroll">
      <h1>Welcome to <em>Nom Nom</em>!</h1>
      <p>
        This is a simple app to help you plan your meals and shopping list.
        It's designed to be used on a phone, so it's not very pretty on a desktop.
      </p>

      <section>
        <div class="horizontal">
          <ExpanderButton v-model="expanded" />
          <h2 @click.prevent="expanded = !expanded">How to use it</h2>
        </div>
        <div v-if="expanded">
          <p>The app is split into five sections that can be accessed from the menu at the top of the screen:</p>
          <dl>
            <dt>Categories: <em>C</em></dt>
            <dd>
              This is where you can add categories to the app.
              Categories represent ingredients that can be found together in the supermarket.
            </dd>
            <dt>Ingredients: <em>I</em></dt>
            <dd>
              This is where you can add ingredients to the app.
              You can add a name and a category for each ingredient.
            </dd>
            <dt>Recipies: <em>R</em></dt>
            <dd>
              This is where you can add recipies to the app.
              You can add a name, a list of ingredients, number of portions and a set of steps for each recipie.
            </dd>
            <dt>Planner: <em>P</em></dt>
            <dd>
              This is where you can plan your meals for the week.
              You can add a recipie for each day of the week, as well as breakfast and lunch options, and the app will use this to generate a shopping list.
            </dd>
            <dt>Shopping List: <em>L</em></dt>
            <dd>
              This is where you can see your shopping list.
              You can check off items as you buy them, and the app will remember what you've bought and what you still need.
              Press the <em>Got</em> or <em>Need</em> button to toggle between items you need to buy and items you've already bought.
            </dd>
          </dl>
        </div>
      </section>

      <section class="danger">
        <h2>Destructive stuff</h2>

        <p>
          If you want to start again, you can use the button below to clear all the data from the app.
          This will delete all your categories, ingredients, recipies, meal plans and shopping lists, so handle with care!
        </p>
    
        <button type="reset" @click.prevent="popup = !popup">Reset</button>
        <PopUp v-if="popup" message="This will permanently delete all your data. Are you sure?" @submit="clear()" @cancel="popup = !popup" />
      </section>

    </section>
  </main>
</template>

<style scoped>
  .scroll {
    overflow-y: scroll;
  }

  dt {
    font-weight: bold;
    margin-top: 1em;
  }

  .danger {
    background-color: var(--color-background-warn);
    padding: 0.5em;
    border-radius: 0.25em;
  }

  .danger h2 {
    color: var(--color-highlight);
  }
</style>