import request from 'supertest';
import {app} from "../../app";

it("should clear cookies on logout", async () => {
    await request(app)
        .post('/api/users/register')
        .send({
            email: 'test@example.com',
            password: 'password',
            firstName: "John",
            lastName: "Doe"
        })
        .expect(201);

    const response = await request(app)
        .get('/api/users/logout')
        .send()
        .expect(200);

    expect(response.get('Set-Cookie')[0]).toEqual("session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly");
});
