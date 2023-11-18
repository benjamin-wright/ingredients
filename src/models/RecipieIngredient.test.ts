import Category from "./Category";
import IngredientType from "./IngredientType";
import { QuantityUnit } from "./QuantityUnit";
import RecipieIngredient from "./RecipieIngredient";
import { describe, test, expect } from "vitest";

describe("RecipieIngredient", () => {
    describe("toString", () => {
        test("Should omit quantity if unit is Unit", () => {
            const ingredient = new RecipieIngredient(new IngredientType(1, "ingredient", new Category(1, 1, "category")), QuantityUnit.Unit, 1);
            expect(ingredient.toString()).toBe("1 ingredient");
        });

        test("Should pluralise quantity if greater than 1", () => {
            const ingredient = new RecipieIngredient(new IngredientType(1, "ingredient", new Category(1, 1, "category")), QuantityUnit.Gram, 2);
            expect(ingredient.toString()).toBe("2 Grams ingredient");
        });
    });
});