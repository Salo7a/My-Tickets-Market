import request from 'supertest';
import {app} from "../../app";

it("should have a route listening for get requests at /api/orders", async () => {
    const response = await request(app).get("/api/orders").send();
    expect(response.status).not.toEqual(404);
});

it("should return a list of orders for the current user", async () => {
    const orderOne = await createOrder('Event 1', 10, "123");
    const orderTwo = await createOrder('Event 2', 20, "123456");
    const orderThree = await createOrder('Event 3', 30, "123456");

    const response = await request(app).get("/api/orders").set('Cookie', login()).send().expect(200);

    const data = response.body;

    expect(data.length).toEqual(2);
    expect(data[0].id).toEqual(orderTwo.id)
    expect(data[0].ticket.id).toEqual(orderTwo.ticket.id)
    expect(data[1].id).toEqual(orderThree.id);
    expect(data[1].ticket.id).toEqual(orderThree.ticket.id);

});