import useRequest from "../../hooks/use-request";
import Router from "next/router";
import {useEffect, useState} from "react";
import StripeCheckout from "react-stripe-checkout";
import {STRIPE_KEY} from "../../config/stripe_key";

const ShowOrder = ({order, currentUser}) => {

    const [timeLeft, setTimeLeft] = useState(0);
    const {doRequest, errors} = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: () => Router.push('/orders')
    })
    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        }
        findTimeLeft();
        const timerInterval = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerInterval);
        }
    }, []);

    if (timeLeft < 0) {
        return (<div className={'card'}>
            <div className={'card-body'}>
                <div>This Order Has Expired</div>
                {errors}
            </div>
        </div>);
    } else {
        return (<div className={'card'}>
            <div className={'card-body'}>
                <div>Time left to complete the purchase: {timeLeft} seconds</div>
                <StripeCheckout token={({id}) => {
                    doRequest({token: id})
                }}
                                stripeKey={STRIPE_KEY}
                                amount={order.ticket.price * 100}
                                email={currentUser.email}
                />
                {errors}
            </div>

        </div>);
    }
}

ShowOrder.getInitialProps = async (context, client, currentUser) => {
    const {data} = await client.get(`/api/orders/${context.query.orderId}`)

    return {order: data};
}

export default ShowOrder