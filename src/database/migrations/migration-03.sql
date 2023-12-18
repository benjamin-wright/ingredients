CREATE TABLE "shopping_list_items" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "quantity" REAL NOT NULL,
    "unit_id" INTEGER NOT NULL,
    "got" BOOLEAN NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("unit_id") REFERENCES "units" ("id") ON DELETE CASCADE
);
