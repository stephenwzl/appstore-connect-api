"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var base_1 = require("./base");
var Client = /** @class */ (function (_super) {
    __extends(Client, _super);
    function Client() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.signinUrl = 'https://idmsa.apple.com/appleauth/auth/signin';
        _this.authRequestUrl = 'https://idmsa.apple.com/appleauth/auth';
        _this.wdigetKeyUrl = 'https://appstoreconnect.apple.com/olympus/v1/app/config?hostname=itunesconnect.apple.com';
        // api end point
        _this.apiEndPoint = 'https://appstoreconnect.apple.com';
        _this.headers = {};
        return _this;
    }
    Client.prototype.widgetKey = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.authServiceWidgetKey) {
                            return [2 /*return*/, this.authServiceWidgetKey];
                        }
                        return [4 /*yield*/, this.get(this.wdigetKeyUrl)];
                    case 1:
                        response = _a.sent();
                        this.authServiceWidgetKey = response.data.authServiceKey;
                        return [2 /*return*/, this.authServiceWidgetKey];
                }
            });
        });
    };
    /**
     * signin with Apple ID and Password
     * !CAUTION: do not support two-step verification
     * @param appleId Apple ID(email format)
     * @param password Apple ID Password (no two-step verification)
     */
    Client.prototype.signin = function (appleId, password) {
        return __awaiter(this, void 0, void 0, function () {
            var widgetKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.widgetKey()];
                    case 1:
                        widgetKey = _a.sent();
                        return [4 /*yield*/, this.post(this.signinUrl, { accountName: appleId, password: password, rememberMe: false }, { 'X-Apple-Domain-Id': '1', 'X-Requested-With': 'XMLHttpRequest', 'X-Apple-Widget-Key': widgetKey })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Client.prototype.authRequest = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.get(this.authRequestUrl, this.headers);
                return [2 /*return*/];
            });
        });
    };
    /**
     * get session data
     */
    Client.prototype.session = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.sessionData) {
                            return [2 /*return*/, this.sessionData];
                        }
                        return [4 /*yield*/, this.get(this.apiEndPoint + "/olympus/v1/session")];
                    case 1:
                        response = _a.sent();
                        this.sessionData = response.data;
                        return [2 /*return*/, this.sessionData];
                }
            });
        });
    };
    /**
     * get current provider
     */
    Client.prototype.currentProvider = function () {
        return __awaiter(this, void 0, void 0, function () {
            var session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.session()];
                    case 1:
                        session = _a.sent();
                        return [2 /*return*/, session.provider];
                }
            });
        });
    };
    Client.prototype.getDetail = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.userDetail) {
                            return [2 /*return*/, this.userDetail];
                        }
                        return [4 /*yield*/, this.get(this.apiEndPoint + "/WebObjects/iTunesConnect.woa/ra/user/detail")];
                    case 1:
                        response = _a.sent();
                        if (response.data.data) {
                            this.userDetail = response.data.data;
                        }
                        return [2 /*return*/, this.userDetail];
                }
            });
        });
    };
    Client.prototype.sessionToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userDetail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDetail()];
                    case 1:
                        userDetail = _a.sent();
                        if (userDetail) {
                            return [2 /*return*/, userDetail.sessionToken];
                        }
                        return [2 /*return*/, undefined];
                }
            });
        });
    };
    Client.prototype.selectTeam = function (providerId) {
        return __awaiter(this, void 0, void 0, function () {
            var availableProviders, currentProvider, targetProvider, token, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.session()];
                    case 1:
                        availableProviders = (_a.sent()).availableProviders;
                        return [4 /*yield*/, this.currentProvider()];
                    case 2:
                        currentProvider = _a.sent();
                        if (providerId === currentProvider.providerId.toString()) {
                            return [2 /*return*/];
                        }
                        targetProvider = availableProviders.find(function (provider) { return provider.providerId.toString() === providerId; });
                        if (!targetProvider) {
                            throw Error("[Airship Error:] can not select team with providerId: " + providerId);
                        }
                        return [4 /*yield*/, this.sessionToken()];
                    case 3:
                        token = _a.sent();
                        if (!token) {
                            throw Error("[Airship Error:] missing required session token for switching provider");
                        }
                        data = Object.assign({}, token, { contentProviderId: providerId });
                        return [4 /*yield*/, this.post(this.apiEndPoint + "/WebObjects/iTunesConnect.woa/ra/v1/session/webSession", data)];
                    case 4:
                        _a.sent();
                        this.sessionData = undefined;
                        return [4 /*yield*/, this.session()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * list apps in current provider
     */
    Client.prototype.listApps = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.apps) {
                            return [2 /*return*/, this.apps];
                        }
                        return [4 /*yield*/, this.get(this.apiEndPoint + "/WebObjects/iTunesConnect.woa/ra/apps/manageyourapps/summary/v2")];
                    case 1:
                        response = _a.sent();
                        if (response.data.data) {
                            this.apps = response.data.data.summaries;
                        }
                        return [2 /*return*/, this.apps];
                }
            });
        });
    };
    Client.prototype.updateRequestHeaders = function (req) {
        this.headers["X-Apple-Id-Session-Id"] = req.headers["x-apple-id-session-id"];
        this.headers["X-Apple-Widget-Key"] = this.authServiceWidgetKey;
        this.headers["scnt"] = req.headers["scnt"];
    };
    return Client;
}(base_1.Base));
exports.Client = Client;
