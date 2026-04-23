## [6.14.8](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.14.7...v6.14.8) (2026-04-23)


### Bug Fixes

* re-enable geo-blocking now that realip works correctly ([8162988](https://github.com/anct-cartographie-nationale/cartographie/commit/81629887361050b85850347fec3d6cfde67ca73a))

## [6.14.7](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.14.6...v6.14.7) (2026-04-23)


### Bug Fixes

* trust all private/reserved IP ranges for realip ([dff519e](https://github.com/anct-cartographie-nationale/cartographie/commit/dff519e09907466efa62bb6e1cb38d27653a3ee0))

## [6.14.6](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.14.5...v6.14.6) (2026-04-23)


### Bug Fixes

* fix realip extraction for Scaleway proxy chain ([8d2a361](https://github.com/anct-cartographie-nationale/cartographie/commit/8d2a361de9654b17597f05bdb0e22e180616ab7d))

## [6.14.5](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.14.4...v6.14.5) (2026-04-23)


### Performance Improvements

* skip cache for RSC requests and add XFF debug logging ([d86f9e5](https://github.com/anct-cartographie-nationale/cartographie/commit/d86f9e59b4408dde7cd867cc9bde946710ec74bb))

## [6.14.4](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.14.3...v6.14.4) (2026-04-23)


### Bug Fixes

* disable geo-blocking temporarily ([6201633](https://github.com/anct-cartographie-nationale/cartographie/commit/620163386d5826c200e5b5bdb095bab434c17401))

## [6.14.3](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.14.2...v6.14.3) (2026-04-23)


### Bug Fixes

* force PORT=3000 for Node.js to avoid conflict with Nginx ([4abaa6b](https://github.com/anct-cartographie-nationale/cartographie/commit/4abaa6b42f365b3193fb639c959e3185f2990806))

## [6.14.2](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.14.1...v6.14.2) (2026-04-23)


### Bug Fixes

* fix container startup for Scaleway deployment ([523c5ae](https://github.com/anct-cartographie-nationale/cartographie/commit/523c5ae25c155cae4544b6bf7bbfbcb53eae9392))

## [6.14.1](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.14.0...v6.14.1) (2026-04-23)


### Performance Improvements

* reduce Docker image size by 42% (530 → 308 MB) ([8448241](https://github.com/anct-cartographie-nationale/cartographie/commit/8448241c31ed668ac29538281ba2b49872dcb9d2))
* reduce Docker image size by removing unused CrowdSec plugins ([acaf09d](https://github.com/anct-cartographie-nationale/cartographie/commit/acaf09d04819d2ba369f1ea1f17c3c66c5640304))

# [6.14.0](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.13.10...v6.14.0) (2026-04-23)


### Bug Fixes

* exclude infrastructure tests from regular test run ([119aa57](https://github.com/anct-cartographie-nationale/cartographie/commit/119aa57efd1a32c1131fd0c25bed5820605197ca))
* harden geo-filter and improve cache configuration ([40e2926](https://github.com/anct-cartographie-nationale/cartographie/commit/40e292654bef58c9217d47df16f06a325e2e8375))
* hide nginx version, add error logs and graceful shutdown ([b4602a7](https://github.com/anct-cartographie-nationale/cartographie/commit/b4602a78d6a882e997d7cee6ee8b3c93c3d16f5e))


### Features

* add geographic whitelist via Nginx reverse proxy with GeoIP2 ([358e08f](https://github.com/anct-cartographie-nationale/cartographie/commit/358e08ffa48d3b5aa2d52f0fc9728179f22223fd))
* add rate limiting, custom 403 page and proxy timeouts ([9eb9498](https://github.com/anct-cartographie-nationale/cartographie/commit/9eb94981845f6406bda1d358e6d68d3ea4b4bc50))
* add structured access logs with country and cache status ([a84e9ad](https://github.com/anct-cartographie-nationale/cartographie/commit/a84e9adc064f2b4ef40ce0a81b4a8e6877d89389))
* add US to geo-whitelist for search engine crawlers and CI ([36b7380](https://github.com/anct-cartographie-nationale/cartographie/commit/36b7380dbfd79983d03690a2b93b85201afc1a71))
* integrate CrowdSec for collaborative threat detection ([1f717e6](https://github.com/anct-cartographie-nationale/cartographie/commit/1f717e6d67e141764fe38ee05950f6ab4eccff7c))


### Performance Improvements

* add gzip compression, upstream keepalive and auto workers ([2045815](https://github.com/anct-cartographie-nationale/cartographie/commit/20458157f4dabd224194967561d1b04d66c71b93))
* add Nginx reverse proxy cache with 6h TTL ([908f6b6](https://github.com/anct-cartographie-nationale/cartographie/commit/908f6b6e1b5f1c75d0d6a76f744365cd3baf97ae))

## [6.13.10](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.13.9...v6.13.10) (2026-04-10)


### Bug Fixes

* disable Next.js cache on export fetch to avoid Node.js streaming crash ([a9624aa](https://github.com/anct-cartographie-nationale/cartographie/commit/a9624aab8534166592c957be2dcf8ed8e6d9b33c))

## [6.13.9](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.13.8...v6.13.9) (2026-04-09)


### Performance Improvements

* increase container resources to 1120 mVCPU / 2048 MB ([5fd7058](https://github.com/anct-cartographie-nationale/cartographie/commit/5fd70588ae2d59f6e528c951f10f62b7ce3a5a9e))

## [6.13.8](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.13.7...v6.13.8) (2026-04-08)


### Bug Fixes

* configure robots.txt with correct site URL and block AI crawlers ([f8a01f1](https://github.com/anct-cartographie-nationale/cartographie/commit/f8a01f177e53ebc2a407820e96948e6d040fbba1))
* output robots.txt and sitemap to public/ for Docker deployment ([52684db](https://github.com/anct-cartographie-nationale/cartographie/commit/52684dbc8e0af9019f4a60f1272dfc2afd33d225))

## [6.13.7](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.13.6...v6.13.7) (2026-04-08)


### Bug Fixes

* upgrade Node.js from 20 to 22 for Web Streams compatibility ([33aba51](https://github.com/anct-cartographie-nationale/cartographie/commit/33aba51f0f55976b0c7d7fccb8d22762e2980515))

## [6.13.6](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.13.5...v6.13.6) (2026-04-08)


### Bug Fixes

* move opening_hours computation from server to client ([a8da3b8](https://github.com/anct-cartographie-nationale/cartographie/commit/a8da3b8afabce5ac9766027a6ab6334c4321c6d2))

## [6.13.5](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.13.4...v6.13.5) (2026-04-08)


### Bug Fixes

* revert CSV export from ReadableStream to plain response ([982ade9](https://github.com/anct-cartographie-nationale/cartographie/commit/982ade97f61c24786100aade54dc17aa35898587))

## [6.13.4](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.13.3...v6.13.4) (2026-04-08)


### Performance Improvements

* disable link prefetch on region and department tag lists ([81418f4](https://github.com/anct-cartographie-nationale/cartographie/commit/81418f4fa8de40b4f3aab50956889ad96e59542e))

## [6.13.3](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.13.2...v6.13.3) (2026-04-08)


### Bug Fixes

* handle PostgREST 416 response for out-of-range pagination ([714a389](https://github.com/anct-cartographie-nationale/cartographie/commit/714a389e6ad63ace98f8730e6054e14705943f78))


### Performance Improvements

* disable link prefetch on high-volume components ([d9eb798](https://github.com/anct-cartographie-nationale/cartographie/commit/d9eb798ca32030eea42ec910698d684e36c512f2)), closes [hi#volume](https://github.com/hi/issues/volume)

## [6.13.2](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.13.1...v6.13.2) (2026-04-08)


### Performance Improvements

* optimize Scaleway container resources and edge services configuration ([ed7cf47](https://github.com/anct-cartographie-nationale/cartographie/commit/ed7cf4737bac680d457429cf77f9038212113758))

## [6.13.1](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.13.0...v6.13.1) (2026-04-08)


### Bug Fixes

* remove lazy loading on CheckboxGroup to prevent filter flash ([100c5db](https://github.com/anct-cartographie-nationale/cartographie/commit/100c5db61e5ecce6247d081f16b4c7215a6be3ef))


### Performance Improvements

* add AbortSignal timeout on API fetch calls ([4ffd46d](https://github.com/anct-cartographie-nationale/cartographie/commit/4ffd46dcd54c79725e9f4944db3068cded4e1891))
* add caching for mediateurs search and fragilite-numerique tiles ([524d145](https://github.com/anct-cartographie-nationale/cartographie/commit/524d1450a84b89c4d3201f2619b871a06bcfe8db))
* add distinctUntilChanged and LRU cache eviction for map chunks ([4ae0595](https://github.com/anct-cartographie-nationale/cartographie/commit/4ae059526f0c8e2018ed187c79227f6b6ea4c09e))
* extract Date instantiation outside map callbacks ([5006e6e](https://github.com/anct-cartographie-nationale/cartographie/commit/5006e6e96c48040a0ffcc68bc23f58a6c806f394))
* optimize map chunk cache key to improve hit rate ([e09770d](https://github.com/anct-cartographie-nationale/cartographie/commit/e09770da770352ec9a2fa56682e170955f59b302))
* optimize React rendering for map markers ([4294ba2](https://github.com/anct-cartographie-nationale/cartographie/commit/4294ba25dc27ac10192752b4d43b43bbf2e4c506))
* optimize React rendering for map markers and list items ([ee5071a](https://github.com/anct-cartographie-nationale/cartographie/commit/ee5071aa30a888e872de35585fc6ba99404abc68))
* stabilize lieux$ observable and move DI out of render path ([f8d6fee](https://github.com/anct-cartographie-nationale/cartographie/commit/f8d6fee96188d3f270249c1c6825f7c855a6dbe6))
* stream CSV exports via ReadableStream ([ef01d81](https://github.com/anct-cartographie-nationale/cartographie/commit/ef01d8176d8ee49e9c01d3f64b95f6b8599e352a))
* use pre-computed Maps for collectivites lookup ([a4bbcc9](https://github.com/anct-cartographie-nationale/cartographie/commit/a4bbcc91b1e4b00ca844e663a46092dc22662ae5))

# [6.13.0](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.12.0...v6.13.0) (2026-04-08)


### Features

* add loading states with Suspense for main routes ([faf7080](https://github.com/anct-cartographie-nationale/cartographie/commit/faf7080266206ff3735c4b53e987e8f92735394b))


### Performance Improvements

* add HTTP and server-side caching for API routes ([4cefcd7](https://github.com/anct-cartographie-nationale/cartographie/commit/4cefcd72bd2490980bb7f4d4f0d0756ac688a9be))
* additional API optimizations ([3e791f5](https://github.com/anct-cartographie-nationale/cartographie/commit/3e791f5bded21540dcbb9c5bae11375f30f78a2b))

# [6.12.0](https://github.com/anct-cartographie-nationale/cartographie/compare/v6.11.1...v6.12.0) (2026-04-08)


### Features

* **infra:** add Cockpit Grafana data sources sync ([1c68115](https://github.com/anct-cartographie-nationale/cartographie/commit/1c6811546ac391976a4aac01b636c59b314d33a9))


### Performance Improvements

* reduce stats API calls from 102 to 1 ([bea07a6](https://github.com/anct-cartographie-nationale/cartographie/commit/bea07a6b95863bc13ad18b871b1c2fd9fe19a893))

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
