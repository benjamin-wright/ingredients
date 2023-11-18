import IngredientType from "./IngredientType";
import { QuantityUnit, humanise } from "./QuantityUnit";

export default class ShoppingListItem {
    public id: number
    public item: IngredientType
    public quantity: number
    public unit: QuantityUnit
    public need: boolean

    constructor(id: number, item: IngredientType, quantity: number, unit: QuantityUnit) {
        this.id = id;
        this.item = item;
        this.quantity = quantity;
        this.unit = unit;
        this.need = true;
    }

    toString(): string {
        return `${humanise(this.unit, this.quantity)} ${this.item.name}`;
    }
}