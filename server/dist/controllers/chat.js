"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserChats = exports.getChat = exports.createChat = void 0;
const prisma_1 = __importDefault(require("../services/prisma"));
const cloudinary_1 = require("../helper/cloudinary");
// create chat
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { isGroup, groupName, members } = req.body; // `members` is an array of emails
    try {
        const isGrp = JSON.parse(isGroup);
        console.log(isGrp, groupName, JSON.parse(members), req.file, "isGrp, groupName, JSON.parse(members), req.file");
        // Retrieve user IDs based on provided emails
        const users = yield prisma_1.default.user.findMany({
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
            const existingChat = yield prisma_1.default.chat.findFirst({
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
            profilePic = (yield (0, cloudinary_1.handleImageUpload)(req.file));
        }
        // Create chat with the retrieved user IDs
        const chat = yield prisma_1.default.chat.create({
            data: {
                isGroup: isGrp,
                groupName: groupName || null,
                groupProfilePic: (profilePic === null || profilePic === void 0 ? void 0 : profilePic.url) || null,
                members: {
                    connect: userIds.map((id) => ({ id })),
                },
                createdBy: userIds[0], // Set the creator as the first user in the list
            },
        });
        res.status(201).json(chat);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating chat", error });
    }
});
exports.createChat = createChat;
// get chat by id
const getChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userId } = req.query; // Pass the current user's ID
    try {
        const chat = yield prisma_1.default.chat.findUnique({
            where: { id },
            include: {
                members: true,
                messages: {
                    orderBy: { updatedAt: "desc" }, // Optional: Order messages by latest
                },
            },
        });
        if (!chat)
            return res.status(404).json({ message: "Chat not found" });
        let member = null;
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
            messages: chat.messages,
            createdBy: chat.createdBy,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error("Error fetching chat:", error);
        res.status(500).json({ message: "Error fetching chat", error });
    }
});
exports.getChat = getChat;
// get chats by user id
const getUserChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.query;
        // Check if the user exists
        const user = yield prisma_1.default.user.findUnique({ where: { email } });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        // Fetch all chats where the user is a member
        const chats = yield prisma_1.default.chat.findMany({
            where: {
                members: { some: { id: user.id } },
            },
            include: {
                lastMessage: {
                    select: {
                        id: true,
                        text: true,
                        createdAt: true,
                        createdBy: true,
                        image: true,
                        audio: true,
                        video: true,
                        gif: true,
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
            },
        });
        // Transform chats to include members conditionally and new fields
        const formattedChats = chats.map((chat) => {
            if (chat.isGroup) {
                // Exclude members for group chats
                return {
                    id: chat.id,
                    isGroup: chat.isGroup,
                    groupName: chat.groupName,
                    groupProfilePic: chat.groupProfilePic,
                    createdBy: chat.createdBy,
                    createdAt: chat.createdAt,
                    updatedAt: chat.updatedAt,
                    unseenMsgCount: chat.unseenMsgCount,
                    lastMessage: chat.lastMessage,
                };
            }
            else {
                // Include only the other member(s) for non-group chats
                const otherMembers = chat.members.filter((member) => member.id !== user.id);
                return {
                    id: chat.id,
                    isGroup: chat.isGroup,
                    member: otherMembers.length > 0 ? otherMembers[0] : null, // Simplify to a single other member
                    createdBy: chat.createdBy,
                    createdAt: chat.createdAt,
                    updatedAt: chat.updatedAt,
                    unseenMsgCount: chat.unseenMsgCount,
                    lastMessage: chat.lastMessage,
                };
            }
        });
        res.status(200).json(formattedChats);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching chats", error });
    }
});
exports.getUserChats = getUserChats;
