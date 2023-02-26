import useRequest from "../../hooks/use-request";
import Router from "next/router";

const ShowTicket = ({ticket}) => {
    const {doRequest, errors} = useRequest({
        url: '/api/orders',
        method: 'post',
        body: {
            ticketId: ticket.id
        },
        onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`)
    })
    return (<div className={'card'}>
        <h1>{ticket.title}</h1>
        <h4>Type: {ticket.type}</h4>
        <h4>Seat: {ticket.seat}</h4>
        <h4>Price: {ticket.price}$</h4>
        {errors}
        <button onClick={(e) => doRequest()} className={'btn btn-primary'} style={{width: 'fit-content'}}>Buy</button>
    </div>);
}

ShowTicket.getInitialProps = async (context, client, currentUser) => {
    const {data} = await client.get(`/api/tickets/${context.query.ticketId}`)

    return {ticket: data};
}

export default ShowTicket