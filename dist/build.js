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
class Build extends base_1.Base {
    constructor(buildId) {
        super();
        this.apiEndPoint = 'https://appstoreconnect.apple.com';
        this.buildId = buildId;
    }
    /**
     * beta build localization describes whatsNew in this build
     * @param limit default is 28
     */
    getBetaBuildLocalizations(limit = 28) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.get(`${this.apiEndPoint}/iris/v1/betaBuildLocalizations?filter%5Bbuild%5D=${this.buildId}&limit=${limit}`);
            return response.data.data;
        });
    }
    /**
     * update beta build localization to let users known what's new
     * @param localizationId localization id with correct locale
     * @param whatsNew what's new
     */
    updateBetaBuildLocalization(localizationId, whatsNew) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                type: "betaBuildLocalizations",
                id: localizationId,
                attributes: {
                    whatsNew,
                }
            };
            yield this.patch(`${this.apiEndPoint}/iris/v1/betaBuildLocalizations/${localizationId}`, { data });
        });
    }
    /**
     * build beta detail contains:
     * autoNotifyEnabled
     * internalBuildState
     * externalBuildState
     */
    getBuildBetaDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.get(`${this.apiEndPoint}/iris/v1/buildBetaDetails?filter%5Bbuild%5D=${this.buildId}&limit=28`);
            return response.data.data;
        });
    }
    /**
     *
     * @param betaBuildDetailId
     * @param autoNotifyEnabled set to true to enable auto notify
     */
    updateBuildBetaDetail(betaBuildDetailId, autoNotifyEnabled) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                type: "buildBetaDetails",
                id: betaBuildDetailId,
                attributes: {
                    autoNotifyEnabled
                }
            };
            yield this.patch(`${this.apiEndPoint}/iris/v1/buildBetaDetails/${betaBuildDetailId}`, { data });
        });
    }
    /**
     * CAUTION!: before submit for beta review, remember:
     * 1. update correct beta build localization
     * 2. update build beta detail
     * 3. complete app localization
     */
    submitForBetaReview() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = { "data": { "type": "betaAppReviewSubmissions", "relationships": { "build": { "data": { "type": "builds", "id": this.buildId } } } } };
            yield this.post(`${this.apiEndPoint}/iris/v1/betaAppReviewSubmissions`, data);
        });
    }
}
exports.Build = Build;
//# sourceMappingURL=build.js.map