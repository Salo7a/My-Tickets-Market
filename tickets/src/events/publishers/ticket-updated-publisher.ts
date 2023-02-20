import {Publisher, Subjects, TicketUpdatedEvent} from "@as-mytix/common/build";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}