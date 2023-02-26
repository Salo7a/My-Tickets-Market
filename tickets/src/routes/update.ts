import express, {Request, Response} from "express";
import {Ticket} from "../models/ticket";
import {BadRequestError, isAuth, NotAuthorizedError, NotFoundError, validateRequest} from "@as-mytix/common/build";
import mongoose from 'mongoose'
import {body} from "express-validator";
import {TicketUpdatedPublisher} from '../events/publishers/ticket-updated-publisher'
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();

router.put("/api/tickets/:id", isAuth, [
    body("title").not().isEmpty().withMessage("Event title is not valid"),
    body("price").isFloat({min: 0}).withMessage("Price must be greater than zero"),
    body("type").not().isEmpty().withMessage("Ticket type cannot be empty"),
    body("seat").not().isEmpty().withMessage("Ticket seat cannot be empty")
], validateRequest, async (req: Request, res: Response) => {
    const {title, price, type, seat} = req.body;
    const id = req.params.id;
    const isValid = mongoose.Types.ObjectId.isValid(id);
    const ticket = isValid && await Ticket.findById(id);
    if (ticket) {
        if (ticket.userId !== req.user!.id) throw new NotAuthorizedError()

        if (ticket.orderId) throw new BadRequestError("This ticket is currently reserved")

        ticket.set({
            title,
            price,
            type,
            seat
        });

        await ticket.save();

        await new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id, price: ticket.price, title: ticket.title, userId: ticket.userId, version: ticket.version
        });

        res.send(ticket);
    } else {
        throw new NotFoundError();
    }

});

export {router as updateTicketRouter};