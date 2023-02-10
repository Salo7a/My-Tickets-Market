import {Message} from "node-nats-streaming";
import Publisher from "./publisher";
import {TicketCreatedEvent} from "./ticket-created-event";
import Subjects from "./subjects";

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}

export default TicketCreatedPublisher
