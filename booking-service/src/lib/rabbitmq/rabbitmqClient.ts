import { Channel } from "amqplib";
import { EventPublisher } from "./eventPublisher";
import { PublishBookingCreatedEventDto } from "./events/PublishBookingCreatedEventDto";

export class RabbitmqClient implements EventPublisher {
  constructor(private channel: Channel) {}

  async PublishBookingCreated(
    queue: string,
    message: PublishBookingCreatedEventDto,
  ): Promise<void> {
    await this.channel.assertQueue(queue, { durable: true });

    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }

  async Consume<T>(
    queue: string,
    callback: (msg: T | null) => void,
  ): Promise<void> {
    if (!this.channel) {
      throw new Error("RabbitMQ channel is not initialized.");
    }

    await this.channel.assertQueue(queue, { durable: true });

    this.channel.consume(
      queue,
      (msg) => {
        if (!msg || !msg.content) {
          return console.error(`Error incoming message`);
        }

        try {
          const data = JSON.parse(msg.content.toString()) as T;
          callback(data);
          this.channel.ack(msg);
        } catch (e) {
          this.channel.ack(msg);
        }
      },
      { noAck: false },
    );
  }
}
