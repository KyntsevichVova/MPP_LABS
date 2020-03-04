enum Method {
    GET = 'GET',
    POST = 'POST'
};

function doRequest(method: Method, url: string, params?: RequestInit) {
    return fetch(url, {
        ...params,
        method: method,
    });
}

export class API {
    static get(url: string, params?: RequestInit) {
        return doRequest(Method.GET, url, params);
    }

    static post(url: string, params?: RequestInit) {
        return doRequest(Method.POST, url, params);
    }
}