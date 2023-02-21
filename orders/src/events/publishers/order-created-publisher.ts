import {Publisher, Subjects, OrderCreatedEvent} from "@as-mytix/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}