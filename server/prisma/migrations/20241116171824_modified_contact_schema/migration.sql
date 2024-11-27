/*
  Warnings:

  - Added the required column `createdById` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "createdById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
