import Recipie from "./Recipie";
import { test, describe, expect } from "vitest";
import RecipieIngredient from "./RecipieIngredient";
import IngredientType from "./IngredientType";
import Category from "./Category";
import { quantityUnitFromString } from "./QuantityUnit";

function fromString(str: string): RecipieIngredient {
    // convert a string in the format "ingredient: quantity unit" to a RecipieIngredient
    const [name, quantity, unit] = str.split(" ");
    return new RecipieIngredient(new IngredientType(1, name, new Category(1, 1, "category")), quantityUnitFromString(unit), Number(quantity));
}

describe("Recipie", () => {
    describe("getIngredients", () => {
        const recipie = new Recipie(1, "recipie", "description", 2, [
            fromString("ingredient1: 2 Liter"),
            fromString("ingredient2: 5 Gram"),
        ], []);

        test("Should return the ingredients with the correct quantities", () => {
            const recipie = new Recipie(1, "recipie", "description", 2, [], []);
            expect(recipie.getIngredients(1)).toEqual([]);
        });

        test("Should return the ingredients with the correct quantities when scaling down", () => {
            expect(recipie.getIngredients(1)).toEqual([
                fromString("ingredient1: 1 Liter"),
                fromString("ingredient2: 2.5 Gram"),
            ]);
        });

        test("Should return the ingredients with the correct quantities when scaling up", () => {
            expect(recipie.getIngredients(3)).toEqual([
                fromString("ingredient1: 3 Liter"),
                fromString("ingredient2: 7.5 Gram"),
            ]);
        });
    });
});