import 'bootstrap/dist/css/bootstrap.css';
import buildClient from "../api/build-client";
import Header from "../components/header";
import App from "next/app"
import Head from "next/head";

const AppComponent = ({Component, pageProps, currentUser}) => {

    return <div>
        <Head>
            <title>MyTix</title>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
        </Head>
        <Header currentUser={currentUser}/>
        <div className={'container'}>
            <Component currentUser={currentUser} {...pageProps} />
        </div>
    </div>
};

AppComponent.getInitialProps = async (appContext) => {
    // Base Route
    const url = '/api/users/currentuser';
    // Get Client
    const client = buildClient(appContext.ctx);
    // Get Current User
    const {data} = await client.get(url);
    // Call the Components own getInitialProps
    let pageProps = {};
    if (appContext.Component.getInitialProps)
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
    return {pageProps, ...data};
}

export default AppComponent