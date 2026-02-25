import amqp, { Channel, ChannelModel } from "amqplib";
import { env } from "../../env/env";

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

export async function getRabbitMQChannel(): Promise<Channel> {
  if (channel) {
    return channel;
  }

  connection = await amqp.connect(env.RABBITMQ_URL);
  channel = await connection.createChannel();

  return channel;
}

export async function closeRabbitMQ(): Promise<void> {
  if (channel) {
    await channel.close();
    channel = null;
  }
  if (connection) {
    await connection.close();
    connection = null;
  }
}
