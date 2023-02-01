import buildClient from "../api/build-client";

const Home = ({currentUser}) => {
    return <h1>Hi {currentUser ? `${currentUser.fullName}` : 'Stranger'} </h1>
}

Home.getInitialProps = async (context) => {
    // Base Route
    const url = '/api/users/currentuser';
    // Get Client
    const client = buildClient(context);
    // Get Current User
    const {data} = await client.get(url);

    return data;

}

export default Home