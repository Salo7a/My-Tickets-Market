import {useState} from "react";
import useRequest from '../../hooks/use-request'
import Router from "next/router";

const register = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {doRequest, errors} = useRequest({
        url: '/api/users/register', method: 'post', body: {
            firstName, lastName, email, password
        },
        onSuccess: () => Router.push('/')
    });
    const onSubmit = async event => {
        event.preventDefault();
        await doRequest();
    }
    return <div className={'card'} style={{margin: 'auto', minWidth: 'fit-content', width: '600px', maxWidth: "50%"}}>
        <h1 className={'card-header'}>Create an account</h1>
        <div className={'card-body'}>
            <form onSubmit={onSubmit}>
                <div className={'form-group'}>
                    <label>First Name</label>
                    <input type="text"
                           value={firstName}
                           onChange={e => setFirstName(e.target.value)}
                           className={'form-control'}/>
                </div>
                <div className={'form-group'}>
                    <label>Last Name</label>
                    <input type="text"
                           value={lastName}
                           onChange={e => setLastName(e.target.value)}
                           className={'form-control'}/>
                </div>
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
                <button className={'btn btn-primary'} style={{marginTop: '10px'}}>Submit</button>
            </form>
        </div>
    </div>
}
export default register