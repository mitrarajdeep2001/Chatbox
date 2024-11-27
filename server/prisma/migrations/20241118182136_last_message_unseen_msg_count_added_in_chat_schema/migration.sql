-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "lastMessageId" TEXT,
ADD COLUMN     "unseenMsgCount" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_lastMessageId_fkey" FOREIGN KEY ("lastMessageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
