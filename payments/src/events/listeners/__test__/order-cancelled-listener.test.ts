import mongoose from 'mongoose';
import {Message} from 'node-nats-streaming';
import {OrderCancelledListener} from '../order-cancelled-listener';
import {natsWrapper} from '../../../nats-wrapper';
import {Order, OrderStatus} from '../../../models';
import {OrderCancelledEvent} from "@as-mytix/common";

const setup = async () => {
        const listener = new OrderCancelledListener(natsWrapper.client);

        const order = Order.build({
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 80,
            status: OrderStatus.Created,
            userId: "123456",
            version: 0
        })
        await order.save();

        const data: OrderCancelledEvent['data'] = {
            updatedAt: order.updatedAt,
            version: 1,
            id: order.id,
            status: OrderStatus.Expired,
            ticket: {
                id: order.id,
            }
        };

// @ts-ignore
        const msg: Message = {
            ack: jest.fn(),
        };

        return {listener, data, msg};
    }
;

it('should lock the ticket by saving the associated order id to hte ticket', async () => {
    const {listener, data, msg} = await setup();

    await listener.onMessage(data, msg);

    const savedOrder = await Order.findById(data.id);

    expect(savedOrder).toBeDefined();
    expect(savedOrder!.status).toEqual(data.status);

});

it('should ack the message', async () => {
    const {data, listener, msg} = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

