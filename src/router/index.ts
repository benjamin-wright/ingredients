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
import PlannerView from '../views/PlannerView.vue'
import PlannerNonDinnerEditView from '../views/PlannerNonDinnerEditView.vue'
import PlannerDinnerEditView from '../views/PlannerDinnerEditView.vue'
import PlannerExtraEditView from '../views/PlannerExtraEditView.vue'
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
      path: '/planner',
      name: 'planner',
      component: PlannerView
    },
    {
      path: '/planner/breakfasts/new',
      name: 'new-planner-breakfast',
      component: PlannerNonDinnerEditView,
      props: { mealType: 'breakfast' }
    },
    {
      path: '/planner/breakfasts/:id',
      name: 'edit-planner-breakfast',
      component: PlannerNonDinnerEditView,
      props: { mealType: 'breakfast' }
    },
    {
      path: '/planner/lunches/new',
      name: 'new-planner-lunch',
      component: PlannerNonDinnerEditView,
      props: { mealType: 'lunch' }
    },
    {
      path: '/planner/lunches/:id',
      name: 'edit-planner-lunch',
      component: PlannerNonDinnerEditView,
      props: { mealType: 'lunch' }
    },
    {
      path: '/planner/dinners/new',
      name: 'new-planner-dinner',
      component: PlannerDinnerEditView
    },
    {
      path: '/planner/dinners/:id',
      name: 'edit-planner-dinner',
      component: PlannerDinnerEditView
    },
    {
      path: '/planner/extras/new',
      name: 'new-planner-extra',
      component: PlannerExtraEditView
    },
    {
      path: '/planner/extras/:id',
      name: 'edit-planner-extra',
      component: PlannerExtraEditView
    },
    {
      path: '/list',
      name: 'list',
      component: ListView
    },
  ]
})

export default router
