import request from 'supertest';
import {app} from "../../app";
import {Ticket} from "../../models/ticket";

it("should fetch a list of tickets", async () => {
    const title = ['Event 1', 'Event 2'];
    const price = [800, 500];
    const userId = ["1234", "6789"];

    for (let i in title) {
        let ticket = Ticket.build({
            title: title[i], price: price[i], userId: userId[i]
        });
        await ticket.save();
    }

    const response = await request(app).get(`/api/tickets/`).send().expect(200);
    expect(response.body.length).toEqual(2);
});
