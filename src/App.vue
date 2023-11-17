<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavTab from './components/NavTab.vue'
import EventsList from './components/EventsList.vue';
</script>

<template>
  <header>
    <nav>
      <NavTab to="/" content="H" />
      <NavTab to="/categories" content="C" />
      <NavTab to="/ingredients" content="I" />
      <NavTab to="/recipies" content="R" />
      <NavTab to="/planner" content="P" />
      <NavTab to="/list" content="L" />
    </nav>
  </header>

  <RouterView />
  <EventsList />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

a {
  margin: 0 0.5em;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
