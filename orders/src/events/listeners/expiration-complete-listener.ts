import {Listener, Subjects, ExpirationCompleteEvent} from "@as-mytix/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Order, OrderStatus} from "../../models";
import {OrderCancelledPublisher} from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
    readonly queueGroupName = queueGroupName;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message): Promise<void> {
        const {orderId} = data;

        const order = await Order.findById(orderId).populate('ticket');
        if (!order) throw new Error('Order Not Found')
        try {
            if (order.status === OrderStatus.Created || order.status === OrderStatus.AwaitingPayment) {
                order.set({
                    status: OrderStatus.Expired
                });
                await order.save();
                new OrderCancelledPublisher(this.client).publish({
                    id: order.id,
                    status: order.status,
                    ticket: {
                        id: order.ticket.id
                    },
                    updatedAt: order.updatedAt,
                    version: order.version
                })
            }
            msg.ack();
        } catch (e) {
            console.log(`Failed to expire order ${orderId}:`, e)
        }
    }
}