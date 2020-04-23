"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const build_1 = require("./build");
class Testflight extends base_1.Base {
    constructor() {
        super();
        this.apiEndPoint = 'https://appstoreconnect.apple.com';
    }
    /**
     * initialize Testflight from Client
     * @param client client has signined
     */
    static fromClient(client, appId) {
        const flight = new Testflight();
        flight.cookieJar = client.cookieJar;
        flight.client = client;
        flight.appId = appId;
        flight.apiEndPoint = client.apiEndPoint;
        return flight;
    }
    /**
     * get prerelease versions;
     * same as "get train version" in old release
     * @param limit limit default is 10
     * @param platform default platform is IOS
     */
    getPreReleaseVersions(limit = 10, platform = 'IOS') {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.get(`${this.apiEndPoint}/iris/v1/preReleaseVersions?filter%5Bapp%5D=${this.appId}&filter%5Bbuilds.expired%5D=false&filter%5Bbuilds.processingState%5D=PROCESSING,VALID&filter%5Bplatform%5D=${platform}&limit=${limit}`);
            return response.data.data;
        });
    }
    getPreReleaseBuilds(preReleaseVersionId, limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.get(`${this.apiEndPoint}/iris/v1/builds?filter%5Bexpired%5D=false&filter%5BpreReleaseVersion%5D=${preReleaseVersionId}&filter%5BprocessingState%5D=PROCESSING,VALID&include=buildBetaDetail,betaBuildMetrics&limit=${limit}&sort=-version`);
            return response.data;
        });
    }
    /**
     * get beta review detail
     */
    getBetaReviewDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.get(`${this.apiEndPoint}/iris/v1/betaAppReviewDetails?filter%5Bapp%5D=${this.appId}&limit=1`);
            return response.data.data;
        });
    }
    getBetaLicenceAgreements() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.get(`${this.apiEndPoint}/iris/v1/betaLicenseAgreements?filter%5Bapp%5D=${this.appId}&limit=1`);
            return response.data.data;
        });
    }
    getBetaAppLocalizations() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.get(`${this.apiEndPoint}/iris/v1/betaAppLocalizations?filter%5Bapp%5D=${this.appId}&limit=28`);
            return response.data.data;
        });
    }
    getBetaGroups(isInternalGroup, limit = 15) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.get(`${this.apiEndPoint}/iris/v1/betaGroups?filter%5Bapp%5D=${this.appId}&filter%5BisInternalGroup%5D=${isInternalGroup}&limit=${limit}&sort=name`);
            return response.data;
        });
    }
    getBetaGroupBuild(groupId, limit = 20) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.get(`${this.apiEndPoint}/iris/v1/builds?filter%5BbetaGroups%5D=${groupId}&filter%5Bexpired%5D=false&filter%5BprocessingState%5D=VALID&include=preReleaseVersion,buildBetaDetail,betaBuildMetrics&limit=${limit}&sort=-version`);
            return response.data;
        });
    }
    /**
     * make sure these builds have been approved for beta testing
     * @param groupId beta group id
     * @param buildIds array of build ids to add into beta group
     */
    addBuildsToBetaGroup(groupId, buildIds) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.post(`${this.apiEndPoint}/iris/v1/betaGroups/${groupId}/relationships/builds`, {
                data: buildIds.map(buildId => { return { type: "builds", id: buildId }; })
            });
        });
    }
    /**
     *
     * @param betaGroupId beta group to modify
     * @param publicLinkEnabled set to true to enable public link
     * @param publicLinkLimit max to 10000
     * @param publicLinkLimitEnabled
     */
    switchBetaGroupPublicLinkState(betaGroupId, publicLinkEnabled, publicLinkLimit, publicLinkLimitEnabled) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.patch(`${this.apiEndPoint}/iris/v1/betaGroups/${betaGroupId}`, {
                data: {
                    type: "betaGroups",
                    id: betaGroupId,
                    attributes: { publicLinkEnabled, publicLinkLimit, publicLinkLimitEnabled }
                }
            });
            return response.data.data;
        });
    }
    updateBetaApplocalizations(localizationId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.patch(`${this.apiEndPoint}/iris/v1/betaAppLocalizations/${localizationId}`, {
                data,
                type: "betaAppLocalizations",
                id: localizationId
            });
        });
    }
    updateBetaLicenceAgreement(agreementId, agreementText) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.patch(`${this.apiEndPoint}/iris/v1/betaLicenseAgreements/${agreementId}`, {
                data: { agreementText },
                type: "betaLicenseAgreements",
                id: agreementId
            });
        });
    }
    updateBetaReviewDetails(detail) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                type: 'betaAppReviewDetails',
                id: this.appId,
                attributes: detail
            };
            yield this.patch(`${this.apiEndPoint}/iris/v1/betaAppReviewDetails/${this.appId}`, { data });
        });
    }
    createBetaGroup(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                attributes: { name },
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
            const res = yield this.post(`${this.apiEndPoint}/iris/v1/betaGroups`, { data });
            return res.data;
        });
    }
    deleteBetaGroup(groupId, deleteTesters = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.client.currentProvider();
            const deleteTestersParam = deleteTesters ? '?deleteTesters=true' : '';
            yield this.delete(`https://appstoreconnect.apple.com/testflight/v2/providers/${provider.providerId}/apps/${this.appId}/groups/${groupId}${deleteTestersParam}`);
        });
    }
    /**
     * get a build instance with build id
     * @param buildId
     */
    getBuild(buildId) {
        const build = new build_1.Build(buildId);
        build.cookieJar = this.cookieJar;
        return build;
    }
    getBetaTester(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.get(`${this.apiEndPoint}/iris/v1/betaTesters?filter[betaGroups]=${groupId}&filter[inviteType]=PUBLIC_LINK&limit=0`);
            return res.data;
        });
    }
}
exports.Testflight = Testflight;
//# sourceMappingURL=testflight.js.map