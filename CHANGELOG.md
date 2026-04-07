## [6.11.1](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.11.0...v6.11.1) (2026-04-07)


### Bug Fixes

* **wc:** fix process.env not replaced in Vite 8 build ([ede7ff9](https://github.com/anct-cartographie-nationale/cartographie/commit/ede7ff9329caf6c0859adb0a7ecba90694ed7d8a))

# [6.11.0](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.10.1...v6.11.0) (2026-04-07)


### Features

* add user-friendly error page for API failures ([f462ef5](https://github.com/anct-cartographie-nationale/cartographie/commit/f462ef50141a7e74821e86343a2d3e0edd7b5ef2))

## [6.10.1](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.10.0...v6.10.1) (2026-04-07)


### Bug Fixes

* rename mediateur phone property to telephone ([07425cf](https://github.com/anct-cartographie-nationale/cartographie/commit/07425cfcdd26ab926ce695788db578936301d84e))

# [6.10.0](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.9.3...v6.10.0) (2026-04-07)


### Bug Fixes

* correct glob pattern in lint-staged config ([9af2925](https://github.com/anct-cartographie-nationale/cartographie/commit/9af29250065b67a3c897ac97e35492051688c9e9))
* stabilize flaky search e2e test ([e132a29](https://github.com/anct-cartographie-nationale/cartographie/commit/e132a2985d260e9e800b8c4b336ded410651f277))


### Features

* add health check endpoint for Scaleway container ([293b799](https://github.com/anct-cartographie-nationale/cartographie/commit/293b799f618342b9243950dafd70c5022f20b7eb))


### Performance Improvements

* increase e2e test parallelism to 4 workers in CI ([595dc51](https://github.com/anct-cartographie-nationale/cartographie/commit/595dc5105a2008d30c8100f8c0d3fd86163350b5))

## [6.9.3](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.9.2...v6.9.3) (2026-04-01)


### Bug Fixes

* preserve specific code_insee filters over default not.is.null ([f5d08c1](https://github.com/anct-cartographie-nationale/cartographie/commit/f5d08c12923ddfe52e141b9defaaf1d792e7d99b))

## [6.9.2](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.9.1...v6.9.2) (2026-04-01)


### Bug Fixes

* filter out lieux without code_insee from API responses ([671638a](https://github.com/anct-cartographie-nationale/cartographie/commit/671638a17db00bf5455ce8d66338c12ef61c4561))
* set minScale to 1 to avoid cold starts ([5f4cfc8](https://github.com/anct-cartographie-nationale/cartographie/commit/5f4cfc8b7f16ad39a67d502506b7e831c1bbd78f))

## [6.9.1](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.9.0...v6.9.1) (2026-03-30)


### Bug Fixes

* disable Matomo proxy to use direct tracking URL ([a19d258](https://github.com/anct-cartographie-nationale/cartographie/commit/a19d258dcc719508550fa87bb9fad51c017be66f))

# [6.9.0](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.8.0...v6.9.0) (2026-03-27)


### Features

* prefill error report mailto with lieu information ([df73d9f](https://github.com/anct-cartographie-nationale/cartographie/commit/df73d9f3a1bc4b238b5e4732005a071c2ea8f256))

# [6.8.0](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.7.0...v6.8.0) (2026-03-27)


### Features

* prefill error report mailto with lieu information ([d07c350](https://github.com/anct-cartographie-nationale/cartographie/commit/d07c350aaf6f28968f332a2cd7b91535e173227d))

# [6.7.0](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.6.0...v6.7.0) (2026-03-26)


### Bug Fixes

* update La Coop link to new URL ([05d9d4b](https://github.com/anct-cartographie-nationale/cartographie/commit/05d9d4b98e30ec6228fb1418030a634bda2b910b))


### Features

* add legacy Angular route redirects ([dcaf6fd](https://github.com/anct-cartographie-nationale/cartographie/commit/dcaf6fd88e07a483d66c2611886c7e7f2af5cd70))
* add legal pages with MDX ([f385623](https://github.com/anct-cartographie-nationale/cartographie/commit/f385623c63f5801af3c8b961021d7984d41e2394))

# [6.6.0](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.5.0...v6.6.0) (2026-03-23)


### Bug Fixes

* align web component API responses with totalLieux naming ([1780cfa](https://github.com/anct-cartographie-nationale/cartographie/commit/1780cfa46feb42320177a3d6eb966f30b75d66de))
* correct typo curentPage to currentPage ([4785461](https://github.com/anct-cartographie-nationale/cartographie/commit/4785461cdc6b9b371732d759794500f4329ad3a8))


### Features

* add caching support to withFetch middleware and layout pipeline ([c8eba70](https://github.com/anct-cartographie-nationale/cartographie/commit/c8eba7080da3093f3db32dd22ebd3806cb372f5f))

# [6.5.0](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.4.0...v6.5.0) (2026-03-19)


### Features

* add URL-based map configuration for Next.js app ([97acaf4](https://github.com/anct-cartographie-nationale/cartographie/commit/97acaf476e2cdf9f20460c9323fa54cb16e27b3a))

# [6.4.0](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.3.2...v6.4.0) (2026-03-12)


### Bug Fixes

* search address ([4a78962](https://github.com/anct-cartographie-nationale/cartographie/commit/4a7896256b1a1ce983362cfc63bbffd9353bd8c9))


### Features

* **wc:** apply custom map position with zoom constraints ([7bf6134](https://github.com/anct-cartographie-nationale/cartographie/commit/7bf6134cf53cfa1b8f6102aa3cc113f7b4881fc9))

## [6.3.2](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.3.1...v6.3.2) (2026-03-12)


### Bug Fixes

* **wc:** invalidate cached map location when config props change ([5adc301](https://github.com/anct-cartographie-nationale/cartographie/commit/5adc301c73b1cf7a94baa88d8cc1a89462bdfd7b))

## [6.3.1](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.3.0...v6.3.1) (2026-03-12)


### Bug Fixes

* **wc:** resolve Next.js code leaking into web component bundle ([d040d7f](https://github.com/anct-cartographie-nationale/cartographie/commit/d040d7fa9edcedb85446475fc307c3aa77b90915))

# [6.3.0](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.2.1...v6.3.0) (2026-03-05)


### Features

* **analytics:** add event tracking to components ([d2c5bd1](https://github.com/anct-cartographie-nationale/cartographie/commit/d2c5bd1c6e84e48c1af208f551a7db9b11169ffc))
* **analytics:** add Matomo analytics library ([f2f7351](https://github.com/anct-cartographie-nationale/cartographie/commit/f2f73511906ccc7fe79a135d4d2c5bfe54ea1004))
* **analytics:** integrate Matomo tracker in layouts ([b14afe1](https://github.com/anct-cartographie-nationale/cartographie/commit/b14afe1790f3c89801ea908a9055214d3432f849))

## [6.2.1](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.2.0...v6.2.1) (2026-03-05)


### Performance Improvements

* optimize API calls with caching and parallelization ([afb9504](https://github.com/anct-cartographie-nationale/cartographie/commit/afb95049968273a00133f4d60c229116682c91a7))

# [6.2.0](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.1.3...v6.2.0) (2026-03-05)


### Features

* **web-component:** add loading indicator for data fetching ([6b0d42a](https://github.com/anct-cartographie-nationale/cartographie/commit/6b0d42ab0f3939af63adcc6ad2fad6432753379c))

## [6.1.3](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.1.2...v6.1.3) (2026-02-26)


### Bug Fixes

* **web-component:** resolve fragilite-numerique tiles and dropdown hover ([91ce4ce](https://github.com/anct-cartographie-nationale/cartographie/commit/91ce4ced826ebc0dad2e6f38e37018e0c2d8b253))

## [6.1.2](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.1.1...v6.1.2) (2026-02-26)


### Bug Fixes

* **web-component:** resolve fragilite-numerique tiles and dropdown hover ([3eeb56b](https://github.com/anct-cartographie-nationale/cartographie/commit/3eeb56b317e3358bbafa6e6aafa70ae532d286a4))

## [6.1.1](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.1.0...v6.1.1) (2026-02-26)


### Bug Fixes

* **web-component:** improve territory filtering and navigation ([cacc55c](https://github.com/anct-cartographie-nationale/cartographie/commit/cacc55c9ba81ac9607d113f272298f60446ccd5d))

# [6.1.0](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.0.1...v6.1.0) (2026-02-26)


### Features

* **web-component:** add territory filtering and initial route ([7644979](https://github.com/anct-cartographie-nationale/cartographie/commit/7644979c7a15beff630c477b4f646042721a230f))
* **web-component:** auto-filter breadcrumbs based on territory config ([96e56b5](https://github.com/anct-cartographie-nationale/cartographie/commit/96e56b5aae26c9abc5df956786179238e0aa7ebf))

## [6.0.1](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.0.0...v6.0.1) (2026-02-19)


### Bug Fixes

* add CORS headers for API routes ([512af57](https://github.com/anct-cartographie-nationale/cartographie/commit/512af57b4de1f4587957c7e53a24260972a1c3f6))

# [6.0.0](https://github.com/anct-cartographie-nationale/cartographie/compare/v5.27.0...v6.0.0) (2026-02-19)


* feat!: add npm release workflow for web component ([72a7374](https://github.com/anct-cartographie-nationale/cartographie/commit/72a73746844b0f30530045e9e06c7fb46257ed3f))


### Bug Fixes

* allow flyTo before style is loaded ([7150134](https://github.com/anct-cartographie-nationale/cartographie/commit/715013454d2380b861dd2ffa04d81dbab195ca1f))
* claude init ([8384283](https://github.com/anct-cartographie-nationale/cartographie/commit/8384283943e2a8bfc0def5a9723809516f007724))
* copy public folder to Docker image ([2497813](https://github.com/anct-cartographie-nationale/cartographie/commit/24978130c582cd1aee665a19ce11aba036aa4c17))
* correct indentation for build-web-component job in workflow ([98a6f15](https://github.com/anct-cartographie-nationale/cartographie/commit/98a6f15a929cc2f38b92f23f4f23d5cf53d12e57))
* use NODE_AUTH_TOKEN for npm authentication ([c4e44e8](https://github.com/anct-cartographie-nationale/cartographie/commit/c4e44e87cd48053798309cefc3212e430a7c5a50))


### Features

* add Image shim for next-shim compatibility ([694d029](https://github.com/anct-cartographie-nationale/cartographie/commit/694d0295225d3899d832392c529ec74effdd415e))
* add typed search params validation for web components ([eadb2d6](https://github.com/anct-cartographie-nationale/cartographie/commit/eadb2d610355c79ce6f97fc83d4926549c234ab0))
* add useTap hook for observable side effects ([75f7658](https://github.com/anct-cartographie-nationale/cartographie/commit/75f7658ca9ed70851656a6f2fb922935431f52fa))


### Reverts

* remove Image shim and use img directly ([b07cdd1](https://github.com/anct-cartographie-nationale/cartographie/commit/b07cdd1e82b07c6da607638dca24555d39b52ebd))


### BREAKING CHANGES

* this package replaces the previous @anct/cartographie
implementation with a new web component architecture
