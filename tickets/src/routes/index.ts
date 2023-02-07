import express, {Request, Response} from "express";
import {Ticket} from "../models/ticket";
import {NotFoundError} from "@as-mytix/common/build";
import mongoose from 'mongoose'


const router = express.Router();

router.get("/api/tickets/", async (req: Request, res: Response, next) => {
    const tickets = await Ticket.find({});
    return res.status(200).send(tickets);

});

export {router as indexTicketRouter};