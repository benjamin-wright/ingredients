import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import IngredientsView from '../views/IngredientsView.vue'
import RecipiesView from '../views/RecipiesView.vue'
import ScheduleView from '../views/ScheduleView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/ingredients',
      name: 'ingredients',
      component: IngredientsView
    },
    {
      path: '/Recipies',
      name: 'Recipies',
      component: RecipiesView
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: ScheduleView
    },
  ]
})

export default router
