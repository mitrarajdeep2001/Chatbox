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
exports.deleteGroup = exports.updateGroup = exports.removeMemberFromGroup = exports.addMemberToGroup = exports.getGroup = exports.createGroup = void 0;
const prisma_1 = __importDefault(require("../services/prisma")); // Adjust the import based on your project structure
// Create a new group
const createGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, members } = req.body; // members is an array of user emails
    try {
        // Retrieve user IDs based on provided emails
        const users = yield prisma_1.default.user.findMany({
            where: { email: { in: members } },
            select: { id: true },
        });
        const userIds = users.map((user) => user.id);
        // Check if all users were found
        if (userIds.length !== members.length) {
            return res.status(404).json({ message: "Some users not found" });
        }
        // Create the group
        const group = yield prisma_1.default.group.create({
            data: {
                name,
                description,
                profilePic: "",
                members: {
                    connect: userIds.map((id) => ({ id })),
                },
            },
        });
        res.status(201).json({ message: "Group created successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating group", error });
    }
});
exports.createGroup = createGroup;
// Get group details by ID
const getGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const group = yield prisma_1.default.group.findUnique({
            where: { id },
            include: {
                members: true, // Include members
                chats: true, // Include associated chats
            },
        });
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        res.status(200).json(group);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching group", error });
    }
});
exports.getGroup = getGroup;
// Add member to group
const addMemberToGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupId, memberEmail } = req.body;
    try {
        // Find the user by email
        const user = yield prisma_1.default.user.findUnique({
            where: { email: memberEmail },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Add the user to the group
        const group = yield prisma_1.default.group.update({
            where: { id: groupId },
            data: {
                members: {
                    connect: { id: user.id },
                },
            },
        });
        res.status(200).json(group);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding member", error });
    }
});
exports.addMemberToGroup = addMemberToGroup;
// Remove member from group
const removeMemberFromGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupId, memberId } = req.body;
    try {
        const group = yield prisma_1.default.group.update({
            where: { id: groupId },
            data: {
                members: {
                    disconnect: { id: memberId }, // Remove member from the group
                },
            },
        });
        res.status(200).json(group);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error removing member", error });
    }
});
exports.removeMemberFromGroup = removeMemberFromGroup;
// Update group information
const updateGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const updatedGroup = yield prisma_1.default.group.update({
            where: { id },
            data: {
                name,
                description,
            },
        });
        res.status(200).json(updatedGroup);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating group", error });
    }
});
exports.updateGroup = updateGroup;
// Delete group
const deleteGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const group = yield prisma_1.default.group.delete({
            where: { id },
        });
        res.status(200).json({ message: "Group deleted successfully", group });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting group", error });
    }
});
exports.deleteGroup = deleteGroup;
