// controllers/messageController.js
import { Request, Response } from "express";
import prisma from "../services/prisma";

export const getMessagesByChat = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
};
