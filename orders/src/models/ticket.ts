import mongoose, {Schema, Model, Document} from "mongoose";
import {Order, OrderStatus} from "./order";
import {updateIfCurrentPlugin} from "mongoose-update-if-current";

/** Interface describing the properties required for a new ticket. */
interface TicketAttrs {
    id: string,
    title: string,
    price: number,
    version?: number
}

/** Interface describing the properties a ticket document has. */
export interface TicketDoc extends Document {
    id: string,
    title: string,
    price: number,
    version: number

    isReserved(): Promise<boolean>;
}

/** Interface describing the properties a ticket model has. */
interface TicketModel extends Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc,

    findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>
}

const ticketSchema = new Schema<TicketDoc>({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});


ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    })
}

ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
    return Ticket.findOne({
        _id: event.id, version: event.version - 1
    })
}

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);
// ticketSchema.pre('save', function (done) {
//         this.$where = {
//             version: this.get('version') - 1
//         }
//         done();
//     }
// )

ticketSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Completed
            ]
        }
    });
    return !!existingOrder
}
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);


export {Ticket};