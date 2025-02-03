/*
  Warnings:

  - You are about to drop the column `emoji` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "emoji";

-- AlterTable
ALTER TABLE "_MessageReadBy" ADD CONSTRAINT "_MessageReadBy_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_MessageReadBy_AB_unique";

-- AlterTable
ALTER TABLE "_UserChats" ADD CONSTRAINT "_UserChats_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_UserChats_AB_unique";
