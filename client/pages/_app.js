import 'bootstrap/dist/css/bootstrap.css';
import buildClient from "../api/build-client";
import Header from "../components/header";
import App from "next/app"

const AppComponent = ({Component, pageProps, currentUser}) => {

    return <div><Header currentUser={currentUser}/> <Component {...pageProps} /></div>
};

AppComponent.getInitialProps = async (appContext) => {
    const AppProps = await App.getInitialProps(appContext)
    // Base Route
    const url = '/api/users/currentuser';
    // Get Client
    const client = buildClient(appContext.ctx);
    // Get Current User
    const {data} = await client.get(url);
    // Call the Components own getInitialProps
    let pageProps = {};
    if (appContext.Component.getInitialProps)
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    return {AppProps, ...data, pageProps};
}

export default AppComponent