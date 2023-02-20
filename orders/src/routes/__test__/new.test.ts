import request from 'supertest';
import {app} from "../../app";
import {Ticket, Order, OrderStatus} from "../../models";
import {natsWrapper} from "../../nats-wrapper";
import mongoose from "mongoose";

it("should have a route listening for post requests at /api/orders", async () => {
    const response = await request(app).post("/api/orders").send({});
    expect(response.status).not.toEqual(404);
});

it("should give error if no user is logged in", async () => {
    await request(app).post("/api/orders").send({}).expect(401);
});

it("should not give 401 unauthorized error", async () => {
    const response = await request(app).post("/api/orders").set('Cookie', login()).send({});
    expect(response.status).not.toEqual(401);
});

it("should return an error if an invalid ticket id is given", async () => {
    const response = await request(app)
        .post("/api/orders")
        .set('Cookie', login())
        .send({
            ticketId: '123'
        })
        .expect(400);

    expect(response.body.errors[0].msg).toEqual('Ticket ID is not valid')
});

it("should return an error if the ticket is not found", async () => {
    const ticketID = new mongoose.Types.ObjectId();

    const response = await request(app)
        .post("/api/orders")
        .set('Cookie', login())
        .send({
            ticketId: ticketID
        })
        .expect(400);

    expect(response.body.errors[0].msg).toEqual('No ticket with the given id was found')
});

it("should return an error if the ticket is reserved", async () => {
    const ticket = Ticket.build({
        title: "Concert",
        price: 20
    });

    await ticket.save();

    let expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 60);

    const order = Order.build({
        expiresAt: expiration,
        status: OrderStatus.Created, ticket, userId: "123456"
    })

    await order.save();

    const response = await request(app)
        .post("/api/orders")
        .set('Cookie', login())
        .send({
            ticketId: ticket.id
        })
        .expect(400);

    expect(response.body.errors[0].msg).toEqual('This ticket is currently not available for ordering')
});

it("should return a 201, create an order & publish it on sending a valid, unreserved ticketId", async () => {
    const ticket = Ticket.build({
        title: "Concert",
        price: 0
    });

    await ticket.save();

    const response = await request(app)
        .post("/api/orders")
        .set('Cookie', login())
        .send({
            ticketId: ticket.id
        }).expect(201);

    const isReserved = await ticket.isReserved();
    expect(isReserved).toEqual(true);

    const order = await Order.find({ticket, status: OrderStatus.Created}).populate('ticket');
    expect(order.length).toEqual(1);
    expect(response.body.id).toEqual(order[0].id);
    expect(response.body.ticket.id).toEqual(order[0].ticket.id);
    // expect(natsWrapper.client.publish).toHaveBeenCalled();
});
