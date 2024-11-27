"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/chatRoutes.js
const express_1 = __importDefault(require("express"));
const chat_1 = require("../controllers/chat");
const cloudinary_1 = require("../helper/cloudinary");
const router = express_1.default.Router();
router.post("/", cloudinary_1.upload.single("profilePic"), chat_1.createChat);
router.get("/:id", chat_1.getChat);
router.get("/", chat_1.getUserChats);
exports.default = router;
