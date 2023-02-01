import {useState} from "react";
import useRequest from '../../hooks/use-request'
import Router from "next/router";

const login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {doRequest, errors} = useRequest({
        url: '/api/users/login', method: 'post', body: {
            email, password
        },
        onSuccess: () => Router.push('/')
    });
    const onSubmit = async event => {
        event.preventDefault();
        await doRequest();
    }
    return <div className={'card'} style={{margin: 'auto', width: 'fit-content', maxWidth: "50%"}}>
        <h1 className={'card-header'}>Login</h1>
        <div className={'card-body'}>
            <form onSubmit={onSubmit}>
                <div className={'form-group'}>
                    <label>Email</label>
                    <input type="text"
                           value={email}
                           onChange={e => setEmail(e.target.value)}
                           className={'form-control'}/>
                </div>
                <div className={'form-group'} style={{marginBottom: '10px'}}>
                    <label>Password</label>
                    <input type="password"
                           value={password}
                           onChange={e => setPassword(e.target.value)}
                           className={'form-control'}/>
                </div>
                {errors}
                <button className={'btn btn-primary'} style={{marginTop: '10px'}}>Login</button>
            </form>
        </div>
    </div>
}
export default login