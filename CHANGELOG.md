# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.6.0](https://github.com/irf87/prices-scraper/compare/v1.5.0...v1.6.0) (2025-05-13)


### Features

* add html selectors and minor improvements ([3c76ff5](https://github.com/irf87/prices-scraper/commit/3c76ff570aea42857ef9aaec38d2f1f92a6f0f9c))
* add more selectors ([e097e31](https://github.com/irf87/prices-scraper/commit/e097e316ef3801373409a62bba85fce8aac41176))
* create relation between scraped product with category and list ([0a5a9fd](https://github.com/irf87/prices-scraper/commit/0a5a9fd09446b57d0908415a7c354c5110d82219))
* improve notifications api ([a1a865b](https://github.com/irf87/prices-scraper/commit/a1a865b7d5bdfde00d8bcc12b333ef28b073cab8))
* improve readme.md ([2241899](https://github.com/irf87/prices-scraper/commit/22418997adfa1125bd773d942625611f2b815a9c))


### Bug Fixes

* cath error if rule is not found it ([3c06056](https://github.com/irf87/prices-scraper/commit/3c060560011d58ce7de184163036e224ce12b075))
* correction in Node threads that were terminating the execution. ([a1cfbfd](https://github.com/irf87/prices-scraper/commit/a1cfbfd9ff3dddb95f46a46b730bcd66cccbee5b))

## [1.5.0](https://github.com/irf87/prices-scraper/compare/v1.4.0...v1.5.0) (2025-04-12)


### Features

* add api documentation ([e7acd0c](https://github.com/irf87/prices-scraper/commit/e7acd0c2b97d83a54f0a80245dd604f9dbca5a12))
* add support to threads into scraper file to improve performance ([60ad5d6](https://github.com/irf87/prices-scraper/commit/60ad5d6ca0dc8e52545a973825f1e76b5d6d1bcd))
* add support to threads into scraper file to improve performance ([78b8ea7](https://github.com/irf87/prices-scraper/commit/78b8ea715e505a72d55b290505c9107ce0db1ab6))
* create api to suggest commons selectors from some online pages ([40e0939](https://github.com/irf87/prices-scraper/commit/40e093992159d124d7718c41e3144e09637ef6c3))
* create CRUD category ([567e902](https://github.com/irf87/prices-scraper/commit/567e902168716f3148a002c9b14e28e2ac9a4f1f))
* create CRUD for list ([27d4a04](https://github.com/irf87/prices-scraper/commit/27d4a04027fc19af2f3b291d23919a3fd1442c53))
* deprecate raven in some apis and fix send notifications ([d521341](https://github.com/irf87/prices-scraper/commit/d521341bae945c6ec2952180dfc9a17d29e1bfb6))
* deprecate ravendb ([8244367](https://github.com/irf87/prices-scraper/commit/82443674f6ef6d23729194aad0f535871530b73c))
* group long records scraped to avoid large list length ([3c80325](https://github.com/irf87/prices-scraper/commit/3c80325128af7f7d8ed9b421b319e111ede93bfe))
* improvements in how to get data from dinamic pages, with mode RENDER ([09cf4ae](https://github.com/irf87/prices-scraper/commit/09cf4ae7f86092f4a14adec776a9ff7b5a967115))
* prepare database for add categories and products list ([b6c00d5](https://github.com/irf87/prices-scraper/commit/b6c00d5b8244e8a5ba5e24c9f59e4d52794cef23))

## [1.4.0](https://github.com/irf87/prices-scraper/compare/v1.3.0...v1.4.0) (2024-08-19)


### Features

* add manual sync ([f2432fb](https://github.com/irf87/prices-scraper/commit/f2432fbec084a5f524361b33e33666b905ac3ed8))
* add render mode to scrape sites like aliexpress ([08bb0bb](https://github.com/irf87/prices-scraper/commit/08bb0bb67c924d4e003da7c24097b8886621dc28))
* auto sync and delete collections when reset sync ([1485f1e](https://github.com/irf87/prices-scraper/commit/1485f1ed2f7dbb6c4ab98b5aa188b1a508030713))
* deprecate mongodb and integrate ravendb ([4f46acd](https://github.com/irf87/prices-scraper/commit/4f46acd2d4677400e01c3d4ce6bf8b3aec8ec92a))


### Bug Fixes

* add try catch when axios crash ([04dfbb8](https://github.com/irf87/prices-scraper/commit/04dfbb86b2ca5de3cdf2737157f5fa36f1f935ae))
* fix sync function ([6f57489](https://github.com/irf87/prices-scraper/commit/6f57489d56b9b9473b694b8bc7abe2a2a2b74b7c))
* report product scraped, return array insted of object ([d6322aa](https://github.com/irf87/prices-scraper/commit/d6322aa2683883f3b2d6d51c6297f8311d0af916))

## [1.3.0](https://github.com/irf87/prices-scraper/compare/v1.2.0...v1.3.0) (2024-06-03)


### Features

* auto sync and delete collections when reset sync ([1485f1e](https://github.com/irf87/prices-scraper/commit/1485f1ed2f7dbb6c4ab98b5aa188b1a508030713))
* deprecate mongodb and integrate ravendb ([e81bbb2](https://github.com/irf87/prices-scraper/commit/e81bbb2b267373b1aade335babf1f4f1820784f5))


### Bug Fixes

* fix sync function ([6f57489](https://github.com/irf87/prices-scraper/commit/6f57489d56b9b9473b694b8bc7abe2a2a2b74b7c))

## [1.2.0](https://github.com/irf87/prices-scraper/compare/v1.1.0...v1.2.0) (2024-04-01)


### Features

* add new endpoint and transform response to camel case ([75dd196](https://github.com/irf87/prices-scraper/commit/75dd1963110c91b1ee44fa08db62f67c3a9795cd))
* create endpoint to test queries ([7607d13](https://github.com/irf87/prices-scraper/commit/7607d13cb4d91246b35a7920dc68f72ecf45e4aa))
* disable scraper when can't get price ([31f7504](https://github.com/irf87/prices-scraper/commit/31f7504e6e3957c2f1cb69af44ad6655e44528f1))
* exit process when scraper finish and creat get all scrapers api ([b6c9300](https://github.com/irf87/prices-scraper/commit/b6c93001e6f1a1586d3326cd519bfbeafebbd666))
* integrate couchdb controller ([6b22eb6](https://github.com/irf87/prices-scraper/commit/6b22eb625d1f02f450c4844978cf2d9462b10dc1))
* integrate mongoDB and new architecture ([fec6847](https://github.com/irf87/prices-scraper/commit/fec68474a2638f633feacafe511d5b5a069ac25e))
* parse responses and body params ([8aff6e2](https://github.com/irf87/prices-scraper/commit/8aff6e2d519a59331db691a91c49ffacf0ad448a))


### Bug Fixes

* add timer if do not respond when analized the dom ([09424c7](https://github.com/irf87/prices-scraper/commit/09424c72cf0a2d27a9b5f0e8de194eb9f63340db))
* fix comparison between rules and price ([3efd94d](https://github.com/irf87/prices-scraper/commit/3efd94d7440e2ece74df022cd156f9ef8967f598))
* fix url messages format ([e0688cf](https://github.com/irf87/prices-scraper/commit/e0688cf40c36ff5cf53dbda72e686b2147779d66))
* get snaps by product_scraped_id insted of product_id ([c917338](https://github.com/irf87/prices-scraper/commit/c917338c1b78c0109d58c5e6a1deb51e23d8f956))

## 1.1.0 (2022-05-26)


### Features

* add stock analyzar ([711460d](https://github.com/irf87/prices-scraper/commit/711460dff14434cb2f8f82435c8c671223cdc910))
* add telegram bot and update the date of notifications which were sent ([1373a75](https://github.com/irf87/prices-scraper/commit/1373a7549584ac45785b8380db4dbe73d729c750))
* creat scraper notifications api and improve bd ([48ee397](https://github.com/irf87/prices-scraper/commit/48ee397408d3d85e5dc9db147bafb7762f80e7ce))
* get rules, scraper notifications ([208abd0](https://github.com/irf87/prices-scraper/commit/208abd0bb9966f8b6c05d815f7a4b32e073cd184))
* improve scraper to get info from dom ([2eded20](https://github.com/irf87/prices-scraper/commit/2eded204b6e935de1353f18aaa31ea46baf6b679))
