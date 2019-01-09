import { CookieJar } from 'tough-cookie';
declare module 'axios' {
    interface AxiosRequestConfig {
        jar?: CookieJar;
    }
}
export declare class Base {
    cookieJar: CookieJar;
    constructor();
    get(url: string, headers?: any): import("axios").AxiosPromise<any>;
    post(url: string, data?: any, headers?: any): import("axios").AxiosPromise<any>;
    delete(url: string, headers?: any): import("axios").AxiosPromise<any>;
    patch(url: string, data?: any, headers?: any): import("axios").AxiosPromise<any>;
}
export interface CommonResponse<T> {
    data?: T;
    messages?: {
        error: string;
        info: string;
        warn: string;
    };
    statusCode?: string;
}
