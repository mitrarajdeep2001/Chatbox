// routes/messageRoutes.js
import express from "express";
import {
  getMessagesByChat,
} from "../controllers/message";

const router = express.Router();

router.get("/", getMessagesByChat);

export default router;
