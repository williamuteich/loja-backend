/*
  Warnings:

  - You are about to drop the column `faviconUrl` on the `StoreConfiguration` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `StoreConfiguration` table. All the data in the column will be lost.
  - You are about to drop the column `ogImageUrl` on the `StoreConfiguration` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StoreConfiguration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceMessage" TEXT,
    "storeName" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "description" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "googleMapsEmbedUrl" TEXT,
    "businessHours" TEXT,
    "contactEmail" TEXT NOT NULL,
    "notifyNewOrders" BOOLEAN NOT NULL DEFAULT false,
    "automaticNewsletter" BOOLEAN NOT NULL DEFAULT false,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "locale" TEXT NOT NULL DEFAULT 'pt-BR',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_StoreConfiguration" ("address", "automaticNewsletter", "businessHours", "city", "cnpj", "contactEmail", "createdAt", "currency", "description", "googleMapsEmbedUrl", "id", "isActive", "locale", "maintenanceMessage", "maintenanceMode", "notifyNewOrders", "phone", "seoDescription", "seoKeywords", "seoTitle", "state", "storeName", "updatedAt", "whatsapp", "zipCode") SELECT "address", "automaticNewsletter", "businessHours", "city", "cnpj", "contactEmail", "createdAt", "currency", "description", "googleMapsEmbedUrl", "id", "isActive", "locale", "maintenanceMessage", "maintenanceMode", "notifyNewOrders", "phone", "seoDescription", "seoKeywords", "seoTitle", "state", "storeName", "updatedAt", "whatsapp", "zipCode" FROM "StoreConfiguration";
DROP TABLE "StoreConfiguration";
ALTER TABLE "new_StoreConfiguration" RENAME TO "StoreConfiguration";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
