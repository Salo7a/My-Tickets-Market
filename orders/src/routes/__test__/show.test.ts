import request from 'supertest';
import {app} from "../../app";
import mongoose from "mongoose";

it("should have a route listening for get requests at /api/orders/:orderId", async () => {
    const response = await request(app).get("/api/orders/1").send();
    expect(response.status).not.toEqual(404);
});

it("should give a 401 error if the user is not logged in", async () => {
    const response = await request(app).get("/api/orders/1").send();
    expect(response.status).toEqual(401);
});

it("should give a 404 error if no ticket with the given id is found", async () => {
    const id = new mongoose.Types.ObjectId()
    await request(app).get(`/api/orders/${id}`).set('Cookie', login()).send().expect(404);
});

it("should give a 401 error if the order doesn't belong to the current user", async () => {
    const order = await createOrder('Event 1', 10, "123");
    await request(app).get(`/api/orders/${order.id}`).set('Cookie', login()).send().expect(401);
});

it("should fetch the info of the given order id under correct conditions", async () => {
    const order = await createOrder('Event 1', 10, "123456");

    const response = await request(app).get(`/api/orders/${order.id}`).set('Cookie', login()).send().expect(200);

    expect(response.body.id).toEqual(order.id);
    expect(response.body.ticket.id).toEqual(order.ticket.id);

});