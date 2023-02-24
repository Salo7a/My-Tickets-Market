import mongoose, {Schema, Model, Document} from "mongoose";
import {OrderStatus} from '@as-mytix/common'
import {TicketDoc} from "./ticket";
import {updateIfCurrentPlugin} from "mongoose-update-if-current";

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
    ticket: TicketDoc,
    updatedAt: string,
    version: number
}

/** Interface describing the properties an order model has. */
interface OrderModel extends Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new Schema<OrderDoc>({
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
    },
    timestamps: true
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs)
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export {Order, OrderStatus};