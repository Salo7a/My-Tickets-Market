import {Listener, Subjects, TicketCreatedEvent} from "@as-mytix/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    readonly queueGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message): Promise<void> {
        const {id, title, price} = data;
        try {
            const ticket = Ticket.build({
                id, title, price
            });

            await ticket.save();
            msg.ack();
        } catch (e) {
        }
    }
}