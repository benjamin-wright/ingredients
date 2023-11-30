CREATE TABLE "categories" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL UNIQUE,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "units" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL UNIQUE,
    "singular" TEXT NOT NULL,
    "plural" TEXT NOT NULL,
    "kind" INTEGER NOT NULL,
    "conversion" REAL NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "units"
("name", "singular", "plural", "kind", "conversion")
VALUES
('grams', 'g', 'g', 1, 1),
('kilograms', 'kg', 'kg', 1, 1000),
('millilitres', 'ml', 'ml', 2, 1),
('litres', 'l', 'l', 2, 1000),
('count', '', '', 3, 1),
('cans', 'can', 'cans', 3, 1);

CREATE TABLE "ingredients" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL UNIQUE,
    "category_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE CASCADE
);

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

CREATE TABLE "recipie_steps" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "recipie_id" INTEGER NOT NULL,
    "step" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("recipie_id") REFERENCES "recipies" ("id") ON DELETE CASCADE
);

CREATE TABLE "dinner_plans" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "day" INTEGER,
    "recipie_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("recipie_id") REFERENCES "recipies" ("id") ON DELETE CASCADE
);

CREATE TABLE "non_dinner_plans" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "people" INTEGER,
    "portions" INTEGER,
    "recipie_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("recipie_id") REFERENCES "recipies" ("id") ON DELETE CASCADE
);

CREATE TABLE "shopping_list_items" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "ingredient_id" INTEGER NOT NULL,
    "quantity" REAL NOT NULL,
    "quantity_unit_id" INTEGER NOT NULL,
    "got" BOOLEAN NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("ingredient_id") REFERENCES "ingredients" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("quantity_unit_id") REFERENCES "quantity_units" ("id") ON DELETE CASCADE
);

CREATE TABLE "shopping_list_custom_items" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL UNIQUE,
    "quantity" REAL NOT NULL,
    "quantity_unit_id" INTEGER NOT NULL,
    "got" BOOLEAN NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("quantity_unit_id") REFERENCES "quantity_units" ("id") ON DELETE CASCADE
);
