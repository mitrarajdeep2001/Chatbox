"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/messageRoutes.js
const express_1 = __importDefault(require("express"));
const message_1 = require("../controllers/message");
const router = express_1.default.Router();
router.post("/", message_1.createMessage);
// router.get("/:chatId", getMessagesByChat);
exports.default = router;
