-- CreateTable
CREATE TABLE "banner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "linkUrl" TEXT,
    "imageDesktop" TEXT,
    "imageMobile" TEXT,
    "resolutionDesktop" TEXT,
    "resolutionMobile" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "newsletter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StoreConfiguration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceMessage" TEXT,
    "storeName" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "description" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "googleMapsEmbedUrl" TEXT,
    "businessHours" TEXT,
    "contactEmail" TEXT NOT NULL,
    "notifyNewOrders" BOOLEAN NOT NULL DEFAULT false,
    "automaticNewsletter" BOOLEAN NOT NULL DEFAULT false,
    "freeShippingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "freeShippingValue" REAL,
    "shippingDeadline" INTEGER,
    "creditCardEnabled" BOOLEAN NOT NULL DEFAULT false,
    "pixEnabled" BOOLEAN NOT NULL DEFAULT false,
    "boletoEnabled" BOOLEAN NOT NULL DEFAULT false,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "locale" TEXT NOT NULL DEFAULT 'pt-BR',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_email_key" ON "newsletter"("email");
