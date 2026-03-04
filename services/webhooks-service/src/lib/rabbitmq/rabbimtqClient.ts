import { Channel } from "amqplib";
import { EventPublisher } from "./eventPublisher";

export class RabbitmqClient implements EventPublisher {
  constructor(private channel: Channel) {}

  async PublishPaymentCompleted(queue: string, message: string): Promise<void> {
    await this.channel.assertQueue(queue, { durable: true });

    this.channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
  }

  async PublishPaymentFailed(queue: string, message: string): Promise<void> {
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
  }
}
