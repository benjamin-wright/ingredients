import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import IngredientsView from '../views/IngredientsView.vue'
import NewIngredientView from '../views/NewIngredientView.vue'
import RecipiesView from '../views/RecipiesView.vue'
import PlannerView from '../views/PlannerView.vue'

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
      path: '/ingredients/new',
      name: 'new-ingredient',
      component: NewIngredientView
    },
    {
      path: '/Recipies',
      name: 'Recipies',
      component: RecipiesView
    },
    {
      path: '/planner',
      name: 'planner',
      component: PlannerView
    },
  ]
})

export default router
