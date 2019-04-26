"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const tough_cookie_1 = require("tough-cookie");
axios_1.default.interceptors.request.use(config => {
    if (config.jar) {
        if (!config.headers) {
            config.headers = {};
        }
        ;
        config.headers['cookie'] = config.jar.getCookieStringSync(config.url);
    }
    return config;
}, error => Promise.reject(error));
axios_1.default.interceptors.response.use(response => {
    const config = response.config;
    const cookies = response.headers['set-cookie'];
    if (cookies) {
        cookies.forEach(cookie => {
            config.jar.setCookieSync(cookie, response.config.url, { ignoreError: true });
        });
    }
    return response;
}, error => Promise.reject(error));
class Base {
    constructor() {
        this.cookieJar = new tough_cookie_1.CookieJar();
    }
    // http methods
    get(url, headers) {
        return axios_1.default.get(url, {
            jar: this.cookieJar,
            withCredentials: true,
            headers
        });
    }
    post(url, data, headers) {
        return axios_1.default.post(url, data, {
            jar: this.cookieJar,
            withCredentials: true,
            headers
        });
    }
    delete(url, headers) {
        return axios_1.default.delete(url, {
            jar: this.cookieJar,
            withCredentials: true,
            headers
        });
    }
    patch(url, data, headers) {
        return axios_1.default.patch(url, data, {
            jar: this.cookieJar,
            withCredentials: true,
            headers
        });
    }
}
exports.Base = Base;
//# sourceMappingURL=base.js.map