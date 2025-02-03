import prisma from "../services/prisma";
import { Message } from "../types";

// Create message from Kafka event
export const createMessage = async (message: string) => {
  try {
    const {
      id,
      chatId,
      createdBy,
      text,
      image,
      audio,
      video,
      gif,
      repliedToId,
    } = JSON.parse(message) as Message;

    console.log("Received message data:", {
      id,
      chatId,
      createdBy,
      text,
      image,
      audio,
      video,
      gif,
      repliedToId,
    });

    // 1️⃣ Check if chat and user exist
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { members: true }, // Fetch chat members
    });

    const user = await prisma.user.findUnique({
      where: { id: createdBy },
    });

    if (!chat || !user) {
      console.error("❌ Chat or User not found.");
      return;
    }

    // 2️⃣ Validate if repliedToId exists and belongs to the same chat
    let repliedToMessage = null;
    if (repliedToId) {
      repliedToMessage = await prisma.message.findUnique({
        where: { id: repliedToId },
      });

      if (!repliedToMessage || repliedToMessage.chatId !== chatId) {
        console.error(
          "❌ Invalid repliedToId: Message not found or in different chat."
        );
        return;
      }
    }

    // 3️⃣ Create the new message
    const newMessage = await prisma.message.create({
      data: {
        id,
        chatId,
        createdBy,
        text,
        image,
        audio,
        video,
        gif,
        repliedToId,
        readBy: { connect: { id: createdBy } }, // Mark sender as having read the message
      },
      include: { readBy: true }, // Fetch readBy users
    });

    console.log("✅ Message created successfully:", newMessage);

    // 4️⃣ Update the lastMessageId in the Chat table
    await prisma.chat.update({
      where: { id: chatId },
      data: { lastMessageId: newMessage.id },
    });

    // 5️⃣ Get all members except the sender
    const recipients = chat.members.filter((member) => member.id !== createdBy);

    for (const recipient of recipients) {
      await prisma.userChatStatus.upsert({
        where: {
          userId_chatId: {
            userId: recipient.id,
            chatId: chatId,
          },
        },
        update: {
          unseenCount: { increment: 1 }, // Increase unseen message count
        },
        create: {
          userId: recipient.id,
          chatId: chatId,
          unseenCount: 1, // Initialize unseen count
          lastReadAt: new Date(),
        },
      });
    }

    console.log("✅ Message created and unseen count updated!");
  } catch (error) {
    console.error("❌ Error creating message:", error);
  }
};



// Update message status to 'read' and decrement unseen count
export const handleReadReceipt = async (message: string) => {
  const { roomId: chatId, userId, messageId } = JSON.parse(message);
  console.log(chatId, userId, messageId, "chatId, userId, messageId");

  try {
    // Fetch chat members
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { members: { select: { id: true } } },
    });

    if (!chat) {
      console.log("Chat not found");
      return;
    }

    const chatMemberIds = chat.members.map((member) => member.id);

    // Fetch the message
    const messageData = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        readBy: { select: { id: true } },
        creator: { select: { id: true } },
      },
    });

    if (!messageData) {
      console.log("Message not found");
      return;
    }

    const alreadyReadBy = messageData.readBy.map((user) => user.id);

    // Check if user has already read the message
    if (!alreadyReadBy.includes(userId)) {
      // Add user to readBy list
      await prisma.message.update({
        where: { id: messageId },
        data: {
          readBy: { connect: { id: userId } },
        },
      });

      console.log(`User ${userId} marked message ${messageId} as read.`);
    }

    // Check if all members except the sender have read the message
    const allRead = chatMemberIds
      .filter((memberId) => memberId !== messageData.creator.id) // Exclude sender
      .every(
        (memberId) => alreadyReadBy.includes(memberId) || memberId === userId
      ); // Check if all others have read

    if (allRead) {
      // Update message status to 'read'
      await prisma.message.update({
        where: { id: messageId },
        data: { status: "read" },
      });

      console.log(`Message ${messageId} marked as read.`);
    }

    // Decrement unseen count in UserChatStatus
    await prisma.userChatStatus.updateMany({
      where: { chatId, userId },
      data: {
        unseenCount: { decrement: 1 },
      },
    });

    console.log(`Updated unseen count for user ${userId} in chat ${chatId}.`);
  } catch (error) {
    console.log("Error updating read receipt:", error);
  }
};

