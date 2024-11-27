import { Request, Response } from "express";
import prisma from "../services/prisma";

export const checkUserExists = async (req: Request, res: Response) => {
  try {
    const { email } = req.query as { email: string };
    const isUserExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    res.status(200).json(Boolean(isUserExists));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error checking user existence.",
    });
  }
};
