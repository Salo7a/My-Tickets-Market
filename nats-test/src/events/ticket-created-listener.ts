import {Message} from "node-nats-streaming";
import Listener from "./listener";
import {TicketCreatedEvent} from "./ticket-created-event";
import Subjects from "./subjects";

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    queueGroupName = 'payments-service';
    readonly subject = Subjects.TicketCreated;

    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log(`Data: ${data}`);
        msg.ack();
    }
}

export default TicketCreatedListener
