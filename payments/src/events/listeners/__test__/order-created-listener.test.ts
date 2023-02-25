import mongoose from 'mongoose';
import {Message} from 'node-nats-streaming';
import {OrderStatus, OrderCreatedEvent} from '@as-mytix/common';
import {OrderCreatedListener} from '../order-created-listener';
import {natsWrapper} from '../../../nats-wrapper';
import {Order} from '../../../models';

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    let expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 30);

    const data: OrderCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: "123456",
        status: OrderStatus.Created,
        expiresAt: expiration.toISOString(),
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 800
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return {listener, data, msg};
};

it('should lock the ticket by saving the associated order id to hte ticket', async () => {
    const {listener, data, msg} = await setup();

    await listener.onMessage(data, msg);

    const savedOrder = await Order.findById(data.id);

    expect(savedOrder).toBeDefined();
    expect(savedOrder!.price).toEqual(data.ticket.price);

});

it('should ack the message', async () => {
    const {data, listener, msg} = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});
