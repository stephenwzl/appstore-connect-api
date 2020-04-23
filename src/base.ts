import axios, { AxiosResponse, AxiosInstance, AxiosStatic } from 'axios';
import { CookieJar, Cookie } from 'tough-cookie';
import * as fs from 'fs';
import * as path from 'path';

declare module 'axios' {
    export interface AxiosRequestConfig {
        jar?: CookieJar;
    }
}

axios.interceptors.request.use(config => {
    try {
        let cookies = fs.readFileSync(path.resolve(process.cwd(), 'cookie.txt')).toString()
        if (cookies) {
            config.jar = CookieJar.fromJSON(JSON.parse(cookies))
        }
    } catch (error) {
        
    }
    if (config.jar) {
        if (!config.headers) { config.headers = {} };
        config.headers['cookie'] = config.jar.getCookieStringSync(config.url!);
    }
    return config;
}, error => Promise.reject(error));

axios.interceptors.response.use(response => {
    const config = response.config;
    const cookies = response.headers['set-cookie'] as [string];
    if (cookies) {
        cookies.forEach(cookie => {
            config.jar!.setCookieSync(cookie, response.config.url!, { ignoreError: true });
        });
        // 序列化
        fs.writeFileSync(path.resolve(process.cwd(), 'cookie.txt'), JSON.stringify(config.jar!.toJSON()))
    }
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

