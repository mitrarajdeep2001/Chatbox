// routes/messageRoutes.js
import express from "express";
import {
  // createMessage,
  getMessagesByChat,
} from "../controllers/message";

const router = express.Router();

// router.post("/", createMessage);
router.get("/:chatId", getMessagesByChat);

export default router;
