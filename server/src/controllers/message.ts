// controllers/messageController.js
import { Request, Response } from "express";
import prisma from "../services/prisma";
import { produceMessage } from "../services/kafka";

export const getMessagesByChat = async (req: Request, res: Response) => {
  const { chatId } = req.query as { chatId: string };
  const { page = "1", limit = "20" } = req.query as {
    page: string;
    limit: string;
  };

  // Convert page and limit to numbers and calculate the offset
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const offset = (pageNumber - 1) * limitNumber;

  try {
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { updatedAt: "desc" }, // Fetch newest messages first
      skip: offset,
      take: limitNumber,
      include: {
        creator: {
          // ✅ Fetch full user details from User table
          select: {
            id: true,
            name: true,
            email: true,
            profilePic: true,
          },
        },
        repliedTo: {
          select: {
            id: true,
            text: true,
            image: true,
            audio: true,
            video: true,
            gif: true,
            createdBy: true,
            creator: {
              // ✅ Fetch full user details from User table
              select: {
                id: true,
                name: true,
                email: true,
                profilePic: true,
              }
            },
            createdAt: true,
          }, // Select necessary fields from the replied message
        },
      },
    });

    // Return paginated messages with reply details
    res.status(200).json(messages.reverse()); // Reverse to maintain chronological order
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
};


