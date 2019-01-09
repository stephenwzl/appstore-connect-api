import { Base } from './base';
import { AxiosResponse } from 'axios';
/**
 * session data format
 */
export interface Session {
    agreeToTerms: boolean;
    availableProviders: [AppStoreProvider];
    backingType: string;
    backingTypes: [string];
    featureFlags: [string];
    helpLinks: [any];
    modules: [any];
    provider: AppStoreProvider;
    publicUserId: string;
    roles: [string];
    termsSignatures: [string];
    user: AppStoreUser;
    userProfile: [any];
}
/**
 * AppStore Connect Provider
 */
export interface AppStoreProvider {
    contentTypes: [string];
    name: string;
    providerId: number;
    subType: string;
}
export interface AccountSummary {
    canCreateAppBundles: boolean;
    canCreateIOSApps: boolean;
    canCreateMacApps: boolean;
    catalogReportsLink: string;
    cloudStorageEnabled: boolean;
    cloudStorageLink: string;
    contractAnnouncements: [any];
    enabledPlatforms: [string];
    gameCenterGroupLink: string;
    macBundlesEnabled: boolean;
    removedAppCount: number;
    sharedSecretLink: string;
    showSharedSecret: boolean;
    summaries: [App];
}
export interface App {
    adamId: string;
    appType: null | string;
    buildVersionSets: [any];
    bundleId: string;
    iconUrl: string;
    issuesCount: number;
    lastModifiedDate: number;
    name: string;
    preOrderEndDate: any;
    priceTier: any;
    type: any;
    vendorId: string;
    versionSets: [any];
}
/**
 * AppStore Connect User
 */
export interface AppStoreUser {
    emailAddress: string;
    firstName: string;
    fullName: string;
    lastName: string;
    prsId: string;
}
export interface AppStoreUserDetail {
    associatedAccounts: [{
        contentProvider: {
            contentProviderId: number;
            contentProviderPublicId: string;
            name: string;
            contentProviderTypes: [string];
        };
        roles: [string];
        lastLogin: number;
    }];
    sessionToken: AppStoreSessionToken;
    visibility: boolean;
    userName: string;
    userId: string;
}
export interface AppStoreSessionToken {
    dsId: string;
    contentProviderId: number;
    ipAddress: null | string;
}
export declare class Client extends Base {
    private signinUrl;
    private wdigetKeyUrl;
    apiEndPoint: string;
    private authServiceWidgetKey?;
    private sessionData?;
    private apps?;
    private userDetail?;
    private widgetKey;
    /**
     * signin with Apple ID and Password
     * !CAUTION: do not support two-step verification
     * @param appleId Apple ID(email format)
     * @param password Apple ID Password (no two-step verification)
     */
    signin(appleId: string, password: string): Promise<AxiosResponse<any>>;
    /**
     * get session data
     */
    session(): Promise<Session>;
    /**
     * get current provider
     */
    currentProvider(): Promise<AppStoreProvider>;
    getDetail(): Promise<AppStoreUserDetail | undefined>;
    sessionToken(): Promise<AppStoreSessionToken | undefined>;
    selectTeam(providerId: string): Promise<void>;
    /**
     * list apps in current provider
     */
    listApps(): Promise<[App] | undefined>;
}
