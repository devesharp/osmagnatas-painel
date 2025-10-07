-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_inadimplencia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer_id" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    "amount_payed" REAL NOT NULL DEFAULT 0,
    "payed" BOOLEAN NOT NULL DEFAULT false,
    "created_by" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "inadimplencia_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "inadimplencia_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_inadimplencia" ("amount", "createdAt", "created_by", "customer_id", "id", "payed", "updatedAt") SELECT "amount", "createdAt", "created_by", "customer_id", "id", "payed", "updatedAt" FROM "inadimplencia";
DROP TABLE "inadimplencia";
ALTER TABLE "new_inadimplencia" RENAME TO "inadimplencia";
CREATE TABLE "new_transactions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer_id" INTEGER NOT NULL,
    "inadimplencia_id" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "payment_type" TEXT NOT NULL DEFAULT 'OUT',
    "notes" TEXT,
    "amount" REAL NOT NULL,
    "moeda" TEXT NOT NULL DEFAULT 'USD',
    "expired_at" DATETIME,
    "payed_at" DATETIME,
    "created_by" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "transactions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "transactions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "transactions_inadimplencia_id_fkey" FOREIGN KEY ("inadimplencia_id") REFERENCES "inadimplencia" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_transactions" ("amount", "createdAt", "created_by", "customer_id", "expired_at", "id", "moeda", "notes", "payed_at", "payment_type", "status", "updatedAt") SELECT "amount", "createdAt", "created_by", "customer_id", "expired_at", "id", "moeda", "notes", "payed_at", "payment_type", "status", "updatedAt" FROM "transactions";
DROP TABLE "transactions";
ALTER TABLE "new_transactions" RENAME TO "transactions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
