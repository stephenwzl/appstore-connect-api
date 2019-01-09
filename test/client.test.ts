import { Client, Session, Testflight, Build } from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('test testflight client', () => {
    it('check apple id in env', () => {
        const appleId = process.env.AppleID;
        expect(appleId, '[Info:] Please do: export AppleId=yourAppleId').to.be.a('string');
        expect((appleId as string).length).to.be.above(0);
        console.log(`[Info:] Your Apple ID is ${appleId}`);
    });
    it('check apple id password in env', () => {
        const applePassword = process.env.Password;
        expect(applePassword, '[Info:] Please do: export Password=yourpassword;').to.be.a('string');
        expect((applePassword as string).length).to.be.above(0);
    });

    const client = new Client();
    it('test signin', done => {
        client.signin(process.env.AppleID as string, process.env.Password as string)
            .then(response => {
                expect(response.status).to.be.eq(200);
                done();
            }).catch(e => done(e));
    });

    it('test get session data', done => {
        client.session()
            .then(session => {
                expect(session).not.to.be.undefined;
                console.log('[Info:] current account name is:', session.user.fullName);
                done();
            }).catch(e => done(e));
    });

    it('test switch provider session', done => {
        let s: Session;
        client.session()
            .then(session => {
                s = session;
                return client.currentProvider();
            })
            .then(currentProvider => {
                const targetProvider = process.env.Provider;
                if (targetProvider) {
                    console.log(`[Info:] found target provider: ${targetProvider!}`);
                    return client.selectTeam(targetProvider!);
                }
                const anotherProvider = s.availableProviders.find(p => p.providerId !== currentProvider.providerId);
                if (!anotherProvider) {
                    console.log('[Info:] no available other providers, skip');
                    done();
                    return;
                }
                console.log(`[Info:] will switch to provider: ${anotherProvider.providerId}`);
                return client.selectTeam(anotherProvider.providerId.toString());
            }).then(() => {
                done();
            })
            .catch(e => done(e));
    });
    let appId: string;
    it('test list apps', done => {
        client.listApps()
            .then(apps => {
                expect(apps).to.be.an('Array');
                console.log(`[Info:] there are ${apps!.length} apps in current provider`);
                appId = apps![0].adamId;
                if (process.env.AppID) {
                    appId = process.env.AppID;
                    console.log(`[Info:] found target AppID: ${appId!}`)
                }
                done();
            }).catch(e => done(e));
    });
    let testflight: Testflight;
    let preReleaseVersion: string;
    it('testflight prerelease versions', done => {
        testflight = Testflight.fromClient(client, appId!);
        testflight.getPreReleaseVersions()
            .then(versions => {
                expect(versions).to.be.an('Array');
                console.log(`[Info:] there are ${versions!.length} pre release versions in app ${appId}`);
                if (versions!.length > 0) {
                    preReleaseVersion = versions![0].id;
                }
                done();
            }).catch(e => done(e));
    });

    let buildId: string;
    it('testflight builds', done => {
        if (!preReleaseVersion) {
            console.log("[Info:] no preRelease version, skip test builds");
            done();
            return;
        }
        testflight.getPreReleaseBuilds(preReleaseVersion!)
            .then(builds => {
                expect(builds.data).to.be.an('Array');
                console.log(`[Info:] there are ${builds!.data!.length} builds in version ${preReleaseVersion!}`);
                if (builds.data && builds.data!.length > 0) {
                    buildId = builds!.data![0].id;
                }
                done();
            }).catch(e => done(e));
    });

    it('testflight beta review details', done => {
        testflight.getBetaReviewDetails()
            .then(details => {
                expect(details).to.be.an('Array');
                done();
            }).catch(e => done(e));
    });

    it('testflight get beta app localizations', done => {
        testflight.getBetaAppLocalizations()
            .then(local => {
                expect(local).to.be.an('Array');
                done();
            }).catch(e => done(e));
    });

    it('testflight get beta licence agreements', done => {
        testflight.getBetaLicenceAgreements()
            .then(agrre => {
                expect(agrre).to.be.an('Array');
                done();
            }).catch(e => done(e));
    })

    it('testflight get beta groups', done => {
        testflight.getBetaGroups(false)
            .then(groups => {
                expect(groups.data).to.be.an('Array');
                done();
            }).catch(e => done(e));
    });
    let buid: Build;
    it('build get beta localizations ', done => {
        if (buildId) {
            buid = testflight.getBuild(buildId!);
        } else {
            console.log('[Info:] no build, skip')
            done();
            return;
        }
        buid!.getBetaBuildLocalizations()
            .then(local => {
                expect(local).to.be.an('Array');
                done();
            }).catch(e => done(e));
    });
    it('build get beta details', done => {
        if (!buid) {
            console.log('[Info:] no build, skip');
            done();
            return;
        }
        buid!.getBuildBetaDetails()
            .then(detail => {
                expect(detail).to.be.an('Array');
                done();
            }).catch(e => done(e));
    })

});