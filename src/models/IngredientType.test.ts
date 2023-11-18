import IngredientType from "./IngredientType";
import Category from "./Category";
import { test, describe, expect } from "vitest";

describe("IngredientType", () => {
    describe("Compare", () => {
        const ingredientA = new IngredientType(1, "IngredientA", new Category(1, 1, "category 1"));
        const ingredientB = new IngredientType(1, "IngredientB", new Category(1, 1, "category 1"));

        test("Should return 0 if the ingredient types are the same", () => {
            expect(IngredientType.Compare(ingredientA, ingredientA)).toBe(0);
        });

        test("Should return -1 if the first ingredient type is before the second", () => {
            expect(IngredientType.Compare(ingredientA, ingredientB)).toBe(-1);
        });

        test("Should return 1 if the first ingredient type is after the second", () => {
            expect(IngredientType.Compare(ingredientB, ingredientA)).toBe(1);
        });
    });
});