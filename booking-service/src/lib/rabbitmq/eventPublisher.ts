import { PublishBookingCreatedEventDto } from "./events/PublishBookingCreatedEventDto";

export interface EventPublisher {
  // mudar de any para um dto
  PublishBookingCreated(
    queue: string,
    message: PublishBookingCreatedEventDto,
  ): void;
}
