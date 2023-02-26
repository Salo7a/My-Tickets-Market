import request from 'supertest';
import {app} from "../../app";
import {Ticket} from "../../models/ticket";
import mongoose from "mongoose";

it("should return a 404 if the provided ticket id doesn't exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).put(`/api/tickets/${id}`).set('Cookie', login()).send({
        title: "Event",
        price: 50,
        type: 'Silver',
        seat: 'F-7'
    }).expect(404);
});

it("should return a 401 if a user tried to update ticket while not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).put(`/api/tickets/${id}`).send({
        title: "Event",
        price: 50
    }).expect(401);
});

it("should return a 401 if a user doesn't own the ticket he's trying to update", async () => {
    const title = 'Event 1';
    const price = 800;
    const userId = "1234";
    const type = 'Gold';
    const seat = 'G-5';

    let ticket = Ticket.build({
        title, price, userId, type, seat
    });

    await ticket.save();

    await request(app).put(`/api/tickets/${ticket.id}`)
        .set('Cookie', login()).send({
            title: "Event 2",
            price: 50,
            type: 'Silver',
            seat: 'F-7'
        }).expect(401);
});

it("should return a 400 if invalid data is provided", async () => {
    const title = 'Event 1';
    const price = 800;
    const userId = "123456";

    let ticket = Ticket.build({
        title, price, userId
    });

    const cookie = login();
    await ticket.save();
    await request(app).put(`/api/tickets/${ticket.id}`)
        .set('Cookie', cookie).send({
            title: "",
            price: 50
        }).expect(400);

    await request(app).put(`/api/tickets/${ticket.id}`)
        .set('Cookie', cookie).send({
            title: "Event 2",
            price: -50
        }).expect(400);

});

it("should update the ticket provided with valid inputs", async () => {
    const title = 'Event 1';
    const price = 800;
    const userId = "123456";
    const type = 'Gold';
    const seat = 'G-5';

    let ticket = Ticket.build({
        title, price, userId, type, seat
    });

    await ticket.save();
    const cookie = login();

    let response = await request(app).put(`/api/tickets/${ticket.id}`)
        .set('Cookie', cookie).send({
            title: "Event 4",
            price: 50,
            type: 'Silver',
            seat: 'F-7'
        }).expect(200);

    expect(response.body.title).toEqual('Event 4');
    expect(response.body.price).toEqual(50);
    let updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.title).toEqual('Event 4');
    expect(updatedTicket!.price).toEqual(50);
});

it("should reject the ticket update if the ticket is reserved", async () => {
    const title = 'Event 1';
    const price = 800;
    const userId = "123456";

    let orderId = new mongoose.Types.ObjectId()

    let ticket = Ticket.build({
        title, price, userId
    });

    ticket.set({orderId})

    await ticket.save();

    await request(app).put(`/api/tickets/${ticket.id}`)
        .set('Cookie', login()).send({
            title: "Event 4",
            price: 50
        }).expect(400);
});

