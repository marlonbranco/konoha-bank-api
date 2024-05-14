/*
  Warnings:

  - Made the column `accountId` on table `Statement` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Statement" DROP CONSTRAINT "Statement_accountId_fkey";

-- AlterTable
ALTER TABLE "Statement" ALTER COLUMN "accountId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Statement" ADD CONSTRAINT "Statement_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
