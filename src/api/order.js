import * as request from './httpRequest';
export const get = async (path, option = {}) => {
    try {
        const res = await request.get(path, option);
        return res;
    } catch (error) {
        //todo write log
    }
};

