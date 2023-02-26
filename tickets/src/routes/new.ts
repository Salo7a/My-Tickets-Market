import express, {Request, Response} from "express";
import {body, validationResult} from "express-validator";
import {Ticket} from "../models/ticket";
import {TicketCreatedPublisher} from "../events/publishers/ticket-created-publisher";
import {validateRequest, isAuth} from "@as-mytix/common";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();

router.post("/api/tickets", isAuth, [
        body("title").not().isEmpty().withMessage("Event title is not valid"),
        body("price").isFloat({min: 0}).withMessage("Price must be greater than zero"),
        body("type").not().isEmpty().withMessage("Ticket type cannot be empty"),
        body("seat").not().isEmpty().withMessage("Ticket seat cannot be empty"),

    ], validateRequest,
    async (req: Request, res: Response) => {
        const {title, price, type, seat} = req.body;
        const userId = req.user!.id;

        const ticket = Ticket.build({
            title, price, userId, type, seat
        });

        await ticket.save();

        await new TicketCreatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version,
        });

        res.status(201).send(ticket);
    });

export {router as createTicketRouter};