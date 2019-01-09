import axios, { AxiosResponse, AxiosInstance, AxiosStatic } from 'axios';
// import axiosCookieJarSupport from '@3846masa/axios-cookiejar-support';
import { CookieJar, Cookie } from 'tough-cookie';

declare module 'axios' {
    export interface AxiosRequestConfig {
        jar?: CookieJar;
    }
}

axios.interceptors.request.use(config => {
    if (config.jar) {
        if (!config.headers) { config.headers = {} };
        config.headers['cookie'] = config.jar.getCookieStringSync(config.url!);
    }
    return config;
}, error => Promise.reject(error));

axios.interceptors.response.use(response => {
    const config = response.config;
    const cookies = response.headers['set-cookie'] as [string];

    cookies.forEach(cookie => {
        config.jar!.setCookieSync(cookie, response.config.url!, { ignoreError: true });
    });
    return response;
}, error => Promise.reject(error));

export class Base {

    cookieJar: CookieJar;
    constructor() {
        this.cookieJar = new CookieJar();
    }

    // http methods

    get(url: string, headers?: any) {
        return axios.get(url, {
            jar: this.cookieJar,
            withCredentials: true,
            headers
        });
    }

    post(url: string, data?: any, headers?: any) {
        return axios.post(url, data, {
            jar: this.cookieJar,
            withCredentials: true,
            headers
        });
    }

    delete(url: string, headers?: any) {
        return axios.delete(url, {
            jar: this.cookieJar,
            withCredentials: true,
            headers
        });
    }

    patch(url: string, data?: any, headers?: any) {
        return axios.patch(url, data, {
            jar: this.cookieJar,
            withCredentials: true,
            headers
        });
    }
}

export interface CommonResponse<T> {
    data?: T;
    messages?: { error: string, info: string, warn: string };
    statusCode?: string;
    meta?: {
        paging: {
            total: number;
            limit: number;
        }
    };
    links?: any;
    included?: any;
}

export interface IrisCommonDataFormat<T> {
    type: string;
    id: string;
    attributes: T;
    relationships?: any;
    links?: any;
}