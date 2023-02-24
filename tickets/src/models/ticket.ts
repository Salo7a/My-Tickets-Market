import mongoose, {Schema, Model, Document} from "mongoose";
import {updateIfCurrentPlugin} from "mongoose-update-if-current";

/** Interface describing the properties required for a new ticket. */
interface TicketAttrs {
    title: string,
    price: number,
    userId: string,
    type?: string,
    location?: string
}

/** Interface describing the properties a ticket model has. */
interface TicketModel extends Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc
}


/** Interface describing the properties a ticket document has. */
interface TicketDoc extends Document {
    title: string,
    price: number,
    userId: string,
    type?: string,
    location?: string,
    orderId?: string,
    createdAt: string,
    updatedAt: string,
    version: number
}

const ticketSchema = new Schema<TicketDoc>({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    type: {
        type: String,
    },
    location: {
        type: String,
    },
    orderId: {
        type: String,
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

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs)
}


const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);


export {Ticket};