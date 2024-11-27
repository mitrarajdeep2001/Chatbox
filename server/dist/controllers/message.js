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
exports.createMessage = void 0;
const prisma_1 = __importDefault(require("../services/prisma"));
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, createdBy, text, emojie, audio, video, gif } = req.body;
    try {
        const isChatExists = yield prisma_1.default.chat.findUnique({
            where: { id: chatId },
        });
        if (!isChatExists) {
            return res.status(404).json({ message: "Chat not found" });
        }
        const message = yield prisma_1.default.message.create({
            data: { chatId, createdBy, text, emojie, audio, video, gif },
        });
        res.status(201).json(message);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating message", error });
    }
});
exports.createMessage = createMessage;
// export const getMessagesByChat = async (req: Request, res: Response) => {
//   const { chatId } = req.params;
//   try {
//     const messages = await prisma.message.findMany({
//       where: { chatId },
//       orderBy: { createdAt: "asc" },
//     });
//     res.status(200).json(messages);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching messages", error });
//   }
// };
