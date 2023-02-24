import {Listener, OrderCreatedEvent, Subjects} from "@as-mytix/common/build";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {expirationQueue} from "../../queue/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly queueGroupName = queueGroupName;
    readonly subject = Subjects.OrderCreated;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message): Promise<void> {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        await expirationQueue.add({
            orderId: data.id
        }, {
            delay
        });

        msg.ack()
    }

}
