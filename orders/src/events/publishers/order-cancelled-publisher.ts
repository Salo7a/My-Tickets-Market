import {Publisher, Subjects, OrderCancelledEvent} from "@as-mytix/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}