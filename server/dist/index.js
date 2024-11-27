"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_1 = __importDefault(require("./services/socket"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const index_1 = __importDefault(require("./routes/index"));
const kafka_1 = require("./services/kafka");
const init = () => {
    const app = (0, express_1.default)(); // Initialize Express app
    const socketService = new socket_1.default();
    const server = http_1.default.createServer(app); // Use Express app with HTTP server
    socketService.io.attach(server); // Attach Socket.io to the server
    const PORT = process.env.PORT || 5000;
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    const customCors = (req, res, next) => {
        const allowedOrigins = [
            process.env.CLIENT_BASE_URL,
            "https://another-origin.com",
        ]; // Define allowed origins
        const origin = req.headers.origin;
        if (allowedOrigins.includes(origin)) {
            res.setHeader("Access-Control-Allow-Origin", origin); // Allow requests from the specific origin
        }
        // Set other CORS headers
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Allow specific methods
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow specific headers
        res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow cookies
        // If the request is an OPTIONS request (pre-flight), respond with 200 status
        if (req.method === "OPTIONS") {
            res.sendStatus(200);
        }
        next();
    };
    // Use the custom CORS middleware
    app.use(customCors);
    // Example route (optional)
    app.get("/", (req, res) => {
        res.send("Server is running!");
    });
    app.use("/api", index_1.default);
    server.listen(PORT, () => {
        console.log(`[⚡⚡] => Server is running on port ${PORT}...`);
    });
    socketService.initListeners(); // Initialize socket listeners
    (0, kafka_1.consumeMessages)(["MESSAGES"]);
};
init();
