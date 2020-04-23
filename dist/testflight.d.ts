import { Client } from './client';
import { Base, CommonResponse, IrisCommonDataFormat } from './base';
import { Build } from './build';
export declare class Testflight extends Base {
    private constructor();
    client?: Client;
    appId?: string;
    apiEndPoint: string;
    /**
     * initialize Testflight from Client
     * @param client client has signined
     */
    static fromClient(client: Client, appId: string): Testflight;
    /**
     * get prerelease versions;
     * same as "get train version" in old release
     * @param limit limit default is 10
     * @param platform default platform is IOS
     */
    getPreReleaseVersions(limit?: number, platform?: string): Promise<[IrisCommonDataFormat<{
        version: string;
        platform: string;
    }>] | undefined>;
    getPreReleaseBuilds(preReleaseVersionId: string, limit?: number): Promise<CommonResponse<[IrisCommonDataFormat<BuildInfo>]>>;
    /**
     * get beta review detail
     */
    getBetaReviewDetails(): Promise<[IrisCommonDataFormat<BetaReviewDetail>] | undefined>;
    getBetaLicenceAgreements(): Promise<[IrisCommonDataFormat<{
        agreementText: string | null;
    }>] | undefined>;
    getBetaAppLocalizations(): Promise<[IrisCommonDataFormat<BetaAppLocalization>] | undefined>;
    getBetaGroups(isInternalGroup: boolean, limit?: number): Promise<CommonResponse<[IrisCommonDataFormat<BetaGroup>]>>;
    getBetaGroupBuild(groupId: string, limit?: number): Promise<CommonResponse<[IrisCommonDataFormat<Build>]>>;
    /**
     * make sure these builds have been approved for beta testing
     * @param groupId beta group id
     * @param buildIds array of build ids to add into beta group
     */
    addBuildsToBetaGroup(groupId: string, buildIds: [string]): Promise<void>;
    /**
     *
     * @param betaGroupId beta group to modify
     * @param publicLinkEnabled set to true to enable public link
     * @param publicLinkLimit max to 10000
     * @param publicLinkLimitEnabled
     */
    switchBetaGroupPublicLinkState(betaGroupId: string, publicLinkEnabled: boolean, publicLinkLimit: number, publicLinkLimitEnabled: boolean): Promise<IrisCommonDataFormat<BetaGroup> | undefined>;
    updateBetaApplocalizations(localizationId: string, data: BetaAppLocalization): Promise<void>;
    updateBetaLicenceAgreement(agreementId: string, agreementText: string): Promise<void>;
    updateBetaReviewDetails(detail: BetaReviewDetail): Promise<void>;
    createBetaGroup(name: string): Promise<CommonResponse<IrisCommonDataFormat<BetaGroup>>>;
    deleteBetaGroup(groupId: string, deleteTesters?: boolean): Promise<void>;
    /**
     * get a build instance with build id
     * @param buildId
     */
    getBuild(buildId: string): Build;
    getBetaTester(groupId: string): Promise<CommonResponse<[] & {
        length: 0;
    }>>;
}
export interface BetaReviewDetail {
    contactEmail: string | null;
    contactFirstName: string | null;
    contactLastName: string | null;
    contactPhone: string | null;
    demoAccountName: string | null;
    demoAccountPassword: string | null;
    demoAccountRequired: boolean;
    notes: string | null;
}
export interface BuildInfo {
    expirationDate: string;
    expired: boolean;
    iconAssetToken: {
        height: number;
        width: number;
        templateUrl: string;
    };
    minOsVersion: string;
    processingState: string;
    qcState: string;
    uploadedDate: string;
    usesNonExemptEncryption: boolean;
    version: string;
}
export interface BetaBuildMetrics {
    crashCount: number;
    installCount: number;
    inviteCount: number;
    sevenDayTesterCount: number;
}
export interface BuildBetaDetails {
    autoNotifyEnabled: boolean;
    didNotify: boolean;
    externalBuildState: string;
    internalBuildState: string;
}
export interface BetaAppLocalization {
    description: string | null;
    feedbackEmail: string | null;
    locale: string;
    marketingUrl: string | null;
    privacyPolicyUrl: string | null;
    tvOsPrivacyPolicy: string | null;
}
export interface BetaGroup {
    createdDate: string;
    isInternalGroup: boolean;
    name: string;
    publicLink: string | null;
    publicLinkEnabled: boolean;
    publicLinkId: string | null;
    publicLinkLimit: number | null;
    publicLinkLimitEnabled: boolean;
}
