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
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const redis_1 = require("./redis");
const kafka_1 = require("./kafka");
class SocketService {
    constructor() {
        console.log("Init Socket Service...");
        this._io = new socket_io_1.Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*",
                methods: ["GET", "POST"],
            },
        });
        redis_1.sub.subscribe("MESSAGES");
    }
    // Helper to create a unique chat room ID for two users
    createRoomId(userIds) {
        return userIds.sort().join("_");
    }
    // Listen for socket events
    initListeners() {
        const io = this._io;
        console.log("Init Socket Listeners...");
        io.on("connect", (socket) => {
            console.log("New socket connected", socket.id);
            // Join chat room based on user IDs
            socket.on("event:joinRoom", ({ roomId }) => {
                // const roomId = this.createRoomId(userIds);
                socket.join(roomId);
                console.log(`User ${socket.id} joined room ${roomId}`);
            });
            // Send message to room
            socket.on("event:message", (_a) => __awaiter(this, [_a], void 0, function* ({ message, roomId, createdBy }) {
                console.log("New message received", message);
                // const roomId = this.createRoomId(userIds);
                // Publish the message to the redis channel
                // console.log(message, roomId, createdBy, "message, roomId, createdBy");
                const payload = { message, roomId, createdBy };
                yield redis_1.pub.publish("MESSAGES", JSON.stringify(payload));
            }));
            // Handle disconnect
            socket.on("disconnect", () => {
                console.log("Socket disconnected", socket.id);
            });
        });
        // Redis subscriber handling messages for all rooms
        redis_1.sub.on("message", (channel, message) => __awaiter(this, void 0, void 0, function* () {
            if (channel === "MESSAGES") {
                const { roomId, createdBy, message: chatMessage } = JSON.parse(message);
                console.log(`New message received for room ${roomId} from Redis`);
                // Emit the message to the correct room on this instance
                io.to(roomId).emit("message", JSON.stringify(chatMessage));
                // Send the message to the kafka
                yield (0, kafka_1.produceMessage)("MESSAGES", { roomId, createdBy, message: chatMessage });
            }
        }));
    }
    get io() {
        return this._io;
    }
}
exports.default = SocketService;
