import express from "express";
import http from "http";
import SocketService from "./services/socket";
import dotenv from "dotenv";
dotenv.config();
import router from "./routes/index";
import { consumeMessages } from "./services/kafka";
import cors from "cors"


const init = () => {
  const app = express(); // Initialize Express app
  const socketService = new SocketService();

  const server = http.createServer(app); // Use Express app with HTTP server
  socketService.io.attach(server); // Attach Socket.io to the server

  const PORT = process.env.PORT || 4000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Use the CORS middleware
  app.use(
    cors({
      origin: `*`,
      methods: ["GET", "POST", "DELETE", "PUT"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Cache-Control",
        "Expires",
        "Pragma",
      ],
      credentials: true,
    })
  );

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
