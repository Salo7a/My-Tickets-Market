import {Listener, Subjects, OrderCreatedEvent} from "@as-mytix/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Order} from "../../models";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    readonly queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        const order = Order.build({
            id: data.id, price: data.ticket.price, status: data.status, userId: data.userId, version: data.version

        });
        try {
            await order.save();
            msg.ack();
        } catch (e) {
            console.log('Failed to save order: ', e);
        }
    }
}