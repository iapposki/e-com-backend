/*
  Warnings:

  - You are about to drop the column `discounted_price` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "discounted_price",
ADD COLUMN     "discountedPrice" INTEGER;
