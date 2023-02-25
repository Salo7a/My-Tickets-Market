import {Publisher, Subjects, PaymentCreatedEvent} from "@as-mytix/common/build";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}