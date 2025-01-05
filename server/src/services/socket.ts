import { Server, Socket } from "socket.io";
import { pub, sub } from "./redis";
import prisma from "./prisma";
import { produceMessage } from "./kafka";
import createMessage from "../helper/kafkaMessageHandlers"; // Example helper
import { Message } from "../types";

interface SocketEventPayload {
  roomId: string;
  message: Message;
}

type EventHandler = (
  socket: Socket,
  roomId: string,
  event: string,
  payload: any
) => Promise<void>;

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Initializing Socket Service...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    // Subscribe to Redis channels
    sub.subscribe("MESSAGES");
  }

  // Initialize all listeners
  public initListeners(): void {
    console.log("Initializing Socket Listeners...");
    const io = this._io;

    io.on("connection", (socket: Socket) => {
      console.log("New socket connected:", socket.id);

      // Generalized event handler
      this.registerEvent(socket, "event:joinRoom", this.handleJoinRoom);
      this.registerEvent(socket, "event:sendMessage", this.handleMessage);
      this.registerEvent(socket, "event:callUser", this.handleGenericEvents);
      this.registerEvent(socket, "event:answerCall", this.handleGenericEvents);
      this.registerEvent(
        socket,
        "event:iceCandidate",
        this.handleGenericEvents
      );
      this.registerEvent(
        socket,
        "event:negotiationNeeded",
        this.handleGenericEvents
      );

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
      });
    });

    // Listen for Redis events
    this.initRedisListeners();
  }

  // Register a specific event and its handler
  private registerEvent(
    socket: Socket,
    eventName: string,
    handler: EventHandler
  ): void {
    socket.on(eventName, async (payload) => {
      try {
        console.log(`Event received: ${eventName}`, payload);
        // Handle the event using the provided handler
        if (eventName === "event:joinRoom") {
          await handler(socket, payload.roomId, "", payload);
        } else if (eventName === "event:sendMessage") {
          await handler(socket, payload.roomId, "event:newMessage", payload);
        } else if (eventName === "event:callUser") {
          await handler(socket, payload.roomId, "event:incomingCall", payload);
        } else if (eventName === "event:answerCall") {
          await handler(socket, payload.roomId, "event:callAccepted", payload);
        } else if (eventName === "event:negotiationNeeded") {
          await handler(socket, payload.roomId, "event:negotiate", payload);
        } else if (eventName === "event:negotiate") {
          await handler(socket, payload.roomId, "event:callAccepted", payload);
        } else if (eventName === "event:iceCandidate") {
          await handler(socket, payload.roomId, "event:iceCandidate", payload);
        } 
      } catch (error) {
        console.error(`Error handling event "${eventName}":`, error);
        // socket.emit("error", { event: eventName, error: error.message });
      }
    });
  }

  // Redis subscriber for cross-instance message handling
  private initRedisListeners(): void {
    sub.on("message", async (channel: string, message: string) => {
      if (channel === "MESSAGES") {
        const parsedMessage = JSON.parse(message) as Message;

        const { chatId } = parsedMessage;

        console.log(`New Redis message for room ${chatId}:`, message);

        // Emit to the correct room
        // this._io.to(chatId).emit("event:newMessage", message);

        // Send message to Kafka for further processing
        await produceMessage("MESSAGES", message);
      }
    });
  }

  // Handle join room event
  private async handleJoinRoom(
    socket: Socket,
    roomId: string,
    event: string,
    payload: SocketEventPayload
  ): Promise<void> {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
  }

  // Handle send message event
  private async handleMessage(
    socket: Socket,
    roomId: string,
    event: string,
    payload: any
  ): Promise<void> {
    console.log(`New message for room ${payload.chatId}:`, payload);
    socket.to(payload.chatId).emit(event, payload);
    // Publish to Redis for cross-instance communication
    await pub.publish("MESSAGES", JSON.stringify(payload));
  }

  // Handler send offer
  private async handleGenericEvents(
    socket: Socket,
    roomId: string,
    event: string,
    payload: any
  ): Promise<void> {
    console.log(`New event (${event}) for room ${roomId}:`, payload);

    socket.to(roomId).emit(event, { ...payload, from: socket.id });
  }

  // Getter for the server instance
  public get io(): Server {
    return this._io;
  }
}

export default SocketService;
