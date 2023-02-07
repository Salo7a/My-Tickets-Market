import express, {Request, Response} from "express";
import {body, validationResult} from "express-validator";
import {Ticket} from "../models/ticket";

import {validateRequest, isAuth} from "@as-mytix/common";

const router = express.Router();

router.post("/api/tickets", isAuth, [
        body("title").not().isEmpty().withMessage("Event title is not valid"),
        body("price").isFloat({min: 0}).withMessage("Price must be greater than zero")
    ], validateRequest,
    async (req: Request, res: Response) => {
        const {title, price} = req.body;
        const userId = req.user!.id;

        const ticket = Ticket.build({
            title, price, userId
        });

        await ticket.save();

        res.status(201).send(ticket);
    });

export {router as createTicketRouter};