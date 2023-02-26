import axios from "axios";
import {useState} from "react";


const useRequest = ({url, method, body = {}, onSuccess}) => {
    const [errors, setErrors] = useState(null);
    if (!['get', 'post', 'put', 'update', 'common', 'delete', 'head', 'patch'].includes(method)) throw new Error("Invalid Method")
    const doRequest = async (props = {}) => {
        try {
            setErrors(null);
            const response = await axios[method](url, {...body, ...props});
            if (onSuccess) onSuccess(response.data);
            return response.data;
        } catch (e) {
            setErrors(<div className={'alert alert-danger'}>
                <ul className={'my-0'} style={{marginTop: '1em'}}>
                    {e.response.data.errors.map(err => {
                        return <li key={err.msg}>{err.msg}</li>
                    })}
                </ul>
            </div>)
        }

    };
    return {doRequest, errors}
};

export default useRequest


