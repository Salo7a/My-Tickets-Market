import {Listener, Subjects, PaymentCreatedEvent} from "@as-mytix/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Order, OrderStatus, Ticket} from "../../models";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
    readonly queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message): Promise<void> {
        const {orderId} = data;

        const order = await Order.findById(orderId);
        if (!order) throw new Error('Error Not Found')
        try {
            order.set({status: OrderStatus.Completed})

            await order.save();

            msg.ack();
        } catch (e) {
            console.log('Failed To Set Order As Completed')
        }
    }
}