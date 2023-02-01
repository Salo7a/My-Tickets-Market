import axios from "axios";

const buildClient = ({req}) => {
    if (req !== undefined) {
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        })


        //  When called in the browser
    } else {
        return axios.create({
            baseURL: '/'
        })
    }
}

export default buildClient