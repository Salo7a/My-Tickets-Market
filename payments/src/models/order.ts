import mongoose, {Schema, Model, Document} from "mongoose";
import {OrderStatus} from '@as-mytix/common'
import {updateIfCurrentPlugin} from "mongoose-update-if-current";

/** Interface describing the properties required for a new order. */
interface OrderAttrs {
    id: string,
    userId: string,
    status: OrderStatus,
    price: number,
    version: number
}

/** Interface describing the properties an order document has (orders retrieved form the db). */
interface OrderDoc extends Document {
    userId: string,
    status: OrderStatus,
    price: number,
    updatedAt: string,
    createdAt: string,
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
    price: {
        type: Number,
        required: true,
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    },
    timestamps: true
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        userId: attrs.userId,
        status: attrs.status,
        price: attrs.price,
        version: attrs.version
    })
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export {Order, OrderStatus};