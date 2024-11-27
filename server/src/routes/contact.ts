import express from "express";
import {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} from "../controllers/contact";

const router = express.Router();

router.post("/", createContact); // Create a contact
router.get("/", getContacts); // Get all contacts for a user
router.get("/:id", getContactById); // Get a contact by ID
router.put("/:id", updateContact); // Update a contact by ID
router.delete("/:id", deleteContact); // Delete a contact by ID

export default router;
