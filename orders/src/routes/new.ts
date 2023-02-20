import express, {Request, Response} from "express";
import {body, validationResult} from "express-validator";
import {Order, Ticket, OrderStatus} from "../models";
import {OrderCreatedPublisher} from "../events/publishers/order-created-publisher";
import {validateRequest, isAuth, BadRequestError} from "@as-mytix/common";
import {natsWrapper} from "../nats-wrapper";

import mongoose from "mongoose";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 30;

router.post("/api/orders", isAuth, [
        body("ticketId").notEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage("Ticket ID is not valid")
    ], validateRequest,
    async (req: Request, res: Response) => {
        // Find the ticket
        const {ticketId} = req.body;
        const ticket = await Ticket.findById(ticketId);

        // Throw an error if the ticket doesn't exist
        if (!ticket) throw new BadRequestError('No ticket with the given id was found')

        // Check that no order exists for this ticket
        const isReserved = await ticket.isReserved()
        if (isReserved) throw new BadRequestError('This ticket is currently not available for ordering');

        // Generate Expiration Date
        let expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

        // Create an order
        const userId = req.user!.id;
        const order = Order.build({
            expiresAt: expiration, status: OrderStatus.Created, ticket, userId
        });

        await order.save();

        // await new OrderCreatedPublisher(natsWrapper.client).publish({
        //     id: order.id,
        //     ticketId: order.ticketId,
        //     userId: order.userId
        // });

        res.status(201).send(order);
    });

export {router as newOrderRouter};