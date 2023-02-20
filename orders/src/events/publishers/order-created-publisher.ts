import {Publisher, Subjects, OrderCreatedEvent} from "@as-mytix/common/build";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}