-- CreateTable
CREATE TABLE "transfers" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "source_store_id" INTEGER NOT NULL,
    "destination_store_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "transfers_pkey" PRIMARY KEY ("id")
);
