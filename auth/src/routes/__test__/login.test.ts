import request from 'supertest';
import {app} from "../../app";

it('should set a cookie on successful login', async () => {
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
        .post('/api/users/login')
        .send({
            email: 'test@example.com',
            password: 'password'
        })
        .expect(200);
    // Check if response sets a jwt cookie
    expect(response.get('Set-Cookie')).toBeDefined();
});

it("should fail when an email that doesn't exist is supplied", async () => {
    return request(app)
        .post('/api/users/login')
        .send({
            email: 'test@example.com',
            password: 'password'
        })
        .expect(400);
});

it("should fail when an incorrect password is used", async () => {
    await request(app)
        .post('/api/users/register')
        .send({
            email: 'test@example.com',
            password: 'password',
            firstName: "John",
            lastName: "Doe"
        })
        .expect(201)
    return request(app)
        .post('/api/users/login')
        .send({
            email: 'test@example.com',
            password: 'password123'
        })
        .expect(400);
});
