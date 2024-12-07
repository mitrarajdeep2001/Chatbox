import express from "express";
import http from "http";
import SocketService from "./services/socket";
import dotenv from "dotenv";
dotenv.config();
import router from "./routes/index";
import { consumeMessages } from "./services/kafka";
import { Request, Response, NextFunction } from "express";

const init = () => {
  const app = express(); // Initialize Express app
  const socketService = new SocketService();

  const server = http.createServer(app); // Use Express app with HTTP server
  socketService.io.attach(server); // Attach Socket.io to the server

  const PORT = process.env.PORT || 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const customCors = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const allowedOrigins = [
      process.env.CLIENT_BASE_URL,
      "https://another-origin.com",
    ]; // Define allowed origins
    const origin = req.headers.origin as string;

    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin); // Allow requests from the specific origin
    }

    // Set other CORS headers
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    ); // Allow specific methods
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    ); // Allow specific headers
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

  app.use("/api", router);

  server.listen(PORT, () => {
    console.log(`[⚡⚡] => Server is running on port ${PORT}...`);
  });

  socketService.initListeners(); // Initialize socket listeners
  consumeMessages(["MESSAGES"]);
};

init();
