import { Base, CommonResponse } from './base';
import { AxiosResponse } from 'axios';

interface AuthServiceKeyObject {
    authServiceUrl: string,
    authServiceKey: string
}

/**
 * session data format
 */
export interface Session {
    agreeToTerms: boolean,
    availableProviders: [AppStoreProvider],
    backingType: string,
    backingTypes: [string],
    featureFlags: [string],
    helpLinks: [any],
    modules: [any],
    provider: AppStoreProvider,
    publicUserId: string,
    roles: [string],
    termsSignatures: [string],
    user: AppStoreUser,
    userProfile: [any]
}
/**
 * AppStore Connect Provider
 */
export interface AppStoreProvider {
    contentTypes: [string],
    name: string,
    providerId: number,
    subType: string,
}

export interface AccountSummary {
    canCreateAppBundles: boolean,
    canCreateIOSApps: boolean,
    canCreateMacApps: boolean,
    catalogReportsLink: string,
    cloudStorageEnabled: boolean,
    cloudStorageLink: string,
    contractAnnouncements: [any],
    enabledPlatforms: [string],
    gameCenterGroupLink: string,
    macBundlesEnabled: boolean,
    removedAppCount: number,
    sharedSecretLink: string,
    showSharedSecret: boolean,
    summaries: [App]
}

export interface App {
    adamId: string,
    appType: null | string,
    buildVersionSets: [any],
    bundleId: string,
    iconUrl: string,
    issuesCount: number,
    lastModifiedDate: number,
    name: string,
    preOrderEndDate: any,
    priceTier: any,
    type: any,
    vendorId: string,
    versionSets: [any]
}

/**
 * AppStore Connect User
 */
export interface AppStoreUser {
    emailAddress: string,
    firstName: string,
    fullName: string,
    lastName: string,
    prsId: string
}

export interface AppStoreUserDetail {
    associatedAccounts: [{
        contentProvider: {
            contentProviderId: number,
            contentProviderPublicId: string,
            name: string,
            contentProviderTypes: [string],
        },
        roles: [string],
        lastLogin: number
    }],
    sessionToken: AppStoreSessionToken,
    visibility: boolean,
    userName: string,
    userId: string
}

export interface AppStoreSessionToken {
    dsId: string,
    contentProviderId: number,
    ipAddress: null | string
}

export class Client extends Base {

    private signinUrl = 'https://idmsa.apple.com/appleauth/auth/signin';
    private wdigetKeyUrl = 'https://olympus.itunes.apple.com/v1/app/config?hostname=itunesconnect.apple.com';
    // api end point
    apiEndPoint = 'https://appstoreconnect.apple.com'

    private authServiceWidgetKey?: string;

    // runtime
    private sessionData?: Session;
    private apps?: [App];
    private userDetail?: AppStoreUserDetail;

    private async widgetKey() {
        if (this.authServiceWidgetKey) {
            return this.authServiceWidgetKey;
        }
        const response = await this.get(this.wdigetKeyUrl);
        this.authServiceWidgetKey = (response.data as AuthServiceKeyObject).authServiceKey;
        return this.authServiceWidgetKey;
    }
    /**
     * signin with Apple ID and Password
     * !CAUTION: do not support two-step verification
     * @param appleId Apple ID(email format)
     * @param password Apple ID Password (no two-step verification)
     */
    async signin(appleId: string, password: string) {
        const widgetKey = await this.widgetKey();
        return await this.post(this.signinUrl,
            { accountName: appleId, password, rememberMe: false },
            { 'X-Apple-Domain-Id': '1', 'X-Requested-With': 'XMLHttpRequest', 'X-Apple-Widget-Key': widgetKey });
    }
    /**
     * get session data
     */
    async session() {
        if (this.sessionData) {
            return this.sessionData;
        }
        const response = await this.get(`${this.apiEndPoint}/olympus/v1/session`) as AxiosResponse<Session>;
        this.sessionData = response.data;
        return this.sessionData;
    }

    /**
     * get current provider
     */
    async currentProvider() {
        const session = await this.session();
        return session.provider;
    }

    async getDetail() {
        if (this.userDetail) {
            return this.userDetail!;
        }
        const response = await this.get(`${this.apiEndPoint}/WebObjects/iTunesConnect.woa/ra/user/detail`) as AxiosResponse<CommonResponse<AppStoreUserDetail>>;
        if (response.data.data) {
            this.userDetail = response.data.data!;
        }
        return this.userDetail;
    }

    async sessionToken() {
        const userDetail = await this.getDetail();
        if (userDetail) {
            return userDetail!.sessionToken;
        }
        return undefined;
    }

    async selectTeam(providerId: string) {
        const availableProviders = (await this.session()).availableProviders;
        const currentProvider = await this.currentProvider();
        if (providerId === currentProvider.providerId.toString()) {
            return;
        }
        const targetProvider = availableProviders.find(provider => provider.providerId.toString() === providerId);
        if (!targetProvider) {
            throw Error(`[Airship Error:] can not select team with providerId: ${providerId}`);
        }
        const token = await this.sessionToken();
        if (!token) {
            throw Error(`[Airship Error:] missing required session token for switching provider`);
        }
        const data = Object.assign({}, token!, { contentProviderId: providerId });
        await this.post(`${this.apiEndPoint}/WebObjects/iTunesConnect.woa/ra/v1/session/webSession`, data);
        this.sessionData = undefined;
        await this.session();
    }

    /**
     * list apps in current provider
     */
    async listApps() {
        if (this.apps) {
            return this.apps;
        }
        const response = await this.get(`${this.apiEndPoint}/WebObjects/iTunesConnect.woa/ra/apps/manageyourapps/summary/v2`) as AxiosResponse<CommonResponse<AccountSummary>>;
        if (response.data.data) {
            this.apps = response.data.data!.summaries;
        }
        return this.apps;
    }

}
