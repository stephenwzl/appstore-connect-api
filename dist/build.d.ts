import { Base, IrisCommonDataFormat } from "./base";
import { BuildBetaDetails } from "./testflight";
export declare class Build extends Base {
    apiEndPoint: string;
    buildId: string;
    constructor(buildId: string);
    /**
     * beta build localization describes whatsNew in this build
     * @param limit default is 28
     */
    getBetaBuildLocalizations(limit?: number): Promise<[IrisCommonDataFormat<BetaBuildLocalizations>] | undefined>;
    /**
     * update beta build localization to let users known what's new
     * @param localizationId localization id with correct locale
     * @param whatsNew what's new
     */
    updateBetaBuildLocalization(localizationId: string, whatsNew: string): Promise<void>;
    /**
     * build beta detail contains:
     * autoNotifyEnabled
     * internalBuildState
     * externalBuildState
     */
    getBuildBetaDetails(): Promise<[IrisCommonDataFormat<BuildBetaDetails>] | undefined>;
    /**
     *
     * @param betaBuildDetailId
     * @param autoNotifyEnabled set to true to enable auto notify
     */
    updateBuildBetaDetail(betaBuildDetailId: string, autoNotifyEnabled: boolean): Promise<void>;
    /**
     * CAUTION!: before submit for beta review, remember:
     * 1. update correct beta build localization
     * 2. update build beta detail
     * 3. complete app localization
     */
    submitForBetaReview(): Promise<void>;
}
export interface BetaBuildLocalizations {
    locale: string;
    whatsNew: string | null;
}
