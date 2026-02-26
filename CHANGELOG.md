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
