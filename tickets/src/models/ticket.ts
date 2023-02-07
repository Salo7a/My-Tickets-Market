import mongoose, {Schema, Model, Document} from "mongoose";

/** Interface describing the properties required for a new ticket. */
interface TicketAttrs {
    title: string,
    price: number,
    userId: string
}

/** Interface describing the properties a ticket model has. */
interface TicketModel extends Model<any> {
    build(attrs: TicketAttrs): any
}


/** Interface describing the properties a Ticket document has. */
interface TicketDoc extends Document {
    title: string,
    price: number,
    userId: string
}

const ticketSchema = new Schema<TicketAttrs>({
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
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
        versionKey: false
    }
});


ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs)
}


const Ticket = mongoose.model<TicketAttrs, TicketModel>('Ticket', ticketSchema);


export {Ticket};