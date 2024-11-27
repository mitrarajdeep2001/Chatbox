"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contact_1 = require("../controllers/contact");
const router = express_1.default.Router();
router.post("/", contact_1.createContact); // Create a contact
router.get("/", contact_1.getContacts); // Get all contacts for a user
router.get("/:id", contact_1.getContactById); // Get a contact by ID
router.put("/:id", contact_1.updateContact); // Update a contact by ID
router.delete("/:id", contact_1.deleteContact); // Delete a contact by ID
exports.default = router;
