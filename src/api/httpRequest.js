import axios from 'axios';

const httpRequest = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 10000,
    headers: {
        'content-type': 'application/json',
    }
});

export const get = async(path, options = {}) => {
    const response = await httpRequest.get(path, options);
    return response.data;
}

export default httpRequest;