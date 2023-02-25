import {Listener, Subjects, OrderCancelledEvent} from "@as-mytix/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Order, OrderStatus} from "../../models";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    readonly queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {
        const {id, status, version} = data;
        const order = await Order.findOne({id, version: version - 1});
        if (!order) throw new Error('Order Not Found')
        try {
            order.set({status});

            await order.save();

            msg.ack();
        } catch (e) {
            console.log('Failed to cancel order:', e)
        }


    }
}