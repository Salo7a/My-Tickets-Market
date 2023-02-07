import request from 'supertest';
import {app} from "../../app";
import {Ticket} from "../../models/ticket";
import mongoose from "mongoose";

it("should give a 404 if the ticket is not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("should return the ticket if found", async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const title = 'Event';
    const price = 800;
    const userId = "1234";

    const ticket = Ticket.build({
        title, price, userId
    });

    await ticket.save();

    const response = await request(app).get(`/api/tickets/${ticket.id}`).send().expect(200);
    expect(response.body.title).toEqual(title);
    expect(response.body.price).toEqual(price);
    expect(response.body.userId).toEqual(userId);
});
