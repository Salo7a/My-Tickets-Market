import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import {Order, OrderStatus, Payment} from "../../models";
import {stripe} from "../../stripe";

// jest.mock('../../stripe');

it('should return a 404 when paying for an order that doesn\'t exist', async function () {
    await request(app)
        .post('/api/payments')
        .set('Cookie', login())
        .send({
            token: "0000",
            orderId: new mongoose.Types.ObjectId().toHexString()
        }).expect(404);

});

it('should return a 401 when paying for an order that doesn\'t belong to the current user', async function () {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 80,
        status: OrderStatus.Created,
        userId: "123",
        version: 0
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', login())
        .send({
            token: "0000",
            orderId: order.id
        }).expect(401);
});

it('should return a 400 when paying for a cancelled, expired or complete order', async function () {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 80,
        status: OrderStatus.Cancelled,
        userId: "123456",
        version: 0
    });

    // Cancelled Order
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', login())
        .send({
            token: "0000",
            orderId: order.id
        }).expect(400);

    // Expired Order
    order.set({
        status: OrderStatus.Expired
    })
    await order.save();
    await request(app)
        .post('/api/payments')
        .set('Cookie', login())
        .send({
            token: "0000",
            orderId: order.id
        }).expect(400);

    // Complete Order
    order.set({
        status: OrderStatus.Completed
    })
    await order.save();
    await request(app)
        .post('/api/payments')
        .set('Cookie', login())
        .send({
            token: "0000",
            orderId: order.id
        }).expect(400);
});

// it('should return 204 with valid inputs', async function () {
//     const price = Math.floor(Math.random() * 100000)
//     const order = Order.build({
//         id: new mongoose.Types.ObjectId().toHexString(),
//         price,
//         status: OrderStatus.Created,
//         userId: "123456",
//         version: 0
//     });
//
//     // Cancelled Order
//     await order.save();
//
//     await request(app)
//         .post('/api/payments')
//         .set('Cookie', login())
//         .send({
//             token: "tok_visa",
//             orderId: order.id
//         }).expect(201);
//
//     const stripeChargeHistory = await stripe.charges.list({limit: 20});
//     const stripeCharge = stripeChargeHistory.data.find((charge)=>{
//         return charge.amount = price * 100;
//     })
//     expect(stripeCharge).toBeDefined();
//     const payment = await Payment.findOne({
//         stripeId: stripeCharge!.id
//     })
//     expect(payment).not.toBeNull();
//
//     // expect(stripe.charges.create).toHaveBeenCalled()
//     // const chargePayload = (stripe.charges.create as jest.Mock).mock.calls[0][0];
//     // expect(chargePayload.source).toEqual('tok_visa');
//     // expect(chargePayload.currency).toEqual('usd');
//     // expect(chargePayload.amount).toEqual(8000);
// });