import Category from "./Category"
import { describe, test, expect } from "vitest" 

describe("Category", () => {
    describe("Compare", () => {
        test("Should return 0 if the categories are the same", () => {
            const category1 = new Category(1, 1, "cat 1");
            const category2 = new Category(2, 1, "cat 2");
            expect(Category.Compare(category1, category2)).toBe(0);
        });

        test("Should return -1 if the first category is before the second", () => {
            const category1 = new Category(1, 1, "cat 1");
            const category2 = new Category(2, 2, "cat 2");
            expect(Category.Compare(category1, category2)).toBe(-1);
        });

        test("Should return 1 if the first category is after the second", () => {
            const category1 = new Category(1, 2, "cat 1");
            const category2 = new Category(2, 1, "cat 2");
            expect(Category.Compare(category1, category2)).toBe(1);
        });
    });
});