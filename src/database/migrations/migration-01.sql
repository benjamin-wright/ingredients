CREATE TABLE "recipies" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL UNIQUE,
    "description" TEXT NOT NULL,
    "servings" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "recipie_ingredients" (
    "recipie_id" INTEGER NOT NULL,
    "ingredient_id" INTEGER NOT NULL,
    "quantity" REAL NOT NULL,
    "unit_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("recipie_id", "ingredient_id"),
    FOREIGN KEY ("recipie_id") REFERENCES "recipies" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("ingredient_id") REFERENCES "ingredients" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("unit_id") REFERENCES "units" ("id") ON DELETE CASCADE
);
