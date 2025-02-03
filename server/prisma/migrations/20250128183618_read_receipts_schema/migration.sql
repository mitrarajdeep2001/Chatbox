/*
  Warnings:

  - You are about to drop the column `unseenMsgCount` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `emojie` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "unseenMsgCount";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "emojie",
ADD COLUMN     "emoji" TEXT;

-- CreateTable
CREATE TABLE "UserChatStatus" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "unseenCount" INTEGER NOT NULL DEFAULT 0,
    "lastReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserChatStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserChatStatus_userId_chatId_key" ON "UserChatStatus"("userId", "chatId");

-- AddForeignKey
ALTER TABLE "UserChatStatus" ADD CONSTRAINT "UserChatStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChatStatus" ADD CONSTRAINT "UserChatStatus_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
