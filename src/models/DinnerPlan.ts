import Recipie from "./Recipie"
import RecipieIngredient from "./RecipieIngredient"

export enum PlanDay {
    Monday = "Monday",
    Tuesday = "Tuesday",
    Wednesday = "Wednesday",
    Thursday = "Thursday",
    Friday = "Friday",
    Saturday = "Saturday",
    Sunday = "Sunday"
}

const days = [
    PlanDay.Saturday,
    PlanDay.Sunday,
    PlanDay.Monday,
    PlanDay.Tuesday,
    PlanDay.Wednesday,
    PlanDay.Thursday,
    PlanDay.Friday,
];

export default class DinnerPlan {
    public id: number
    public day: PlanDay
    public recipie: Recipie
    public portions: number

    constructor(id: number, day: PlanDay, recipie: Recipie, portions: number) {
        this.id = id;
        this.day = day
        this.recipie = recipie
        this.portions = portions
    }

    getIngredients(): RecipieIngredient[] {
        return this.recipie.getIngredients(this.portions);
    }

    static Compare(a: DinnerPlan, b: DinnerPlan): number {
        // compare days based on their index in the days array
        const dayA = days.indexOf(a.day);
        const dayB = days.indexOf(b.day);
        if (dayA < dayB) {
            return -1;
        }

        if (dayA > dayB) {
            return 1;
        }

        return 0;
    }
}