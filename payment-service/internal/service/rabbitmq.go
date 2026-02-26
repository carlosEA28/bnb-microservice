package service

import (
	"fmt"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

type MessageHandler interface {
	HandleMessage(delivery amqp.Delivery) error
}

type Consumer struct {
	conn      *amqp.Connection
	channel   *amqp.Channel
	queueName string
	handler   MessageHandler
}

func NewConsumer(amqpURL, queueName string, handler MessageHandler) (*Consumer, error) {
	conn, err := amqp.Dial(amqpURL)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to RabbitMQ: %w", err)
	}

	ch, err := conn.Channel()
	if err != nil {
		return nil, fmt.Errorf("failed to open a channel: %w", err)
	}

	return &Consumer{
		conn:      conn,
		channel:   ch,
		queueName: queueName,
		handler:   handler,
	}, nil
}

func (c *Consumer) StartConsumer() error {
	msgs, err := c.channel.Consume(
		c.queueName,
		"",
		false,
		false,
		false,
		false,
		nil,
	)

	if err != nil {
		return fmt.Errorf("failed to register a consumer: %w", err)
	}

	go func() {
		for d := range msgs {
			if err := c.handler.HandleMessage(d); err != nil {
				fmt.Printf("Error handling message: %v\n", err)
				d.Nack(false, true)
			} else {
				d.Ack(false)
			}
		}
	}()

	log.Printf("Consumer started and listening for messages on queue %s", c.queueName)
	return nil
}

func (c *Consumer) Close() {
	c.channel.Close()
	c.conn.Close()
}
