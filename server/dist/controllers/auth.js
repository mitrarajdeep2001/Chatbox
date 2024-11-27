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
exports.createUser = void 0;
const prisma_1 = __importDefault(require("../services/prisma"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body, "req.body");
        const { uid, email, name, photoURL } = req.body;
        yield prisma_1.default.user.create({
            data: {
                id: uid,
                email,
                name,
                profilePic: photoURL,
            },
        });
        res.status(201).json({ msg: "User created successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create user" });
    }
});
exports.createUser = createUser;
