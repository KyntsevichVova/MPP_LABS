const enum Method{
    GET = 'GET',
    POST = 'POST'
};

function doRequest(method: Method, url: string) {
    return fetch(url, {
        method: method
    });
}

export class API {
    static get(url: string) {
        return doRequest(Method.GET, url);
    }

    static post(url: string) {
        return doRequest(Method.POST, url);
    }
}