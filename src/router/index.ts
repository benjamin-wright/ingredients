import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import IngredientsView from '../views/IngredientsView.vue'
import IngredientsNewView from '../views/IngredientsNewView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import CategoriesNewView from '../views/CategoriesNewView.vue'
import RecipiesView from '../views/RecipiesView.vue'
import RecipiesNewNameView from '../views/RecipiesNewNameView.vue'
import RecipiesNewIngredientsView from '../views/RecipiesNewIngredientsView.vue'
import RecipiesNewStepsView from '../views/RecipiesNewStepsView.vue'
import PlannerView from '../views/PlannerView.vue'
import PlannerNewDinnerView from '../views/PlannerNewDinnerView.vue'
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
      path: '/categories',
      name: 'categories',
      component: CategoriesView
    },
    {
      path: '/categories/new',
      name: 'new-categories',
      component: CategoriesNewView
    },
    {
      path: '/ingredients',
      name: 'ingredients',
      component: IngredientsView
    },
    {
      path: '/ingredients/new',
      name: 'new-ingredient',
      component: IngredientsNewView
    },
    {
      path: '/recipies',
      name: 'Recipies',
      component: RecipiesView
    },
    {
      path: '/recipies/new/name',
      name: 'new-recipie-name',
      component: RecipiesNewNameView
    },
    {
      path: '/recipies/new/ingredients',
      name: 'new-recipie-ingredients',
      component: RecipiesNewIngredientsView
    },
    {
      path: '/recipies/new/steps',
      name: 'new-recipie-steps',
      component: RecipiesNewStepsView
    },
    {
      path: '/planner',
      name: 'planner',
      component: PlannerView
    },
    {
      path: '/planner/dinners/new',
      name: 'new-dinner-planner',
      component: PlannerNewDinnerView
    },
    {
      path: '/list',
      name: 'list',
      component: ListView
    },
  ]
})

export default router
