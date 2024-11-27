/*
  Warnings:

  - You are about to drop the column `groupId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GroupMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_groupId_fkey";

-- DropForeignKey
ALTER TABLE "_GroupMembers" DROP CONSTRAINT "_GroupMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupMembers" DROP CONSTRAINT "_GroupMembers_B_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "groupId",
ADD COLUMN     "groupDescription" TEXT,
ADD COLUMN     "groupProfilePic" TEXT;

-- DropTable
DROP TABLE "Group";

-- DropTable
DROP TABLE "_GroupMembers";
