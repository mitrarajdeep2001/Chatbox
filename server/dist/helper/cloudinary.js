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
exports.handleImageUpload = exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
cloudinary_1.v2.config({
    cloud_name: "dj84vitsf",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRETE_KEY,
    secure: true,
});
const storage = multer_1.default.memoryStorage();
function imageUploadUtil(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield cloudinary_1.v2.uploader.upload(file, {
            resource_type: "auto",
            folder: "chat_box",
        });
        return result;
    });
}
const handleImageUpload = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const b64 = Buffer.from(file.buffer).toString("base64");
        const url = "data:" + file.mimetype + ";base64," + b64;
        const result = yield imageUploadUtil(url);
        return result;
    }
    catch (error) {
        console.log(error);
    }
});
exports.handleImageUpload = handleImageUpload;
const upload = (0, multer_1.default)({ storage });
exports.upload = upload;
