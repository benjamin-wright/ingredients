import Recipie, { RecipieIngredient } from "./Recipie"
import ShoppingList from "./ShoppingList"

export default class MealPlan {
    public startDate: Date
    public monday: MealPlanDay
    public tuesday: MealPlanDay
    public wednesday: MealPlanDay
    public thursday: MealPlanDay
    public friday: MealPlanDay
    public saturday: MealPlanDay
    public sunday: MealPlanDay

    constructor(startDate: Date, monday: MealPlanDay, tuesday: MealPlanDay, wednesday: MealPlanDay, thursday: MealPlanDay, friday: MealPlanDay, saturday: MealPlanDay, sunday: MealPlanDay) {
        this.startDate = startDate
        this.monday = monday
        this.tuesday = tuesday
        this.wednesday = wednesday
        this.thursday = thursday
        this.friday = friday
        this.saturday = saturday
        this.sunday = sunday
    }

    getShoppingList() {
        const shoppingList = new ShoppingList();
        
        this.monday.getIngredients().forEach((i) => shoppingList.addIngredient(i.ingredient, i.quantity));
        this.tuesday.getIngredients().forEach((i) => shoppingList.addIngredient(i.ingredient, i.quantity));
        this.wednesday.getIngredients().forEach((i) => shoppingList.addIngredient(i.ingredient, i.quantity));
        this.thursday.getIngredients().forEach((i) => shoppingList.addIngredient(i.ingredient, i.quantity));
        this.friday.getIngredients().forEach((i) => shoppingList.addIngredient(i.ingredient, i.quantity));
        this.saturday.getIngredients().forEach((i) => shoppingList.addIngredient(i.ingredient, i.quantity));
        this.sunday.getIngredients().forEach((i) => shoppingList.addIngredient(i.ingredient, i.quantity));
        
        return shoppingList;
    }
}

export class MealPlanDay {
    public day: string
    public recipie: Recipie
    public portions: number

    constructor(day: string, recipie: Recipie, portions: number) {
        this.day = day
        this.recipie = recipie
        this.portions = portions
    }

    getIngredients(): RecipieIngredient[] {
        return this.recipie.getIngredients(this.portions);
    }
}