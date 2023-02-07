import request from 'supertest';
import {app} from "../../app";
import {Ticket} from "../../models/ticket";

it("should have a route listening for post requests at /api/tickets", async () => {
    const response = await request(app).post("/api/tickets").send({});
    expect(response.status).not.toEqual(404);
});

it("should give error if no user is logged in", async () => {
    await request(app).post("/api/tickets").send({}).expect(401);
});

it("should not give 401 unauthorized error", async () => {
    const response = await request(app).post("/api/tickets").set('Cookie', login()).send({});
    expect(response.status).not.toEqual(401);
});

it("should return an error if an invalid title is given", async () => {
    await request(app)
        .post("/api/tickets")
        .set('Cookie', login())
        .send({
            title: '',
            price: 50
        })
        .expect(400);

    await request(app)
        .post("/api/tickets")
        .set('Cookie', login())
        .send({
            price: 50
        })
        .expect(400);

});

it("should return an error if an invalid price is given", async () => {
    await request(app)
        .post("/api/tickets")
        .set('Cookie', login())
        .send({
            title: 'Event',
            price: "yy"
        })
        .expect(400);

    await request(app)
        .post("/api/tickets")
        .set('Cookie', login())
        .send({
            title: 'Event'
        })
        .expect(400);

    await request(app)
        .post("/api/tickets")
        .set('Cookie', login())
        .send({
            title: 'Event',
            price: -50
        })
        .expect(400);


});

it("should return a 201 on sending valid inputs", async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);
    const title = 'Event';
    const price = 800;
    await request(app)
        .post("/api/tickets")
        .set('Cookie', login())
        .send({
            title,
            price
        })
        .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].title).toEqual('Event');
    expect(tickets[0].price).toEqual(price);

});