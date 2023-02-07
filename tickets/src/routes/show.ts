import express, {Request, Response} from "express";
import {Ticket} from "../models/ticket";
import {NotFoundError} from "@as-mytix/common/build";
import mongoose from 'mongoose'


const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response, next) => {
    const id = req.params.id;
    const isValid = mongoose.Types.ObjectId.isValid(id);
    const ticket = isValid && await Ticket.findById(id);
    if (ticket) {
        return res.status(200).send(ticket);
    } else {
        throw new NotFoundError();
    }
});

export {router as showTicketRouter};