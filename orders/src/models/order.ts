import mongoose, {Schema, Model, Document} from "mongoose";
import {OrderStatus} from '@as-mytix/common'
import {TicketDoc} from "./ticket";

/** Interface describing the properties required for a new order. */
interface OrderAttrs {
    userId: string,
    status: OrderStatus,
    expiresAt: Date,
    ticket: TicketDoc
}

/** Interface describing the properties an order document has (orders retrieved form the db). */
interface OrderDoc extends Document {
    userId: string,
    status: OrderStatus,
    expiresAt: Date,
    ticket: TicketDoc
}

/** Interface describing the properties an order model has. */
interface OrderModel extends Model<OrderDoc> {
    build(attrs: OrderAttrs): any
}

const orderSchema = new Schema<OrderAttrs>({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: Schema.Types.Date
    },
    ticket: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Ticket'
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
        versionKey: false
    }
});

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs)
}

const Order = mongoose.model<OrderAttrs, OrderModel>('Order', orderSchema);

export {Order, OrderStatus};