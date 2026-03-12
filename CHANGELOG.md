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
