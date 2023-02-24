import {Listener, Subjects, OrderCreatedEvent} from "@as-mytix/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";
import {TicketUpdatedPublisher} from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    readonly queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        const {id, ticket: orderedTicket} = data;
        const ticket = await Ticket.findById(orderedTicket.id);
        if (!ticket) throw new Error('Failed to lock ticket: Ticket not found')
        try {
            ticket.set({
                orderId: id
            });
            await ticket.save();

            await new TicketUpdatedPublisher(this.client).publish({
                id: ticket.id,
                price: ticket.price,
                title: ticket.title,
                userId: ticket.userId,
                version: ticket.version,
                orderId: ticket.orderId
            });

            msg.ack();
        } catch (e) {
            console.log('Failed to lock ticket: ', e)
        }


    }
}