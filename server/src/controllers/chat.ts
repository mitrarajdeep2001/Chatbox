// controllers/chatController.js
import { Request, Response } from "express";
import prisma from "../services/prisma";
import { handleImageUpload } from "../helper/cloudinary";
import { UploadApiResponse } from "cloudinary";

// create chat
export const createChat = async (
  req: Request,
  res: Response
): Promise<any | Response<any, Record<string, any>>> => {
  const { isGroup, groupName, members } = req.body; // `members` is an array of emails

  try {
    const isGrp = JSON.parse(isGroup);
    console.log(
      isGrp,
      groupName,
      JSON.parse(members),
      req.file,
      "isGrp, groupName, JSON.parse(members), req.file"
    );

    // Retrieve user IDs based on provided emails
    const users = await prisma.user.findMany({
      where: { email: { in: JSON.parse(members) } },
      select: { id: true },
    });

    // Extract user IDs from the result
    const userIds = users.map((user) => user.id);

    // Check if we found all provided emails
    if (userIds.length !== JSON.parse(members).length) {
      return res.status(404).json({ message: "Some users not found" });
    }

    if (!isGrp) {
      // Ensure there are exactly two members for one-on-one chats
      if (userIds.length !== 2) {
        return res
          .status(400)
          .json({ message: "A one-on-one chat must have exactly two members" });
      }

      // Check if a chat already exists between these two users
      const existingChat = await prisma.chat.findFirst({
        where: {
          isGroup: false,
          members: {
            every: {
              id: { in: userIds },
            },
          },
        },
        select: { id: true },
      });

      if (existingChat) {
        return res.status(200).json(existingChat);
      }
    }

    let profilePic = null;
    if (req.file) {
      profilePic = (await handleImageUpload(req.file)) as UploadApiResponse;
    }
    // Create chat with the retrieved user IDs
    const chat = await prisma.chat.create({
      data: {
        isGroup: isGrp,
        groupName: groupName || null,
        groupProfilePic: profilePic?.url || null,
        members: {
          connect: userIds.map((id) => ({ id })),
        },
        createdBy: userIds[0], // Set the creator as the first user in the list
      },
    });

    res.status(201).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating chat", error });
  }
};

// get chat by id
export const getChat = async (
  req: Request,
  res: Response
): Promise<any | Response<any, Record<string, any>>> => {
  const { id } = req.params;
  const { userId } = req.query as { userId: string }; // Pass the current user's ID

  try {
    const chat = await prisma.chat.findUnique({
      where: { id },
      include: {
        members: true,
      },
    });

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    let member: any = null;

    if (!chat.isGroup) {
      // Filter out the current user and get the opposite member
      const otherMember = chat.members.find((m) => m.id !== userId);
      if (otherMember) {
        member = {
          id: otherMember.id,
          name: otherMember.name,
          email: otherMember.email,
          profilePic: otherMember.profilePic,
        };
      }
    }

    // Construct response
    const response = {
      id: chat.id,
      isGroup: chat.isGroup,
      groupName: chat.isGroup ? chat.groupName : null,
      groupProfilePic: chat.isGroup ? chat.groupProfilePic : null,
      member: chat.isGroup ? null : member, // Include member only if not a group chat
      createdBy: chat.createdBy,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({ message: "Error fetching chat", error });
  }
};

// get chats by user id
export const getUserChats = async (
  req: Request,
  res: Response
): Promise<any | Response<any, Record<string, any>>> => {
  try {
    const { email } = req.query as { email: string };

    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch all chats where the user is a member
    const chats = await prisma.chat.findMany({
      where: {
        members: { some: { id: user.id } },
      },
      include: {
        lastMessage: {
          select: {
            id: true,
            text: true,
            createdAt: true,
            updatedAt: true,
            image: true,
            audio: true,
            video: true,
            gif: true,
            creator: {
              // ✅ Fetch full user details from User table
              select: {
                id: true,
                name: true,
                email: true,
                profilePic: true,
              },
            },
          },
        },
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePic: true,
          },
        },
        UserChatStatus: {
          where: { userId: user.id },
          select: { unseenCount: true },
        },
      },
    });

    // Transform chats to include members conditionally and unseen count
    const formattedChats = chats.map((chat) => {
      const unseenCount =
        chat.UserChatStatus.length > 0 ? chat.UserChatStatus[0].unseenCount : 0;

      if (chat.isGroup) {
        return {
          id: chat.id,
          isGroup: chat.isGroup,
          groupName: chat.groupName,
          groupProfilePic: chat.groupProfilePic,
          members: chat.members,
          createdBy: chat.createdBy,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt,
          lastMessage: chat.lastMessage,
          unseenCount,
        };
      } else {
        const otherMembers = chat.members.filter(
          (member) => member.id !== user.id
        );
        return {
          id: chat.id,
          isGroup: chat.isGroup,
          member: otherMembers.length > 0 ? otherMembers[0] : null,
          createdBy: chat.createdBy,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt,
          lastMessage: chat.lastMessage,
          unseenCount,
        };
      }
    });

    res.status(200).json(formattedChats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching chats", error });
  }
};
