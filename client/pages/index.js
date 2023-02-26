import Link from "next/link";

const Home = ({currentUser, tickets}) => {
    const ticketList = tickets.map(ticket => {
        return (<tr key={ticket.id}>
            <td>{ticket.title}</td>
            <td>{ticket.type}</td>
            <td>{ticket.seat}</td>
            <td>{ticket.price}$</td>
            <td>{(!ticket.orderId) ?
                <Link className={'link-info'} href={`/tickets/[ticketId]`} as={`/tickets/${ticket.id}`}>
                    View
                </Link> : 'Not Available'}
            </td>
        </tr>)
    })
    return (
        <div>
            <h1>Tickets</h1>
            <table className={'table'}>
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Seat</th>
                    <th>Price</th>
                    <th>Info</th>
                </tr>
                </thead>
                <tbody>
                {ticketList}
                </tbody>
            </table>
        </div>
    )
}

Home.getInitialProps = async (context, client, currentUser) => {
    const {data} = await client.get('/api/tickets')
    return {tickets: data};
}

export default Home