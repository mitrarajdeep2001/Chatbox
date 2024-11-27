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
const prisma_1 = __importDefault(require("../services/prisma"));
const createMessage = (_a) => __awaiter(void 0, [_a], void 0, function* ({ chatId, createdBy, text, image, emojie, audio, video, gif, }) {
    try {
        console.log(chatId, createdBy, text, image, emojie, audio, video, gif, "chatId, createdBy, text, image, emojie, audio, video, gif");
        const isChatExists = yield prisma_1.default.chat.findUnique({
            where: { id: chatId },
        });
        const isUserExists = yield prisma_1.default.user.findUnique({
            where: { email: createdBy },
        });
        if (!isChatExists || !isUserExists) {
            return;
        }
        yield prisma_1.default.message.create({
            data: {
                chatId,
                createdBy: isUserExists.id,
                text,
                image,
                emojie,
                audio,
                video,
                gif,
            },
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = createMessage;
