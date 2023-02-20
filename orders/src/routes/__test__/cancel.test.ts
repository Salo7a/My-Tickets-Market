import request from 'supertest';
import {app} from "../../app";
import mongoose from "mongoose";
import {Order, OrderStatus} from "../../models";
import {natsWrapper} from "../../nats-wrapper";

it("should have a route listening for patch requests at /api/orders/:orderId", async () => {
    const response = await request(app).patch("/api/orders/1").send();
    expect(response.status).not.toEqual(404);
});

it("should give a 401 error if the user is not logged in", async () => {
    const response = await request(app).patch("/api/orders/1").send();
    expect(response.status).toEqual(401);
});

it("should give a 404 error if no ticket with the given id is found", async () => {
    const id = new mongoose.Types.ObjectId()
    await request(app).patch(`/api/orders/${id}`).set('Cookie', login()).send().expect(404);
});

it("should give a 401 error if the order doesn't belong to the current user", async () => {
    const order = await createOrder('Event 1', 10, "123");
    await request(app).patch(`/api/orders/${order.id}`).set('Cookie', login()).send().expect(401);
});

it("should cancel the order under correct conditions", async () => {
    let order = await createOrder('Event 1', 10, "123456");

    const response = await request(app).patch(`/api/orders/${order.id}`).set('Cookie', login()).send().expect(204);

    order = await Order.findById(order.id);

    expect(order.status).toEqual(OrderStatus.Cancelled);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});