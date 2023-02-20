import express, {Request, Response} from "express";
import {Order} from "../models";
import {isAuth, NotAuthorizedError, NotFoundError} from "@as-mytix/common/build";
import mongoose from 'mongoose'
import {body, validationResult, param} from "express-validator";

const router = express.Router();

router.get("/api/orders/:orderId", isAuth, async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    const isValid = mongoose.Types.ObjectId.isValid(orderId);
    const order = isValid && await Order.findById(orderId).populate('ticket');

    if (!order) throw new NotFoundError();

    if (order.userId !== req.user!.id) throw new NotAuthorizedError();

    res.status(200).send(order);
});

export {router as showOrderRouter};