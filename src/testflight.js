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
var build_1 = require("./build");
var Testflight = /** @class */ (function (_super) {
    __extends(Testflight, _super);
    function Testflight() {
        var _this = _super.call(this) || this;
        _this.apiEndPoint = 'https://appstoreconnect.apple.com';
        return _this;
    }
    /**
     * initialize Testflight from Client
     * @param client client has signined
     */
    Testflight.fromClient = function (client, appId) {
        var flight = new Testflight();
        flight.cookieJar = client.cookieJar;
        flight.client = client;
        flight.appId = appId;
        flight.apiEndPoint = client.apiEndPoint;
        return flight;
    };
    /**
     * get prerelease versions;
     * same as "get train version" in old release
     * @param limit limit default is 10
     * @param platform default platform is IOS
     */
    Testflight.prototype.getPreReleaseVersions = function (limit, platform) {
        if (limit === void 0) { limit = 10; }
        if (platform === void 0) { platform = 'IOS'; }
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get(this.apiEndPoint + "/iris/v1/preReleaseVersions?filter%5Bapp%5D=" + this.appId + "&filter%5Bbuilds.expired%5D=false&filter%5Bbuilds.processingState%5D=PROCESSING,VALID&filter%5Bplatform%5D=" + platform + "&limit=" + limit)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.data];
                }
            });
        });
    };
    Testflight.prototype.getPreReleaseBuilds = function (preReleaseVersionId, limit) {
        if (limit === void 0) { limit = 10; }
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get(this.apiEndPoint + "/iris/v1/builds?filter%5Bexpired%5D=false&filter%5BpreReleaseVersion%5D=" + preReleaseVersionId + "&filter%5BprocessingState%5D=PROCESSING,VALID&include=buildBetaDetail,betaBuildMetrics&limit=" + limit + "&sort=-version")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * get beta review detail
     */
    Testflight.prototype.getBetaReviewDetails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get(this.apiEndPoint + "/iris/v1/betaAppReviewDetails?filter%5Bapp%5D=" + this.appId + "&limit=1")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.data];
                }
            });
        });
    };
    Testflight.prototype.getBetaLicenceAgreements = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get(this.apiEndPoint + "/iris/v1/betaLicenseAgreements?filter%5Bapp%5D=" + this.appId + "&limit=1")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.data];
                }
            });
        });
    };
    Testflight.prototype.getBetaAppLocalizations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get(this.apiEndPoint + "/iris/v1/betaAppLocalizations?filter%5Bapp%5D=" + this.appId + "&limit=28")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.data];
                }
            });
        });
    };
    Testflight.prototype.getBetaGroups = function (isInternalGroup, limit) {
        if (limit === void 0) { limit = 15; }
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get(this.apiEndPoint + "/iris/v1/betaGroups?filter%5Bapp%5D=" + this.appId + "&filter%5BisInternalGroup%5D=" + isInternalGroup + "&limit=" + limit + "&sort=name")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    Testflight.prototype.getBetaGroupBuild = function (groupId, limit) {
        if (limit === void 0) { limit = 20; }
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get(this.apiEndPoint + "/iris/v1/builds?filter%5BbetaGroups%5D=" + groupId + "&filter%5Bexpired%5D=false&filter%5BprocessingState%5D=VALID&include=preReleaseVersion,buildBetaDetail,betaBuildMetrics&limit=" + limit + "&sort=-version")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * make sure these builds have been approved for beta testing
     * @param groupId beta group id
     * @param buildIds array of build ids to add into beta group
     */
    Testflight.prototype.addBuildsToBetaGroup = function (groupId, buildIds) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post(this.apiEndPoint + "/iris/v1/betaGroups/" + groupId + "/relationships/builds", {
                            data: buildIds.map(function (buildId) { return { type: "builds", id: buildId }; })
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * @param betaGroupId beta group to modify
     * @param publicLinkEnabled set to true to enable public link
     * @param publicLinkLimit max to 10000
     * @param publicLinkLimitEnabled
     */
    Testflight.prototype.switchBetaGroupPublicLinkState = function (betaGroupId, publicLinkEnabled, publicLinkLimit, publicLinkLimitEnabled) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.patch(this.apiEndPoint + "/iris/v1/betaGroups/" + betaGroupId, {
                            data: {
                                type: "betaGroups",
                                id: betaGroupId,
                                attributes: { publicLinkEnabled: publicLinkEnabled, publicLinkLimit: publicLinkLimit, publicLinkLimitEnabled: publicLinkLimitEnabled }
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.data];
                }
            });
        });
    };
    Testflight.prototype.updateBetaApplocalizations = function (localizationId, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.patch(this.apiEndPoint + "/iris/v1/betaAppLocalizations/" + localizationId, {
                            data: data,
                            type: "betaAppLocalizations",
                            id: localizationId
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Testflight.prototype.updateBetaLicenceAgreement = function (agreementId, agreementText) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.patch(this.apiEndPoint + "/iris/v1/betaLicenseAgreements/" + agreementId, {
                            data: { agreementText: agreementText },
                            type: "betaLicenseAgreements",
                            id: agreementId
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Testflight.prototype.updateBetaReviewDetails = function (detail) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            type: 'betaAppReviewDetails',
                            id: this.appId,
                            attributes: detail
                        };
                        return [4 /*yield*/, this.patch(this.apiEndPoint + "/iris/v1/betaAppReviewDetails/" + this.appId, { data: data })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Testflight.prototype.createBetaGroup = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var data, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            attributes: { name: name },
                            relationships: {
                                app: {
                                    data: {
                                        id: this.appId.toString(),
                                        type: 'apps'
                                    }
                                }
                            },
                            type: 'betaGroups'
                        };
                        return [4 /*yield*/, this.post(this.apiEndPoint + "/iris/v1/betaGroups", { data: data })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    Testflight.prototype.deleteBetaGroup = function (groupId, deleteTesters) {
        if (deleteTesters === void 0) { deleteTesters = true; }
        return __awaiter(this, void 0, void 0, function () {
            var provider, deleteTestersParam;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.currentProvider()];
                    case 1:
                        provider = _a.sent();
                        deleteTestersParam = deleteTesters ? '?deleteTesters=true' : '';
                        return [4 /*yield*/, this["delete"]("https://appstoreconnect.apple.com/testflight/v2/providers/" + provider.providerId + "/apps/" + this.appId + "/groups/" + groupId + deleteTestersParam)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * get a build instance with build id
     * @param buildId
     */
    Testflight.prototype.getBuild = function (buildId) {
        var build = new build_1.Build(buildId);
        build.cookieJar = this.cookieJar;
        return build;
    };
    return Testflight;
}(base_1.Base));
exports.Testflight = Testflight;
