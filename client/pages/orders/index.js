import Link from "next/link";

const MyOrders = ({currentUser, orders}) => {
    const ordersList = orders.map(order => {
        return (<tr key={order.id}>
            <td>{order.ticket.title}</td>
            <td>{order.ticket.price}</td>
            <td>{order.status}</td>
        </tr>)
    })
    return (
        <div className={'card'}>
            <div className={'card-header'}>
                <h1>My Orders</h1>
            </div>
            <div className={'card-body'}>
                <table className={'table'}>
                    <thead>
                    <tr>
                        <th>Ticket</th>
                        <th>Price</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {ordersList}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

MyOrders.getInitialProps = async (context, client, currentUser) => {
    const {data} = await client.get('/api/orders')
    return {orders: data};
}

export default MyOrders