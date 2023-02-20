import express, {Request, Response} from "express";
import {Order, OrderStatus} from "../models";
import {isAuth, NotAuthorizedError, NotFoundError} from "@as-mytix/common/build";
import mongoose from 'mongoose'
import {OrderCancelledPublisher} from '../events/'
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();

router.patch("/api/orders/:orderId", isAuth, async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    const isValid = mongoose.Types.ObjectId.isValid(orderId);
    const order = isValid && await Order.findById(orderId).populate('ticket');
    if (order) {
        if (order.userId !== req.user!.id) throw new NotAuthorizedError()
        order.set({
            status: OrderStatus.Cancelled
        })
        await order.save();
        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id, status: OrderStatus.Cancelled, ticket: {id: order.ticket.id},
        });
        res.status(204).send();
    } else {
        throw new NotFoundError();
    }
});

export {router as cancelOrderRouter};