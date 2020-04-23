import { AxiosResponse } from 'axios';
import { CookieJar } from 'tough-cookie';
declare module 'axios' {
    interface AxiosRequestConfig {
        jar?: CookieJar;
    }
}
export declare class Base {
    cookieJar: CookieJar;
    constructor();
    get(url: string, headers?: any): Promise<AxiosResponse<any>>;
    post(url: string, data?: any, headers?: any): Promise<AxiosResponse<any>>;
    delete(url: string, headers?: any): Promise<AxiosResponse<any>>;
    patch(url: string, data?: any, headers?: any): Promise<AxiosResponse<any>>;
}
export interface CommonResponse<T> {
    data?: T;
    messages?: {
        error: string;
        info: string;
        warn: string;
    };
    statusCode?: string;
    meta?: {
        paging: {
            total: number;
            limit: number;
        };
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
