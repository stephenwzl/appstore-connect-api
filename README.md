App Store Connect API
---
基于 web版 App Store Connect封装的 API工具：  

 * 🤖目前仅支持完整的 Testflight自动化 API
 * 💪久经考验，生产环境使用长达 1年

 [![npm version](https://badge.fury.io/js/appstore-connect-api.svg)](https://badge.fury.io/js/appstore-connect-api)


## 快速入门

```typescript
import { Client, Testflight, Build } from 'appstore-connect-api';

const client = new Client();

// in async method

// 登录
await client.login(account, password);
// 获取 session
await client.session();
// 切换 AppStore Connect Team
await client.selectTeam(teamId);
// 获取当前 team下 APP列表
const apps = await client.listApps();

// 从 client和 appId获取 testflight实例
const testflight = Testflight.fromClient(client, appId);
// 获取所有已经上传的版本
const preReleaseVersions = await testflight.getPreReleaseVersions();
// 通过已上传的版本 id获取该版本下的构建版本
const preReleaseBuilds = await testflight.getPreReleaseBuilds(preReleaseVersionId);

// 可以获取当前 APP的 “Beta版 App 审核信息”，并且可以进行更新
const betaReviewDetails = await testflight.getBetaReviewDetails();
// 可以获取并更新当前 APP的测试 “许可协议”
const betaLicenceAgreements = await testflight.getBetaLicenceAgreements();
// 可以获取并更新当前 APP的测试信息，包含 “Beta版 APP描述、反馈电子邮件”等
const betaAppLocallizations = await testflight.getBetaAppLocalizations();

// 可以获取测试员群组，包括内部和外部的，通过 isInternalGroup形参标志
const externalBetaGroups = await testflight.getBetaGroups(false);

// 获取group的测试员数量
const betaTester = await testflight.getBetaTester(groupId)

// 获取一个测试员群组下已经添加的 build
const builds = await testflight.getBetaGroupBuild(groupId);
// 把多个 build添加到测试员群组 （前提：该 build已经提交并通过 beta审核，内部测试员群组无此限制）
await testflight.addBuildsToBetaGroup(groupId, [ buildId_1, buildId_2 ]);
// 开启该外部测试员群组的 PublicLink，并设置上限为 1000 （前提：已经给该测试员群组添加了 build）
const publicLinkState = await testflight.switchBetaGroupPublicLinkState(groupId, true, 1000, true);
// 对外下发 publicLink即可
console.log(publicLinkState.attributes.publicLink);

// 从 testflight获取一个 build实例
const build = testflight.getBuild(buildId);
// 可以获取并更新这个 build的 测试详细信息，包括“测试内容”
const betaBuildLocalizations = await build.getBetaBuildLocalizations();
// 可以并更新获取提交 beta审核的详细信息，比如 是否开启自动通知测试员、内部测试状态、外部测试状态。
const buildBetaDetials = await build.getBuildBetaDetails();
// 提交 beta审核 (提交 beta审核前，需要更新完整的 “Beta版 App 审核信息”、“APP的测试信息”、“测试详细信息”)
await build.submitForBetaReview();

```

## 一个简单的登录实现

```ts
import { Client, Session, Testflight, Build } from 'appstore-connect-api'


const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise<string>(resolve => rl.question(query, (answer) => resolve(answer)));

const client = new Client();
(async () => {
  const res = await client.signin(account, password) // 填入自己的账号和密码
  if (res === 'ok') {
    // 登录成功
  } else if (res === 'code') { // 验证码登录
    let code = await question('请输入验证码 \n');
    let s = await client.securityCodeRequest(code)
    const session = await client.session()
    // 登录成功
  }
})()
```
