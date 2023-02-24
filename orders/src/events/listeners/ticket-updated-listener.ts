import {Listener, Subjects, TicketUpdatedEvent} from "@as-mytix/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    readonly queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message): Promise<void> {
        const ticket = await Ticket.findByEvent(data);

        if (!ticket) throw new Error('Ticket not found')
        try {
            const {title, price} = data;
            ticket.set({
                title, price
            });
            await ticket.save();
            msg.ack();
        } catch (e) {

        }

    }
}