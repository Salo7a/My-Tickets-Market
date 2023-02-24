import mongoose from 'mongoose';
import {Message} from 'node-nats-streaming';
import {OrderStatus, OrderCreatedEvent} from '@as-mytix/common';
import {OrderCreatedListener} from '../order-created-listener';
import {natsWrapper} from '../../../nats-wrapper';
import {Ticket} from '../../../models/ticket';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: "Event 1",
    price: 80,
    userId: "123456",
  });

  await ticket.save();

  let expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + 30);

  const data: OrderCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: "123456",
    status: OrderStatus.Created,
    expiresAt: expiration.toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {listener, ticket, data, msg};
};

it('should lock the ticket by saving the associated order id to hte ticket', async () => {
  const {listener, ticket, data, msg} = await setup();

  await listener.onMessage(data, msg);

  const savedTicket = await Ticket.findById(ticket.id);

  expect(savedTicket).toBeDefined();
  expect(savedTicket!.orderId).toEqual(data.id);

});

it('should ack the message', async () => {
  const {data, listener, msg} = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('should publish a ticket updated event', async () => {
  const {data, listener, msg} = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  let eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(data.ticket.id).toEqual(eventData.id)
});

