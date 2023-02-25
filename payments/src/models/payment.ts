import mongoose, {Schema, Model, Document} from "mongoose";
import {updateIfCurrentPlugin} from "mongoose-update-if-current";

/** Interface describing the properties required for a new payment. */
interface PaymentAttrs {
    orderId: string,
    stripeId: string
}

/** Interface describing the properties a payment model has. */
interface PaymentModel extends Model<PaymentDoc> {
    build(attrs: PaymentAttrs): PaymentDoc
}


/** Interface describing the properties a payment document has. */
interface PaymentDoc extends Document {
    orderId: string,
    stripeId: string,
    version: number
}

const paymentSchema = new Schema<PaymentDoc>({
    orderId: {
        type: String,
        required: true
    },
    stripeId: {
        type: String,
        required: true
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

paymentSchema.set('versionKey', 'version');
paymentSchema.plugin(updateIfCurrentPlugin);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
    return new Payment(attrs)
}

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export {Payment};