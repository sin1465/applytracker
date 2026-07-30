/*
  Warnings:

  - Made the column `userId` on table `JobApplication` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "JobApplication" ALTER COLUMN "userId" SET NOT NULL;
