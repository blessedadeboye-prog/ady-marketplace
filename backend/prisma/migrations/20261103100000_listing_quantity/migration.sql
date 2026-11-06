-- Quantities: a seller can list several units of one item.
ALTER TABLE "Listing" ADD COLUMN "quantity" INTEGER NOT NULL DEFAULT 1;
