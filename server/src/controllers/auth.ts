import { Request, Response } from "express";
import prisma from "../services/prisma";

export const createUser = async (req: Request, res: Response) => {
  try {
    console.log(req.body, "req.body");
    const { uid, email, name, photoURL } = req.body;

    await prisma.user.create({
      data: {
        id: uid,
        email,
        name,
        profilePic: photoURL,
      },
    });

    res.status(201).json({ msg: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create user" });
  }
};