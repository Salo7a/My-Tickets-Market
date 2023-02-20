import {Publisher, Subjects, TicketCreatedEvent} from "@as-mytix/common/build";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}