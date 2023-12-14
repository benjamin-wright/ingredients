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
('cans', ' can', ' cans', 3, 1);

CREATE TABLE "ingredients" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL UNIQUE,
    "category_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE CASCADE
);
