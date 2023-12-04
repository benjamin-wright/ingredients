import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import IngredientsView from '../views/IngredientsView.vue'
import IngredientsEditView from '../views/IngredientsEditView.vue'
import UnitsView from '../views/UnitsView.vue'
import UnitsEditView from '../views/UnitsEditView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import CategoriesEditView from '../views/CategoriesEditView.vue'
import RecipiesView from '../views/RecipiesView.vue'
import RecipieEditView from '../views/RecipieEditView.vue'
import RecipieIngredientsView from '../views/RecipieIngredientsView.vue'
import RecipieIngredientEditView from '../views/RecipieIngredientEditView.vue'
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
      component: UnitsEditView
    },
    {
      path: '/units/:id',
      name: 'edit-units',
      component: UnitsEditView
    },
    {
      path: '/categories',
      name: 'categories',
      component: CategoriesView
    },
    {
      path: '/categories/new',
      name: 'new-categories',
      component: CategoriesEditView
    },
    {
      path: '/categories/:id',
      name: 'edit-categories',
      component: CategoriesEditView
    },
    {
      path: '/ingredients',
      name: 'ingredients',
      component: IngredientsView
    },
    {
      path: '/ingredients/new',
      name: 'new-ingredient',
      component: IngredientsEditView
    },
    {
      path: '/ingredients/:id',
      name: 'edit-ingredient',
      component: IngredientsEditView
    },
    {
      path: '/recipies',
      name: 'Recipies',
      component: RecipiesView
    },
    {
      path: '/recipies/new',
      name: 'new-recipie',
      component: RecipieEditView
    },
    {
      path: '/recipies/:id',
      name: 'edit-recipie',
      component: RecipieEditView
    },
    {
      path: '/recipies/:id/ingredients',
      name: 'recipie-ingredients',
      component: RecipieIngredientsView
    },
    {
      path: '/recipies/:recipieId/ingredients/new',
      name: 'new-recipie-ingredient',
      component: RecipieIngredientEditView
    },
    {
      path: '/recipies/:recipieId/ingredients/:ingredientId',
      name: 'edit-recipie-ingredient',
      component: RecipieIngredientEditView
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
