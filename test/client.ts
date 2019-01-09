import { Client, Session } from '../src/client';
import { expect, assert } from 'chai';
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

    it('test list apps', done => {
        client.listApps()
            .then(apps => {
                expect(apps).to.be.an('Array');
                console.log(`[Info:] there are ${apps!.length} apps in current provider`);
                done();
            }).catch(e => done(e));
    })
});