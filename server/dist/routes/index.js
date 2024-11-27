"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const chat_1 = __importDefault(require("./chat"));
const message_1 = __importDefault(require("./message"));
const contact_1 = __importDefault(require("./contact"));
const user_1 = __importDefault(require("./user"));
const router = (0, express_1.Router)();
router.use("/auth", auth_1.default);
router.use("/chat", chat_1.default);
router.use("/message", message_1.default);
router.use("/contact", contact_1.default);
router.use("/user", user_1.default);
exports.default = router;
