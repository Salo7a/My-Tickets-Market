import mongoose from 'mongoose';
import {Message} from 'node-nats-streaming';
import {OrderStatus, OrderCancelledEvent} from '@as-mytix/common';
import {OrderCancelledListener} from '../order-cancelled-listener';
import {natsWrapper} from '../../../nats-wrapper';
import {Ticket} from '../../../models/ticket';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  let orderId = new mongoose.Types.ObjectId()
  const ticket = Ticket.build({
    userId: "123456",
    title: 'Event 1',
    price: 20
  });

  ticket.set({
    orderId: orderId
  })

  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: ticket.orderId!,
    version: ticket.version,
    status: OrderStatus.Cancelled,
    ticket: {
      id: ticket.id
    },
    updatedAt: new Date().toISOString()
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {msg, data, ticket, listener};
};

it('should unlock a ticket by deleting it\'s associated orderId', async () => {
  const {msg, data, ticket, listener} = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.orderId).not.toBeDefined();
});

it('should ack the message', async () => {
  const {msg, data, listener} = await setup();

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


