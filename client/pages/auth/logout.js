import {useEffect} from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

export default function Logout() {
    const {doRequest} = useRequest({
        url: '/api/users/logout',
        method: 'get',
        onSuccess: () => Router.push('/')
    });

    useEffect(() => {
        doRequest()
    }, [])
    return <div className="container d-flex h-100">
        <div className="row justify-content-center align-self-center">
            <h3>Logging out...</h3>
        </div>
    </div>
}