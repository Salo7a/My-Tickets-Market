import express, {Request, Response} from "express";
import {Ticket} from "../models/ticket";
import {isAuth, NotAuthorizedError, NotFoundError, validateRequest} from "@as-mytix/common/build";
import mongoose from 'mongoose'
import {body} from "express-validator";
import {TicketUpdatedPublisher} from '../events/publishers/ticket-updated-publisher'
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();

router.put("/api/tickets/:id", isAuth, [
    body("title").not().isEmpty().withMessage("Event title is not valid"),
    body("price").isFloat({min: 0}).withMessage("Price must be greater than zero")
], validateRequest, async (req: Request, res: Response) => {
    const {title, price} = req.body;
    const id = req.params.id;
    const isValid = mongoose.Types.ObjectId.isValid(id);
    const ticket = isValid && await Ticket.findById(id);
    if (ticket) {
        if (ticket.userId !== req.user!.id) throw new NotAuthorizedError()
        ticket.set({
            title,
            price
        });
        await ticket.save();
        await new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id, price: ticket.price, title: ticket.title, userId: ticket.userId
        });
        res.send(ticket);
    } else {
        throw new NotFoundError();
    }

});

export {router as updateTicketRouter};