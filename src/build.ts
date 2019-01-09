import { Base, CommonResponse, IrisCommonDataFormat } from "./base";
import { BuildBetaDetails } from "./testflight";

export class Build extends Base {
    apiEndPoint = 'https://appstoreconnect.apple.com';
    buildId: string;

    constructor(buildId: string) {
        super();
        this.buildId = buildId;
    }

    /**
     * beta build localization describes whatsNew in this build
     * @param limit default is 28
     */
    async getBetaBuildLocalizations(limit = 28) {
        const response = await this.get(`${this.apiEndPoint}/iris/v1/betaBuildLocalizations?filter%5Bbuild%5D=${this.buildId}&limit=${limit}`);
        return (response.data as CommonResponse<[IrisCommonDataFormat<BetaBuildLocalizations>]>).data;
    }

    /**
     * update beta build localization to let users known what's new
     * @param localizationId localization id with correct locale
     * @param whatsNew what's new
     */
    async updateBetaBuildLocalization(localizationId: string, whatsNew: string) {
        const data = {
            type: "betaBuildLocalizations",
            id: localizationId,
            attributes: {
                whatsNew,
            }
        }
        await this.patch(`${this.apiEndPoint}/iris/v1/betaBuildLocalizations/${localizationId}`, { data });
    }

    /**
     * build beta detail contains:
     * autoNotifyEnabled
     * internalBuildState
     * externalBuildState
     */
    async getBuildBetaDetails() {
        const response = await this.get(`${this.apiEndPoint}/iris/v1/buildBetaDetails?filter%5Bbuild%5D=${this.buildId}&limit=28`);
        return (response.data as CommonResponse<[IrisCommonDataFormat<BuildBetaDetails>]>).data;
    }

    /**
     * 
     * @param betaBuildDetailId 
     * @param autoNotifyEnabled set to true to enable auto notify
     */
    async updateBuildBetaDetail(betaBuildDetailId: string, autoNotifyEnabled: boolean) {
        const data = {
            type: "buildBetaDetails",
            id: betaBuildDetailId,
            attributes: {
                autoNotifyEnabled
            }
        }
        await this.patch(`${this.apiEndPoint}/iris/v1/buildBetaDetails/${betaBuildDetailId}`, { data });
    }

    /**
     * CAUTION!: before submit for beta review, remember:
     * 1. update correct beta build localization
     * 2. update build beta detail
     * 3. complete app localization
     */
    async submitForBetaReview() {
        const data = { "data": { "type": "betaAppReviewSubmissions", "relationships": { "build": { "data": { "type": "builds", "id": this.buildId } } } } };
        await this.post(`${this.apiEndPoint}/iris/v1/betaAppReviewSubmissions`, data);
    }

}

export interface BetaBuildLocalizations {
    locale: string;
    whatsNew: string | null;
}
