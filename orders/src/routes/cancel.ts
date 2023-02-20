import express, {Request, Response} from "express";
import {Order, OrderStatus} from "../models";
import {isAuth, NotAuthorizedError, NotFoundError} from "@as-mytix/common/build";
import mongoose from 'mongoose'
import {TicketUpdatedPublisher} from '../events/publishers/ticket-updated-publisher'
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();

router.patch("/api/orders/:orderId", isAuth, async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    const isValid = mongoose.Types.ObjectId.isValid(orderId);
    const order = isValid && await Order.findById(orderId);
    if (order) {
        if (order.userId !== req.user!.id) throw new NotAuthorizedError()
        order.set({
            status: OrderStatus.Cancelled
        })
        await order.save();
        // await new TicketUpdatedPublisher(natsWrapper.client).publish({
        //     id: ticket.id, price: ticket.price, title: ticket.title, userId: ticket.userId
        // });
        res.status(204).send();
    } else {
        throw new NotFoundError();
    }
});

export {router as cancelOrderRouter};