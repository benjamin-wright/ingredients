import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import IngredientsView from '../views/IngredientsView.vue'
import IngredientsNewView from '../views/IngredientsNewView.vue'
import UnitsView from '../views/UnitsView.vue'
import UnitsNewView from '../views/UnitsNewView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import CategoriesNewView from '../views/CategoriesNewView.vue'
import RecipiesView from '../views/RecipiesView.vue'
import RecipiesNewView from '../views/RecipiesNewView.vue'
import RecipieIngredientsView from '../views/RecipieIngredientsView.vue'
import RecipiesNewStepsView from '../views/RecipiesNewStepsView.vue'
import PlannerView from '../views/PlannerView.vue'
import PlannerNewNonDinnerView from '../views/PlannerNewNonDinnerView.vue'
import PlannerNewDinnerView from '../views/PlannerNewDinnerView.vue'
import ListView from '../views/ListView.vue'
import ListCustomView from '../views/ListCustomView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/units',
      name: 'units',
      component: UnitsView
    },
    {
      path: '/units/new',
      name: 'new-units',
      component: UnitsNewView
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
      path: '/recipies/new',
      name: 'new-recipie',
      component: RecipiesNewView
    },
    {
      path: '/recipies/:id/ingredients',
      name: 'recipie-ingredients',
      component: RecipieIngredientsView
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
      path: '/planner/:meal/new',
      name: 'new-non-dinner-planner',
      component: PlannerNewNonDinnerView
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
    {
      path: '/list/custom',
      name: 'list-custom',
      component: ListCustomView
    }
  ]
})

export default router
