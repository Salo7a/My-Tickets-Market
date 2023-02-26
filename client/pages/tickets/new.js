import {useState} from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const NewTicket = () => {

    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [seat, setSeat] = useState('');
    const [type, setType] = useState('');

    const {doRequest, errors} = useRequest({
        url: '/api/tickets/',
        method: 'post',
        body: {title, price, seat, type},
        onSuccess: (ticket) => {
            Router.push('/')
        }
    });

    function onSubmit(e) {
        e.preventDefault();
        doRequest();
    }

    function onBlur() {
        const value = parseFloat(price);
        if (isNaN(value)) return;
        setPrice(value.toFixed(2))
    }

    return <div>
        <div className={'card'}
             style={{margin: "auto", marginTop: '5em', minWidth: 'fit-content', width: '600px', maxWidth: "50%"}}>
            <h1 className={'card-header'}>Create a ticket</h1>
            <div className={'card-body'}>
                <form onSubmit={onSubmit}>
                    <div className={'form-group'}>
                        <label className={'form-label'}>Event Title</label>
                        <input type="text"
                               value={title}
                               onChange={e => setTitle(e.target.value)}
                               className={'form-control'}/>
                    </div>
                    <div className='form-group'>
                        <label className={'form-label'}>Price</label>
                        <input type="number"
                               value={price}
                               onBlur={onBlur}
                               onChange={e => setPrice(e.target.value)}
                               className={'form-control'}/>
                    </div>
                    <div className={'form-group'} style={{marginBottom: '10px'}}>
                        <label className={'form-label'}>Type</label>
                        <input type="text"
                               value={type}
                               onChange={e => setType(e.target.value)}
                               className={'form-control'}/>
                    </div>
                    <div className={'form-group'}>
                        <label className={'form-label'}>Seat</label>
                        <input type="text"
                               value={seat}
                               onChange={e => setSeat(e.target.value)}
                               className={'form-control'}/>
                    </div>
                    {errors}
                    <button className={'btn btn-primary'} style={{marginTop: '10px'}}>Submit</button>
                </form>
            </div>
        </div>
    </div>
}

export default NewTicket