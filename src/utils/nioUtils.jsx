import S from '../constants/system'
export const api = (url,params) => {
    return fetch((S.BASE_URL + url),params)
        .then((res) => {
            if (res.ok) {//200 to 299
                return res.json().then((body) => ({body, res}));
            }
            else {
                return res.json().then((body) => Promise.reject({body, res}));
            }
        });
}

export const get = (url) => {

    let params={
        method: 'GET',
        mode: 'cors'};
    return api(url,params);
}
