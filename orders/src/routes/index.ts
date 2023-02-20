import express, {Request, Response} from "express";
import {Order} from "../models";
import {isAuth} from "@as-mytix/common";

const router = express.Router();

router.get("/api/orders/", isAuth, async (req: Request, res: Response, next) => {
    const orders = await Order.find({userId: req.user!.id}).populate('ticket');
    return res.status(200).send(orders);
});

export {router as indexOrderRouter};