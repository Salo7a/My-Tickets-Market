import express, {Request, Response} from "express";
import {Order, OrderStatus, Payment} from "../models";
import {isAuth, NotFoundError, validateRequest, NotAuthorizedError, BadRequestError} from "@as-mytix/common";
import {body} from "express-validator";
import {stripe} from "../stripe";
import {PaymentCreatedPublisher} from "../events/publishers/payment-created-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();

router.post("/api/payments/", isAuth, [
    body('token').notEmpty(), body('orderId').notEmpty()
], validateRequest, async (req: Request, res: Response) => {
    const {token, orderId} = req.body

    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();

    if (order.userId !== req.user?.id) throw new NotAuthorizedError()

    if ([OrderStatus.Expired, OrderStatus.Cancelled, OrderStatus.Completed].includes(order.status)) {
        throw new BadRequestError("This Order was cancelled, has expired or already completed")
    }

    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token
    });

    const payment = Payment.build({
        orderId, stripeId: charge.id
    });

    await payment.save()

    new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id, orderId: payment.orderId, stripeId: payment.stripeId
    });

    res.status(201).send({msg: "Success"});
});

export {router as createChargeRouter};