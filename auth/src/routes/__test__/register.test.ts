import request from 'supertest';
import {app} from "../../app";

it('should return a 201 on successful registration', async () => {
    return request(app)
        .post('/api/users/register')
        .send({
            email: 'test@example.com',
            password: 'password',
            firstName: "John",
            lastName: "Doe"
        })
        .expect(201);
});

it('should return a 400 with invalid input', async () => {
    // Invalid Email
    await request(app)
        .post('/api/users/register')
        .send({
            email: 'test@example.com',
            password: '123',
            firstName: "John",
            lastName: "Doe"
        })
        .expect(400);

    // Invalid firstName
    await request(app)
        .post('/api/users/register')
        .send({
            email: 'test@example.com',
            password: '123456',
            firstName: "Joh--n",
            lastName: "Doe"
        })
        .expect(400);

    // Invalid lastName
    await request(app)
        .post('/api/users/register')
        .send({
            email: 'test@example.com',
            password: '123456',
            firstName: "John",
            lastName: "Do...e"
        })
        .expect(400);

    // Invalid email
    return request(app)
        .post('/api/users/register')
        .send({
            email: 'test',
            password: 'password',
            firstName: "John",
            lastName: "Doe"
        })
        .expect(400);
});

it('should return a 400 with missing inputs', async () => {
    return request(app)
        .post('/api/users/register')
        .send({})
        .expect(400);
});