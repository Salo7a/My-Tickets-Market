import request from 'supertest';
import {app} from "../../app";

it("should send logged in user's info", async () => {

    const cookie = await global.login();

    const response = await request(app)
        .get('/api/users/currentuser')
        .set("Cookie", cookie)
        .expect(200);

    expect(response.body.currentUser.email).toEqual("test@example.com");
});
