import {Listener, Subjects, OrderCancelledEvent} from "@as-mytix/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";
import {TicketUpdatedPublisher} from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    readonly queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {
        const {id, ticket: orderedTicket} = data;
        const ticket = await Ticket.findOne({id: orderedTicket.id, orderId: id});
        if (!ticket) throw new Error('Failed to unlock ticket: No ticket associated with this order was found')
        try {
            ticket.set({
                orderId: undefined
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
            console.log('Failed to unlock ticket: ', e)
        }


    }
}