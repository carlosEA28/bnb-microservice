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
}
