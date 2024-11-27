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
exports.consumeMessages = exports.produceMessage = void 0;
const kafkajs_1 = require("kafkajs");
const dotenv_1 = __importDefault(require("dotenv"));
const kafkaMessageHandlers_1 = __importDefault(require("../helper/kafkaMessageHandlers"));
dotenv_1.default.config();
const kafka = new kafkajs_1.Kafka({
    clientId: "my-app",
    brokers: [process.env.KAFKA_BROKER],
});
let producer = null;
const createProducer = () => __awaiter(void 0, void 0, void 0, function* () {
    if (producer) {
        return producer;
    }
    const _producer = kafka.producer();
    yield _producer.connect();
    producer = _producer;
    return producer;
});
const produceMessage = (topic, message) => __awaiter(void 0, void 0, void 0, function* () {
    const producer = yield createProducer();
    yield producer.send({
        topic,
        messages: [
            { key: `${topic}-${Date.now()}`, value: JSON.stringify(message) },
        ],
    });
});
exports.produceMessage = produceMessage;
const consumeMessages = (topics) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Kafka initialized!");
    const consumer = kafka.consumer({ groupId: "chatbox-group" });
    yield consumer.connect();
    for (const topic of topics) {
        yield consumer.subscribe({ topic, fromBeginning: true });
    }
    yield consumer.run({
        eachMessage: (_a) => __awaiter(void 0, [_a], void 0, function* ({ topic, partition, message }) {
            var _b, _c;
            const { roomId, createdBy, message: chatMessage, } = JSON.parse((_b = message.value) === null || _b === void 0 ? void 0 : _b.toString());
            console.log({
                value: (_c = message.value) === null || _c === void 0 ? void 0 : _c.toString(),
                topic,
                partition,
            });
            if (topic === "MESSAGES") {
                yield (0, kafkaMessageHandlers_1.default)({
                    chatId: roomId,
                    createdBy,
                    text: chatMessage.text,
                    // emojie: chatMessage.emojie,
                    // image: chatMessage.image,
                    // audio: chatMessage.audio,
                    // video: chatMessage.video,
                    // gif: chatMessage.gif,
                });
            }
        }),
    });
});
exports.consumeMessages = consumeMessages;
