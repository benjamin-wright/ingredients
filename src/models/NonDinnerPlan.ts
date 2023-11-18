import Recipie from "./Recipie"
import RecipieIngredient from "./RecipieIngredient"

export enum Meal {
    Breakfast = "Breakfast",
    Lunch = "Lunch"
}

export default class NonDinnerPlan {
    id: number
    meal: Meal
    days: number
    people: number
    recipie: Recipie

    constructor(id: number, meal: Meal, days: number, people: number, recipie: Recipie) {
        this.id = id;
        this.meal = meal
        this.days = days
        this.people = people
        this.recipie = recipie
    }

    getIngredients(): RecipieIngredient[] {
        return this.recipie.getIngredients(this.days * this.people);
    }
}