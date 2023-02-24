import {Publisher, Subjects, ExpirationCompleteEvent} from "@as-mytix/common/build";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}