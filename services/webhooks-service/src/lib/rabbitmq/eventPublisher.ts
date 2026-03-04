export interface EventPublisher {
  PublishPaymentCompleted(queue: string, message: string): Promise<void>;
  PublishPaymentFailed(queue: string, message: string): Promise<void>;
}
