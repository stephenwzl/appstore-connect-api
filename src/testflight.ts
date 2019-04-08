import { Client } from './client';
import { Base, CommonResponse, IrisCommonDataFormat } from './base';
import { Build } from './build';

export class Testflight extends Base {
    private constructor() {
        super();
    }

    client?: Client;
    appId?: string;

    apiEndPoint = 'https://appstoreconnect.apple.com';
    /**
     * initialize Testflight from Client
     * @param client client has signined
     */
    static fromClient(client: Client, appId: string) {
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
    async getPreReleaseVersions(limit = 10, platform = 'IOS') {
        const response = await this.get(`${this.apiEndPoint}/iris/v1/preReleaseVersions?filter%5Bapp%5D=${this.appId!}&filter%5Bbuilds.expired%5D=false&filter%5Bbuilds.processingState%5D=PROCESSING,VALID&filter%5Bplatform%5D=${platform}&limit=${limit}`);
        return (response.data as CommonResponse<[IrisCommonDataFormat<{ version: string, platform: string }>]>).data;
    }

    async getPreReleaseBuilds(preReleaseVersionId: string, limit = 10) {
        const response = await this.get(`${this.apiEndPoint}/iris/v1/builds?filter%5Bexpired%5D=false&filter%5BpreReleaseVersion%5D=${preReleaseVersionId}&filter%5BprocessingState%5D=PROCESSING,VALID&include=buildBetaDetail,betaBuildMetrics&limit=${limit}&sort=-version`);
        return (response.data as CommonResponse<[IrisCommonDataFormat<BuildInfo>]>);
    }

    /**
     * get beta review detail
     */
    async getBetaReviewDetails() {
        const response = await this.get(`${this.apiEndPoint}/iris/v1/betaAppReviewDetails?filter%5Bapp%5D=${this.appId!}&limit=1`);
        return (response.data as CommonResponse<[IrisCommonDataFormat<BetaReviewDetail>]>).data;
    }

    async getBetaLicenceAgreements() {
        const response = await this.get(`${this.apiEndPoint}/iris/v1/betaLicenseAgreements?filter%5Bapp%5D=${this.appId!}&limit=1`);
        return (response.data as CommonResponse<[IrisCommonDataFormat<{ agreementText: string | null }>]>).data;
    }

    async getBetaAppLocalizations() {
        const response = await this.get(`${this.apiEndPoint}/iris/v1/betaAppLocalizations?filter%5Bapp%5D=${this.appId!}&limit=28`);
        return (response.data as CommonResponse<[IrisCommonDataFormat<BetaAppLocalization>]>).data;
    }

    async getBetaGroups(isInternalGroup: boolean, limit = 15) {
        const response = await this.get(`${this.apiEndPoint}/iris/v1/betaGroups?filter%5Bapp%5D=${this.appId!}&filter%5BisInternalGroup%5D=${isInternalGroup}&limit=${limit}&sort=name`)
        return (response.data as CommonResponse<[IrisCommonDataFormat<BetaGroup>]>);
    }

    async getBetaGroupBuild(groupId: string, limit = 20) {
        const response = await this.get(`${this.apiEndPoint}/iris/v1/builds?filter%5BbetaGroups%5D=${groupId}&filter%5Bexpired%5D=false&filter%5BprocessingState%5D=VALID&include=preReleaseVersion,buildBetaDetail,betaBuildMetrics&limit=${limit}&sort=-version`);
        return (response.data as CommonResponse<[IrisCommonDataFormat<Build>]>);
    }

    /**
     * make sure these builds have been approved for beta testing
     * @param groupId beta group id
     * @param buildIds array of build ids to add into beta group
     */
    async addBuildsToBetaGroup(groupId: string, buildIds: [string]) {
        await this.post(`${this.apiEndPoint}/iris/v1/betaGroups/${groupId}/relationships/builds`, {
            data: buildIds.map(buildId => { return { type: "builds", id: buildId } })
        })
    }

    /**
     * 
     * @param betaGroupId beta group to modify
     * @param publicLinkEnabled set to true to enable public link
     * @param publicLinkLimit max to 10000
     * @param publicLinkLimitEnabled 
     */
    async switchBetaGroupPublicLinkState(betaGroupId: string, publicLinkEnabled: boolean, publicLinkLimit: number, publicLinkLimitEnabled: boolean) {
        const response = await this.patch(`${this.apiEndPoint}/iris/v1/betaGroups/${betaGroupId}`, {
            data: {
                type: "betaGroups",
                id: betaGroupId,
                attributes: { publicLinkEnabled, publicLinkLimit, publicLinkLimitEnabled }
            }
        });
        return (response.data as CommonResponse<IrisCommonDataFormat<BetaGroup>>).data;
    }

    async updateBetaApplocalizations(localizationId: string, data: BetaAppLocalization) {
        await this.patch(`${this.apiEndPoint}/iris/v1/betaAppLocalizations/${localizationId}`, {
            data,
            type: "betaAppLocalizations",
            id: localizationId
        });
    }

    async updateBetaLicenceAgreement(agreementId: string, agreementText: string) {
        await this.patch(`${this.apiEndPoint}/iris/v1/betaLicenseAgreements/${agreementId}`, {
            data: { agreementText },
            type: "betaLicenseAgreements",
            id: agreementId
        });
    }

    async updateBetaReviewDetails(detail: BetaReviewDetail) {
        const data = {
            type: 'betaAppReviewDetails',
            id: this.appId!,
            attributes: detail
        }
        await this.patch(`${this.apiEndPoint}/iris/v1/betaAppReviewDetails/${this.appId!}`, { data });
    }

    async createBetaGroup(name: string) {
        const data = {
            attributes: { name },
            relationships: {
                app: {
                    data: {
                        id: this.appId!.toString(),
                        type: 'apps'
                    }
                }
            },
            type: 'betaGroups'
        };
        const res = await this.post(`${this.apiEndPoint}/iris/v1/betaGroups`, { data });
        return res.data as CommonResponse<IrisCommonDataFormat<BetaGroup>>;
    }

    async deleteBetaGroup(groupId: string, deleteTesters = true) {
        const provider = await this.client!.currentProvider();
        const deleteTestersParam = deleteTesters ? '?deleteTesters=true' : '';
        await this.delete(`https://appstoreconnect.apple.com/testflight/v2/providers/${provider.providerId}/apps/${this.appId!}/groups/${groupId}${deleteTestersParam}`);
    }

    /**
     * get a build instance with build id
     * @param buildId 
     */
    getBuild(buildId: string) {
        const build = new Build(buildId);
        build.cookieJar = this.cookieJar;
        return build;
    }

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
    }
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