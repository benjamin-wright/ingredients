import Recipie from "./Recipie"
import RecipieIngredient from "./RecipieIngredient"

export default class Plan {
    public id: number
    public day: string
    public recipie: Recipie
    public portions: number

    constructor(id: number, day: string, recipie: Recipie, portions: number) {
        this.id = id;
        this.day = day
        this.recipie = recipie
        this.portions = portions
    }

    getIngredients(): RecipieIngredient[] {
        return this.recipie.getIngredients(this.portions);
    }

    static Compare(a: Plan, b: Plan): number {
        if (a.name < b.name) {
            return -1;
        }

        if (a.name > b.name) {
            return 1;
        }

        return 0;
    }
}