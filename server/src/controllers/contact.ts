import { Request, Response } from "express";
import prisma from "../services/prisma";

// create new contact
export const createContact = async (
  req: Request,
  res: Response
): Promise<any | Response<any, Record<string, any>>> => {
  try {
    const { email, createdBy } = req.body;

    // Find the user associated with the email (the contact's owner)
    const isUserExists = await prisma.user.findUnique({
      where: { email },
    });

    if (!isUserExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the user who is creating the contact based on `createdBy` email
    const creator = await prisma.user.findUnique({
      where: { email: createdBy },
    });

    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }

    // Check if the contact already exists
    const existingContact = await prisma.contact.findFirst({
      where: {
        email,
        createdById: creator.id, // Ensure the contact is unique for the creator
      },
    });

    if (existingContact) {
      return res.status(400).json({ message: "Contact already exists" });
    }

    // Create the contact
    await prisma.contact.create({
      data: {
        name: isUserExists.name,
        email,
        user: { connect: { id: isUserExists.id } }, // Connect to the user's ID
        createdBy: { connect: { id: creator.id } }, // Connect to the creator's ID
      },
    });

    return res.status(201).json({ msg: "Contact created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create contact" });
  }
};

// get all contact of user by userid
export const getContacts = async (
  req: Request,
  res: Response
): Promise<any | Response<any, Record<string, any>>> => {
  try {
    const { email } = req.query as { email: string };

    // Find the creator's user ID from their email
    const creator = await prisma.user.findUnique({
      where: { email },
    });

    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }

    // Fetch contacts created by the user
    const contacts = await prisma.contact.findMany({
      where: { createdById: creator.id },
      select: {
        id: true,
        name: true,
        email: true,
        user: {
          select: {
            profilePic: true, // Retrieve profilePic from the associated User model
          },
        },
      },
    });

    // Transform the response to include `profilePic` at the top level
    const formattedContacts = contacts.map((contact) => ({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      profilePic: contact.user?.profilePic || null, // Default to null if no profilePic
    }));

    res.status(200).json(formattedContacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve contacts" });
  }
};

export const getContactById = async (
  req: Request,
  res: Response
): Promise<any | Response<any, Record<string, any>>> => {
  try {
    const { id } = req.query as { id: string };

    const contact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve contact" });
  }
};

export const updateContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.query as { id: string };
    const { email } = req.body;

    const contact = await prisma.contact.update({
      where: { id },
      data: { email },
    });

    res.status(200).json({ msg: "Contact updated successfully", contact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update contact" });
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.query as { id: string };

    await prisma.contact.delete({
      where: { id },
    });

    res.status(200).json({ msg: "Contact deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete contact" });
  }
};
