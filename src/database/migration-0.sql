CREATE TABLE "categories" {
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
};

CREATE TABLE "quantity_units" {
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "singular" TEXT NOT NULL,
    "plural" TEXT NOT NULL,
    "is_unit" BOOLEAN NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
};

CREATE TABLE "ingredients" {
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE CASCADE
};

CREATE TABLE "recipies" {
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
};

CREATE TABLE "recipie_ingredients" {
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "recipie_id" INTEGER NOT NULL,
    "ingredient_id" INTEGER NOT NULL,
    "quantity" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("recipie_id") REFERENCES "recipies" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("ingredient_id") REFERENCES "ingredients" ("id") ON DELETE CASCADE
};

CREATE TABLE "recipie_steps" {
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "recipie_id" INTEGER NOT NULL,
    "step" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("recipie_id") REFERENCES "recipies" ("id") ON DELETE CASCADE
};

CREATE TABLE "dinner_plans" {
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "day" INTEGER,
    "recipie_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("recipie_id") REFERENCES "recipies" ("id") ON DELETE CASCADE
};

CREATE TABLE "non_dinner_plans" {
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "people" INTEGER,
    "portions" INTEGER,
    "recipie_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("recipie_id") REFERENCES "recipies" ("id") ON DELETE CASCADE
};

CREATE TABLE "shopping_list_items" {
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "ingredient_id" INTEGER NOT NULL,
    "quantity" REAL NOT NULL,
    "quantity_unit_id" INTEGER NOT NULL,
    "got" BOOLEAN NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("ingredient_id") REFERENCES "ingredients" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("quantity_unit_id") REFERENCES "quantity_units" ("id") ON DELETE CASCADE
};

CREATE TABLE "shopping_list_custom_items" {
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "quantity_unit_id" INTEGER NOT NULL,
    "got" BOOLEAN NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("quantity_unit_id") REFERENCES "quantity_units" ("id") ON DELETE CASCADE
};
