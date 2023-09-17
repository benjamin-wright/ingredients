import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import IngredientsView from '../views/IngredientsView.vue'
import NewIngredientView from '../views/NewIngredientView.vue'
import RecipiesView from '../views/RecipiesView.vue'
import NewRecipieNameView from '../views/NewRecipieNameView.vue'
import NewRecipieIngredientsView from '../views/NewRecipieIngredientsView.vue'
import PlannerView from '../views/PlannerView.vue'
import ListView from '../views/ListView.vue'

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
      path: '/recipies',
      name: 'Recipies',
      component: RecipiesView
    },
    {
      path: '/recipies/new/name',
      name: 'new-recipie-name',
      component: NewRecipieNameView
    },
    {
      path: '/recipies/new/ingredients',
      name: 'new-recipie-ingredients',
      component: NewRecipieIngredientsView
    },
    {
      path: '/planner',
      name: 'planner',
      component: PlannerView
    },
    {
      path: '/list',
      name: 'list',
      component: ListView
    },
  ]
})

export default router
