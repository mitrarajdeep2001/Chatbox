// routes/chatRoutes.js
import express from "express";
import { createChat, getChat, getUserChats } from "../controllers/chat";
import { upload } from "../helper/cloudinary";

const router = express.Router();

router.post("/", upload.single("profilePic"), createChat);
router.get("/:id", getChat);
router.get("/", getUserChats);

export default router;
