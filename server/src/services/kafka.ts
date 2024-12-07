import { Kafka, Producer } from "kafkajs";
import dotenv from "dotenv";
import createMessage from "../helper/kafkaMessageHandlers";
dotenv.config();

const kafka = new Kafka({
  clientId: "my-app",
  brokers: [process.env.KAFKA_BROKER as string],
});

let producer: null | Producer = null;

const createProducer = async () => {
  if (producer) {
    return producer;
  }
  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  return producer;
};

export const produceMessage = async (topic: string, message: string) => {
  const producer = await createProducer();

  await producer.send({
    topic,
    messages: [{ key: `${topic}-${Date.now()}`, value: message }],
  });
};

export const consumeMessages = async (topics: string[]) => {
  console.log("Kafka initialized!");
  const consumer = kafka.consumer({ groupId: "chatbox-group" });
  await consumer.connect();
  for (const topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: true });
  }
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value?.toString(),
        topic,
        partition,
      });
      if (topic === "MESSAGES") {
        await createMessage(message.value?.toString() as string);
      }
    },
  });
};
