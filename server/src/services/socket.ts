import { Server, Socket } from "socket.io";
import { pub, sub } from "./redis";
import { produceMessage } from "./kafka";
import { Message } from "../types";
import { handleReadReceipt } from "../helper/kafkaMessageHandlers";

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
        methods: ["GET", "POST", "PUT", "DELETE"],
      },
    });

    // Subscribe to Redis channels
    sub.subscribe("MESSAGES");
    sub.subscribe("READ_RECEIPT");
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
      this.registerEvent(socket, "event:messageRead", this.handleGenericEvents);

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
        // console.log(`Event received: ${eventName}`, payload);
        // Handle the event using the provided handler
        if (eventName === "event:joinRoom") {
          await handler(socket, payload.roomId, "", payload);
        } else if (eventName === "event:sendMessage") {
          await handler(socket, payload.roomId, "event:newMessage", payload);
        } else if (eventName === "event:callUser") {
          await handler(socket, payload.roomId, "event:incomingCall", payload);
        } else if (eventName === "event:answerCall") {
          await handler(socket, payload.roomId, "event:callAccepted", payload);
        } else if (eventName === "event:messageRead") {
          await handler(socket, payload.roomId, "event:messageRead", payload);
        }
      } catch (error) {
        console.error(`Error handling event "${eventName}":`, error);
      }
    });
  }

  // Redis subscriber for cross-instance message handling
  private initRedisListeners(): void {
    sub.on("message", async (channel: string, message: string) => {
      console.log(`New Redis message for channel ${channel}:`, message);
      
      if (channel === "MESSAGES") {
        const parsedMessage = JSON.parse(message) as Message;

        // const { chatId } = parsedMessage;

        // console.log(`New Redis message for room ${chatId}:`, message);

        // Send message to Kafka for further processing
        await produceMessage("MESSAGES", message);
      } else if (channel === "READ_RECEIPT") {
        const parsedMessage = JSON.parse(message);

        const { roomId } = parsedMessage;

        console.log(`New Redis read receipt for room ${roomId}:`, message);

        // Send message to Kafka for further processing
        // await produceMessage("READ_RECEIPT", message);

        handleReadReceipt(message);
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
    // console.log(`New message for room ${payload.chatId}:`, payload);
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
    // console.log(`New event (${event}) for room ${roomId}:`, payload);

    socket.to(roomId).emit(event, { ...payload, from: socket.id });
    // Publish to Redis for cross-instance communication
    if (event === "event:messageRead") {
      console.log("Publishing read receipt to Redis...");
      
      await pub.publish("READ_RECEIPT", JSON.stringify(payload));
    }
  }

  // Getter for the server instance
  public get io(): Server {
    return this._io;
  }
}

export default SocketService;
