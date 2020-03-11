import { URLSearchParams } from 'url';

enum Method {
    GET = 'GET',
    POST = 'POST'
};

interface RequestParams extends RequestInit {
    searchParams?: URLSearchParams;
}

function doRequest(method: Method, url: string, params?: RequestParams) {
    const { searchParams, ...rest } = params || {};
    let query = searchParams?.toString();
    query = query?.length ? `?${query}` : '';
    return fetch(`${url}${query}`, {
        ...rest,
        method: method,
    });
}

export class API {
    static get(url: string, params?: RequestParams) {
        return doRequest(Method.GET, url, params);
    }

    static post(url: string, params?: RequestParams) {
        return doRequest(Method.POST, url, params);
    }
}