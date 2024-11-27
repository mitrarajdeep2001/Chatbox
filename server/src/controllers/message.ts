// controllers/messageController.js
import { Request, Response } from "express";
import prisma from "../services/prisma";

export const createMessage = async (
  req: Request,
  res: Response
): Promise<any | Response<any, Record<string, any>>> => {
  const { chatId, createdBy, text, emojie, audio, video, gif } = req.body;
  try {
    const isChatExists = await prisma.chat.findUnique({
      where: { id: chatId },
    });
    if (!isChatExists) {
      return res.status(404).json({ message: "Chat not found" });
    }
    const message = await prisma.message.create({
      data: { chatId, createdBy, text, emojie, audio, video, gif },
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Error creating message", error });
  }
};

// export const getMessagesByChat = async (req: Request, res: Response) => {
//   const { chatId } = req.params;
//   try {
//     const messages = await prisma.message.findMany({
//       where: { chatId },
//       orderBy: { createdAt: "asc" },
//     });
//     res.status(200).json(messages);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching messages", error });
//   }
// };
