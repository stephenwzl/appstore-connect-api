"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
var tough_cookie_1 = require("tough-cookie");
axios_1["default"].interceptors.request.use(function (config) {
    if (config.jar) {
        if (!config.headers) {
            config.headers = {};
        }
        ;
        config.headers['cookie'] = config.jar.getCookieStringSync(config.url);
    }
    return config;
}, function (error) { return Promise.reject(error); });
axios_1["default"].interceptors.response.use(function (response) {
    var config = response.config;
    var cookies = response.headers['set-cookie'];
    if (cookies) {
        cookies.forEach(function (cookie) {
            config.jar.setCookieSync(cookie, response.config.url, { ignoreError: true });
        });
    }
    return response;
}, function (error) { return Promise.reject(error); });
var Base = /** @class */ (function () {
    function Base() {
        this.cookieJar = new tough_cookie_1.CookieJar();
    }
    // http methods
    Base.prototype.get = function (url, headers) {
        return axios_1["default"].get(url, {
            jar: this.cookieJar,
            withCredentials: true,
            headers: headers
        });
    };
    Base.prototype.post = function (url, data, headers) {
        return axios_1["default"].post(url, data, {
            jar: this.cookieJar,
            withCredentials: true,
            headers: headers
        });
    };
    Base.prototype["delete"] = function (url, headers) {
        return axios_1["default"]["delete"](url, {
            jar: this.cookieJar,
            withCredentials: true,
            headers: headers
        });
    };
    Base.prototype.patch = function (url, data, headers) {
        return axios_1["default"].patch(url, data, {
            jar: this.cookieJar,
            withCredentials: true,
            headers: headers
        });
    };
    return Base;
}());
exports.Base = Base;
