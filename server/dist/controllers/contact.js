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
exports.deleteContact = exports.updateContact = exports.getContactById = exports.getContacts = exports.createContact = void 0;
const prisma_1 = __importDefault(require("../services/prisma"));
// create new contact
const createContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, createdBy } = req.body;
        // Find the user associated with the email (the contact's owner)
        const isUserExists = yield prisma_1.default.user.findUnique({
            where: { email },
        });
        if (!isUserExists) {
            return res.status(404).json({ message: "User not found" });
        }
        // Find the user who is creating the contact based on `createdBy` email
        const creator = yield prisma_1.default.user.findUnique({
            where: { email: createdBy },
        });
        if (!creator) {
            return res.status(404).json({ message: "Creator not found" });
        }
        // Check if the contact already exists
        const existingContact = yield prisma_1.default.contact.findFirst({
            where: {
                email,
                createdById: creator.id, // Ensure the contact is unique for the creator
            },
        });
        if (existingContact) {
            return res.status(400).json({ message: "Contact already exists" });
        }
        // Create the contact
        yield prisma_1.default.contact.create({
            data: {
                name: isUserExists.name,
                email,
                user: { connect: { id: isUserExists.id } }, // Connect to the user's ID
                createdBy: { connect: { id: creator.id } }, // Connect to the creator's ID
            },
        });
        return res.status(201).json({ msg: "Contact created successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create contact" });
    }
});
exports.createContact = createContact;
// get all contact of user by userid
const getContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.query;
        // Find the creator's user ID from their email
        const creator = yield prisma_1.default.user.findUnique({
            where: { email },
        });
        if (!creator) {
            return res.status(404).json({ message: "Creator not found" });
        }
        // Fetch contacts created by the user
        const contacts = yield prisma_1.default.contact.findMany({
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
        const formattedContacts = contacts.map((contact) => {
            var _a;
            return ({
                id: contact.id,
                name: contact.name,
                email: contact.email,
                profilePic: ((_a = contact.user) === null || _a === void 0 ? void 0 : _a.profilePic) || null, // Default to null if no profilePic
            });
        });
        res.status(200).json(formattedContacts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve contacts" });
    }
});
exports.getContacts = getContacts;
const getContactById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const contact = yield prisma_1.default.contact.findUnique({
            where: { id },
        });
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }
        res.status(200).json(contact);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve contact" });
    }
});
exports.getContactById = getContactById;
const updateContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const { email } = req.body;
        const contact = yield prisma_1.default.contact.update({
            where: { id },
            data: { email },
        });
        res.status(200).json({ msg: "Contact updated successfully", contact });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update contact" });
    }
});
exports.updateContact = updateContact;
const deleteContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        yield prisma_1.default.contact.delete({
            where: { id },
        });
        res.status(200).json({ msg: "Contact deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete contact" });
    }
});
exports.deleteContact = deleteContact;
