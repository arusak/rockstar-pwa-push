try {
  self["workbox:core:6.5.3"] && _();
} catch {
}
const x = (a, ...e) => {
  let t = a;
  return e.length > 0 && (t += ` :: ${JSON.stringify(e)}`), t;
}, O = x;
class l extends Error {
  /**
   *
   * @param {string} errorCode The error code that
   * identifies this particular error.
   * @param {Object=} details Any relevant arguments
   * that will help developers identify issues should
   * be added as a key on the context object.
   */
  constructor(e, t) {
    const s = O(e, t);
    super(s), this.name = e, this.details = t;
  }
}
const d = {
  googleAnalytics: "googleAnalytics",
  precache: "precache-v2",
  prefix: "workbox",
  runtime: "runtime",
  suffix: typeof registration < "u" ? registration.scope : ""
}, C = (a) => [d.prefix, a, d.suffix].filter((e) => e && e.length > 0).join("-"), I = (a) => {
  for (const e of Object.keys(d))
    a(e);
}, L = {
  updateDetails: (a) => {
    I((e) => {
      typeof a[e] == "string" && (d[e] = a[e]);
    });
  },
  getGoogleAnalyticsName: (a) => a || C(d.googleAnalytics),
  getPrecacheName: (a) => a || C(d.precache),
  getPrefix: () => d.prefix,
  getRuntimeName: (a) => a || C(d.runtime),
  getSuffix: () => d.suffix
};
function K(a, e) {
  const t = e();
  return a.waitUntil(t), t;
}
try {
  self["workbox:precaching:6.5.3"] && _();
} catch {
}
const A = "__WB_REVISION__";
function M(a) {
  if (!a)
    throw new l("add-to-cache-list-unexpected-type", { entry: a });
  if (typeof a == "string") {
    const i = new URL(a, location.href);
    return {
      cacheKey: i.href,
      url: i.href
    };
  }
  const { revision: e, url: t } = a;
  if (!t)
    throw new l("add-to-cache-list-unexpected-type", { entry: a });
  if (!e) {
    const i = new URL(t, location.href);
    return {
      cacheKey: i.href,
      url: i.href
    };
  }
  const s = new URL(t, location.href), n = new URL(t, location.href);
  return s.searchParams.set(A, e), {
    cacheKey: s.href,
    url: n.href
  };
}
class S {
  constructor() {
    this.updatedURLs = [], this.notUpdatedURLs = [], this.handlerWillStart = async ({ request: e, state: t }) => {
      t && (t.originalRequest = e);
    }, this.cachedResponseWillBeUsed = async ({ event: e, state: t, cachedResponse: s }) => {
      if (e.type === "install" && t && t.originalRequest && t.originalRequest instanceof Request) {
        const n = t.originalRequest.url;
        s ? this.notUpdatedURLs.push(n) : this.updatedURLs.push(n);
      }
      return s;
    };
  }
}
class q {
  constructor({ precacheController: e }) {
    this.cacheKeyWillBeUsed = async ({ request: t, params: s }) => {
      const n = (s == null ? void 0 : s.cacheKey) || this._precacheController.getCacheKeyForURL(t.url);
      return n ? new Request(n, { headers: t.headers }) : t;
    }, this._precacheController = e;
  }
}
let y;
function W() {
  if (y === void 0) {
    const a = new Response("");
    if ("body" in a)
      try {
        new Response(a.body), y = !0;
      } catch {
        y = !1;
      }
    y = !1;
  }
  return y;
}
async function D(a, e) {
  let t = null;
  if (a.url && (t = new URL(a.url).origin), t !== self.location.origin)
    throw new l("cross-origin-copy-response", { origin: t });
  const s = a.clone(), n = {
    headers: new Headers(s.headers),
    status: s.status,
    statusText: s.statusText
  }, i = e ? e(n) : n, r = W() ? s.body : await s.blob();
  return new Response(r, i);
}
const j = (a) => new URL(String(a), location.href).href.replace(new RegExp(`^${location.origin}`), "");
function N(a, e) {
  const t = new URL(a);
  for (const s of e)
    t.searchParams.delete(s);
  return t.href;
}
async function H(a, e, t, s) {
  const n = N(e.url, t);
  if (e.url === n)
    return a.match(e, s);
  const i = Object.assign(Object.assign({}, s), { ignoreSearch: !0 }), r = await a.keys(e, i);
  for (const c of r) {
    const o = N(c.url, t);
    if (n === o)
      return a.match(c, s);
  }
}
class F {
  /**
   * Creates a promise and exposes its resolve and reject functions as methods.
   */
  constructor() {
    this.promise = new Promise((e, t) => {
      this.resolve = e, this.reject = t;
    });
  }
}
const B = /* @__PURE__ */ new Set();
async function $() {
  for (const a of B)
    await a();
}
function G(a) {
  return new Promise((e) => setTimeout(e, a));
}
try {
  self["workbox:strategies:6.5.3"] && _();
} catch {
}
function R(a) {
  return typeof a == "string" ? new Request(a) : a;
}
class J {
  /**
   * Creates a new instance associated with the passed strategy and event
   * that's handling the request.
   *
   * The constructor also initializes the state that will be passed to each of
   * the plugins handling this request.
   *
   * @param {workbox-strategies.Strategy} strategy
   * @param {Object} options
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {ExtendableEvent} options.event The event associated with the
   *     request.
   * @param {URL} [options.url]
   * @param {*} [options.params] The return value from the
   *     {@link workbox-routing~matchCallback} (if applicable).
   */
  constructor(e, t) {
    this._cacheKeys = {}, Object.assign(this, t), this.event = t.event, this._strategy = e, this._handlerDeferred = new F(), this._extendLifetimePromises = [], this._plugins = [...e.plugins], this._pluginStateMap = /* @__PURE__ */ new Map();
    for (const s of this._plugins)
      this._pluginStateMap.set(s, {});
    this.event.waitUntil(this._handlerDeferred.promise);
  }
  /**
   * Fetches a given request (and invokes any applicable plugin callback
   * methods) using the `fetchOptions` (for non-navigation requests) and
   * `plugins` defined on the `Strategy` object.
   *
   * The following plugin lifecycle methods are invoked when using this method:
   * - `requestWillFetch()`
   * - `fetchDidSucceed()`
   * - `fetchDidFail()`
   *
   * @param {Request|string} input The URL or request to fetch.
   * @return {Promise<Response>}
   */
  async fetch(e) {
    const { event: t } = this;
    let s = R(e);
    if (s.mode === "navigate" && t instanceof FetchEvent && t.preloadResponse) {
      const r = await t.preloadResponse;
      if (r)
        return r;
    }
    const n = this.hasCallback("fetchDidFail") ? s.clone() : null;
    try {
      for (const r of this.iterateCallbacks("requestWillFetch"))
        s = await r({ request: s.clone(), event: t });
    } catch (r) {
      if (r instanceof Error)
        throw new l("plugin-error-request-will-fetch", {
          thrownErrorMessage: r.message
        });
    }
    const i = s.clone();
    try {
      let r;
      r = await fetch(s, s.mode === "navigate" ? void 0 : this._strategy.fetchOptions);
      for (const c of this.iterateCallbacks("fetchDidSucceed"))
        r = await c({
          event: t,
          request: i,
          response: r
        });
      return r;
    } catch (r) {
      throw n && await this.runCallbacks("fetchDidFail", {
        error: r,
        event: t,
        originalRequest: n.clone(),
        request: i.clone()
      }), r;
    }
  }
  /**
   * Calls `this.fetch()` and (in the background) runs `this.cachePut()` on
   * the response generated by `this.fetch()`.
   *
   * The call to `this.cachePut()` automatically invokes `this.waitUntil()`,
   * so you do not have to manually call `waitUntil()` on the event.
   *
   * @param {Request|string} input The request or URL to fetch and cache.
   * @return {Promise<Response>}
   */
  async fetchAndCachePut(e) {
    const t = await this.fetch(e), s = t.clone();
    return this.waitUntil(this.cachePut(e, s)), t;
  }
  /**
   * Matches a request from the cache (and invokes any applicable plugin
   * callback methods) using the `cacheName`, `matchOptions`, and `plugins`
   * defined on the strategy object.
   *
   * The following plugin lifecycle methods are invoked when using this method:
   * - cacheKeyWillByUsed()
   * - cachedResponseWillByUsed()
   *
   * @param {Request|string} key The Request or URL to use as the cache key.
   * @return {Promise<Response|undefined>} A matching response, if found.
   */
  async cacheMatch(e) {
    const t = R(e);
    let s;
    const { cacheName: n, matchOptions: i } = this._strategy, r = await this.getCacheKey(t, "read"), c = Object.assign(Object.assign({}, i), { cacheName: n });
    s = await caches.match(r, c);
    for (const o of this.iterateCallbacks("cachedResponseWillBeUsed"))
      s = await o({
        cacheName: n,
        matchOptions: i,
        cachedResponse: s,
        request: r,
        event: this.event
      }) || void 0;
    return s;
  }
  /**
   * Puts a request/response pair in the cache (and invokes any applicable
   * plugin callback methods) using the `cacheName` and `plugins` defined on
   * the strategy object.
   *
   * The following plugin lifecycle methods are invoked when using this method:
   * - cacheKeyWillByUsed()
   * - cacheWillUpdate()
   * - cacheDidUpdate()
   *
   * @param {Request|string} key The request or URL to use as the cache key.
   * @param {Response} response The response to cache.
   * @return {Promise<boolean>} `false` if a cacheWillUpdate caused the response
   * not be cached, and `true` otherwise.
   */
  async cachePut(e, t) {
    const s = R(e);
    await G(0);
    const n = await this.getCacheKey(s, "write");
    if (!t)
      throw new l("cache-put-with-no-response", {
        url: j(n.url)
      });
    const i = await this._ensureResponseSafeToCache(t);
    if (!i)
      return !1;
    const { cacheName: r, matchOptions: c } = this._strategy, o = await self.caches.open(r), u = this.hasCallback("cacheDidUpdate"), g = u ? await H(
      // TODO(philipwalton): the `__WB_REVISION__` param is a precaching
      // feature. Consider into ways to only add this behavior if using
      // precaching.
      o,
      n.clone(),
      ["__WB_REVISION__"],
      c
    ) : null;
    try {
      await o.put(n, u ? i.clone() : i);
    } catch (f) {
      if (f instanceof Error)
        throw f.name === "QuotaExceededError" && await $(), f;
    }
    for (const f of this.iterateCallbacks("cacheDidUpdate"))
      await f({
        cacheName: r,
        oldResponse: g,
        newResponse: i.clone(),
        request: n,
        event: this.event
      });
    return !0;
  }
  /**
   * Checks the list of plugins for the `cacheKeyWillBeUsed` callback, and
   * executes any of those callbacks found in sequence. The final `Request`
   * object returned by the last plugin is treated as the cache key for cache
   * reads and/or writes. If no `cacheKeyWillBeUsed` plugin callbacks have
   * been registered, the passed request is returned unmodified
   *
   * @param {Request} request
   * @param {string} mode
   * @return {Promise<Request>}
   */
  async getCacheKey(e, t) {
    const s = `${e.url} | ${t}`;
    if (!this._cacheKeys[s]) {
      let n = e;
      for (const i of this.iterateCallbacks("cacheKeyWillBeUsed"))
        n = R(await i({
          mode: t,
          request: n,
          event: this.event,
          // params has a type any can't change right now.
          params: this.params
          // eslint-disable-line
        }));
      this._cacheKeys[s] = n;
    }
    return this._cacheKeys[s];
  }
  /**
   * Returns true if the strategy has at least one plugin with the given
   * callback.
   *
   * @param {string} name The name of the callback to check for.
   * @return {boolean}
   */
  hasCallback(e) {
    for (const t of this._strategy.plugins)
      if (e in t)
        return !0;
    return !1;
  }
  /**
   * Runs all plugin callbacks matching the given name, in order, passing the
   * given param object (merged ith the current plugin state) as the only
   * argument.
   *
   * Note: since this method runs all plugins, it's not suitable for cases
   * where the return value of a callback needs to be applied prior to calling
   * the next callback. See
   * {@link workbox-strategies.StrategyHandler#iterateCallbacks}
   * below for how to handle that case.
   *
   * @param {string} name The name of the callback to run within each plugin.
   * @param {Object} param The object to pass as the first (and only) param
   *     when executing each callback. This object will be merged with the
   *     current plugin state prior to callback execution.
   */
  async runCallbacks(e, t) {
    for (const s of this.iterateCallbacks(e))
      await s(t);
  }
  /**
   * Accepts a callback and returns an iterable of matching plugin callbacks,
   * where each callback is wrapped with the current handler state (i.e. when
   * you call each callback, whatever object parameter you pass it will
   * be merged with the plugin's current state).
   *
   * @param {string} name The name fo the callback to run
   * @return {Array<Function>}
   */
  *iterateCallbacks(e) {
    for (const t of this._strategy.plugins)
      if (typeof t[e] == "function") {
        const s = this._pluginStateMap.get(t);
        yield (i) => {
          const r = Object.assign(Object.assign({}, i), { state: s });
          return t[e](r);
        };
      }
  }
  /**
   * Adds a promise to the
   * [extend lifetime promises]{@link https://w3c.github.io/ServiceWorker/#extendableevent-extend-lifetime-promises}
   * of the event event associated with the request being handled (usually a
   * `FetchEvent`).
   *
   * Note: you can await
   * {@link workbox-strategies.StrategyHandler~doneWaiting}
   * to know when all added promises have settled.
   *
   * @param {Promise} promise A promise to add to the extend lifetime promises
   *     of the event that triggered the request.
   */
  waitUntil(e) {
    return this._extendLifetimePromises.push(e), e;
  }
  /**
   * Returns a promise that resolves once all promises passed to
   * {@link workbox-strategies.StrategyHandler~waitUntil}
   * have settled.
   *
   * Note: any work done after `doneWaiting()` settles should be manually
   * passed to an event's `waitUntil()` method (not this handler's
   * `waitUntil()` method), otherwise the service worker thread my be killed
   * prior to your work completing.
   */
  async doneWaiting() {
    let e;
    for (; e = this._extendLifetimePromises.shift(); )
      await e;
  }
  /**
   * Stops running the strategy and immediately resolves any pending
   * `waitUntil()` promises.
   */
  destroy() {
    this._handlerDeferred.resolve(null);
  }
  /**
   * This method will call cacheWillUpdate on the available plugins (or use
   * status === 200) to determine if the Response is safe and valid to cache.
   *
   * @param {Request} options.request
   * @param {Response} options.response
   * @return {Promise<Response|undefined>}
   *
   * @private
   */
  async _ensureResponseSafeToCache(e) {
    let t = e, s = !1;
    for (const n of this.iterateCallbacks("cacheWillUpdate"))
      if (t = await n({
        request: this.request,
        response: t,
        event: this.event
      }) || void 0, s = !0, !t)
        break;
    return s || t && t.status !== 200 && (t = void 0), t;
  }
}
class V {
  /**
   * Creates a new instance of the strategy and sets all documented option
   * properties as public instance properties.
   *
   * Note: if a custom strategy class extends the base Strategy class and does
   * not need more than these properties, it does not need to define its own
   * constructor.
   *
   * @param {Object} [options]
   * @param {string} [options.cacheName] Cache name to store and retrieve
   * requests. Defaults to the cache names provided by
   * {@link workbox-core.cacheNames}.
   * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} [options.fetchOptions] Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
   * `fetch()` requests made by this strategy.
   * @param {Object} [options.matchOptions] The
   * [`CacheQueryOptions`]{@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions}
   * for any `cache.match()` or `cache.put()` calls made by this strategy.
   */
  constructor(e = {}) {
    this.cacheName = L.getRuntimeName(e.cacheName), this.plugins = e.plugins || [], this.fetchOptions = e.fetchOptions, this.matchOptions = e.matchOptions;
  }
  /**
   * Perform a request strategy and returns a `Promise` that will resolve with
   * a `Response`, invoking all relevant plugin callbacks.
   *
   * When a strategy instance is registered with a Workbox
   * {@link workbox-routing.Route}, this method is automatically
   * called when the route matches.
   *
   * Alternatively, this method can be used in a standalone `FetchEvent`
   * listener by passing it to `event.respondWith()`.
   *
   * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
   *     properties listed below.
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {ExtendableEvent} options.event The event associated with the
   *     request.
   * @param {URL} [options.url]
   * @param {*} [options.params]
   */
  handle(e) {
    const [t] = this.handleAll(e);
    return t;
  }
  /**
   * Similar to {@link workbox-strategies.Strategy~handle}, but
   * instead of just returning a `Promise` that resolves to a `Response` it
   * it will return an tuple of `[response, done]` promises, where the former
   * (`response`) is equivalent to what `handle()` returns, and the latter is a
   * Promise that will resolve once any promises that were added to
   * `event.waitUntil()` as part of performing the strategy have completed.
   *
   * You can await the `done` promise to ensure any extra work performed by
   * the strategy (usually caching responses) completes successfully.
   *
   * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
   *     properties listed below.
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {ExtendableEvent} options.event The event associated with the
   *     request.
   * @param {URL} [options.url]
   * @param {*} [options.params]
   * @return {Array<Promise>} A tuple of [response, done]
   *     promises that can be used to determine when the response resolves as
   *     well as when the handler has completed all its work.
   */
  handleAll(e) {
    e instanceof FetchEvent && (e = {
      event: e,
      request: e.request
    });
    const t = e.event, s = typeof e.request == "string" ? new Request(e.request) : e.request, n = "params" in e ? e.params : void 0, i = new J(this, { event: t, request: s, params: n }), r = this._getResponse(i, s, t), c = this._awaitComplete(r, i, s, t);
    return [r, c];
  }
  async _getResponse(e, t, s) {
    await e.runCallbacks("handlerWillStart", { event: s, request: t });
    let n;
    try {
      if (n = await this._handle(t, e), !n || n.type === "error")
        throw new l("no-response", { url: t.url });
    } catch (i) {
      if (i instanceof Error) {
        for (const r of e.iterateCallbacks("handlerDidError"))
          if (n = await r({ error: i, event: s, request: t }), n)
            break;
      }
      if (!n)
        throw i;
    }
    for (const i of e.iterateCallbacks("handlerWillRespond"))
      n = await i({ event: s, request: t, response: n });
    return n;
  }
  async _awaitComplete(e, t, s, n) {
    let i, r;
    try {
      i = await e;
    } catch {
    }
    try {
      await t.runCallbacks("handlerDidRespond", {
        event: n,
        request: s,
        response: i
      }), await t.doneWaiting();
    } catch (c) {
      c instanceof Error && (r = c);
    }
    if (await t.runCallbacks("handlerDidComplete", {
      event: n,
      request: s,
      response: i,
      error: r
    }), t.destroy(), r)
      throw r;
  }
}
class p extends V {
  /**
   *
   * @param {Object} [options]
   * @param {string} [options.cacheName] Cache name to store and retrieve
   * requests. Defaults to the cache names provided by
   * {@link workbox-core.cacheNames}.
   * @param {Array<Object>} [options.plugins] {@link https://developers.google.com/web/tools/workbox/guides/using-plugins|Plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} [options.fetchOptions] Values passed along to the
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters|init}
   * of all fetch() requests made by this strategy.
   * @param {Object} [options.matchOptions] The
   * {@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions|CacheQueryOptions}
   * for any `cache.match()` or `cache.put()` calls made by this strategy.
   * @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
   * get the response from the network if there's a precache miss.
   */
  constructor(e = {}) {
    e.cacheName = L.getPrecacheName(e.cacheName), super(e), this._fallbackToNetwork = e.fallbackToNetwork !== !1, this.plugins.push(p.copyRedirectedCacheableResponsesPlugin);
  }
  /**
   * @private
   * @param {Request|string} request A request to run this strategy for.
   * @param {workbox-strategies.StrategyHandler} handler The event that
   *     triggered the request.
   * @return {Promise<Response>}
   */
  async _handle(e, t) {
    const s = await t.cacheMatch(e);
    return s || (t.event && t.event.type === "install" ? await this._handleInstall(e, t) : await this._handleFetch(e, t));
  }
  async _handleFetch(e, t) {
    let s;
    const n = t.params || {};
    if (this._fallbackToNetwork) {
      const i = n.integrity, r = e.integrity, c = !r || r === i;
      s = await t.fetch(new Request(e, {
        integrity: e.mode !== "no-cors" ? r || i : void 0
      })), i && c && e.mode !== "no-cors" && (this._useDefaultCacheabilityPluginIfNeeded(), await t.cachePut(e, s.clone()));
    } else
      throw new l("missing-precache-entry", {
        cacheName: this.cacheName,
        url: e.url
      });
    return s;
  }
  async _handleInstall(e, t) {
    this._useDefaultCacheabilityPluginIfNeeded();
    const s = await t.fetch(e);
    if (!await t.cachePut(e, s.clone()))
      throw new l("bad-precaching-response", {
        url: e.url,
        status: s.status
      });
    return s;
  }
  /**
   * This method is complex, as there a number of things to account for:
   *
   * The `plugins` array can be set at construction, and/or it might be added to
   * to at any time before the strategy is used.
   *
   * At the time the strategy is used (i.e. during an `install` event), there
   * needs to be at least one plugin that implements `cacheWillUpdate` in the
   * array, other than `copyRedirectedCacheableResponsesPlugin`.
   *
   * - If this method is called and there are no suitable `cacheWillUpdate`
   * plugins, we need to add `defaultPrecacheCacheabilityPlugin`.
   *
   * - If this method is called and there is exactly one `cacheWillUpdate`, then
   * we don't have to do anything (this might be a previously added
   * `defaultPrecacheCacheabilityPlugin`, or it might be a custom plugin).
   *
   * - If this method is called and there is more than one `cacheWillUpdate`,
   * then we need to check if one is `defaultPrecacheCacheabilityPlugin`. If so,
   * we need to remove it. (This situation is unlikely, but it could happen if
   * the strategy is used multiple times, the first without a `cacheWillUpdate`,
   * and then later on after manually adding a custom `cacheWillUpdate`.)
   *
   * See https://github.com/GoogleChrome/workbox/issues/2737 for more context.
   *
   * @private
   */
  _useDefaultCacheabilityPluginIfNeeded() {
    let e = null, t = 0;
    for (const [s, n] of this.plugins.entries())
      n !== p.copyRedirectedCacheableResponsesPlugin && (n === p.defaultPrecacheCacheabilityPlugin && (e = s), n.cacheWillUpdate && t++);
    t === 0 ? this.plugins.push(p.defaultPrecacheCacheabilityPlugin) : t > 1 && e !== null && this.plugins.splice(e, 1);
  }
}
p.defaultPrecacheCacheabilityPlugin = {
  async cacheWillUpdate({ response: a }) {
    return !a || a.status >= 400 ? null : a;
  }
};
p.copyRedirectedCacheableResponsesPlugin = {
  async cacheWillUpdate({ response: a }) {
    return a.redirected ? await D(a) : a;
  }
};
class Q {
  /**
   * Create a new PrecacheController.
   *
   * @param {Object} [options]
   * @param {string} [options.cacheName] The cache to use for precaching.
   * @param {string} [options.plugins] Plugins to use when precaching as well
   * as responding to fetch events for precached assets.
   * @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
   * get the response from the network if there's a precache miss.
   */
  constructor({ cacheName: e, plugins: t = [], fallbackToNetwork: s = !0 } = {}) {
    this._urlsToCacheKeys = /* @__PURE__ */ new Map(), this._urlsToCacheModes = /* @__PURE__ */ new Map(), this._cacheKeysToIntegrities = /* @__PURE__ */ new Map(), this._strategy = new p({
      cacheName: L.getPrecacheName(e),
      plugins: [
        ...t,
        new q({ precacheController: this })
      ],
      fallbackToNetwork: s
    }), this.install = this.install.bind(this), this.activate = this.activate.bind(this);
  }
  /**
   * @type {workbox-precaching.PrecacheStrategy} The strategy created by this controller and
   * used to cache assets and respond to fetch events.
   */
  get strategy() {
    return this._strategy;
  }
  /**
   * Adds items to the precache list, removing any duplicates and
   * stores the files in the
   * {@link workbox-core.cacheNames|"precache cache"} when the service
   * worker installs.
   *
   * This method can be called multiple times.
   *
   * @param {Array<Object|string>} [entries=[]] Array of entries to precache.
   */
  precache(e) {
    this.addToCacheList(e), this._installAndActiveListenersAdded || (self.addEventListener("install", this.install), self.addEventListener("activate", this.activate), this._installAndActiveListenersAdded = !0);
  }
  /**
   * This method will add items to the precache list, removing duplicates
   * and ensuring the information is valid.
   *
   * @param {Array<workbox-precaching.PrecacheController.PrecacheEntry|string>} entries
   *     Array of entries to precache.
   */
  addToCacheList(e) {
    const t = [];
    for (const s of e) {
      typeof s == "string" ? t.push(s) : s && s.revision === void 0 && t.push(s.url);
      const { cacheKey: n, url: i } = M(s), r = typeof s != "string" && s.revision ? "reload" : "default";
      if (this._urlsToCacheKeys.has(i) && this._urlsToCacheKeys.get(i) !== n)
        throw new l("add-to-cache-list-conflicting-entries", {
          firstEntry: this._urlsToCacheKeys.get(i),
          secondEntry: n
        });
      if (typeof s != "string" && s.integrity) {
        if (this._cacheKeysToIntegrities.has(n) && this._cacheKeysToIntegrities.get(n) !== s.integrity)
          throw new l("add-to-cache-list-conflicting-integrities", {
            url: i
          });
        this._cacheKeysToIntegrities.set(n, s.integrity);
      }
      if (this._urlsToCacheKeys.set(i, n), this._urlsToCacheModes.set(i, r), t.length > 0) {
        const c = `Workbox is precaching URLs without revision info: ${t.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
        console.warn(c);
      }
    }
  }
  /**
   * Precaches new and updated assets. Call this method from the service worker
   * install event.
   *
   * Note: this method calls `event.waitUntil()` for you, so you do not need
   * to call it yourself in your event handlers.
   *
   * @param {ExtendableEvent} event
   * @return {Promise<workbox-precaching.InstallResult>}
   */
  install(e) {
    return K(e, async () => {
      const t = new S();
      this.strategy.plugins.push(t);
      for (const [i, r] of this._urlsToCacheKeys) {
        const c = this._cacheKeysToIntegrities.get(r), o = this._urlsToCacheModes.get(i), u = new Request(i, {
          integrity: c,
          cache: o,
          credentials: "same-origin"
        });
        await Promise.all(this.strategy.handleAll({
          params: { cacheKey: r },
          request: u,
          event: e
        }));
      }
      const { updatedURLs: s, notUpdatedURLs: n } = t;
      return { updatedURLs: s, notUpdatedURLs: n };
    });
  }
  /**
   * Deletes assets that are no longer present in the current precache manifest.
   * Call this method from the service worker activate event.
   *
   * Note: this method calls `event.waitUntil()` for you, so you do not need
   * to call it yourself in your event handlers.
   *
   * @param {ExtendableEvent} event
   * @return {Promise<workbox-precaching.CleanupResult>}
   */
  activate(e) {
    return K(e, async () => {
      const t = await self.caches.open(this.strategy.cacheName), s = await t.keys(), n = new Set(this._urlsToCacheKeys.values()), i = [];
      for (const r of s)
        n.has(r.url) || (await t.delete(r), i.push(r.url));
      return { deletedURLs: i };
    });
  }
  /**
   * Returns a mapping of a precached URL to the corresponding cache key, taking
   * into account the revision information for the URL.
   *
   * @return {Map<string, string>} A URL to cache key mapping.
   */
  getURLsToCacheKeys() {
    return this._urlsToCacheKeys;
  }
  /**
   * Returns a list of all the URLs that have been precached by the current
   * service worker.
   *
   * @return {Array<string>} The precached URLs.
   */
  getCachedURLs() {
    return [...this._urlsToCacheKeys.keys()];
  }
  /**
   * Returns the cache key used for storing a given URL. If that URL is
   * unversioned, like `/index.html', then the cache key will be the original
   * URL with a search parameter appended to it.
   *
   * @param {string} url A URL whose cache key you want to look up.
   * @return {string} The versioned URL that corresponds to a cache key
   * for the original URL, or undefined if that URL isn't precached.
   */
  getCacheKeyForURL(e) {
    const t = new URL(e, location.href);
    return this._urlsToCacheKeys.get(t.href);
  }
  /**
   * @param {string} url A cache key whose SRI you want to look up.
   * @return {string} The subresource integrity associated with the cache key,
   * or undefined if it's not set.
   */
  getIntegrityForCacheKey(e) {
    return this._cacheKeysToIntegrities.get(e);
  }
  /**
   * This acts as a drop-in replacement for
   * [`cache.match()`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match)
   * with the following differences:
   *
   * - It knows what the name of the precache is, and only checks in that cache.
   * - It allows you to pass in an "original" URL without versioning parameters,
   * and it will automatically look up the correct cache key for the currently
   * active revision of that URL.
   *
   * E.g., `matchPrecache('index.html')` will find the correct precached
   * response for the currently active service worker, even if the actual cache
   * key is `'/index.html?__WB_REVISION__=1234abcd'`.
   *
   * @param {string|Request} request The key (without revisioning parameters)
   * to look up in the precache.
   * @return {Promise<Response|undefined>}
   */
  async matchPrecache(e) {
    const t = e instanceof Request ? e.url : e, s = this.getCacheKeyForURL(t);
    if (s)
      return (await self.caches.open(this.strategy.cacheName)).match(s);
  }
  /**
   * Returns a function that looks up `url` in the precache (taking into
   * account revision information), and returns the corresponding `Response`.
   *
   * @param {string} url The precached URL which will be used to lookup the
   * `Response`.
   * @return {workbox-routing~handlerCallback}
   */
  createHandlerBoundToURL(e) {
    const t = this.getCacheKeyForURL(e);
    if (!t)
      throw new l("non-precached-url", { url: e });
    return (s) => (s.request = new Request(e), s.params = Object.assign({ cacheKey: t }, s.params), this.strategy.handle(s));
  }
}
let U;
const T = () => (U || (U = new Q()), U);
try {
  self["workbox:routing:6.5.3"] && _();
} catch {
}
const E = "GET", b = (a) => a && typeof a == "object" ? a : { handle: a };
class m {
  /**
   * Constructor for Route class.
   *
   * @param {workbox-routing~matchCallback} match
   * A callback function that determines whether the route matches a given
   * `fetch` event by returning a non-falsy value.
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resolving to a Response.
   * @param {string} [method='GET'] The HTTP method to match the Route
   * against.
   */
  constructor(e, t, s = E) {
    this.handler = b(t), this.match = e, this.method = s;
  }
  /**
   *
   * @param {workbox-routing-handlerCallback} handler A callback
   * function that returns a Promise resolving to a Response
   */
  setCatchHandler(e) {
    this.catchHandler = b(e);
  }
}
class X extends m {
  /**
   * If the regular expression contains
   * [capture groups]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#grouping-back-references},
   * the captured values will be passed to the
   * {@link workbox-routing~handlerCallback} `params`
   * argument.
   *
   * @param {RegExp} regExp The regular expression to match against URLs.
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   * @param {string} [method='GET'] The HTTP method to match the Route
   * against.
   */
  constructor(e, t, s) {
    const n = ({ url: i }) => {
      const r = e.exec(i.href);
      if (r && !(i.origin !== location.origin && r.index !== 0))
        return r.slice(1);
    };
    super(n, t, s);
  }
}
class Y {
  /**
   * Initializes a new Router.
   */
  constructor() {
    this._routes = /* @__PURE__ */ new Map(), this._defaultHandlerMap = /* @__PURE__ */ new Map();
  }
  /**
   * @return {Map<string, Array<workbox-routing.Route>>} routes A `Map` of HTTP
   * method name ('GET', etc.) to an array of all the corresponding `Route`
   * instances that are registered.
   */
  get routes() {
    return this._routes;
  }
  /**
   * Adds a fetch event listener to respond to events when a route matches
   * the event's request.
   */
  addFetchListener() {
    self.addEventListener("fetch", (e) => {
      const { request: t } = e, s = this.handleRequest({ request: t, event: e });
      s && e.respondWith(s);
    });
  }
  /**
   * Adds a message event listener for URLs to cache from the window.
   * This is useful to cache resources loaded on the page prior to when the
   * service worker started controlling it.
   *
   * The format of the message data sent from the window should be as follows.
   * Where the `urlsToCache` array may consist of URL strings or an array of
   * URL string + `requestInit` object (the same as you'd pass to `fetch()`).
   *
   * ```
   * {
   *   type: 'CACHE_URLS',
   *   payload: {
   *     urlsToCache: [
   *       './script1.js',
   *       './script2.js',
   *       ['./script3.js', {mode: 'no-cors'}],
   *     ],
   *   },
   * }
   * ```
   */
  addCacheListener() {
    self.addEventListener("message", (e) => {
      if (e.data && e.data.type === "CACHE_URLS") {
        const { payload: t } = e.data, s = Promise.all(t.urlsToCache.map((n) => {
          typeof n == "string" && (n = [n]);
          const i = new Request(...n);
          return this.handleRequest({ request: i, event: e });
        }));
        e.waitUntil(s), e.ports && e.ports[0] && s.then(() => e.ports[0].postMessage(!0));
      }
    });
  }
  /**
   * Apply the routing rules to a FetchEvent object to get a Response from an
   * appropriate Route's handler.
   *
   * @param {Object} options
   * @param {Request} options.request The request to handle.
   * @param {ExtendableEvent} options.event The event that triggered the
   *     request.
   * @return {Promise<Response>|undefined} A promise is returned if a
   *     registered route can handle the request. If there is no matching
   *     route and there's no `defaultHandler`, `undefined` is returned.
   */
  handleRequest({ request: e, event: t }) {
    const s = new URL(e.url, location.href);
    if (!s.protocol.startsWith("http"))
      return;
    const n = s.origin === location.origin, { params: i, route: r } = this.findMatchingRoute({
      event: t,
      request: e,
      sameOrigin: n,
      url: s
    });
    let c = r && r.handler;
    const o = e.method;
    if (!c && this._defaultHandlerMap.has(o) && (c = this._defaultHandlerMap.get(o)), !c)
      return;
    let u;
    try {
      u = c.handle({ url: s, request: e, event: t, params: i });
    } catch (f) {
      u = Promise.reject(f);
    }
    const g = r && r.catchHandler;
    return u instanceof Promise && (this._catchHandler || g) && (u = u.catch(async (f) => {
      if (g)
        try {
          return await g.handle({ url: s, request: e, event: t, params: i });
        } catch (k) {
          k instanceof Error && (f = k);
        }
      if (this._catchHandler)
        return this._catchHandler.handle({ url: s, request: e, event: t });
      throw f;
    })), u;
  }
  /**
   * Checks a request and URL (and optionally an event) against the list of
   * registered routes, and if there's a match, returns the corresponding
   * route along with any params generated by the match.
   *
   * @param {Object} options
   * @param {URL} options.url
   * @param {boolean} options.sameOrigin The result of comparing `url.origin`
   *     against the current origin.
   * @param {Request} options.request The request to match.
   * @param {Event} options.event The corresponding event.
   * @return {Object} An object with `route` and `params` properties.
   *     They are populated if a matching route was found or `undefined`
   *     otherwise.
   */
  findMatchingRoute({ url: e, sameOrigin: t, request: s, event: n }) {
    const i = this._routes.get(s.method) || [];
    for (const r of i) {
      let c;
      const o = r.match({ url: e, sameOrigin: t, request: s, event: n });
      if (o)
        return c = o, (Array.isArray(c) && c.length === 0 || o.constructor === Object && // eslint-disable-line
        Object.keys(o).length === 0 || typeof o == "boolean") && (c = void 0), { route: r, params: c };
    }
    return {};
  }
  /**
   * Define a default `handler` that's called when no routes explicitly
   * match the incoming request.
   *
   * Each HTTP method ('GET', 'POST', etc.) gets its own default handler.
   *
   * Without a default handler, unmatched requests will go against the
   * network as if there were no service worker present.
   *
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   * @param {string} [method='GET'] The HTTP method to associate with this
   * default handler. Each method has its own default.
   */
  setDefaultHandler(e, t = E) {
    this._defaultHandlerMap.set(t, b(e));
  }
  /**
   * If a Route throws an error while handling a request, this `handler`
   * will be called and given a chance to provide a response.
   *
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   */
  setCatchHandler(e) {
    this._catchHandler = b(e);
  }
  /**
   * Registers a route with the router.
   *
   * @param {workbox-routing.Route} route The route to register.
   */
  registerRoute(e) {
    this._routes.has(e.method) || this._routes.set(e.method, []), this._routes.get(e.method).push(e);
  }
  /**
   * Unregisters a route with the router.
   *
   * @param {workbox-routing.Route} route The route to unregister.
   */
  unregisterRoute(e) {
    if (!this._routes.has(e.method))
      throw new l("unregister-route-but-not-found-with-method", {
        method: e.method
      });
    const t = this._routes.get(e.method).indexOf(e);
    if (t > -1)
      this._routes.get(e.method).splice(t, 1);
    else
      throw new l("unregister-route-route-not-registered");
  }
}
let w;
const z = () => (w || (w = new Y(), w.addFetchListener(), w.addCacheListener()), w);
function Z(a, e, t) {
  let s;
  if (typeof a == "string") {
    const i = new URL(a, location.href), r = ({ url: c }) => c.href === i.href;
    s = new m(r, e, t);
  } else if (a instanceof RegExp)
    s = new X(a, e, t);
  else if (typeof a == "function")
    s = new m(a, e, t);
  else if (a instanceof m)
    s = a;
  else
    throw new l("unsupported-route-type", {
      moduleName: "workbox-routing",
      funcName: "registerRoute",
      paramName: "capture"
    });
  return z().registerRoute(s), s;
}
function ee(a, e = []) {
  for (const t of [...a.searchParams.keys()])
    e.some((s) => s.test(t)) && a.searchParams.delete(t);
  return a;
}
function* te(a, { ignoreURLParametersMatching: e = [/^utm_/, /^fbclid$/], directoryIndex: t = "index.html", cleanURLs: s = !0, urlManipulation: n } = {}) {
  const i = new URL(a, location.href);
  i.hash = "", yield i.href;
  const r = ee(i, e);
  if (yield r.href, t && r.pathname.endsWith("/")) {
    const c = new URL(r.href);
    c.pathname += t, yield c.href;
  }
  if (s) {
    const c = new URL(r.href);
    c.pathname += ".html", yield c.href;
  }
  if (n) {
    const c = n({ url: i });
    for (const o of c)
      yield o.href;
  }
}
class se extends m {
  /**
   * @param {PrecacheController} precacheController A `PrecacheController`
   * instance used to both match requests and respond to fetch events.
   * @param {Object} [options] Options to control how requests are matched
   * against the list of precached URLs.
   * @param {string} [options.directoryIndex=index.html] The `directoryIndex` will
   * check cache entries for a URLs ending with '/' to see if there is a hit when
   * appending the `directoryIndex` value.
   * @param {Array<RegExp>} [options.ignoreURLParametersMatching=[/^utm_/, /^fbclid$/]] An
   * array of regex's to remove search params when looking for a cache match.
   * @param {boolean} [options.cleanURLs=true] The `cleanURLs` option will
   * check the cache for the URL with a `.html` added to the end of the end.
   * @param {workbox-precaching~urlManipulation} [options.urlManipulation]
   * This is a function that should take a URL and return an array of
   * alternative URLs that should be checked for precache matches.
   */
  constructor(e, t) {
    const s = ({ request: n }) => {
      const i = e.getURLsToCacheKeys();
      for (const r of te(n.url, t)) {
        const c = i.get(r);
        if (c) {
          const o = e.getIntegrityForCacheKey(c);
          return { cacheKey: c, integrity: o };
        }
      }
    };
    super(s, e.strategy);
  }
}
function ae(a) {
  const e = T(), t = new se(e, a);
  Z(t);
}
function ne(a) {
  T().precache(a);
}
function ie(a, e) {
  ne(a), ae(e);
}
function re() {
  self.addEventListener("activate", () => self.clients.claim());
}
console.info("Service worker build 26/05/2023, 12:48");
const v = async (a, e) => {
  (await self.clients.matchAll({ includeUncontrolled: !0, type: "window" })).forEach((s) => {
    s.postMessage({
      type: "LOG",
      message: e
    });
  });
}, h = (a) => (console.info(a), v("LOG", a)), ce = (a) => "setAppBadge" in self.navigator ? self.navigator.setAppBadge(a).then(() => h("Badge displayed")) : (h("Badge API is not available"), Promise.resolve()), oe = async () => {
  if ("pushManager" in self.registration && typeof self.registration.pushManager.subscribe == "function") {
    await h("Registering a push subscription");
    try {
      const a = await self.registration.pushManager.subscribe({
        userVisibleOnly: !0,
        applicationServerKey: "BGdL595OYfn0whXOJSJfrKsQu0hE4XDm3mH_F8a00cdOqbPXcCyTljPWuIU_inEJNYkmjCUr9eAmiIJnvmkKxVY"
      });
      return await h("Subscribed successfully"), await v("SUB"), a;
    } catch (a) {
      await h(`Unable to subscribe. ${a}`);
    }
  }
  return null;
}, le = async () => {
  if (Notification.permission !== "granted") {
    h("No permission to show notifications");
    return;
  }
  try {
    await self.registration.showNotification("Local Notification", {
      body: "This was sent from service worker, without using Push API",
      icon: "./icon-192.png"
    }), h("Local notification is sent successfully");
  } catch (a) {
    h(`Error sending local notification: ${a}`);
  }
}, he = async (a) => {
  const t = await (await fetch("https://rockstar-push.glitch.me/send-push", {
    method: "post",
    body: JSON.stringify(a, null, 2),
    headers: {
      "Content-Type": "application/json"
    }
  })).text();
  await h(`Push request result: ${t}`);
};
self.skipWaiting();
re();
ie([{"revision":null,"url":"assets/index-6ef9ef0f.css"},{"revision":null,"url":"assets/index-9333d31d.js"},{"revision":"1edc5221880734590238e78501c6c375","url":"index.html"},{"revision":"013de5474500ddbb23aece0dcc0e8f52","url":"registerSW.js"},{"revision":"eeec202140a133160157b38d0870b22b","url":"icon192.png"},{"revision":"0b031c44a66b36fbcea23dac0bcb0b6e","url":"icon512.png"},{"revision":"b8480fab49bd2b641b37c2b14deef198","url":"manifest.webmanifest"}]);
let P = null;
(async () => (h("Service worker is running"), P = await oe()))();
self.addEventListener("message", (a) => {
  var e, t, s;
  if (((e = a.data) == null ? void 0 : e.type) === "SEND_NOTIFICATION") {
    const n = [];
    n.push(le()), "setAppBadge" in self.navigator && n.push(self.navigator.setAppBadge(1)), a.waitUntil(Promise.all(n));
  }
  ((t = a.data) == null ? void 0 : t.type) === "REQUEST_PUSH" && (P ? a.waitUntil(he(P)) : a.waitUntil(h("Unable to request a push: no subscription"))), ((s = a.data) == null ? void 0 : s.type) === "APP_OPEN" && "clearAppBadge" in self.navigator && a.waitUntil(self.navigator.clearAppBadge());
});
self.addEventListener("push", (a) => {
  var c;
  h("Received a push message");
  const e = [], t = ce(1);
  e.push(t);
  const { title: s = "Empty message", body: n = "Empty message" } = ((c = a.data) == null ? void 0 : c.json()) || {}, i = self.registration.showNotification(s, { body: n });
  e.push(i);
  const r = Promise.all(e).catch((o) => h(`Push processing failed. ${o}`));
  a.waitUntil(r);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS13b3JrZXIuanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy93b3JrYm94LWNvcmUvX3ZlcnNpb24uanMiLCIuLi9ub2RlX21vZHVsZXMvd29ya2JveC1jb3JlL21vZGVscy9tZXNzYWdlcy9tZXNzYWdlR2VuZXJhdG9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtY29yZS9fcHJpdmF0ZS9Xb3JrYm94RXJyb3IuanMiLCIuLi9ub2RlX21vZHVsZXMvd29ya2JveC1jb3JlL19wcml2YXRlL2NhY2hlTmFtZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvd29ya2JveC1jb3JlL19wcml2YXRlL3dhaXRVbnRpbC5qcyIsIi4uL25vZGVfbW9kdWxlcy93b3JrYm94LXByZWNhY2hpbmcvX3ZlcnNpb24uanMiLCIuLi9ub2RlX21vZHVsZXMvd29ya2JveC1wcmVjYWNoaW5nL3V0aWxzL2NyZWF0ZUNhY2hlS2V5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtcHJlY2FjaGluZy91dGlscy9QcmVjYWNoZUluc3RhbGxSZXBvcnRQbHVnaW4uanMiLCIuLi9ub2RlX21vZHVsZXMvd29ya2JveC1wcmVjYWNoaW5nL3V0aWxzL1ByZWNhY2hlQ2FjaGVLZXlQbHVnaW4uanMiLCIuLi9ub2RlX21vZHVsZXMvd29ya2JveC1jb3JlL19wcml2YXRlL2NhbkNvbnN0cnVjdFJlc3BvbnNlRnJvbUJvZHlTdHJlYW0uanMiLCIuLi9ub2RlX21vZHVsZXMvd29ya2JveC1jb3JlL2NvcHlSZXNwb25zZS5qcyIsIi4uL25vZGVfbW9kdWxlcy93b3JrYm94LWNvcmUvX3ByaXZhdGUvZ2V0RnJpZW5kbHlVUkwuanMiLCIuLi9ub2RlX21vZHVsZXMvd29ya2JveC1jb3JlL19wcml2YXRlL2NhY2hlTWF0Y2hJZ25vcmVQYXJhbXMuanMiLCIuLi9ub2RlX21vZHVsZXMvd29ya2JveC1jb3JlL19wcml2YXRlL0RlZmVycmVkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtY29yZS9tb2RlbHMvcXVvdGFFcnJvckNhbGxiYWNrcy5qcyIsIi4uL25vZGVfbW9kdWxlcy93b3JrYm94LWNvcmUvX3ByaXZhdGUvZXhlY3V0ZVF1b3RhRXJyb3JDYWxsYmFja3MuanMiLCIuLi9ub2RlX21vZHVsZXMvd29ya2JveC1jb3JlL19wcml2YXRlL3RpbWVvdXQuanMiLCIuLi9ub2RlX21vZHVsZXMvd29ya2JveC1zdHJhdGVnaWVzL192ZXJzaW9uLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtc3RyYXRlZ2llcy9TdHJhdGVneUhhbmRsZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvd29ya2JveC1zdHJhdGVnaWVzL1N0cmF0ZWd5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtcHJlY2FjaGluZy9QcmVjYWNoZVN0cmF0ZWd5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtcHJlY2FjaGluZy9QcmVjYWNoZUNvbnRyb2xsZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvd29ya2JveC1wcmVjYWNoaW5nL3V0aWxzL2dldE9yQ3JlYXRlUHJlY2FjaGVDb250cm9sbGVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtcm91dGluZy9fdmVyc2lvbi5qcyIsIi4uL25vZGVfbW9kdWxlcy93b3JrYm94LXJvdXRpbmcvdXRpbHMvY29uc3RhbnRzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtcm91dGluZy91dGlscy9ub3JtYWxpemVIYW5kbGVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtcm91dGluZy9Sb3V0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy93b3JrYm94LXJvdXRpbmcvUmVnRXhwUm91dGUuanMiLCIuLi9ub2RlX21vZHVsZXMvd29ya2JveC1yb3V0aW5nL1JvdXRlci5qcyIsIi4uL25vZGVfbW9kdWxlcy93b3JrYm94LXJvdXRpbmcvdXRpbHMvZ2V0T3JDcmVhdGVEZWZhdWx0Um91dGVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtcm91dGluZy9yZWdpc3RlclJvdXRlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtcHJlY2FjaGluZy91dGlscy9yZW1vdmVJZ25vcmVkU2VhcmNoUGFyYW1zLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtcHJlY2FjaGluZy91dGlscy9nZW5lcmF0ZVVSTFZhcmlhdGlvbnMuanMiLCIuLi9ub2RlX21vZHVsZXMvd29ya2JveC1wcmVjYWNoaW5nL1ByZWNhY2hlUm91dGUuanMiLCIuLi9ub2RlX21vZHVsZXMvd29ya2JveC1wcmVjYWNoaW5nL2FkZFJvdXRlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtcHJlY2FjaGluZy9wcmVjYWNoZS5qcyIsIi4uL25vZGVfbW9kdWxlcy93b3JrYm94LXByZWNhY2hpbmcvcHJlY2FjaGVBbmRSb3V0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy93b3JrYm94LWNvcmUvY2xpZW50c0NsYWltLmpzIiwiLi4vc3JjL3NlcnZpY2Utd29ya2VyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuLy8gQHRzLWlnbm9yZVxudHJ5IHtcbiAgICBzZWxmWyd3b3JrYm94OmNvcmU6Ni41LjMnXSAmJiBfKCk7XG59XG5jYXRjaCAoZSkgeyB9XG4iLCIvKlxuICBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDXG5cbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgeyBtZXNzYWdlcyB9IGZyb20gJy4vbWVzc2FnZXMuanMnO1xuaW1wb3J0ICcuLi8uLi9fdmVyc2lvbi5qcyc7XG5jb25zdCBmYWxsYmFjayA9IChjb2RlLCAuLi5hcmdzKSA9PiB7XG4gICAgbGV0IG1zZyA9IGNvZGU7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICBtc2cgKz0gYCA6OiAke0pTT04uc3RyaW5naWZ5KGFyZ3MpfWA7XG4gICAgfVxuICAgIHJldHVybiBtc2c7XG59O1xuY29uc3QgZ2VuZXJhdG9yRnVuY3Rpb24gPSAoY29kZSwgZGV0YWlscyA9IHt9KSA9PiB7XG4gICAgY29uc3QgbWVzc2FnZSA9IG1lc3NhZ2VzW2NvZGVdO1xuICAgIGlmICghbWVzc2FnZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBmaW5kIG1lc3NhZ2UgZm9yIGNvZGUgJyR7Y29kZX0nLmApO1xuICAgIH1cbiAgICByZXR1cm4gbWVzc2FnZShkZXRhaWxzKTtcbn07XG5leHBvcnQgY29uc3QgbWVzc2FnZUdlbmVyYXRvciA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicgPyBmYWxsYmFjayA6IGdlbmVyYXRvckZ1bmN0aW9uO1xuIiwiLypcbiAgQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0IHsgbWVzc2FnZUdlbmVyYXRvciB9IGZyb20gJy4uL21vZGVscy9tZXNzYWdlcy9tZXNzYWdlR2VuZXJhdG9yLmpzJztcbmltcG9ydCAnLi4vX3ZlcnNpb24uanMnO1xuLyoqXG4gKiBXb3JrYm94IGVycm9ycyBzaG91bGQgYmUgdGhyb3duIHdpdGggdGhpcyBjbGFzcy5cbiAqIFRoaXMgYWxsb3dzIHVzZSB0byBlbnN1cmUgdGhlIHR5cGUgZWFzaWx5IGluIHRlc3RzLFxuICogaGVscHMgZGV2ZWxvcGVycyBpZGVudGlmeSBlcnJvcnMgZnJvbSB3b3JrYm94XG4gKiBlYXNpbHkgYW5kIGFsbG93cyB1c2UgdG8gb3B0aW1pc2UgZXJyb3JcbiAqIG1lc3NhZ2VzIGNvcnJlY3RseS5cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBXb3JrYm94RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXJyb3JDb2RlIFRoZSBlcnJvciBjb2RlIHRoYXRcbiAgICAgKiBpZGVudGlmaWVzIHRoaXMgcGFydGljdWxhciBlcnJvci5cbiAgICAgKiBAcGFyYW0ge09iamVjdD19IGRldGFpbHMgQW55IHJlbGV2YW50IGFyZ3VtZW50c1xuICAgICAqIHRoYXQgd2lsbCBoZWxwIGRldmVsb3BlcnMgaWRlbnRpZnkgaXNzdWVzIHNob3VsZFxuICAgICAqIGJlIGFkZGVkIGFzIGEga2V5IG9uIHRoZSBjb250ZXh0IG9iamVjdC5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihlcnJvckNvZGUsIGRldGFpbHMpIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IG1lc3NhZ2VHZW5lcmF0b3IoZXJyb3JDb2RlLCBkZXRhaWxzKTtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMubmFtZSA9IGVycm9yQ29kZTtcbiAgICAgICAgdGhpcy5kZXRhaWxzID0gZGV0YWlscztcbiAgICB9XG59XG5leHBvcnQgeyBXb3JrYm94RXJyb3IgfTtcbiIsIi8qXG4gIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCAnLi4vX3ZlcnNpb24uanMnO1xuY29uc3QgX2NhY2hlTmFtZURldGFpbHMgPSB7XG4gICAgZ29vZ2xlQW5hbHl0aWNzOiAnZ29vZ2xlQW5hbHl0aWNzJyxcbiAgICBwcmVjYWNoZTogJ3ByZWNhY2hlLXYyJyxcbiAgICBwcmVmaXg6ICd3b3JrYm94JyxcbiAgICBydW50aW1lOiAncnVudGltZScsXG4gICAgc3VmZml4OiB0eXBlb2YgcmVnaXN0cmF0aW9uICE9PSAndW5kZWZpbmVkJyA/IHJlZ2lzdHJhdGlvbi5zY29wZSA6ICcnLFxufTtcbmNvbnN0IF9jcmVhdGVDYWNoZU5hbWUgPSAoY2FjaGVOYW1lKSA9PiB7XG4gICAgcmV0dXJuIFtfY2FjaGVOYW1lRGV0YWlscy5wcmVmaXgsIGNhY2hlTmFtZSwgX2NhY2hlTmFtZURldGFpbHMuc3VmZml4XVxuICAgICAgICAuZmlsdGVyKCh2YWx1ZSkgPT4gdmFsdWUgJiYgdmFsdWUubGVuZ3RoID4gMClcbiAgICAgICAgLmpvaW4oJy0nKTtcbn07XG5jb25zdCBlYWNoQ2FjaGVOYW1lRGV0YWlsID0gKGZuKSA9PiB7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoX2NhY2hlTmFtZURldGFpbHMpKSB7XG4gICAgICAgIGZuKGtleSk7XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCBjYWNoZU5hbWVzID0ge1xuICAgIHVwZGF0ZURldGFpbHM6IChkZXRhaWxzKSA9PiB7XG4gICAgICAgIGVhY2hDYWNoZU5hbWVEZXRhaWwoKGtleSkgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBkZXRhaWxzW2tleV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgX2NhY2hlTmFtZURldGFpbHNba2V5XSA9IGRldGFpbHNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXRHb29nbGVBbmFseXRpY3NOYW1lOiAodXNlckNhY2hlTmFtZSkgPT4ge1xuICAgICAgICByZXR1cm4gdXNlckNhY2hlTmFtZSB8fCBfY3JlYXRlQ2FjaGVOYW1lKF9jYWNoZU5hbWVEZXRhaWxzLmdvb2dsZUFuYWx5dGljcyk7XG4gICAgfSxcbiAgICBnZXRQcmVjYWNoZU5hbWU6ICh1c2VyQ2FjaGVOYW1lKSA9PiB7XG4gICAgICAgIHJldHVybiB1c2VyQ2FjaGVOYW1lIHx8IF9jcmVhdGVDYWNoZU5hbWUoX2NhY2hlTmFtZURldGFpbHMucHJlY2FjaGUpO1xuICAgIH0sXG4gICAgZ2V0UHJlZml4OiAoKSA9PiB7XG4gICAgICAgIHJldHVybiBfY2FjaGVOYW1lRGV0YWlscy5wcmVmaXg7XG4gICAgfSxcbiAgICBnZXRSdW50aW1lTmFtZTogKHVzZXJDYWNoZU5hbWUpID0+IHtcbiAgICAgICAgcmV0dXJuIHVzZXJDYWNoZU5hbWUgfHwgX2NyZWF0ZUNhY2hlTmFtZShfY2FjaGVOYW1lRGV0YWlscy5ydW50aW1lKTtcbiAgICB9LFxuICAgIGdldFN1ZmZpeDogKCkgPT4ge1xuICAgICAgICByZXR1cm4gX2NhY2hlTmFtZURldGFpbHMuc3VmZml4O1xuICAgIH0sXG59O1xuIiwiLypcbiAgQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCAnLi4vX3ZlcnNpb24uanMnO1xuLyoqXG4gKiBBIHV0aWxpdHkgbWV0aG9kIHRoYXQgbWFrZXMgaXQgZWFzaWVyIHRvIHVzZSBgZXZlbnQud2FpdFVudGlsYCB3aXRoXG4gKiBhc3luYyBmdW5jdGlvbnMgYW5kIHJldHVybiB0aGUgcmVzdWx0LlxuICpcbiAqIEBwYXJhbSB7RXh0ZW5kYWJsZUV2ZW50fSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gYXN5bmNGblxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiB3YWl0VW50aWwoZXZlbnQsIGFzeW5jRm4pIHtcbiAgICBjb25zdCByZXR1cm5Qcm9taXNlID0gYXN5bmNGbigpO1xuICAgIGV2ZW50LndhaXRVbnRpbChyZXR1cm5Qcm9taXNlKTtcbiAgICByZXR1cm4gcmV0dXJuUHJvbWlzZTtcbn1cbmV4cG9ydCB7IHdhaXRVbnRpbCB9O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBAdHMtaWdub3JlXG50cnkge1xuICAgIHNlbGZbJ3dvcmtib3g6cHJlY2FjaGluZzo2LjUuMyddICYmIF8oKTtcbn1cbmNhdGNoIChlKSB7IH1cbiIsIi8qXG4gIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCB7IFdvcmtib3hFcnJvciB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9Xb3JrYm94RXJyb3IuanMnO1xuaW1wb3J0ICcuLi9fdmVyc2lvbi5qcyc7XG4vLyBOYW1lIG9mIHRoZSBzZWFyY2ggcGFyYW1ldGVyIHVzZWQgdG8gc3RvcmUgcmV2aXNpb24gaW5mby5cbmNvbnN0IFJFVklTSU9OX1NFQVJDSF9QQVJBTSA9ICdfX1dCX1JFVklTSU9OX18nO1xuLyoqXG4gKiBDb252ZXJ0cyBhIG1hbmlmZXN0IGVudHJ5IGludG8gYSB2ZXJzaW9uZWQgVVJMIHN1aXRhYmxlIGZvciBwcmVjYWNoaW5nLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fHN0cmluZ30gZW50cnlcbiAqIEByZXR1cm4ge3N0cmluZ30gQSBVUkwgd2l0aCB2ZXJzaW9uaW5nIGluZm8uXG4gKlxuICogQHByaXZhdGVcbiAqIEBtZW1iZXJvZiB3b3JrYm94LXByZWNhY2hpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNhY2hlS2V5KGVudHJ5KSB7XG4gICAgaWYgKCFlbnRyeSkge1xuICAgICAgICB0aHJvdyBuZXcgV29ya2JveEVycm9yKCdhZGQtdG8tY2FjaGUtbGlzdC11bmV4cGVjdGVkLXR5cGUnLCB7IGVudHJ5IH0pO1xuICAgIH1cbiAgICAvLyBJZiBhIHByZWNhY2hlIG1hbmlmZXN0IGVudHJ5IGlzIGEgc3RyaW5nLCBpdCdzIGFzc3VtZWQgdG8gYmUgYSB2ZXJzaW9uZWRcbiAgICAvLyBVUkwsIGxpa2UgJy9hcHAuYWJjZDEyMzQuanMnLiBSZXR1cm4gYXMtaXMuXG4gICAgaWYgKHR5cGVvZiBlbnRyeSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc3QgdXJsT2JqZWN0ID0gbmV3IFVSTChlbnRyeSwgbG9jYXRpb24uaHJlZik7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjYWNoZUtleTogdXJsT2JqZWN0LmhyZWYsXG4gICAgICAgICAgICB1cmw6IHVybE9iamVjdC5ocmVmLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBjb25zdCB7IHJldmlzaW9uLCB1cmwgfSA9IGVudHJ5O1xuICAgIGlmICghdXJsKSB7XG4gICAgICAgIHRocm93IG5ldyBXb3JrYm94RXJyb3IoJ2FkZC10by1jYWNoZS1saXN0LXVuZXhwZWN0ZWQtdHlwZScsIHsgZW50cnkgfSk7XG4gICAgfVxuICAgIC8vIElmIHRoZXJlJ3MganVzdCBhIFVSTCBhbmQgbm8gcmV2aXNpb24sIHRoZW4gaXQncyBhbHNvIGFzc3VtZWQgdG8gYmUgYVxuICAgIC8vIHZlcnNpb25lZCBVUkwuXG4gICAgaWYgKCFyZXZpc2lvbikge1xuICAgICAgICBjb25zdCB1cmxPYmplY3QgPSBuZXcgVVJMKHVybCwgbG9jYXRpb24uaHJlZik7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjYWNoZUtleTogdXJsT2JqZWN0LmhyZWYsXG4gICAgICAgICAgICB1cmw6IHVybE9iamVjdC5ocmVmLFxuICAgICAgICB9O1xuICAgIH1cbiAgICAvLyBPdGhlcndpc2UsIGNvbnN0cnVjdCBhIHByb3Blcmx5IHZlcnNpb25lZCBVUkwgdXNpbmcgdGhlIGN1c3RvbSBXb3JrYm94XG4gICAgLy8gc2VhcmNoIHBhcmFtZXRlciBhbG9uZyB3aXRoIHRoZSByZXZpc2lvbiBpbmZvLlxuICAgIGNvbnN0IGNhY2hlS2V5VVJMID0gbmV3IFVSTCh1cmwsIGxvY2F0aW9uLmhyZWYpO1xuICAgIGNvbnN0IG9yaWdpbmFsVVJMID0gbmV3IFVSTCh1cmwsIGxvY2F0aW9uLmhyZWYpO1xuICAgIGNhY2hlS2V5VVJMLnNlYXJjaFBhcmFtcy5zZXQoUkVWSVNJT05fU0VBUkNIX1BBUkFNLCByZXZpc2lvbik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY2FjaGVLZXk6IGNhY2hlS2V5VVJMLmhyZWYsXG4gICAgICAgIHVybDogb3JpZ2luYWxVUkwuaHJlZixcbiAgICB9O1xufVxuIiwiLypcbiAgQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0ICcuLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIEEgcGx1Z2luLCBkZXNpZ25lZCB0byBiZSB1c2VkIHdpdGggUHJlY2FjaGVDb250cm9sbGVyLCB0byBkZXRlcm1pbmUgdGhlXG4gKiBvZiBhc3NldHMgdGhhdCB3ZXJlIHVwZGF0ZWQgKG9yIG5vdCB1cGRhdGVkKSBkdXJpbmcgdGhlIGluc3RhbGwgZXZlbnQuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgUHJlY2FjaGVJbnN0YWxsUmVwb3J0UGx1Z2luIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy51cGRhdGVkVVJMcyA9IFtdO1xuICAgICAgICB0aGlzLm5vdFVwZGF0ZWRVUkxzID0gW107XG4gICAgICAgIHRoaXMuaGFuZGxlcldpbGxTdGFydCA9IGFzeW5jICh7IHJlcXVlc3QsIHN0YXRlLCB9KSA9PiB7XG4gICAgICAgICAgICAvLyBUT0RPOiBgc3RhdGVgIHNob3VsZCBuZXZlciBiZSB1bmRlZmluZWQuLi5cbiAgICAgICAgICAgIGlmIChzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLm9yaWdpbmFsUmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2FjaGVkUmVzcG9uc2VXaWxsQmVVc2VkID0gYXN5bmMgKHsgZXZlbnQsIHN0YXRlLCBjYWNoZWRSZXNwb25zZSwgfSkgPT4ge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdpbnN0YWxsJykge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSAmJlxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5vcmlnaW5hbFJlcXVlc3QgJiZcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUub3JpZ2luYWxSZXF1ZXN0IGluc3RhbmNlb2YgUmVxdWVzdCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiBgc3RhdGVgIHNob3VsZCBuZXZlciBiZSB1bmRlZmluZWQuLi5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXJsID0gc3RhdGUub3JpZ2luYWxSZXF1ZXN0LnVybDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlZFJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vdFVwZGF0ZWRVUkxzLnB1c2godXJsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlZFVSTHMucHVzaCh1cmwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFJlc3BvbnNlO1xuICAgICAgICB9O1xuICAgIH1cbn1cbmV4cG9ydCB7IFByZWNhY2hlSW5zdGFsbFJlcG9ydFBsdWdpbiB9O1xuIiwiLypcbiAgQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0ICcuLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIEEgcGx1Z2luLCBkZXNpZ25lZCB0byBiZSB1c2VkIHdpdGggUHJlY2FjaGVDb250cm9sbGVyLCB0byB0cmFuc2xhdGUgVVJMcyBpbnRvXG4gKiB0aGUgY29ycmVzcG9uZGluZyBjYWNoZSBrZXksIGJhc2VkIG9uIHRoZSBjdXJyZW50IHJldmlzaW9uIGluZm8uXG4gKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgUHJlY2FjaGVDYWNoZUtleVBsdWdpbiB7XG4gICAgY29uc3RydWN0b3IoeyBwcmVjYWNoZUNvbnRyb2xsZXIgfSkge1xuICAgICAgICB0aGlzLmNhY2hlS2V5V2lsbEJlVXNlZCA9IGFzeW5jICh7IHJlcXVlc3QsIHBhcmFtcywgfSkgPT4ge1xuICAgICAgICAgICAgLy8gUGFyYW1zIGlzIHR5cGUgYW55LCBjYW4ndCBjaGFuZ2UgcmlnaHQgbm93LlxuICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUgKi9cbiAgICAgICAgICAgIGNvbnN0IGNhY2hlS2V5ID0gKHBhcmFtcyA9PT0gbnVsbCB8fCBwYXJhbXMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHBhcmFtcy5jYWNoZUtleSkgfHxcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmVjYWNoZUNvbnRyb2xsZXIuZ2V0Q2FjaGVLZXlGb3JVUkwocmVxdWVzdC51cmwpO1xuICAgICAgICAgICAgLyogZXNsaW50LWVuYWJsZSAqL1xuICAgICAgICAgICAgcmV0dXJuIGNhY2hlS2V5XG4gICAgICAgICAgICAgICAgPyBuZXcgUmVxdWVzdChjYWNoZUtleSwgeyBoZWFkZXJzOiByZXF1ZXN0LmhlYWRlcnMgfSlcbiAgICAgICAgICAgICAgICA6IHJlcXVlc3Q7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX3ByZWNhY2hlQ29udHJvbGxlciA9IHByZWNhY2hlQ29udHJvbGxlcjtcbiAgICB9XG59XG5leHBvcnQgeyBQcmVjYWNoZUNhY2hlS2V5UGx1Z2luIH07XG4iLCIvKlxuICBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG5cbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgJy4uL192ZXJzaW9uLmpzJztcbmxldCBzdXBwb3J0U3RhdHVzO1xuLyoqXG4gKiBBIHV0aWxpdHkgZnVuY3Rpb24gdGhhdCBkZXRlcm1pbmVzIHdoZXRoZXIgdGhlIGN1cnJlbnQgYnJvd3NlciBzdXBwb3J0c1xuICogY29uc3RydWN0aW5nIGEgbmV3IGBSZXNwb25zZWAgZnJvbSBhIGByZXNwb25zZS5ib2R5YCBzdHJlYW0uXG4gKlxuICogQHJldHVybiB7Ym9vbGVhbn0gYHRydWVgLCBpZiB0aGUgY3VycmVudCBicm93c2VyIGNhbiBzdWNjZXNzZnVsbHlcbiAqICAgICBjb25zdHJ1Y3QgYSBgUmVzcG9uc2VgIGZyb20gYSBgcmVzcG9uc2UuYm9keWAgc3RyZWFtLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBjYW5Db25zdHJ1Y3RSZXNwb25zZUZyb21Cb2R5U3RyZWFtKCkge1xuICAgIGlmIChzdXBwb3J0U3RhdHVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgdGVzdFJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKCcnKTtcbiAgICAgICAgaWYgKCdib2R5JyBpbiB0ZXN0UmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbmV3IFJlc3BvbnNlKHRlc3RSZXNwb25zZS5ib2R5KTtcbiAgICAgICAgICAgICAgICBzdXBwb3J0U3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHN1cHBvcnRTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzdXBwb3J0U3RhdHVzID0gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBzdXBwb3J0U3RhdHVzO1xufVxuZXhwb3J0IHsgY2FuQ29uc3RydWN0UmVzcG9uc2VGcm9tQm9keVN0cmVhbSB9O1xuIiwiLypcbiAgQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0IHsgY2FuQ29uc3RydWN0UmVzcG9uc2VGcm9tQm9keVN0cmVhbSB9IGZyb20gJy4vX3ByaXZhdGUvY2FuQ29uc3RydWN0UmVzcG9uc2VGcm9tQm9keVN0cmVhbS5qcyc7XG5pbXBvcnQgeyBXb3JrYm94RXJyb3IgfSBmcm9tICcuL19wcml2YXRlL1dvcmtib3hFcnJvci5qcyc7XG5pbXBvcnQgJy4vX3ZlcnNpb24uanMnO1xuLyoqXG4gKiBBbGxvd3MgZGV2ZWxvcGVycyB0byBjb3B5IGEgcmVzcG9uc2UgYW5kIG1vZGlmeSBpdHMgYGhlYWRlcnNgLCBgc3RhdHVzYCxcbiAqIG9yIGBzdGF0dXNUZXh0YCB2YWx1ZXMgKHRoZSB2YWx1ZXMgc2V0dGFibGUgdmlhIGFcbiAqIFtgUmVzcG9uc2VJbml0YF17QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1Jlc3BvbnNlL1Jlc3BvbnNlI1N5bnRheH1cbiAqIG9iamVjdCBpbiB0aGUgY29uc3RydWN0b3IpLlxuICogVG8gbW9kaWZ5IHRoZXNlIHZhbHVlcywgcGFzcyBhIGZ1bmN0aW9uIGFzIHRoZSBzZWNvbmQgYXJndW1lbnQuIFRoYXRcbiAqIGZ1bmN0aW9uIHdpbGwgYmUgaW52b2tlZCB3aXRoIGEgc2luZ2xlIG9iamVjdCB3aXRoIHRoZSByZXNwb25zZSBwcm9wZXJ0aWVzXG4gKiBge2hlYWRlcnMsIHN0YXR1cywgc3RhdHVzVGV4dH1gLiBUaGUgcmV0dXJuIHZhbHVlIG9mIHRoaXMgZnVuY3Rpb24gd2lsbFxuICogYmUgdXNlZCBhcyB0aGUgYFJlc3BvbnNlSW5pdGAgZm9yIHRoZSBuZXcgYFJlc3BvbnNlYC4gVG8gY2hhbmdlIHRoZSB2YWx1ZXNcbiAqIGVpdGhlciBtb2RpZnkgdGhlIHBhc3NlZCBwYXJhbWV0ZXIocykgYW5kIHJldHVybiBpdCwgb3IgcmV0dXJuIGEgdG90YWxseVxuICogbmV3IG9iamVjdC5cbiAqXG4gKiBUaGlzIG1ldGhvZCBpcyBpbnRlbnRpb25hbGx5IGxpbWl0ZWQgdG8gc2FtZS1vcmlnaW4gcmVzcG9uc2VzLCByZWdhcmRsZXNzIG9mXG4gKiB3aGV0aGVyIENPUlMgd2FzIHVzZWQgb3Igbm90LlxuICpcbiAqIEBwYXJhbSB7UmVzcG9uc2V9IHJlc3BvbnNlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBtb2RpZmllclxuICogQG1lbWJlcm9mIHdvcmtib3gtY29yZVxuICovXG5hc3luYyBmdW5jdGlvbiBjb3B5UmVzcG9uc2UocmVzcG9uc2UsIG1vZGlmaWVyKSB7XG4gICAgbGV0IG9yaWdpbiA9IG51bGw7XG4gICAgLy8gSWYgcmVzcG9uc2UudXJsIGlzbid0IHNldCwgYXNzdW1lIGl0J3MgY3Jvc3Mtb3JpZ2luIGFuZCBrZWVwIG9yaWdpbiBudWxsLlxuICAgIGlmIChyZXNwb25zZS51cmwpIHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2VVUkwgPSBuZXcgVVJMKHJlc3BvbnNlLnVybCk7XG4gICAgICAgIG9yaWdpbiA9IHJlc3BvbnNlVVJMLm9yaWdpbjtcbiAgICB9XG4gICAgaWYgKG9yaWdpbiAhPT0gc2VsZi5sb2NhdGlvbi5vcmlnaW4pIHtcbiAgICAgICAgdGhyb3cgbmV3IFdvcmtib3hFcnJvcignY3Jvc3Mtb3JpZ2luLWNvcHktcmVzcG9uc2UnLCB7IG9yaWdpbiB9KTtcbiAgICB9XG4gICAgY29uc3QgY2xvbmVkUmVzcG9uc2UgPSByZXNwb25zZS5jbG9uZSgpO1xuICAgIC8vIENyZWF0ZSBhIGZyZXNoIGBSZXNwb25zZUluaXRgIG9iamVjdCBieSBjbG9uaW5nIHRoZSBoZWFkZXJzLlxuICAgIGNvbnN0IHJlc3BvbnNlSW5pdCA9IHtcbiAgICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnMoY2xvbmVkUmVzcG9uc2UuaGVhZGVycyksXG4gICAgICAgIHN0YXR1czogY2xvbmVkUmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiBjbG9uZWRSZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgIH07XG4gICAgLy8gQXBwbHkgYW55IHVzZXIgbW9kaWZpY2F0aW9ucy5cbiAgICBjb25zdCBtb2RpZmllZFJlc3BvbnNlSW5pdCA9IG1vZGlmaWVyID8gbW9kaWZpZXIocmVzcG9uc2VJbml0KSA6IHJlc3BvbnNlSW5pdDtcbiAgICAvLyBDcmVhdGUgdGhlIG5ldyByZXNwb25zZSBmcm9tIHRoZSBib2R5IHN0cmVhbSBhbmQgYFJlc3BvbnNlSW5pdGBcbiAgICAvLyBtb2RpZmljYXRpb25zLiBOb3RlOiBub3QgYWxsIGJyb3dzZXJzIHN1cHBvcnQgdGhlIFJlc3BvbnNlLmJvZHkgc3RyZWFtLFxuICAgIC8vIHNvIGZhbGwgYmFjayB0byByZWFkaW5nIHRoZSBlbnRpcmUgYm9keSBpbnRvIG1lbW9yeSBhcyBhIGJsb2IuXG4gICAgY29uc3QgYm9keSA9IGNhbkNvbnN0cnVjdFJlc3BvbnNlRnJvbUJvZHlTdHJlYW0oKVxuICAgICAgICA/IGNsb25lZFJlc3BvbnNlLmJvZHlcbiAgICAgICAgOiBhd2FpdCBjbG9uZWRSZXNwb25zZS5ibG9iKCk7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShib2R5LCBtb2RpZmllZFJlc3BvbnNlSW5pdCk7XG59XG5leHBvcnQgeyBjb3B5UmVzcG9uc2UgfTtcbiIsIi8qXG4gIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCAnLi4vX3ZlcnNpb24uanMnO1xuY29uc3QgZ2V0RnJpZW5kbHlVUkwgPSAodXJsKSA9PiB7XG4gICAgY29uc3QgdXJsT2JqID0gbmV3IFVSTChTdHJpbmcodXJsKSwgbG9jYXRpb24uaHJlZik7XG4gICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9Hb29nbGVDaHJvbWUvd29ya2JveC9pc3N1ZXMvMjMyM1xuICAgIC8vIFdlIHdhbnQgdG8gaW5jbHVkZSBldmVyeXRoaW5nLCBleGNlcHQgZm9yIHRoZSBvcmlnaW4gaWYgaXQncyBzYW1lLW9yaWdpbi5cbiAgICByZXR1cm4gdXJsT2JqLmhyZWYucmVwbGFjZShuZXcgUmVnRXhwKGBeJHtsb2NhdGlvbi5vcmlnaW59YCksICcnKTtcbn07XG5leHBvcnQgeyBnZXRGcmllbmRseVVSTCB9O1xuIiwiLypcbiAgQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCAnLi4vX3ZlcnNpb24uanMnO1xuZnVuY3Rpb24gc3RyaXBQYXJhbXMoZnVsbFVSTCwgaWdub3JlUGFyYW1zKSB7XG4gICAgY29uc3Qgc3RyaXBwZWRVUkwgPSBuZXcgVVJMKGZ1bGxVUkwpO1xuICAgIGZvciAoY29uc3QgcGFyYW0gb2YgaWdub3JlUGFyYW1zKSB7XG4gICAgICAgIHN0cmlwcGVkVVJMLnNlYXJjaFBhcmFtcy5kZWxldGUocGFyYW0pO1xuICAgIH1cbiAgICByZXR1cm4gc3RyaXBwZWRVUkwuaHJlZjtcbn1cbi8qKlxuICogTWF0Y2hlcyBhbiBpdGVtIGluIHRoZSBjYWNoZSwgaWdub3Jpbmcgc3BlY2lmaWMgVVJMIHBhcmFtcy4gVGhpcyBpcyBzaW1pbGFyXG4gKiB0byB0aGUgYGlnbm9yZVNlYXJjaGAgb3B0aW9uLCBidXQgaXQgYWxsb3dzIHlvdSB0byBpZ25vcmUganVzdCBzcGVjaWZpY1xuICogcGFyYW1zICh3aGlsZSBjb250aW51aW5nIHRvIG1hdGNoIG9uIHRoZSBvdGhlcnMpLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0NhY2hlfSBjYWNoZVxuICogQHBhcmFtIHtSZXF1ZXN0fSByZXF1ZXN0XG4gKiBAcGFyYW0ge09iamVjdH0gbWF0Y2hPcHRpb25zXG4gKiBAcGFyYW0ge0FycmF5PHN0cmluZz59IGlnbm9yZVBhcmFtc1xuICogQHJldHVybiB7UHJvbWlzZTxSZXNwb25zZXx1bmRlZmluZWQ+fVxuICovXG5hc3luYyBmdW5jdGlvbiBjYWNoZU1hdGNoSWdub3JlUGFyYW1zKGNhY2hlLCByZXF1ZXN0LCBpZ25vcmVQYXJhbXMsIG1hdGNoT3B0aW9ucykge1xuICAgIGNvbnN0IHN0cmlwcGVkUmVxdWVzdFVSTCA9IHN0cmlwUGFyYW1zKHJlcXVlc3QudXJsLCBpZ25vcmVQYXJhbXMpO1xuICAgIC8vIElmIHRoZSByZXF1ZXN0IGRvZXNuJ3QgaW5jbHVkZSBhbnkgaWdub3JlZCBwYXJhbXMsIG1hdGNoIGFzIG5vcm1hbC5cbiAgICBpZiAocmVxdWVzdC51cmwgPT09IHN0cmlwcGVkUmVxdWVzdFVSTCkge1xuICAgICAgICByZXR1cm4gY2FjaGUubWF0Y2gocmVxdWVzdCwgbWF0Y2hPcHRpb25zKTtcbiAgICB9XG4gICAgLy8gT3RoZXJ3aXNlLCBtYXRjaCBieSBjb21wYXJpbmcga2V5c1xuICAgIGNvbnN0IGtleXNPcHRpb25zID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBtYXRjaE9wdGlvbnMpLCB7IGlnbm9yZVNlYXJjaDogdHJ1ZSB9KTtcbiAgICBjb25zdCBjYWNoZUtleXMgPSBhd2FpdCBjYWNoZS5rZXlzKHJlcXVlc3QsIGtleXNPcHRpb25zKTtcbiAgICBmb3IgKGNvbnN0IGNhY2hlS2V5IG9mIGNhY2hlS2V5cykge1xuICAgICAgICBjb25zdCBzdHJpcHBlZENhY2hlS2V5VVJMID0gc3RyaXBQYXJhbXMoY2FjaGVLZXkudXJsLCBpZ25vcmVQYXJhbXMpO1xuICAgICAgICBpZiAoc3RyaXBwZWRSZXF1ZXN0VVJMID09PSBzdHJpcHBlZENhY2hlS2V5VVJMKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FjaGUubWF0Y2goY2FjaGVLZXksIG1hdGNoT3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuO1xufVxuZXhwb3J0IHsgY2FjaGVNYXRjaElnbm9yZVBhcmFtcyB9O1xuIiwiLypcbiAgQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0ICcuLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIFRoZSBEZWZlcnJlZCBjbGFzcyBjb21wb3NlcyBQcm9taXNlcyBpbiBhIHdheSB0aGF0IGFsbG93cyBmb3IgdGhlbSB0byBiZVxuICogcmVzb2x2ZWQgb3IgcmVqZWN0ZWQgZnJvbSBvdXRzaWRlIHRoZSBjb25zdHJ1Y3Rvci4gSW4gbW9zdCBjYXNlcyBwcm9taXNlc1xuICogc2hvdWxkIGJlIHVzZWQgZGlyZWN0bHksIGJ1dCBEZWZlcnJlZHMgY2FuIGJlIG5lY2Vzc2FyeSB3aGVuIHRoZSBsb2dpYyB0b1xuICogcmVzb2x2ZSBhIHByb21pc2UgbXVzdCBiZSBzZXBhcmF0ZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBEZWZlcnJlZCB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHByb21pc2UgYW5kIGV4cG9zZXMgaXRzIHJlc29sdmUgYW5kIHJlamVjdCBmdW5jdGlvbnMgYXMgbWV0aG9kcy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgICAgICAgIHRoaXMucmVqZWN0ID0gcmVqZWN0O1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnQgeyBEZWZlcnJlZCB9O1xuIiwiLypcbiAgQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0ICcuLi9fdmVyc2lvbi5qcyc7XG4vLyBDYWxsYmFja3MgdG8gYmUgZXhlY3V0ZWQgd2hlbmV2ZXIgdGhlcmUncyBhIHF1b3RhIGVycm9yLlxuLy8gQ2FuJ3QgY2hhbmdlIEZ1bmN0aW9uIHR5cGUgcmlnaHQgbm93LlxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHlwZXNcbmNvbnN0IHF1b3RhRXJyb3JDYWxsYmFja3MgPSBuZXcgU2V0KCk7XG5leHBvcnQgeyBxdW90YUVycm9yQ2FsbGJhY2tzIH07XG4iLCIvKlxuICBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDXG5cbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuLi9fcHJpdmF0ZS9sb2dnZXIuanMnO1xuaW1wb3J0IHsgcXVvdGFFcnJvckNhbGxiYWNrcyB9IGZyb20gJy4uL21vZGVscy9xdW90YUVycm9yQ2FsbGJhY2tzLmpzJztcbmltcG9ydCAnLi4vX3ZlcnNpb24uanMnO1xuLyoqXG4gKiBSdW5zIGFsbCBvZiB0aGUgY2FsbGJhY2sgZnVuY3Rpb25zLCBvbmUgYXQgYSB0aW1lIHNlcXVlbnRpYWxseSwgaW4gdGhlIG9yZGVyXG4gKiBpbiB3aGljaCB0aGV5IHdlcmUgcmVnaXN0ZXJlZC5cbiAqXG4gKiBAbWVtYmVyb2Ygd29ya2JveC1jb3JlXG4gKiBAcHJpdmF0ZVxuICovXG5hc3luYyBmdW5jdGlvbiBleGVjdXRlUXVvdGFFcnJvckNhbGxiYWNrcygpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICBsb2dnZXIubG9nKGBBYm91dCB0byBydW4gJHtxdW90YUVycm9yQ2FsbGJhY2tzLnNpemV9IGAgK1xuICAgICAgICAgICAgYGNhbGxiYWNrcyB0byBjbGVhbiB1cCBjYWNoZXMuYCk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgY2FsbGJhY2sgb2YgcXVvdGFFcnJvckNhbGxiYWNrcykge1xuICAgICAgICBhd2FpdCBjYWxsYmFjaygpO1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgbG9nZ2VyLmxvZyhjYWxsYmFjaywgJ2lzIGNvbXBsZXRlLicpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIGxvZ2dlci5sb2coJ0ZpbmlzaGVkIHJ1bm5pbmcgY2FsbGJhY2tzLicpO1xuICAgIH1cbn1cbmV4cG9ydCB7IGV4ZWN1dGVRdW90YUVycm9yQ2FsbGJhY2tzIH07XG4iLCIvKlxuICBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0ICcuLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgYW5kIHRoZSBwYXNzZWQgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcy5cbiAqIFRoaXMgdXRpbGl0eSBpcyBhbiBhc3luYy9hd2FpdC1mcmllbmRseSB2ZXJzaW9uIG9mIGBzZXRUaW1lb3V0YC5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbXNcbiAqIEByZXR1cm4ge1Byb21pc2V9XG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGltZW91dChtcykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBAdHMtaWdub3JlXG50cnkge1xuICAgIHNlbGZbJ3dvcmtib3g6c3RyYXRlZ2llczo2LjUuMyddICYmIF8oKTtcbn1cbmNhdGNoIChlKSB7IH1cbiIsIi8qXG4gIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9hc3NlcnQuanMnO1xuaW1wb3J0IHsgY2FjaGVNYXRjaElnbm9yZVBhcmFtcyB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9jYWNoZU1hdGNoSWdub3JlUGFyYW1zLmpzJztcbmltcG9ydCB7IERlZmVycmVkIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL0RlZmVycmVkLmpzJztcbmltcG9ydCB7IGV4ZWN1dGVRdW90YUVycm9yQ2FsbGJhY2tzIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL2V4ZWN1dGVRdW90YUVycm9yQ2FsbGJhY2tzLmpzJztcbmltcG9ydCB7IGdldEZyaWVuZGx5VVJMIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL2dldEZyaWVuZGx5VVJMLmpzJztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9sb2dnZXIuanMnO1xuaW1wb3J0IHsgdGltZW91dCB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS90aW1lb3V0LmpzJztcbmltcG9ydCB7IFdvcmtib3hFcnJvciB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9Xb3JrYm94RXJyb3IuanMnO1xuaW1wb3J0ICcuL192ZXJzaW9uLmpzJztcbmZ1bmN0aW9uIHRvUmVxdWVzdChpbnB1dCkge1xuICAgIHJldHVybiB0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnID8gbmV3IFJlcXVlc3QoaW5wdXQpIDogaW5wdXQ7XG59XG4vKipcbiAqIEEgY2xhc3MgY3JlYXRlZCBldmVyeSB0aW1lIGEgU3RyYXRlZ3kgaW5zdGFuY2UgaW5zdGFuY2UgY2FsbHNcbiAqIHtAbGluayB3b3JrYm94LXN0cmF0ZWdpZXMuU3RyYXRlZ3l+aGFuZGxlfSBvclxuICoge0BsaW5rIHdvcmtib3gtc3RyYXRlZ2llcy5TdHJhdGVneX5oYW5kbGVBbGx9IHRoYXQgd3JhcHMgYWxsIGZldGNoIGFuZFxuICogY2FjaGUgYWN0aW9ucyBhcm91bmQgcGx1Z2luIGNhbGxiYWNrcyBhbmQga2VlcHMgdHJhY2sgb2Ygd2hlbiB0aGUgc3RyYXRlZ3lcbiAqIGlzIFwiZG9uZVwiIChpLmUuIGFsbCBhZGRlZCBgZXZlbnQud2FpdFVudGlsKClgIHByb21pc2VzIGhhdmUgcmVzb2x2ZWQpLlxuICpcbiAqIEBtZW1iZXJvZiB3b3JrYm94LXN0cmF0ZWdpZXNcbiAqL1xuY2xhc3MgU3RyYXRlZ3lIYW5kbGVyIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIGFzc29jaWF0ZWQgd2l0aCB0aGUgcGFzc2VkIHN0cmF0ZWd5IGFuZCBldmVudFxuICAgICAqIHRoYXQncyBoYW5kbGluZyB0aGUgcmVxdWVzdC5cbiAgICAgKlxuICAgICAqIFRoZSBjb25zdHJ1Y3RvciBhbHNvIGluaXRpYWxpemVzIHRoZSBzdGF0ZSB0aGF0IHdpbGwgYmUgcGFzc2VkIHRvIGVhY2ggb2ZcbiAgICAgKiB0aGUgcGx1Z2lucyBoYW5kbGluZyB0aGlzIHJlcXVlc3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3dvcmtib3gtc3RyYXRlZ2llcy5TdHJhdGVneX0gc3RyYXRlZ3lcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgICAqIEBwYXJhbSB7UmVxdWVzdHxzdHJpbmd9IG9wdGlvbnMucmVxdWVzdCBBIHJlcXVlc3QgdG8gcnVuIHRoaXMgc3RyYXRlZ3kgZm9yLlxuICAgICAqIEBwYXJhbSB7RXh0ZW5kYWJsZUV2ZW50fSBvcHRpb25zLmV2ZW50IFRoZSBldmVudCBhc3NvY2lhdGVkIHdpdGggdGhlXG4gICAgICogICAgIHJlcXVlc3QuXG4gICAgICogQHBhcmFtIHtVUkx9IFtvcHRpb25zLnVybF1cbiAgICAgKiBAcGFyYW0geyp9IFtvcHRpb25zLnBhcmFtc10gVGhlIHJldHVybiB2YWx1ZSBmcm9tIHRoZVxuICAgICAqICAgICB7QGxpbmsgd29ya2JveC1yb3V0aW5nfm1hdGNoQ2FsbGJhY2t9IChpZiBhcHBsaWNhYmxlKS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzdHJhdGVneSwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLl9jYWNoZUtleXMgPSB7fTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSByZXF1ZXN0IHRoZSBzdHJhdGVneSBpcyBwZXJmb3JtaW5nIChwYXNzZWQgdG8gdGhlIHN0cmF0ZWd5J3NcbiAgICAgICAgICogYGhhbmRsZSgpYCBvciBgaGFuZGxlQWxsKClgIG1ldGhvZCkuXG4gICAgICAgICAqIEBuYW1lIHJlcXVlc3RcbiAgICAgICAgICogQGluc3RhbmNlXG4gICAgICAgICAqIEB0eXBlIHtSZXF1ZXN0fVxuICAgICAgICAgKiBAbWVtYmVyb2Ygd29ya2JveC1zdHJhdGVnaWVzLlN0cmF0ZWd5SGFuZGxlclxuICAgICAgICAgKi9cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBldmVudCBhc3NvY2lhdGVkIHdpdGggdGhpcyByZXF1ZXN0LlxuICAgICAgICAgKiBAbmFtZSBldmVudFxuICAgICAgICAgKiBAaW5zdGFuY2VcbiAgICAgICAgICogQHR5cGUge0V4dGVuZGFibGVFdmVudH1cbiAgICAgICAgICogQG1lbWJlcm9mIHdvcmtib3gtc3RyYXRlZ2llcy5TdHJhdGVneUhhbmRsZXJcbiAgICAgICAgICovXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGBVUkxgIGluc3RhbmNlIG9mIGByZXF1ZXN0LnVybGAgKGlmIHBhc3NlZCB0byB0aGUgc3RyYXRlZ3knc1xuICAgICAgICAgKiBgaGFuZGxlKClgIG9yIGBoYW5kbGVBbGwoKWAgbWV0aG9kKS5cbiAgICAgICAgICogTm90ZTogdGhlIGB1cmxgIHBhcmFtIHdpbGwgYmUgcHJlc2VudCBpZiB0aGUgc3RyYXRlZ3kgd2FzIGludm9rZWRcbiAgICAgICAgICogZnJvbSBhIHdvcmtib3ggYFJvdXRlYCBvYmplY3QuXG4gICAgICAgICAqIEBuYW1lIHVybFxuICAgICAgICAgKiBAaW5zdGFuY2VcbiAgICAgICAgICogQHR5cGUge1VSTHx1bmRlZmluZWR9XG4gICAgICAgICAqIEBtZW1iZXJvZiB3b3JrYm94LXN0cmF0ZWdpZXMuU3RyYXRlZ3lIYW5kbGVyXG4gICAgICAgICAqL1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBgcGFyYW1gIHZhbHVlIChpZiBwYXNzZWQgdG8gdGhlIHN0cmF0ZWd5J3NcbiAgICAgICAgICogYGhhbmRsZSgpYCBvciBgaGFuZGxlQWxsKClgIG1ldGhvZCkuXG4gICAgICAgICAqIE5vdGU6IHRoZSBgcGFyYW1gIHBhcmFtIHdpbGwgYmUgcHJlc2VudCBpZiB0aGUgc3RyYXRlZ3kgd2FzIGludm9rZWRcbiAgICAgICAgICogZnJvbSBhIHdvcmtib3ggYFJvdXRlYCBvYmplY3QgYW5kIHRoZVxuICAgICAgICAgKiB7QGxpbmsgd29ya2JveC1yb3V0aW5nfm1hdGNoQ2FsbGJhY2t9IHJldHVybmVkXG4gICAgICAgICAqIGEgdHJ1dGh5IHZhbHVlIChpdCB3aWxsIGJlIHRoYXQgdmFsdWUpLlxuICAgICAgICAgKiBAbmFtZSBwYXJhbXNcbiAgICAgICAgICogQGluc3RhbmNlXG4gICAgICAgICAqIEB0eXBlIHsqfHVuZGVmaW5lZH1cbiAgICAgICAgICogQG1lbWJlcm9mIHdvcmtib3gtc3RyYXRlZ2llcy5TdHJhdGVneUhhbmRsZXJcbiAgICAgICAgICovXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICBhc3NlcnQuaXNJbnN0YW5jZShvcHRpb25zLmV2ZW50LCBFeHRlbmRhYmxlRXZlbnQsIHtcbiAgICAgICAgICAgICAgICBtb2R1bGVOYW1lOiAnd29ya2JveC1zdHJhdGVnaWVzJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdTdHJhdGVneUhhbmRsZXInLFxuICAgICAgICAgICAgICAgIGZ1bmNOYW1lOiAnY29uc3RydWN0b3InLFxuICAgICAgICAgICAgICAgIHBhcmFtTmFtZTogJ29wdGlvbnMuZXZlbnQnLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5ldmVudCA9IG9wdGlvbnMuZXZlbnQ7XG4gICAgICAgIHRoaXMuX3N0cmF0ZWd5ID0gc3RyYXRlZ3k7XG4gICAgICAgIHRoaXMuX2hhbmRsZXJEZWZlcnJlZCA9IG5ldyBEZWZlcnJlZCgpO1xuICAgICAgICB0aGlzLl9leHRlbmRMaWZldGltZVByb21pc2VzID0gW107XG4gICAgICAgIC8vIENvcHkgdGhlIHBsdWdpbnMgbGlzdCAoc2luY2UgaXQncyBtdXRhYmxlIG9uIHRoZSBzdHJhdGVneSksXG4gICAgICAgIC8vIHNvIGFueSBtdXRhdGlvbnMgZG9uJ3QgYWZmZWN0IHRoaXMgaGFuZGxlciBpbnN0YW5jZS5cbiAgICAgICAgdGhpcy5fcGx1Z2lucyA9IFsuLi5zdHJhdGVneS5wbHVnaW5zXTtcbiAgICAgICAgdGhpcy5fcGx1Z2luU3RhdGVNYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIGZvciAoY29uc3QgcGx1Z2luIG9mIHRoaXMuX3BsdWdpbnMpIHtcbiAgICAgICAgICAgIHRoaXMuX3BsdWdpblN0YXRlTWFwLnNldChwbHVnaW4sIHt9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmV2ZW50LndhaXRVbnRpbCh0aGlzLl9oYW5kbGVyRGVmZXJyZWQucHJvbWlzZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZldGNoZXMgYSBnaXZlbiByZXF1ZXN0IChhbmQgaW52b2tlcyBhbnkgYXBwbGljYWJsZSBwbHVnaW4gY2FsbGJhY2tcbiAgICAgKiBtZXRob2RzKSB1c2luZyB0aGUgYGZldGNoT3B0aW9uc2AgKGZvciBub24tbmF2aWdhdGlvbiByZXF1ZXN0cykgYW5kXG4gICAgICogYHBsdWdpbnNgIGRlZmluZWQgb24gdGhlIGBTdHJhdGVneWAgb2JqZWN0LlxuICAgICAqXG4gICAgICogVGhlIGZvbGxvd2luZyBwbHVnaW4gbGlmZWN5Y2xlIG1ldGhvZHMgYXJlIGludm9rZWQgd2hlbiB1c2luZyB0aGlzIG1ldGhvZDpcbiAgICAgKiAtIGByZXF1ZXN0V2lsbEZldGNoKClgXG4gICAgICogLSBgZmV0Y2hEaWRTdWNjZWVkKClgXG4gICAgICogLSBgZmV0Y2hEaWRGYWlsKClgXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlcXVlc3R8c3RyaW5nfSBpbnB1dCBUaGUgVVJMIG9yIHJlcXVlc3QgdG8gZmV0Y2guXG4gICAgICogQHJldHVybiB7UHJvbWlzZTxSZXNwb25zZT59XG4gICAgICovXG4gICAgYXN5bmMgZmV0Y2goaW5wdXQpIHtcbiAgICAgICAgY29uc3QgeyBldmVudCB9ID0gdGhpcztcbiAgICAgICAgbGV0IHJlcXVlc3QgPSB0b1JlcXVlc3QoaW5wdXQpO1xuICAgICAgICBpZiAocmVxdWVzdC5tb2RlID09PSAnbmF2aWdhdGUnICYmXG4gICAgICAgICAgICBldmVudCBpbnN0YW5jZW9mIEZldGNoRXZlbnQgJiZcbiAgICAgICAgICAgIGV2ZW50LnByZWxvYWRSZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc3QgcG9zc2libGVQcmVsb2FkUmVzcG9uc2UgPSAoYXdhaXQgZXZlbnQucHJlbG9hZFJlc3BvbnNlKTtcbiAgICAgICAgICAgIGlmIChwb3NzaWJsZVByZWxvYWRSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5sb2coYFVzaW5nIGEgcHJlbG9hZGVkIG5hdmlnYXRpb24gcmVzcG9uc2UgZm9yIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYCcke2dldEZyaWVuZGx5VVJMKHJlcXVlc3QudXJsKX0nYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBwb3NzaWJsZVByZWxvYWRSZXNwb25zZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB0aGVyZSBpcyBhIGZldGNoRGlkRmFpbCBwbHVnaW4sIHdlIG5lZWQgdG8gc2F2ZSBhIGNsb25lIG9mIHRoZVxuICAgICAgICAvLyBvcmlnaW5hbCByZXF1ZXN0IGJlZm9yZSBpdCdzIGVpdGhlciBtb2RpZmllZCBieSBhIHJlcXVlc3RXaWxsRmV0Y2hcbiAgICAgICAgLy8gcGx1Z2luIG9yIGJlZm9yZSB0aGUgb3JpZ2luYWwgcmVxdWVzdCdzIGJvZHkgaXMgY29uc3VtZWQgdmlhIGZldGNoKCkuXG4gICAgICAgIGNvbnN0IG9yaWdpbmFsUmVxdWVzdCA9IHRoaXMuaGFzQ2FsbGJhY2soJ2ZldGNoRGlkRmFpbCcpXG4gICAgICAgICAgICA/IHJlcXVlc3QuY2xvbmUoKVxuICAgICAgICAgICAgOiBudWxsO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBjYiBvZiB0aGlzLml0ZXJhdGVDYWxsYmFja3MoJ3JlcXVlc3RXaWxsRmV0Y2gnKSkge1xuICAgICAgICAgICAgICAgIHJlcXVlc3QgPSBhd2FpdCBjYih7IHJlcXVlc3Q6IHJlcXVlc3QuY2xvbmUoKSwgZXZlbnQgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFdvcmtib3hFcnJvcigncGx1Z2luLWVycm9yLXJlcXVlc3Qtd2lsbC1mZXRjaCcsIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3duRXJyb3JNZXNzYWdlOiBlcnIubWVzc2FnZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBUaGUgcmVxdWVzdCBjYW4gYmUgYWx0ZXJlZCBieSBwbHVnaW5zIHdpdGggYHJlcXVlc3RXaWxsRmV0Y2hgIG1ha2luZ1xuICAgICAgICAvLyB0aGUgb3JpZ2luYWwgcmVxdWVzdCAobW9zdCBsaWtlbHkgZnJvbSBhIGBmZXRjaGAgZXZlbnQpIGRpZmZlcmVudFxuICAgICAgICAvLyBmcm9tIHRoZSBSZXF1ZXN0IHdlIG1ha2UuIFBhc3MgYm90aCB0byBgZmV0Y2hEaWRGYWlsYCB0byBhaWQgZGVidWdnaW5nLlxuICAgICAgICBjb25zdCBwbHVnaW5GaWx0ZXJlZFJlcXVlc3QgPSByZXF1ZXN0LmNsb25lKCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgZmV0Y2hSZXNwb25zZTtcbiAgICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vR29vZ2xlQ2hyb21lL3dvcmtib3gvaXNzdWVzLzE3OTZcbiAgICAgICAgICAgIGZldGNoUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0LCByZXF1ZXN0Lm1vZGUgPT09ICduYXZpZ2F0ZScgPyB1bmRlZmluZWQgOiB0aGlzLl9zdHJhdGVneS5mZXRjaE9wdGlvbnMpO1xuICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoYE5ldHdvcmsgcmVxdWVzdCBmb3IgYCArXG4gICAgICAgICAgICAgICAgICAgIGAnJHtnZXRGcmllbmRseVVSTChyZXF1ZXN0LnVybCl9JyByZXR1cm5lZCBhIHJlc3BvbnNlIHdpdGggYCArXG4gICAgICAgICAgICAgICAgICAgIGBzdGF0dXMgJyR7ZmV0Y2hSZXNwb25zZS5zdGF0dXN9Jy5gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3QgY2FsbGJhY2sgb2YgdGhpcy5pdGVyYXRlQ2FsbGJhY2tzKCdmZXRjaERpZFN1Y2NlZWQnKSkge1xuICAgICAgICAgICAgICAgIGZldGNoUmVzcG9uc2UgPSBhd2FpdCBjYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0OiBwbHVnaW5GaWx0ZXJlZFJlcXVlc3QsXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlOiBmZXRjaFJlc3BvbnNlLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZldGNoUmVzcG9uc2U7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5sb2coYE5ldHdvcmsgcmVxdWVzdCBmb3IgYCArXG4gICAgICAgICAgICAgICAgICAgIGAnJHtnZXRGcmllbmRseVVSTChyZXF1ZXN0LnVybCl9JyB0aHJldyBhbiBlcnJvci5gLCBlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBgb3JpZ2luYWxSZXF1ZXN0YCB3aWxsIG9ubHkgZXhpc3QgaWYgYSBgZmV0Y2hEaWRGYWlsYCBjYWxsYmFja1xuICAgICAgICAgICAgLy8gaXMgYmVpbmcgdXNlZCAoc2VlIGFib3ZlKS5cbiAgICAgICAgICAgIGlmIChvcmlnaW5hbFJlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnJ1bkNhbGxiYWNrcygnZmV0Y2hEaWRGYWlsJywge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFJlcXVlc3Q6IG9yaWdpbmFsUmVxdWVzdC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0OiBwbHVnaW5GaWx0ZXJlZFJlcXVlc3QuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbGxzIGB0aGlzLmZldGNoKClgIGFuZCAoaW4gdGhlIGJhY2tncm91bmQpIHJ1bnMgYHRoaXMuY2FjaGVQdXQoKWAgb25cbiAgICAgKiB0aGUgcmVzcG9uc2UgZ2VuZXJhdGVkIGJ5IGB0aGlzLmZldGNoKClgLlxuICAgICAqXG4gICAgICogVGhlIGNhbGwgdG8gYHRoaXMuY2FjaGVQdXQoKWAgYXV0b21hdGljYWxseSBpbnZva2VzIGB0aGlzLndhaXRVbnRpbCgpYCxcbiAgICAgKiBzbyB5b3UgZG8gbm90IGhhdmUgdG8gbWFudWFsbHkgY2FsbCBgd2FpdFVudGlsKClgIG9uIHRoZSBldmVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVxdWVzdHxzdHJpbmd9IGlucHV0IFRoZSByZXF1ZXN0IG9yIFVSTCB0byBmZXRjaCBhbmQgY2FjaGUuXG4gICAgICogQHJldHVybiB7UHJvbWlzZTxSZXNwb25zZT59XG4gICAgICovXG4gICAgYXN5bmMgZmV0Y2hBbmRDYWNoZVB1dChpbnB1dCkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuZmV0Y2goaW5wdXQpO1xuICAgICAgICBjb25zdCByZXNwb25zZUNsb25lID0gcmVzcG9uc2UuY2xvbmUoKTtcbiAgICAgICAgdm9pZCB0aGlzLndhaXRVbnRpbCh0aGlzLmNhY2hlUHV0KGlucHV0LCByZXNwb25zZUNsb25lKSk7XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTWF0Y2hlcyBhIHJlcXVlc3QgZnJvbSB0aGUgY2FjaGUgKGFuZCBpbnZva2VzIGFueSBhcHBsaWNhYmxlIHBsdWdpblxuICAgICAqIGNhbGxiYWNrIG1ldGhvZHMpIHVzaW5nIHRoZSBgY2FjaGVOYW1lYCwgYG1hdGNoT3B0aW9uc2AsIGFuZCBgcGx1Z2luc2BcbiAgICAgKiBkZWZpbmVkIG9uIHRoZSBzdHJhdGVneSBvYmplY3QuXG4gICAgICpcbiAgICAgKiBUaGUgZm9sbG93aW5nIHBsdWdpbiBsaWZlY3ljbGUgbWV0aG9kcyBhcmUgaW52b2tlZCB3aGVuIHVzaW5nIHRoaXMgbWV0aG9kOlxuICAgICAqIC0gY2FjaGVLZXlXaWxsQnlVc2VkKClcbiAgICAgKiAtIGNhY2hlZFJlc3BvbnNlV2lsbEJ5VXNlZCgpXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlcXVlc3R8c3RyaW5nfSBrZXkgVGhlIFJlcXVlc3Qgb3IgVVJMIHRvIHVzZSBhcyB0aGUgY2FjaGUga2V5LlxuICAgICAqIEByZXR1cm4ge1Byb21pc2U8UmVzcG9uc2V8dW5kZWZpbmVkPn0gQSBtYXRjaGluZyByZXNwb25zZSwgaWYgZm91bmQuXG4gICAgICovXG4gICAgYXN5bmMgY2FjaGVNYXRjaChrZXkpIHtcbiAgICAgICAgY29uc3QgcmVxdWVzdCA9IHRvUmVxdWVzdChrZXkpO1xuICAgICAgICBsZXQgY2FjaGVkUmVzcG9uc2U7XG4gICAgICAgIGNvbnN0IHsgY2FjaGVOYW1lLCBtYXRjaE9wdGlvbnMgfSA9IHRoaXMuX3N0cmF0ZWd5O1xuICAgICAgICBjb25zdCBlZmZlY3RpdmVSZXF1ZXN0ID0gYXdhaXQgdGhpcy5nZXRDYWNoZUtleShyZXF1ZXN0LCAncmVhZCcpO1xuICAgICAgICBjb25zdCBtdWx0aU1hdGNoT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgbWF0Y2hPcHRpb25zKSwgeyBjYWNoZU5hbWUgfSk7XG4gICAgICAgIGNhY2hlZFJlc3BvbnNlID0gYXdhaXQgY2FjaGVzLm1hdGNoKGVmZmVjdGl2ZVJlcXVlc3QsIG11bHRpTWF0Y2hPcHRpb25zKTtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgIGlmIChjYWNoZWRSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZyhgRm91bmQgYSBjYWNoZWQgcmVzcG9uc2UgaW4gJyR7Y2FjaGVOYW1lfScuYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoYE5vIGNhY2hlZCByZXNwb25zZSBmb3VuZCBpbiAnJHtjYWNoZU5hbWV9Jy5gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGNhbGxiYWNrIG9mIHRoaXMuaXRlcmF0ZUNhbGxiYWNrcygnY2FjaGVkUmVzcG9uc2VXaWxsQmVVc2VkJykpIHtcbiAgICAgICAgICAgIGNhY2hlZFJlc3BvbnNlID1cbiAgICAgICAgICAgICAgICAoYXdhaXQgY2FsbGJhY2soe1xuICAgICAgICAgICAgICAgICAgICBjYWNoZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoT3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgY2FjaGVkUmVzcG9uc2UsXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3Q6IGVmZmVjdGl2ZVJlcXVlc3QsXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50OiB0aGlzLmV2ZW50LFxuICAgICAgICAgICAgICAgIH0pKSB8fCB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhY2hlZFJlc3BvbnNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQdXRzIGEgcmVxdWVzdC9yZXNwb25zZSBwYWlyIGluIHRoZSBjYWNoZSAoYW5kIGludm9rZXMgYW55IGFwcGxpY2FibGVcbiAgICAgKiBwbHVnaW4gY2FsbGJhY2sgbWV0aG9kcykgdXNpbmcgdGhlIGBjYWNoZU5hbWVgIGFuZCBgcGx1Z2luc2AgZGVmaW5lZCBvblxuICAgICAqIHRoZSBzdHJhdGVneSBvYmplY3QuXG4gICAgICpcbiAgICAgKiBUaGUgZm9sbG93aW5nIHBsdWdpbiBsaWZlY3ljbGUgbWV0aG9kcyBhcmUgaW52b2tlZCB3aGVuIHVzaW5nIHRoaXMgbWV0aG9kOlxuICAgICAqIC0gY2FjaGVLZXlXaWxsQnlVc2VkKClcbiAgICAgKiAtIGNhY2hlV2lsbFVwZGF0ZSgpXG4gICAgICogLSBjYWNoZURpZFVwZGF0ZSgpXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlcXVlc3R8c3RyaW5nfSBrZXkgVGhlIHJlcXVlc3Qgb3IgVVJMIHRvIHVzZSBhcyB0aGUgY2FjaGUga2V5LlxuICAgICAqIEBwYXJhbSB7UmVzcG9uc2V9IHJlc3BvbnNlIFRoZSByZXNwb25zZSB0byBjYWNoZS5cbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlPGJvb2xlYW4+fSBgZmFsc2VgIGlmIGEgY2FjaGVXaWxsVXBkYXRlIGNhdXNlZCB0aGUgcmVzcG9uc2VcbiAgICAgKiBub3QgYmUgY2FjaGVkLCBhbmQgYHRydWVgIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBhc3luYyBjYWNoZVB1dChrZXksIHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbnN0IHJlcXVlc3QgPSB0b1JlcXVlc3Qoa2V5KTtcbiAgICAgICAgLy8gUnVuIGluIHRoZSBuZXh0IHRhc2sgdG8gYXZvaWQgYmxvY2tpbmcgb3RoZXIgY2FjaGUgcmVhZHMuXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS93M2MvU2VydmljZVdvcmtlci9pc3N1ZXMvMTM5N1xuICAgICAgICBhd2FpdCB0aW1lb3V0KDApO1xuICAgICAgICBjb25zdCBlZmZlY3RpdmVSZXF1ZXN0ID0gYXdhaXQgdGhpcy5nZXRDYWNoZUtleShyZXF1ZXN0LCAnd3JpdGUnKTtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgIGlmIChlZmZlY3RpdmVSZXF1ZXN0Lm1ldGhvZCAmJiBlZmZlY3RpdmVSZXF1ZXN0Lm1ldGhvZCAhPT0gJ0dFVCcpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgV29ya2JveEVycm9yKCdhdHRlbXB0LXRvLWNhY2hlLW5vbi1nZXQtcmVxdWVzdCcsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBnZXRGcmllbmRseVVSTChlZmZlY3RpdmVSZXF1ZXN0LnVybCksXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogZWZmZWN0aXZlUmVxdWVzdC5tZXRob2QsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL0dvb2dsZUNocm9tZS93b3JrYm94L2lzc3Vlcy8yODE4XG4gICAgICAgICAgICBjb25zdCB2YXJ5ID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoJ1ZhcnknKTtcbiAgICAgICAgICAgIGlmICh2YXJ5KSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKGBUaGUgcmVzcG9uc2UgZm9yICR7Z2V0RnJpZW5kbHlVUkwoZWZmZWN0aXZlUmVxdWVzdC51cmwpfSBgICtcbiAgICAgICAgICAgICAgICAgICAgYGhhcyBhICdWYXJ5OiAke3Zhcnl9JyBoZWFkZXIuIGAgK1xuICAgICAgICAgICAgICAgICAgICBgQ29uc2lkZXIgc2V0dGluZyB0aGUge2lnbm9yZVZhcnk6IHRydWV9IG9wdGlvbiBvbiB5b3VyIHN0cmF0ZWd5IGAgK1xuICAgICAgICAgICAgICAgICAgICBgdG8gZW5zdXJlIGNhY2hlIG1hdGNoaW5nIGFuZCBkZWxldGlvbiB3b3JrcyBhcyBleHBlY3RlZC5gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgQ2Fubm90IGNhY2hlIG5vbi1leGlzdGVudCByZXNwb25zZSBmb3IgYCArXG4gICAgICAgICAgICAgICAgICAgIGAnJHtnZXRGcmllbmRseVVSTChlZmZlY3RpdmVSZXF1ZXN0LnVybCl9Jy5gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IG5ldyBXb3JrYm94RXJyb3IoJ2NhY2hlLXB1dC13aXRoLW5vLXJlc3BvbnNlJywge1xuICAgICAgICAgICAgICAgIHVybDogZ2V0RnJpZW5kbHlVUkwoZWZmZWN0aXZlUmVxdWVzdC51cmwpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVzcG9uc2VUb0NhY2hlID0gYXdhaXQgdGhpcy5fZW5zdXJlUmVzcG9uc2VTYWZlVG9DYWNoZShyZXNwb25zZSk7XG4gICAgICAgIGlmICghcmVzcG9uc2VUb0NhY2hlKSB7XG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZyhgUmVzcG9uc2UgJyR7Z2V0RnJpZW5kbHlVUkwoZWZmZWN0aXZlUmVxdWVzdC51cmwpfScgYCArXG4gICAgICAgICAgICAgICAgICAgIGB3aWxsIG5vdCBiZSBjYWNoZWQuYCwgcmVzcG9uc2VUb0NhY2hlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB7IGNhY2hlTmFtZSwgbWF0Y2hPcHRpb25zIH0gPSB0aGlzLl9zdHJhdGVneTtcbiAgICAgICAgY29uc3QgY2FjaGUgPSBhd2FpdCBzZWxmLmNhY2hlcy5vcGVuKGNhY2hlTmFtZSk7XG4gICAgICAgIGNvbnN0IGhhc0NhY2hlVXBkYXRlQ2FsbGJhY2sgPSB0aGlzLmhhc0NhbGxiYWNrKCdjYWNoZURpZFVwZGF0ZScpO1xuICAgICAgICBjb25zdCBvbGRSZXNwb25zZSA9IGhhc0NhY2hlVXBkYXRlQ2FsbGJhY2tcbiAgICAgICAgICAgID8gYXdhaXQgY2FjaGVNYXRjaElnbm9yZVBhcmFtcyhcbiAgICAgICAgICAgIC8vIFRPRE8ocGhpbGlwd2FsdG9uKTogdGhlIGBfX1dCX1JFVklTSU9OX19gIHBhcmFtIGlzIGEgcHJlY2FjaGluZ1xuICAgICAgICAgICAgLy8gZmVhdHVyZS4gQ29uc2lkZXIgaW50byB3YXlzIHRvIG9ubHkgYWRkIHRoaXMgYmVoYXZpb3IgaWYgdXNpbmdcbiAgICAgICAgICAgIC8vIHByZWNhY2hpbmcuXG4gICAgICAgICAgICBjYWNoZSwgZWZmZWN0aXZlUmVxdWVzdC5jbG9uZSgpLCBbJ19fV0JfUkVWSVNJT05fXyddLCBtYXRjaE9wdGlvbnMpXG4gICAgICAgICAgICA6IG51bGw7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICBsb2dnZXIuZGVidWcoYFVwZGF0aW5nIHRoZSAnJHtjYWNoZU5hbWV9JyBjYWNoZSB3aXRoIGEgbmV3IFJlc3BvbnNlIGAgK1xuICAgICAgICAgICAgICAgIGBmb3IgJHtnZXRGcmllbmRseVVSTChlZmZlY3RpdmVSZXF1ZXN0LnVybCl9LmApO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBjYWNoZS5wdXQoZWZmZWN0aXZlUmVxdWVzdCwgaGFzQ2FjaGVVcGRhdGVDYWxsYmFjayA/IHJlc3BvbnNlVG9DYWNoZS5jbG9uZSgpIDogcmVzcG9uc2VUb0NhY2hlKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgICAgLy8gU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9ET01FeGNlcHRpb24jZXhjZXB0aW9uLVF1b3RhRXhjZWVkZWRFcnJvclxuICAgICAgICAgICAgICAgIGlmIChlcnJvci5uYW1lID09PSAnUXVvdGFFeGNlZWRlZEVycm9yJykge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBleGVjdXRlUXVvdGFFcnJvckNhbGxiYWNrcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGNhbGxiYWNrIG9mIHRoaXMuaXRlcmF0ZUNhbGxiYWNrcygnY2FjaGVEaWRVcGRhdGUnKSkge1xuICAgICAgICAgICAgYXdhaXQgY2FsbGJhY2soe1xuICAgICAgICAgICAgICAgIGNhY2hlTmFtZSxcbiAgICAgICAgICAgICAgICBvbGRSZXNwb25zZSxcbiAgICAgICAgICAgICAgICBuZXdSZXNwb25zZTogcmVzcG9uc2VUb0NhY2hlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgcmVxdWVzdDogZWZmZWN0aXZlUmVxdWVzdCxcbiAgICAgICAgICAgICAgICBldmVudDogdGhpcy5ldmVudCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGVja3MgdGhlIGxpc3Qgb2YgcGx1Z2lucyBmb3IgdGhlIGBjYWNoZUtleVdpbGxCZVVzZWRgIGNhbGxiYWNrLCBhbmRcbiAgICAgKiBleGVjdXRlcyBhbnkgb2YgdGhvc2UgY2FsbGJhY2tzIGZvdW5kIGluIHNlcXVlbmNlLiBUaGUgZmluYWwgYFJlcXVlc3RgXG4gICAgICogb2JqZWN0IHJldHVybmVkIGJ5IHRoZSBsYXN0IHBsdWdpbiBpcyB0cmVhdGVkIGFzIHRoZSBjYWNoZSBrZXkgZm9yIGNhY2hlXG4gICAgICogcmVhZHMgYW5kL29yIHdyaXRlcy4gSWYgbm8gYGNhY2hlS2V5V2lsbEJlVXNlZGAgcGx1Z2luIGNhbGxiYWNrcyBoYXZlXG4gICAgICogYmVlbiByZWdpc3RlcmVkLCB0aGUgcGFzc2VkIHJlcXVlc3QgaXMgcmV0dXJuZWQgdW5tb2RpZmllZFxuICAgICAqXG4gICAgICogQHBhcmFtIHtSZXF1ZXN0fSByZXF1ZXN0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGVcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlPFJlcXVlc3Q+fVxuICAgICAqL1xuICAgIGFzeW5jIGdldENhY2hlS2V5KHJlcXVlc3QsIG1vZGUpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gYCR7cmVxdWVzdC51cmx9IHwgJHttb2RlfWA7XG4gICAgICAgIGlmICghdGhpcy5fY2FjaGVLZXlzW2tleV0pIHtcbiAgICAgICAgICAgIGxldCBlZmZlY3RpdmVSZXF1ZXN0ID0gcmVxdWVzdDtcbiAgICAgICAgICAgIGZvciAoY29uc3QgY2FsbGJhY2sgb2YgdGhpcy5pdGVyYXRlQ2FsbGJhY2tzKCdjYWNoZUtleVdpbGxCZVVzZWQnKSkge1xuICAgICAgICAgICAgICAgIGVmZmVjdGl2ZVJlcXVlc3QgPSB0b1JlcXVlc3QoYXdhaXQgY2FsbGJhY2soe1xuICAgICAgICAgICAgICAgICAgICBtb2RlLFxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0OiBlZmZlY3RpdmVSZXF1ZXN0LFxuICAgICAgICAgICAgICAgICAgICBldmVudDogdGhpcy5ldmVudCxcbiAgICAgICAgICAgICAgICAgICAgLy8gcGFyYW1zIGhhcyBhIHR5cGUgYW55IGNhbid0IGNoYW5nZSByaWdodCBub3cuXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczogdGhpcy5wYXJhbXMsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9jYWNoZUtleXNba2V5XSA9IGVmZmVjdGl2ZVJlcXVlc3Q7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlS2V5c1trZXldO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHN0cmF0ZWd5IGhhcyBhdCBsZWFzdCBvbmUgcGx1Z2luIHdpdGggdGhlIGdpdmVuXG4gICAgICogY2FsbGJhY2suXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgY2FsbGJhY2sgdG8gY2hlY2sgZm9yLlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICovXG4gICAgaGFzQ2FsbGJhY2sobmFtZSkge1xuICAgICAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiB0aGlzLl9zdHJhdGVneS5wbHVnaW5zKSB7XG4gICAgICAgICAgICBpZiAobmFtZSBpbiBwbHVnaW4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJ1bnMgYWxsIHBsdWdpbiBjYWxsYmFja3MgbWF0Y2hpbmcgdGhlIGdpdmVuIG5hbWUsIGluIG9yZGVyLCBwYXNzaW5nIHRoZVxuICAgICAqIGdpdmVuIHBhcmFtIG9iamVjdCAobWVyZ2VkIGl0aCB0aGUgY3VycmVudCBwbHVnaW4gc3RhdGUpIGFzIHRoZSBvbmx5XG4gICAgICogYXJndW1lbnQuXG4gICAgICpcbiAgICAgKiBOb3RlOiBzaW5jZSB0aGlzIG1ldGhvZCBydW5zIGFsbCBwbHVnaW5zLCBpdCdzIG5vdCBzdWl0YWJsZSBmb3IgY2FzZXNcbiAgICAgKiB3aGVyZSB0aGUgcmV0dXJuIHZhbHVlIG9mIGEgY2FsbGJhY2sgbmVlZHMgdG8gYmUgYXBwbGllZCBwcmlvciB0byBjYWxsaW5nXG4gICAgICogdGhlIG5leHQgY2FsbGJhY2suIFNlZVxuICAgICAqIHtAbGluayB3b3JrYm94LXN0cmF0ZWdpZXMuU3RyYXRlZ3lIYW5kbGVyI2l0ZXJhdGVDYWxsYmFja3N9XG4gICAgICogYmVsb3cgZm9yIGhvdyB0byBoYW5kbGUgdGhhdCBjYXNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGNhbGxiYWNrIHRvIHJ1biB3aXRoaW4gZWFjaCBwbHVnaW4uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtIFRoZSBvYmplY3QgdG8gcGFzcyBhcyB0aGUgZmlyc3QgKGFuZCBvbmx5KSBwYXJhbVxuICAgICAqICAgICB3aGVuIGV4ZWN1dGluZyBlYWNoIGNhbGxiYWNrLiBUaGlzIG9iamVjdCB3aWxsIGJlIG1lcmdlZCB3aXRoIHRoZVxuICAgICAqICAgICBjdXJyZW50IHBsdWdpbiBzdGF0ZSBwcmlvciB0byBjYWxsYmFjayBleGVjdXRpb24uXG4gICAgICovXG4gICAgYXN5bmMgcnVuQ2FsbGJhY2tzKG5hbWUsIHBhcmFtKSB7XG4gICAgICAgIGZvciAoY29uc3QgY2FsbGJhY2sgb2YgdGhpcy5pdGVyYXRlQ2FsbGJhY2tzKG5hbWUpKSB7XG4gICAgICAgICAgICAvLyBUT0RPKHBoaWxpcHdhbHRvbik6IG5vdCBzdXJlIHdoeSBgYW55YCBpcyBuZWVkZWQuIEl0IHNlZW1zIGxpa2VcbiAgICAgICAgICAgIC8vIHRoaXMgc2hvdWxkIHdvcmsgd2l0aCBgYXMgV29ya2JveFBsdWdpbkNhbGxiYWNrUGFyYW1bQ11gLlxuICAgICAgICAgICAgYXdhaXQgY2FsbGJhY2socGFyYW0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFjY2VwdHMgYSBjYWxsYmFjayBhbmQgcmV0dXJucyBhbiBpdGVyYWJsZSBvZiBtYXRjaGluZyBwbHVnaW4gY2FsbGJhY2tzLFxuICAgICAqIHdoZXJlIGVhY2ggY2FsbGJhY2sgaXMgd3JhcHBlZCB3aXRoIHRoZSBjdXJyZW50IGhhbmRsZXIgc3RhdGUgKGkuZS4gd2hlblxuICAgICAqIHlvdSBjYWxsIGVhY2ggY2FsbGJhY2ssIHdoYXRldmVyIG9iamVjdCBwYXJhbWV0ZXIgeW91IHBhc3MgaXQgd2lsbFxuICAgICAqIGJlIG1lcmdlZCB3aXRoIHRoZSBwbHVnaW4ncyBjdXJyZW50IHN0YXRlKS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIGZvIHRoZSBjYWxsYmFjayB0byBydW5cbiAgICAgKiBAcmV0dXJuIHtBcnJheTxGdW5jdGlvbj59XG4gICAgICovXG4gICAgKml0ZXJhdGVDYWxsYmFja3MobmFtZSkge1xuICAgICAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiB0aGlzLl9zdHJhdGVneS5wbHVnaW5zKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHBsdWdpbltuYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5fcGx1Z2luU3RhdGVNYXAuZ2V0KHBsdWdpbik7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhdGVmdWxDYWxsYmFjayA9IChwYXJhbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGF0ZWZ1bFBhcmFtID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBwYXJhbSksIHsgc3RhdGUgfSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE8ocGhpbGlwd2FsdG9uKTogbm90IHN1cmUgd2h5IGBhbnlgIGlzIG5lZWRlZC4gSXQgc2VlbXMgbGlrZVxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIHNob3VsZCB3b3JrIHdpdGggYGFzIFdvcmtib3hQbHVnaW5DYWxsYmFja1BhcmFtW0NdYC5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBsdWdpbltuYW1lXShzdGF0ZWZ1bFBhcmFtKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHlpZWxkIHN0YXRlZnVsQ2FsbGJhY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQWRkcyBhIHByb21pc2UgdG8gdGhlXG4gICAgICogW2V4dGVuZCBsaWZldGltZSBwcm9taXNlc117QGxpbmsgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL1NlcnZpY2VXb3JrZXIvI2V4dGVuZGFibGVldmVudC1leHRlbmQtbGlmZXRpbWUtcHJvbWlzZXN9XG4gICAgICogb2YgdGhlIGV2ZW50IGV2ZW50IGFzc29jaWF0ZWQgd2l0aCB0aGUgcmVxdWVzdCBiZWluZyBoYW5kbGVkICh1c3VhbGx5IGFcbiAgICAgKiBgRmV0Y2hFdmVudGApLlxuICAgICAqXG4gICAgICogTm90ZTogeW91IGNhbiBhd2FpdFxuICAgICAqIHtAbGluayB3b3JrYm94LXN0cmF0ZWdpZXMuU3RyYXRlZ3lIYW5kbGVyfmRvbmVXYWl0aW5nfVxuICAgICAqIHRvIGtub3cgd2hlbiBhbGwgYWRkZWQgcHJvbWlzZXMgaGF2ZSBzZXR0bGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtQcm9taXNlfSBwcm9taXNlIEEgcHJvbWlzZSB0byBhZGQgdG8gdGhlIGV4dGVuZCBsaWZldGltZSBwcm9taXNlc1xuICAgICAqICAgICBvZiB0aGUgZXZlbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIHJlcXVlc3QuXG4gICAgICovXG4gICAgd2FpdFVudGlsKHByb21pc2UpIHtcbiAgICAgICAgdGhpcy5fZXh0ZW5kTGlmZXRpbWVQcm9taXNlcy5wdXNoKHByb21pc2UpO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyBvbmNlIGFsbCBwcm9taXNlcyBwYXNzZWQgdG9cbiAgICAgKiB7QGxpbmsgd29ya2JveC1zdHJhdGVnaWVzLlN0cmF0ZWd5SGFuZGxlcn53YWl0VW50aWx9XG4gICAgICogaGF2ZSBzZXR0bGVkLlxuICAgICAqXG4gICAgICogTm90ZTogYW55IHdvcmsgZG9uZSBhZnRlciBgZG9uZVdhaXRpbmcoKWAgc2V0dGxlcyBzaG91bGQgYmUgbWFudWFsbHlcbiAgICAgKiBwYXNzZWQgdG8gYW4gZXZlbnQncyBgd2FpdFVudGlsKClgIG1ldGhvZCAobm90IHRoaXMgaGFuZGxlcidzXG4gICAgICogYHdhaXRVbnRpbCgpYCBtZXRob2QpLCBvdGhlcndpc2UgdGhlIHNlcnZpY2Ugd29ya2VyIHRocmVhZCBteSBiZSBraWxsZWRcbiAgICAgKiBwcmlvciB0byB5b3VyIHdvcmsgY29tcGxldGluZy5cbiAgICAgKi9cbiAgICBhc3luYyBkb25lV2FpdGluZygpIHtcbiAgICAgICAgbGV0IHByb21pc2U7XG4gICAgICAgIHdoaWxlICgocHJvbWlzZSA9IHRoaXMuX2V4dGVuZExpZmV0aW1lUHJvbWlzZXMuc2hpZnQoKSkpIHtcbiAgICAgICAgICAgIGF3YWl0IHByb21pc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogU3RvcHMgcnVubmluZyB0aGUgc3RyYXRlZ3kgYW5kIGltbWVkaWF0ZWx5IHJlc29sdmVzIGFueSBwZW5kaW5nXG4gICAgICogYHdhaXRVbnRpbCgpYCBwcm9taXNlcy5cbiAgICAgKi9cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLl9oYW5kbGVyRGVmZXJyZWQucmVzb2x2ZShudWxsKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhpcyBtZXRob2Qgd2lsbCBjYWxsIGNhY2hlV2lsbFVwZGF0ZSBvbiB0aGUgYXZhaWxhYmxlIHBsdWdpbnMgKG9yIHVzZVxuICAgICAqIHN0YXR1cyA9PT0gMjAwKSB0byBkZXRlcm1pbmUgaWYgdGhlIFJlc3BvbnNlIGlzIHNhZmUgYW5kIHZhbGlkIHRvIGNhY2hlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtSZXF1ZXN0fSBvcHRpb25zLnJlcXVlc3RcbiAgICAgKiBAcGFyYW0ge1Jlc3BvbnNlfSBvcHRpb25zLnJlc3BvbnNlXG4gICAgICogQHJldHVybiB7UHJvbWlzZTxSZXNwb25zZXx1bmRlZmluZWQ+fVxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBhc3luYyBfZW5zdXJlUmVzcG9uc2VTYWZlVG9DYWNoZShyZXNwb25zZSkge1xuICAgICAgICBsZXQgcmVzcG9uc2VUb0NhY2hlID0gcmVzcG9uc2U7XG4gICAgICAgIGxldCBwbHVnaW5zVXNlZCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGNvbnN0IGNhbGxiYWNrIG9mIHRoaXMuaXRlcmF0ZUNhbGxiYWNrcygnY2FjaGVXaWxsVXBkYXRlJykpIHtcbiAgICAgICAgICAgIHJlc3BvbnNlVG9DYWNoZSA9XG4gICAgICAgICAgICAgICAgKGF3YWl0IGNhbGxiYWNrKHtcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdDogdGhpcy5yZXF1ZXN0LFxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZTogcmVzcG9uc2VUb0NhY2hlLFxuICAgICAgICAgICAgICAgICAgICBldmVudDogdGhpcy5ldmVudCxcbiAgICAgICAgICAgICAgICB9KSkgfHwgdW5kZWZpbmVkO1xuICAgICAgICAgICAgcGx1Z2luc1VzZWQgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZVRvQ2FjaGUpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIXBsdWdpbnNVc2VkKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2VUb0NhY2hlICYmIHJlc3BvbnNlVG9DYWNoZS5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlVG9DYWNoZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlVG9DYWNoZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VUb0NhY2hlLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VUb0NhY2hlLnN0YXR1cyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuKGBUaGUgcmVzcG9uc2UgZm9yICcke3RoaXMucmVxdWVzdC51cmx9JyBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYGlzIGFuIG9wYXF1ZSByZXNwb25zZS4gVGhlIGNhY2hpbmcgc3RyYXRlZ3kgdGhhdCB5b3UncmUgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGB1c2luZyB3aWxsIG5vdCBjYWNoZSBvcGFxdWUgcmVzcG9uc2VzIGJ5IGRlZmF1bHQuYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoYFRoZSByZXNwb25zZSBmb3IgJyR7dGhpcy5yZXF1ZXN0LnVybH0nIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgcmV0dXJuZWQgYSBzdGF0dXMgY29kZSBvZiAnJHtyZXNwb25zZS5zdGF0dXN9JyBhbmQgd29uJ3QgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBiZSBjYWNoZWQgYXMgYSByZXN1bHQuYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlVG9DYWNoZTtcbiAgICB9XG59XG5leHBvcnQgeyBTdHJhdGVneUhhbmRsZXIgfTtcbiIsIi8qXG4gIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCB7IGNhY2hlTmFtZXMgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvY2FjaGVOYW1lcy5qcyc7XG5pbXBvcnQgeyBXb3JrYm94RXJyb3IgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvV29ya2JveEVycm9yLmpzJztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9sb2dnZXIuanMnO1xuaW1wb3J0IHsgZ2V0RnJpZW5kbHlVUkwgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvZ2V0RnJpZW5kbHlVUkwuanMnO1xuaW1wb3J0IHsgU3RyYXRlZ3lIYW5kbGVyIH0gZnJvbSAnLi9TdHJhdGVneUhhbmRsZXIuanMnO1xuaW1wb3J0ICcuL192ZXJzaW9uLmpzJztcbi8qKlxuICogQW4gYWJzdHJhY3QgYmFzZSBjbGFzcyB0aGF0IGFsbCBvdGhlciBzdHJhdGVneSBjbGFzc2VzIG11c3QgZXh0ZW5kIGZyb206XG4gKlxuICogQG1lbWJlcm9mIHdvcmtib3gtc3RyYXRlZ2llc1xuICovXG5jbGFzcyBTdHJhdGVneSB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgc3RyYXRlZ3kgYW5kIHNldHMgYWxsIGRvY3VtZW50ZWQgb3B0aW9uXG4gICAgICogcHJvcGVydGllcyBhcyBwdWJsaWMgaW5zdGFuY2UgcHJvcGVydGllcy5cbiAgICAgKlxuICAgICAqIE5vdGU6IGlmIGEgY3VzdG9tIHN0cmF0ZWd5IGNsYXNzIGV4dGVuZHMgdGhlIGJhc2UgU3RyYXRlZ3kgY2xhc3MgYW5kIGRvZXNcbiAgICAgKiBub3QgbmVlZCBtb3JlIHRoYW4gdGhlc2UgcHJvcGVydGllcywgaXQgZG9lcyBub3QgbmVlZCB0byBkZWZpbmUgaXRzIG93blxuICAgICAqIGNvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5jYWNoZU5hbWVdIENhY2hlIG5hbWUgdG8gc3RvcmUgYW5kIHJldHJpZXZlXG4gICAgICogcmVxdWVzdHMuIERlZmF1bHRzIHRvIHRoZSBjYWNoZSBuYW1lcyBwcm92aWRlZCBieVxuICAgICAqIHtAbGluayB3b3JrYm94LWNvcmUuY2FjaGVOYW1lc30uXG4gICAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBbb3B0aW9ucy5wbHVnaW5zXSBbUGx1Z2luc117QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vd2ViL3Rvb2xzL3dvcmtib3gvZ3VpZGVzL3VzaW5nLXBsdWdpbnN9XG4gICAgICogdG8gdXNlIGluIGNvbmp1bmN0aW9uIHdpdGggdGhpcyBjYWNoaW5nIHN0cmF0ZWd5LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5mZXRjaE9wdGlvbnNdIFZhbHVlcyBwYXNzZWQgYWxvbmcgdG8gdGhlXG4gICAgICogW2Bpbml0YF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dpbmRvd09yV29ya2VyR2xvYmFsU2NvcGUvZmV0Y2gjUGFyYW1ldGVycylcbiAgICAgKiBvZiBbbm9uLW5hdmlnYXRpb25dKGh0dHBzOi8vZ2l0aHViLmNvbS9Hb29nbGVDaHJvbWUvd29ya2JveC9pc3N1ZXMvMTc5NilcbiAgICAgKiBgZmV0Y2goKWAgcmVxdWVzdHMgbWFkZSBieSB0aGlzIHN0cmF0ZWd5LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5tYXRjaE9wdGlvbnNdIFRoZVxuICAgICAqIFtgQ2FjaGVRdWVyeU9wdGlvbnNgXXtAbGluayBodHRwczovL3czYy5naXRodWIuaW8vU2VydmljZVdvcmtlci8jZGljdGRlZi1jYWNoZXF1ZXJ5b3B0aW9uc31cbiAgICAgKiBmb3IgYW55IGBjYWNoZS5tYXRjaCgpYCBvciBgY2FjaGUucHV0KClgIGNhbGxzIG1hZGUgYnkgdGhpcyBzdHJhdGVneS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhY2hlIG5hbWUgdG8gc3RvcmUgYW5kIHJldHJpZXZlXG4gICAgICAgICAqIHJlcXVlc3RzLiBEZWZhdWx0cyB0byB0aGUgY2FjaGUgbmFtZXMgcHJvdmlkZWQgYnlcbiAgICAgICAgICoge0BsaW5rIHdvcmtib3gtY29yZS5jYWNoZU5hbWVzfS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2FjaGVOYW1lID0gY2FjaGVOYW1lcy5nZXRSdW50aW1lTmFtZShvcHRpb25zLmNhY2hlTmFtZSk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgbGlzdFxuICAgICAgICAgKiBbUGx1Z2luc117QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vd2ViL3Rvb2xzL3dvcmtib3gvZ3VpZGVzL3VzaW5nLXBsdWdpbnN9XG4gICAgICAgICAqIHVzZWQgYnkgdGhpcyBzdHJhdGVneS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge0FycmF5PE9iamVjdD59XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnBsdWdpbnMgPSBvcHRpb25zLnBsdWdpbnMgfHwgW107XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBWYWx1ZXMgcGFzc2VkIGFsb25nIHRvIHRoZVxuICAgICAgICAgKiBbYGluaXRgXXtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2luZG93T3JXb3JrZXJHbG9iYWxTY29wZS9mZXRjaCNQYXJhbWV0ZXJzfVxuICAgICAgICAgKiBvZiBhbGwgZmV0Y2goKSByZXF1ZXN0cyBtYWRlIGJ5IHRoaXMgc3RyYXRlZ3kuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmZldGNoT3B0aW9ucyA9IG9wdGlvbnMuZmV0Y2hPcHRpb25zO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlXG4gICAgICAgICAqIFtgQ2FjaGVRdWVyeU9wdGlvbnNgXXtAbGluayBodHRwczovL3czYy5naXRodWIuaW8vU2VydmljZVdvcmtlci8jZGljdGRlZi1jYWNoZXF1ZXJ5b3B0aW9uc31cbiAgICAgICAgICogZm9yIGFueSBgY2FjaGUubWF0Y2goKWAgb3IgYGNhY2hlLnB1dCgpYCBjYWxscyBtYWRlIGJ5IHRoaXMgc3RyYXRlZ3kuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm1hdGNoT3B0aW9ucyA9IG9wdGlvbnMubWF0Y2hPcHRpb25zO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtIGEgcmVxdWVzdCBzdHJhdGVneSBhbmQgcmV0dXJucyBhIGBQcm9taXNlYCB0aGF0IHdpbGwgcmVzb2x2ZSB3aXRoXG4gICAgICogYSBgUmVzcG9uc2VgLCBpbnZva2luZyBhbGwgcmVsZXZhbnQgcGx1Z2luIGNhbGxiYWNrcy5cbiAgICAgKlxuICAgICAqIFdoZW4gYSBzdHJhdGVneSBpbnN0YW5jZSBpcyByZWdpc3RlcmVkIHdpdGggYSBXb3JrYm94XG4gICAgICoge0BsaW5rIHdvcmtib3gtcm91dGluZy5Sb3V0ZX0sIHRoaXMgbWV0aG9kIGlzIGF1dG9tYXRpY2FsbHlcbiAgICAgKiBjYWxsZWQgd2hlbiB0aGUgcm91dGUgbWF0Y2hlcy5cbiAgICAgKlxuICAgICAqIEFsdGVybmF0aXZlbHksIHRoaXMgbWV0aG9kIGNhbiBiZSB1c2VkIGluIGEgc3RhbmRhbG9uZSBgRmV0Y2hFdmVudGBcbiAgICAgKiBsaXN0ZW5lciBieSBwYXNzaW5nIGl0IHRvIGBldmVudC5yZXNwb25kV2l0aCgpYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RmV0Y2hFdmVudHxPYmplY3R9IG9wdGlvbnMgQSBgRmV0Y2hFdmVudGAgb3IgYW4gb2JqZWN0IHdpdGggdGhlXG4gICAgICogICAgIHByb3BlcnRpZXMgbGlzdGVkIGJlbG93LlxuICAgICAqIEBwYXJhbSB7UmVxdWVzdHxzdHJpbmd9IG9wdGlvbnMucmVxdWVzdCBBIHJlcXVlc3QgdG8gcnVuIHRoaXMgc3RyYXRlZ3kgZm9yLlxuICAgICAqIEBwYXJhbSB7RXh0ZW5kYWJsZUV2ZW50fSBvcHRpb25zLmV2ZW50IFRoZSBldmVudCBhc3NvY2lhdGVkIHdpdGggdGhlXG4gICAgICogICAgIHJlcXVlc3QuXG4gICAgICogQHBhcmFtIHtVUkx9IFtvcHRpb25zLnVybF1cbiAgICAgKiBAcGFyYW0geyp9IFtvcHRpb25zLnBhcmFtc11cbiAgICAgKi9cbiAgICBoYW5kbGUob3B0aW9ucykge1xuICAgICAgICBjb25zdCBbcmVzcG9uc2VEb25lXSA9IHRoaXMuaGFuZGxlQWxsKG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2VEb25lO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTaW1pbGFyIHRvIHtAbGluayB3b3JrYm94LXN0cmF0ZWdpZXMuU3RyYXRlZ3l+aGFuZGxlfSwgYnV0XG4gICAgICogaW5zdGVhZCBvZiBqdXN0IHJldHVybmluZyBhIGBQcm9taXNlYCB0aGF0IHJlc29sdmVzIHRvIGEgYFJlc3BvbnNlYCBpdFxuICAgICAqIGl0IHdpbGwgcmV0dXJuIGFuIHR1cGxlIG9mIGBbcmVzcG9uc2UsIGRvbmVdYCBwcm9taXNlcywgd2hlcmUgdGhlIGZvcm1lclxuICAgICAqIChgcmVzcG9uc2VgKSBpcyBlcXVpdmFsZW50IHRvIHdoYXQgYGhhbmRsZSgpYCByZXR1cm5zLCBhbmQgdGhlIGxhdHRlciBpcyBhXG4gICAgICogUHJvbWlzZSB0aGF0IHdpbGwgcmVzb2x2ZSBvbmNlIGFueSBwcm9taXNlcyB0aGF0IHdlcmUgYWRkZWQgdG9cbiAgICAgKiBgZXZlbnQud2FpdFVudGlsKClgIGFzIHBhcnQgb2YgcGVyZm9ybWluZyB0aGUgc3RyYXRlZ3kgaGF2ZSBjb21wbGV0ZWQuXG4gICAgICpcbiAgICAgKiBZb3UgY2FuIGF3YWl0IHRoZSBgZG9uZWAgcHJvbWlzZSB0byBlbnN1cmUgYW55IGV4dHJhIHdvcmsgcGVyZm9ybWVkIGJ5XG4gICAgICogdGhlIHN0cmF0ZWd5ICh1c3VhbGx5IGNhY2hpbmcgcmVzcG9uc2VzKSBjb21wbGV0ZXMgc3VjY2Vzc2Z1bGx5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtGZXRjaEV2ZW50fE9iamVjdH0gb3B0aW9ucyBBIGBGZXRjaEV2ZW50YCBvciBhbiBvYmplY3Qgd2l0aCB0aGVcbiAgICAgKiAgICAgcHJvcGVydGllcyBsaXN0ZWQgYmVsb3cuXG4gICAgICogQHBhcmFtIHtSZXF1ZXN0fHN0cmluZ30gb3B0aW9ucy5yZXF1ZXN0IEEgcmVxdWVzdCB0byBydW4gdGhpcyBzdHJhdGVneSBmb3IuXG4gICAgICogQHBhcmFtIHtFeHRlbmRhYmxlRXZlbnR9IG9wdGlvbnMuZXZlbnQgVGhlIGV2ZW50IGFzc29jaWF0ZWQgd2l0aCB0aGVcbiAgICAgKiAgICAgcmVxdWVzdC5cbiAgICAgKiBAcGFyYW0ge1VSTH0gW29wdGlvbnMudXJsXVxuICAgICAqIEBwYXJhbSB7Kn0gW29wdGlvbnMucGFyYW1zXVxuICAgICAqIEByZXR1cm4ge0FycmF5PFByb21pc2U+fSBBIHR1cGxlIG9mIFtyZXNwb25zZSwgZG9uZV1cbiAgICAgKiAgICAgcHJvbWlzZXMgdGhhdCBjYW4gYmUgdXNlZCB0byBkZXRlcm1pbmUgd2hlbiB0aGUgcmVzcG9uc2UgcmVzb2x2ZXMgYXNcbiAgICAgKiAgICAgd2VsbCBhcyB3aGVuIHRoZSBoYW5kbGVyIGhhcyBjb21wbGV0ZWQgYWxsIGl0cyB3b3JrLlxuICAgICAqL1xuICAgIGhhbmRsZUFsbChvcHRpb25zKSB7XG4gICAgICAgIC8vIEFsbG93IGZvciBmbGV4aWJsZSBvcHRpb25zIHRvIGJlIHBhc3NlZC5cbiAgICAgICAgaWYgKG9wdGlvbnMgaW5zdGFuY2VvZiBGZXRjaEV2ZW50KSB7XG4gICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIGV2ZW50OiBvcHRpb25zLFxuICAgICAgICAgICAgICAgIHJlcXVlc3Q6IG9wdGlvbnMucmVxdWVzdCxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZXZlbnQgPSBvcHRpb25zLmV2ZW50O1xuICAgICAgICBjb25zdCByZXF1ZXN0ID0gdHlwZW9mIG9wdGlvbnMucmVxdWVzdCA9PT0gJ3N0cmluZydcbiAgICAgICAgICAgID8gbmV3IFJlcXVlc3Qob3B0aW9ucy5yZXF1ZXN0KVxuICAgICAgICAgICAgOiBvcHRpb25zLnJlcXVlc3Q7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9ICdwYXJhbXMnIGluIG9wdGlvbnMgPyBvcHRpb25zLnBhcmFtcyA6IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBTdHJhdGVneUhhbmRsZXIodGhpcywgeyBldmVudCwgcmVxdWVzdCwgcGFyYW1zIH0pO1xuICAgICAgICBjb25zdCByZXNwb25zZURvbmUgPSB0aGlzLl9nZXRSZXNwb25zZShoYW5kbGVyLCByZXF1ZXN0LCBldmVudCk7XG4gICAgICAgIGNvbnN0IGhhbmRsZXJEb25lID0gdGhpcy5fYXdhaXRDb21wbGV0ZShyZXNwb25zZURvbmUsIGhhbmRsZXIsIHJlcXVlc3QsIGV2ZW50KTtcbiAgICAgICAgLy8gUmV0dXJuIGFuIGFycmF5IG9mIHByb21pc2VzLCBzdWl0YWJsZSBmb3IgdXNlIHdpdGggUHJvbWlzZS5hbGwoKS5cbiAgICAgICAgcmV0dXJuIFtyZXNwb25zZURvbmUsIGhhbmRsZXJEb25lXTtcbiAgICB9XG4gICAgYXN5bmMgX2dldFJlc3BvbnNlKGhhbmRsZXIsIHJlcXVlc3QsIGV2ZW50KSB7XG4gICAgICAgIGF3YWl0IGhhbmRsZXIucnVuQ2FsbGJhY2tzKCdoYW5kbGVyV2lsbFN0YXJ0JywgeyBldmVudCwgcmVxdWVzdCB9KTtcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gdW5kZWZpbmVkO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLl9oYW5kbGUocmVxdWVzdCwgaGFuZGxlcik7XG4gICAgICAgICAgICAvLyBUaGUgXCJvZmZpY2lhbFwiIFN0cmF0ZWd5IHN1YmNsYXNzZXMgYWxsIHRocm93IHRoaXMgZXJyb3IgYXV0b21hdGljYWxseSxcbiAgICAgICAgICAgIC8vIGJ1dCBpbiBjYXNlIGEgdGhpcmQtcGFydHkgU3RyYXRlZ3kgZG9lc24ndCwgZW5zdXJlIHRoYXQgd2UgaGF2ZSBhXG4gICAgICAgICAgICAvLyBjb25zaXN0ZW50IGZhaWx1cmUgd2hlbiB0aGVyZSdzIG5vIHJlc3BvbnNlIG9yIGFuIGVycm9yIHJlc3BvbnNlLlxuICAgICAgICAgICAgaWYgKCFyZXNwb25zZSB8fCByZXNwb25zZS50eXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFdvcmtib3hFcnJvcignbm8tcmVzcG9uc2UnLCB7IHVybDogcmVxdWVzdC51cmwgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgY2FsbGJhY2sgb2YgaGFuZGxlci5pdGVyYXRlQ2FsbGJhY2tzKCdoYW5kbGVyRGlkRXJyb3InKSkge1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IGF3YWl0IGNhbGxiYWNrKHsgZXJyb3IsIGV2ZW50LCByZXF1ZXN0IH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5sb2coYFdoaWxlIHJlc3BvbmRpbmcgdG8gJyR7Z2V0RnJpZW5kbHlVUkwocmVxdWVzdC51cmwpfScsIGAgK1xuICAgICAgICAgICAgICAgICAgICBgYW4gJHtlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IudG9TdHJpbmcoKSA6ICcnfSBlcnJvciBvY2N1cnJlZC4gVXNpbmcgYSBmYWxsYmFjayByZXNwb25zZSBwcm92aWRlZCBieSBgICtcbiAgICAgICAgICAgICAgICAgICAgYGEgaGFuZGxlckRpZEVycm9yIHBsdWdpbi5gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGNhbGxiYWNrIG9mIGhhbmRsZXIuaXRlcmF0ZUNhbGxiYWNrcygnaGFuZGxlcldpbGxSZXNwb25kJykpIHtcbiAgICAgICAgICAgIHJlc3BvbnNlID0gYXdhaXQgY2FsbGJhY2soeyBldmVudCwgcmVxdWVzdCwgcmVzcG9uc2UgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH1cbiAgICBhc3luYyBfYXdhaXRDb21wbGV0ZShyZXNwb25zZURvbmUsIGhhbmRsZXIsIHJlcXVlc3QsIGV2ZW50KSB7XG4gICAgICAgIGxldCByZXNwb25zZTtcbiAgICAgICAgbGV0IGVycm9yO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCByZXNwb25zZURvbmU7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAvLyBJZ25vcmUgZXJyb3JzLCBhcyByZXNwb25zZSBlcnJvcnMgc2hvdWxkIGJlIGNhdWdodCB2aWEgdGhlIGByZXNwb25zZWBcbiAgICAgICAgICAgIC8vIHByb21pc2UgYWJvdmUuIFRoZSBgZG9uZWAgcHJvbWlzZSB3aWxsIG9ubHkgdGhyb3cgZm9yIGVycm9ycyBpblxuICAgICAgICAgICAgLy8gcHJvbWlzZXMgcGFzc2VkIHRvIGBoYW5kbGVyLndhaXRVbnRpbCgpYC5cbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgaGFuZGxlci5ydW5DYWxsYmFja3MoJ2hhbmRsZXJEaWRSZXNwb25kJywge1xuICAgICAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgICAgIHJlcXVlc3QsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGF3YWl0IGhhbmRsZXIuZG9uZVdhaXRpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAod2FpdFVudGlsRXJyb3IpIHtcbiAgICAgICAgICAgIGlmICh3YWl0VW50aWxFcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IgPSB3YWl0VW50aWxFcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBoYW5kbGVyLnJ1bkNhbGxiYWNrcygnaGFuZGxlckRpZENvbXBsZXRlJywge1xuICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICByZXF1ZXN0LFxuICAgICAgICAgICAgcmVzcG9uc2UsXG4gICAgICAgICAgICBlcnJvcjogZXJyb3IsXG4gICAgICAgIH0pO1xuICAgICAgICBoYW5kbGVyLmRlc3Ryb3koKTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydCB7IFN0cmF0ZWd5IH07XG4vKipcbiAqIENsYXNzZXMgZXh0ZW5kaW5nIHRoZSBgU3RyYXRlZ3lgIGJhc2VkIGNsYXNzIHNob3VsZCBpbXBsZW1lbnQgdGhpcyBtZXRob2QsXG4gKiBhbmQgbGV2ZXJhZ2UgdGhlIHtAbGluayB3b3JrYm94LXN0cmF0ZWdpZXMuU3RyYXRlZ3lIYW5kbGVyfVxuICogYXJnIHRvIHBlcmZvcm0gYWxsIGZldGNoaW5nIGFuZCBjYWNoZSBsb2dpYywgd2hpY2ggd2lsbCBlbnN1cmUgYWxsIHJlbGV2YW50XG4gKiBjYWNoZSwgY2FjaGUgb3B0aW9ucywgZmV0Y2ggb3B0aW9ucyBhbmQgcGx1Z2lucyBhcmUgdXNlZCAocGVyIHRoZSBjdXJyZW50XG4gKiBzdHJhdGVneSBpbnN0YW5jZSkuXG4gKlxuICogQG5hbWUgX2hhbmRsZVxuICogQGluc3RhbmNlXG4gKiBAYWJzdHJhY3RcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtSZXF1ZXN0fSByZXF1ZXN0XG4gKiBAcGFyYW0ge3dvcmtib3gtc3RyYXRlZ2llcy5TdHJhdGVneUhhbmRsZXJ9IGhhbmRsZXJcbiAqIEByZXR1cm4ge1Byb21pc2U8UmVzcG9uc2U+fVxuICpcbiAqIEBtZW1iZXJvZiB3b3JrYm94LXN0cmF0ZWdpZXMuU3RyYXRlZ3lcbiAqL1xuIiwiLypcbiAgQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0IHsgY29weVJlc3BvbnNlIH0gZnJvbSAnd29ya2JveC1jb3JlL2NvcHlSZXNwb25zZS5qcyc7XG5pbXBvcnQgeyBjYWNoZU5hbWVzIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL2NhY2hlTmFtZXMuanMnO1xuaW1wb3J0IHsgZ2V0RnJpZW5kbHlVUkwgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvZ2V0RnJpZW5kbHlVUkwuanMnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL2xvZ2dlci5qcyc7XG5pbXBvcnQgeyBXb3JrYm94RXJyb3IgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvV29ya2JveEVycm9yLmpzJztcbmltcG9ydCB7IFN0cmF0ZWd5IH0gZnJvbSAnd29ya2JveC1zdHJhdGVnaWVzL1N0cmF0ZWd5LmpzJztcbmltcG9ydCAnLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIEEge0BsaW5rIHdvcmtib3gtc3RyYXRlZ2llcy5TdHJhdGVneX0gaW1wbGVtZW50YXRpb25cbiAqIHNwZWNpZmljYWxseSBkZXNpZ25lZCB0byB3b3JrIHdpdGhcbiAqIHtAbGluayB3b3JrYm94LXByZWNhY2hpbmcuUHJlY2FjaGVDb250cm9sbGVyfVxuICogdG8gYm90aCBjYWNoZSBhbmQgZmV0Y2ggcHJlY2FjaGVkIGFzc2V0cy5cbiAqXG4gKiBOb3RlOiBhbiBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGlzIGNyZWF0ZWQgYXV0b21hdGljYWxseSB3aGVuIGNyZWF0aW5nIGFcbiAqIGBQcmVjYWNoZUNvbnRyb2xsZXJgOyBpdCdzIGdlbmVyYWxseSBub3QgbmVjZXNzYXJ5IHRvIGNyZWF0ZSB0aGlzIHlvdXJzZWxmLlxuICpcbiAqIEBleHRlbmRzIHdvcmtib3gtc3RyYXRlZ2llcy5TdHJhdGVneVxuICogQG1lbWJlcm9mIHdvcmtib3gtcHJlY2FjaGluZ1xuICovXG5jbGFzcyBQcmVjYWNoZVN0cmF0ZWd5IGV4dGVuZHMgU3RyYXRlZ3kge1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5jYWNoZU5hbWVdIENhY2hlIG5hbWUgdG8gc3RvcmUgYW5kIHJldHJpZXZlXG4gICAgICogcmVxdWVzdHMuIERlZmF1bHRzIHRvIHRoZSBjYWNoZSBuYW1lcyBwcm92aWRlZCBieVxuICAgICAqIHtAbGluayB3b3JrYm94LWNvcmUuY2FjaGVOYW1lc30uXG4gICAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBbb3B0aW9ucy5wbHVnaW5zXSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vd2ViL3Rvb2xzL3dvcmtib3gvZ3VpZGVzL3VzaW5nLXBsdWdpbnN8UGx1Z2luc31cbiAgICAgKiB0byB1c2UgaW4gY29uanVuY3Rpb24gd2l0aCB0aGlzIGNhY2hpbmcgc3RyYXRlZ3kuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLmZldGNoT3B0aW9uc10gVmFsdWVzIHBhc3NlZCBhbG9uZyB0byB0aGVcbiAgICAgKiB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dpbmRvd09yV29ya2VyR2xvYmFsU2NvcGUvZmV0Y2gjUGFyYW1ldGVyc3xpbml0fVxuICAgICAqIG9mIGFsbCBmZXRjaCgpIHJlcXVlc3RzIG1hZGUgYnkgdGhpcyBzdHJhdGVneS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubWF0Y2hPcHRpb25zXSBUaGVcbiAgICAgKiB7QGxpbmsgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL1NlcnZpY2VXb3JrZXIvI2RpY3RkZWYtY2FjaGVxdWVyeW9wdGlvbnN8Q2FjaGVRdWVyeU9wdGlvbnN9XG4gICAgICogZm9yIGFueSBgY2FjaGUubWF0Y2goKWAgb3IgYGNhY2hlLnB1dCgpYCBjYWxscyBtYWRlIGJ5IHRoaXMgc3RyYXRlZ3kuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5mYWxsYmFja1RvTmV0d29yaz10cnVlXSBXaGV0aGVyIHRvIGF0dGVtcHQgdG9cbiAgICAgKiBnZXQgdGhlIHJlc3BvbnNlIGZyb20gdGhlIG5ldHdvcmsgaWYgdGhlcmUncyBhIHByZWNhY2hlIG1pc3MuXG4gICAgICovXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIG9wdGlvbnMuY2FjaGVOYW1lID0gY2FjaGVOYW1lcy5nZXRQcmVjYWNoZU5hbWUob3B0aW9ucy5jYWNoZU5hbWUpO1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICAgICAgdGhpcy5fZmFsbGJhY2tUb05ldHdvcmsgPVxuICAgICAgICAgICAgb3B0aW9ucy5mYWxsYmFja1RvTmV0d29yayA9PT0gZmFsc2UgPyBmYWxzZSA6IHRydWU7XG4gICAgICAgIC8vIFJlZGlyZWN0ZWQgcmVzcG9uc2VzIGNhbm5vdCBiZSB1c2VkIHRvIHNhdGlzZnkgYSBuYXZpZ2F0aW9uIHJlcXVlc3QsIHNvXG4gICAgICAgIC8vIGFueSByZWRpcmVjdGVkIHJlc3BvbnNlIG11c3QgYmUgXCJjb3BpZWRcIiByYXRoZXIgdGhhbiBjbG9uZWQsIHNvIHRoZSBuZXdcbiAgICAgICAgLy8gcmVzcG9uc2UgZG9lc24ndCBjb250YWluIHRoZSBgcmVkaXJlY3RlZGAgZmxhZy4gU2VlOlxuICAgICAgICAvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD02NjkzNjMmZGVzYz0yI2MxXG4gICAgICAgIHRoaXMucGx1Z2lucy5wdXNoKFByZWNhY2hlU3RyYXRlZ3kuY29weVJlZGlyZWN0ZWRDYWNoZWFibGVSZXNwb25zZXNQbHVnaW4pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7UmVxdWVzdHxzdHJpbmd9IHJlcXVlc3QgQSByZXF1ZXN0IHRvIHJ1biB0aGlzIHN0cmF0ZWd5IGZvci5cbiAgICAgKiBAcGFyYW0ge3dvcmtib3gtc3RyYXRlZ2llcy5TdHJhdGVneUhhbmRsZXJ9IGhhbmRsZXIgVGhlIGV2ZW50IHRoYXRcbiAgICAgKiAgICAgdHJpZ2dlcmVkIHRoZSByZXF1ZXN0LlxuICAgICAqIEByZXR1cm4ge1Byb21pc2U8UmVzcG9uc2U+fVxuICAgICAqL1xuICAgIGFzeW5jIF9oYW5kbGUocmVxdWVzdCwgaGFuZGxlcikge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGhhbmRsZXIuY2FjaGVNYXRjaChyZXF1ZXN0KTtcbiAgICAgICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgdGhpcyBpcyBhbiBgaW5zdGFsbGAgZXZlbnQgZm9yIGFuIGVudHJ5IHRoYXQgaXNuJ3QgYWxyZWFkeSBjYWNoZWQsXG4gICAgICAgIC8vIHRoZW4gcG9wdWxhdGUgdGhlIGNhY2hlLlxuICAgICAgICBpZiAoaGFuZGxlci5ldmVudCAmJiBoYW5kbGVyLmV2ZW50LnR5cGUgPT09ICdpbnN0YWxsJykge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX2hhbmRsZUluc3RhbGwocmVxdWVzdCwgaGFuZGxlcik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gR2V0dGluZyBoZXJlIG1lYW5zIHNvbWV0aGluZyB3ZW50IHdyb25nLiBBbiBlbnRyeSB0aGF0IHNob3VsZCBoYXZlIGJlZW5cbiAgICAgICAgLy8gcHJlY2FjaGVkIHdhc24ndCBmb3VuZCBpbiB0aGUgY2FjaGUuXG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLl9oYW5kbGVGZXRjaChyZXF1ZXN0LCBoYW5kbGVyKTtcbiAgICB9XG4gICAgYXN5bmMgX2hhbmRsZUZldGNoKHJlcXVlc3QsIGhhbmRsZXIpIHtcbiAgICAgICAgbGV0IHJlc3BvbnNlO1xuICAgICAgICBjb25zdCBwYXJhbXMgPSAoaGFuZGxlci5wYXJhbXMgfHwge30pO1xuICAgICAgICAvLyBGYWxsIGJhY2sgdG8gdGhlIG5ldHdvcmsgaWYgd2UncmUgY29uZmlndXJlZCB0byBkbyBzby5cbiAgICAgICAgaWYgKHRoaXMuX2ZhbGxiYWNrVG9OZXR3b3JrKSB7XG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuKGBUaGUgcHJlY2FjaGVkIHJlc3BvbnNlIGZvciBgICtcbiAgICAgICAgICAgICAgICAgICAgYCR7Z2V0RnJpZW5kbHlVUkwocmVxdWVzdC51cmwpfSBpbiAke3RoaXMuY2FjaGVOYW1lfSB3YXMgbm90IGAgK1xuICAgICAgICAgICAgICAgICAgICBgZm91bmQuIEZhbGxpbmcgYmFjayB0byB0aGUgbmV0d29yay5gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGludGVncml0eUluTWFuaWZlc3QgPSBwYXJhbXMuaW50ZWdyaXR5O1xuICAgICAgICAgICAgY29uc3QgaW50ZWdyaXR5SW5SZXF1ZXN0ID0gcmVxdWVzdC5pbnRlZ3JpdHk7XG4gICAgICAgICAgICBjb25zdCBub0ludGVncml0eUNvbmZsaWN0ID0gIWludGVncml0eUluUmVxdWVzdCB8fCBpbnRlZ3JpdHlJblJlcXVlc3QgPT09IGludGVncml0eUluTWFuaWZlc3Q7XG4gICAgICAgICAgICAvLyBEbyBub3QgYWRkIGludGVncml0eSBpZiB0aGUgb3JpZ2luYWwgcmVxdWVzdCBpcyBuby1jb3JzXG4gICAgICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL0dvb2dsZUNocm9tZS93b3JrYm94L2lzc3Vlcy8zMDk2XG4gICAgICAgICAgICByZXNwb25zZSA9IGF3YWl0IGhhbmRsZXIuZmV0Y2gobmV3IFJlcXVlc3QocmVxdWVzdCwge1xuICAgICAgICAgICAgICAgIGludGVncml0eTogcmVxdWVzdC5tb2RlICE9PSAnbm8tY29ycydcbiAgICAgICAgICAgICAgICAgICAgPyBpbnRlZ3JpdHlJblJlcXVlc3QgfHwgaW50ZWdyaXR5SW5NYW5pZmVzdFxuICAgICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIC8vIEl0J3Mgb25seSBcInNhZmVcIiB0byByZXBhaXIgdGhlIGNhY2hlIGlmIHdlJ3JlIHVzaW5nIFNSSSB0byBndWFyYW50ZWVcbiAgICAgICAgICAgIC8vIHRoYXQgdGhlIHJlc3BvbnNlIG1hdGNoZXMgdGhlIHByZWNhY2hlIG1hbmlmZXN0J3MgZXhwZWN0YXRpb25zLFxuICAgICAgICAgICAgLy8gYW5kIHRoZXJlJ3MgZWl0aGVyIGEpIG5vIGludGVncml0eSBwcm9wZXJ0eSBpbiB0aGUgaW5jb21pbmcgcmVxdWVzdFxuICAgICAgICAgICAgLy8gb3IgYikgdGhlcmUgaXMgYW4gaW50ZWdyaXR5LCBhbmQgaXQgbWF0Y2hlcyB0aGUgcHJlY2FjaGUgbWFuaWZlc3QuXG4gICAgICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL0dvb2dsZUNocm9tZS93b3JrYm94L2lzc3Vlcy8yODU4XG4gICAgICAgICAgICAvLyBBbHNvIGlmIHRoZSBvcmlnaW5hbCByZXF1ZXN0IHVzZXJzIG5vLWNvcnMgd2UgZG9uJ3QgdXNlIGludGVncml0eS5cbiAgICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vR29vZ2xlQ2hyb21lL3dvcmtib3gvaXNzdWVzLzMwOTZcbiAgICAgICAgICAgIGlmIChpbnRlZ3JpdHlJbk1hbmlmZXN0ICYmXG4gICAgICAgICAgICAgICAgbm9JbnRlZ3JpdHlDb25mbGljdCAmJlxuICAgICAgICAgICAgICAgIHJlcXVlc3QubW9kZSAhPT0gJ25vLWNvcnMnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXNlRGVmYXVsdENhY2hlYWJpbGl0eVBsdWdpbklmTmVlZGVkKCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgd2FzQ2FjaGVkID0gYXdhaXQgaGFuZGxlci5jYWNoZVB1dChyZXF1ZXN0LCByZXNwb25zZS5jbG9uZSgpKTtcbiAgICAgICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAod2FzQ2FjaGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIubG9nKGBBIHJlc3BvbnNlIGZvciAke2dldEZyaWVuZGx5VVJMKHJlcXVlc3QudXJsKX0gYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYHdhcyB1c2VkIHRvIFwicmVwYWlyXCIgdGhlIHByZWNhY2hlLmApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gVGhpcyBzaG91bGRuJ3Qgbm9ybWFsbHkgaGFwcGVuLCBidXQgdGhlcmUgYXJlIGVkZ2UgY2FzZXM6XG4gICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vR29vZ2xlQ2hyb21lL3dvcmtib3gvaXNzdWVzLzE0NDFcbiAgICAgICAgICAgIHRocm93IG5ldyBXb3JrYm94RXJyb3IoJ21pc3NpbmctcHJlY2FjaGUtZW50cnknLCB7XG4gICAgICAgICAgICAgICAgY2FjaGVOYW1lOiB0aGlzLmNhY2hlTmFtZSxcbiAgICAgICAgICAgICAgICB1cmw6IHJlcXVlc3QudXJsLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlS2V5ID0gcGFyYW1zLmNhY2hlS2V5IHx8IChhd2FpdCBoYW5kbGVyLmdldENhY2hlS2V5KHJlcXVlc3QsICdyZWFkJykpO1xuICAgICAgICAgICAgLy8gV29ya2JveCBpcyBnb2luZyB0byBoYW5kbGUgdGhlIHJvdXRlLlxuICAgICAgICAgICAgLy8gcHJpbnQgdGhlIHJvdXRpbmcgZGV0YWlscyB0byB0aGUgY29uc29sZS5cbiAgICAgICAgICAgIGxvZ2dlci5ncm91cENvbGxhcHNlZChgUHJlY2FjaGluZyBpcyByZXNwb25kaW5nIHRvOiBgICsgZ2V0RnJpZW5kbHlVUkwocmVxdWVzdC51cmwpKTtcbiAgICAgICAgICAgIGxvZ2dlci5sb2coYFNlcnZpbmcgdGhlIHByZWNhY2hlZCB1cmw6ICR7Z2V0RnJpZW5kbHlVUkwoY2FjaGVLZXkgaW5zdGFuY2VvZiBSZXF1ZXN0ID8gY2FjaGVLZXkudXJsIDogY2FjaGVLZXkpfWApO1xuICAgICAgICAgICAgbG9nZ2VyLmdyb3VwQ29sbGFwc2VkKGBWaWV3IHJlcXVlc3QgZGV0YWlscyBoZXJlLmApO1xuICAgICAgICAgICAgbG9nZ2VyLmxvZyhyZXF1ZXN0KTtcbiAgICAgICAgICAgIGxvZ2dlci5ncm91cEVuZCgpO1xuICAgICAgICAgICAgbG9nZ2VyLmdyb3VwQ29sbGFwc2VkKGBWaWV3IHJlc3BvbnNlIGRldGFpbHMgaGVyZS5gKTtcbiAgICAgICAgICAgIGxvZ2dlci5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgbG9nZ2VyLmdyb3VwRW5kKCk7XG4gICAgICAgICAgICBsb2dnZXIuZ3JvdXBFbmQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfVxuICAgIGFzeW5jIF9oYW5kbGVJbnN0YWxsKHJlcXVlc3QsIGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5fdXNlRGVmYXVsdENhY2hlYWJpbGl0eVBsdWdpbklmTmVlZGVkKCk7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaGFuZGxlci5mZXRjaChyZXF1ZXN0KTtcbiAgICAgICAgLy8gTWFrZSBzdXJlIHdlIGRlZmVyIGNhY2hlUHV0KCkgdW50aWwgYWZ0ZXIgd2Uga25vdyB0aGUgcmVzcG9uc2VcbiAgICAgICAgLy8gc2hvdWxkIGJlIGNhY2hlZDsgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9Hb29nbGVDaHJvbWUvd29ya2JveC9pc3N1ZXMvMjczN1xuICAgICAgICBjb25zdCB3YXNDYWNoZWQgPSBhd2FpdCBoYW5kbGVyLmNhY2hlUHV0KHJlcXVlc3QsIHJlc3BvbnNlLmNsb25lKCkpO1xuICAgICAgICBpZiAoIXdhc0NhY2hlZCkge1xuICAgICAgICAgICAgLy8gVGhyb3dpbmcgaGVyZSB3aWxsIGxlYWQgdG8gdGhlIGBpbnN0YWxsYCBoYW5kbGVyIGZhaWxpbmcsIHdoaWNoXG4gICAgICAgICAgICAvLyB3ZSB3YW50IHRvIGRvIGlmICphbnkqIG9mIHRoZSByZXNwb25zZXMgYXJlbid0IHNhZmUgdG8gY2FjaGUuXG4gICAgICAgICAgICB0aHJvdyBuZXcgV29ya2JveEVycm9yKCdiYWQtcHJlY2FjaGluZy1yZXNwb25zZScsIHtcbiAgICAgICAgICAgICAgICB1cmw6IHJlcXVlc3QudXJsLFxuICAgICAgICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGlzIG1ldGhvZCBpcyBjb21wbGV4LCBhcyB0aGVyZSBhIG51bWJlciBvZiB0aGluZ3MgdG8gYWNjb3VudCBmb3I6XG4gICAgICpcbiAgICAgKiBUaGUgYHBsdWdpbnNgIGFycmF5IGNhbiBiZSBzZXQgYXQgY29uc3RydWN0aW9uLCBhbmQvb3IgaXQgbWlnaHQgYmUgYWRkZWQgdG9cbiAgICAgKiB0byBhdCBhbnkgdGltZSBiZWZvcmUgdGhlIHN0cmF0ZWd5IGlzIHVzZWQuXG4gICAgICpcbiAgICAgKiBBdCB0aGUgdGltZSB0aGUgc3RyYXRlZ3kgaXMgdXNlZCAoaS5lLiBkdXJpbmcgYW4gYGluc3RhbGxgIGV2ZW50KSwgdGhlcmVcbiAgICAgKiBuZWVkcyB0byBiZSBhdCBsZWFzdCBvbmUgcGx1Z2luIHRoYXQgaW1wbGVtZW50cyBgY2FjaGVXaWxsVXBkYXRlYCBpbiB0aGVcbiAgICAgKiBhcnJheSwgb3RoZXIgdGhhbiBgY29weVJlZGlyZWN0ZWRDYWNoZWFibGVSZXNwb25zZXNQbHVnaW5gLlxuICAgICAqXG4gICAgICogLSBJZiB0aGlzIG1ldGhvZCBpcyBjYWxsZWQgYW5kIHRoZXJlIGFyZSBubyBzdWl0YWJsZSBgY2FjaGVXaWxsVXBkYXRlYFxuICAgICAqIHBsdWdpbnMsIHdlIG5lZWQgdG8gYWRkIGBkZWZhdWx0UHJlY2FjaGVDYWNoZWFiaWxpdHlQbHVnaW5gLlxuICAgICAqXG4gICAgICogLSBJZiB0aGlzIG1ldGhvZCBpcyBjYWxsZWQgYW5kIHRoZXJlIGlzIGV4YWN0bHkgb25lIGBjYWNoZVdpbGxVcGRhdGVgLCB0aGVuXG4gICAgICogd2UgZG9uJ3QgaGF2ZSB0byBkbyBhbnl0aGluZyAodGhpcyBtaWdodCBiZSBhIHByZXZpb3VzbHkgYWRkZWRcbiAgICAgKiBgZGVmYXVsdFByZWNhY2hlQ2FjaGVhYmlsaXR5UGx1Z2luYCwgb3IgaXQgbWlnaHQgYmUgYSBjdXN0b20gcGx1Z2luKS5cbiAgICAgKlxuICAgICAqIC0gSWYgdGhpcyBtZXRob2QgaXMgY2FsbGVkIGFuZCB0aGVyZSBpcyBtb3JlIHRoYW4gb25lIGBjYWNoZVdpbGxVcGRhdGVgLFxuICAgICAqIHRoZW4gd2UgbmVlZCB0byBjaGVjayBpZiBvbmUgaXMgYGRlZmF1bHRQcmVjYWNoZUNhY2hlYWJpbGl0eVBsdWdpbmAuIElmIHNvLFxuICAgICAqIHdlIG5lZWQgdG8gcmVtb3ZlIGl0LiAoVGhpcyBzaXR1YXRpb24gaXMgdW5saWtlbHksIGJ1dCBpdCBjb3VsZCBoYXBwZW4gaWZcbiAgICAgKiB0aGUgc3RyYXRlZ3kgaXMgdXNlZCBtdWx0aXBsZSB0aW1lcywgdGhlIGZpcnN0IHdpdGhvdXQgYSBgY2FjaGVXaWxsVXBkYXRlYCxcbiAgICAgKiBhbmQgdGhlbiBsYXRlciBvbiBhZnRlciBtYW51YWxseSBhZGRpbmcgYSBjdXN0b20gYGNhY2hlV2lsbFVwZGF0ZWAuKVxuICAgICAqXG4gICAgICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9Hb29nbGVDaHJvbWUvd29ya2JveC9pc3N1ZXMvMjczNyBmb3IgbW9yZSBjb250ZXh0LlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfdXNlRGVmYXVsdENhY2hlYWJpbGl0eVBsdWdpbklmTmVlZGVkKCkge1xuICAgICAgICBsZXQgZGVmYXVsdFBsdWdpbkluZGV4ID0gbnVsbDtcbiAgICAgICAgbGV0IGNhY2hlV2lsbFVwZGF0ZVBsdWdpbkNvdW50ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBbaW5kZXgsIHBsdWdpbl0gb2YgdGhpcy5wbHVnaW5zLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgLy8gSWdub3JlIHRoZSBjb3B5IHJlZGlyZWN0ZWQgcGx1Z2luIHdoZW4gZGV0ZXJtaW5pbmcgd2hhdCB0byBkby5cbiAgICAgICAgICAgIGlmIChwbHVnaW4gPT09IFByZWNhY2hlU3RyYXRlZ3kuY29weVJlZGlyZWN0ZWRDYWNoZWFibGVSZXNwb25zZXNQbHVnaW4pIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFNhdmUgdGhlIGRlZmF1bHQgcGx1Z2luJ3MgaW5kZXgsIGluIGNhc2UgaXQgbmVlZHMgdG8gYmUgcmVtb3ZlZC5cbiAgICAgICAgICAgIGlmIChwbHVnaW4gPT09IFByZWNhY2hlU3RyYXRlZ3kuZGVmYXVsdFByZWNhY2hlQ2FjaGVhYmlsaXR5UGx1Z2luKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdFBsdWdpbkluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGx1Z2luLmNhY2hlV2lsbFVwZGF0ZSkge1xuICAgICAgICAgICAgICAgIGNhY2hlV2lsbFVwZGF0ZVBsdWdpbkNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNhY2hlV2lsbFVwZGF0ZVBsdWdpbkNvdW50ID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbnMucHVzaChQcmVjYWNoZVN0cmF0ZWd5LmRlZmF1bHRQcmVjYWNoZUNhY2hlYWJpbGl0eVBsdWdpbik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY2FjaGVXaWxsVXBkYXRlUGx1Z2luQ291bnQgPiAxICYmIGRlZmF1bHRQbHVnaW5JbmRleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gT25seSByZW1vdmUgdGhlIGRlZmF1bHQgcGx1Z2luOyBtdWx0aXBsZSBjdXN0b20gcGx1Z2lucyBhcmUgYWxsb3dlZC5cbiAgICAgICAgICAgIHRoaXMucGx1Z2lucy5zcGxpY2UoZGVmYXVsdFBsdWdpbkluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBOb3RoaW5nIG5lZWRzIHRvIGJlIGRvbmUgaWYgY2FjaGVXaWxsVXBkYXRlUGx1Z2luQ291bnQgaXMgMVxuICAgIH1cbn1cblByZWNhY2hlU3RyYXRlZ3kuZGVmYXVsdFByZWNhY2hlQ2FjaGVhYmlsaXR5UGx1Z2luID0ge1xuICAgIGFzeW5jIGNhY2hlV2lsbFVwZGF0ZSh7IHJlc3BvbnNlIH0pIHtcbiAgICAgICAgaWYgKCFyZXNwb25zZSB8fCByZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSxcbn07XG5QcmVjYWNoZVN0cmF0ZWd5LmNvcHlSZWRpcmVjdGVkQ2FjaGVhYmxlUmVzcG9uc2VzUGx1Z2luID0ge1xuICAgIGFzeW5jIGNhY2hlV2lsbFVwZGF0ZSh7IHJlc3BvbnNlIH0pIHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnJlZGlyZWN0ZWQgPyBhd2FpdCBjb3B5UmVzcG9uc2UocmVzcG9uc2UpIDogcmVzcG9uc2U7XG4gICAgfSxcbn07XG5leHBvcnQgeyBQcmVjYWNoZVN0cmF0ZWd5IH07XG4iLCIvKlxuICBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG5cbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvYXNzZXJ0LmpzJztcbmltcG9ydCB7IGNhY2hlTmFtZXMgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvY2FjaGVOYW1lcy5qcyc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvbG9nZ2VyLmpzJztcbmltcG9ydCB7IFdvcmtib3hFcnJvciB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9Xb3JrYm94RXJyb3IuanMnO1xuaW1wb3J0IHsgd2FpdFVudGlsIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL3dhaXRVbnRpbC5qcyc7XG5pbXBvcnQgeyBjcmVhdGVDYWNoZUtleSB9IGZyb20gJy4vdXRpbHMvY3JlYXRlQ2FjaGVLZXkuanMnO1xuaW1wb3J0IHsgUHJlY2FjaGVJbnN0YWxsUmVwb3J0UGx1Z2luIH0gZnJvbSAnLi91dGlscy9QcmVjYWNoZUluc3RhbGxSZXBvcnRQbHVnaW4uanMnO1xuaW1wb3J0IHsgUHJlY2FjaGVDYWNoZUtleVBsdWdpbiB9IGZyb20gJy4vdXRpbHMvUHJlY2FjaGVDYWNoZUtleVBsdWdpbi5qcyc7XG5pbXBvcnQgeyBwcmludENsZWFudXBEZXRhaWxzIH0gZnJvbSAnLi91dGlscy9wcmludENsZWFudXBEZXRhaWxzLmpzJztcbmltcG9ydCB7IHByaW50SW5zdGFsbERldGFpbHMgfSBmcm9tICcuL3V0aWxzL3ByaW50SW5zdGFsbERldGFpbHMuanMnO1xuaW1wb3J0IHsgUHJlY2FjaGVTdHJhdGVneSB9IGZyb20gJy4vUHJlY2FjaGVTdHJhdGVneS5qcyc7XG5pbXBvcnQgJy4vX3ZlcnNpb24uanMnO1xuLyoqXG4gKiBQZXJmb3JtcyBlZmZpY2llbnQgcHJlY2FjaGluZyBvZiBhc3NldHMuXG4gKlxuICogQG1lbWJlcm9mIHdvcmtib3gtcHJlY2FjaGluZ1xuICovXG5jbGFzcyBQcmVjYWNoZUNvbnRyb2xsZXIge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBQcmVjYWNoZUNvbnRyb2xsZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmNhY2hlTmFtZV0gVGhlIGNhY2hlIHRvIHVzZSBmb3IgcHJlY2FjaGluZy5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMucGx1Z2luc10gUGx1Z2lucyB0byB1c2Ugd2hlbiBwcmVjYWNoaW5nIGFzIHdlbGxcbiAgICAgKiBhcyByZXNwb25kaW5nIHRvIGZldGNoIGV2ZW50cyBmb3IgcHJlY2FjaGVkIGFzc2V0cy5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmZhbGxiYWNrVG9OZXR3b3JrPXRydWVdIFdoZXRoZXIgdG8gYXR0ZW1wdCB0b1xuICAgICAqIGdldCB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgbmV0d29yayBpZiB0aGVyZSdzIGEgcHJlY2FjaGUgbWlzcy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih7IGNhY2hlTmFtZSwgcGx1Z2lucyA9IFtdLCBmYWxsYmFja1RvTmV0d29yayA9IHRydWUsIH0gPSB7fSkge1xuICAgICAgICB0aGlzLl91cmxzVG9DYWNoZUtleXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuX3VybHNUb0NhY2hlTW9kZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuX2NhY2hlS2V5c1RvSW50ZWdyaXRpZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuX3N0cmF0ZWd5ID0gbmV3IFByZWNhY2hlU3RyYXRlZ3koe1xuICAgICAgICAgICAgY2FjaGVOYW1lOiBjYWNoZU5hbWVzLmdldFByZWNhY2hlTmFtZShjYWNoZU5hbWUpLFxuICAgICAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgICAgICAgIC4uLnBsdWdpbnMsXG4gICAgICAgICAgICAgICAgbmV3IFByZWNhY2hlQ2FjaGVLZXlQbHVnaW4oeyBwcmVjYWNoZUNvbnRyb2xsZXI6IHRoaXMgfSksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgZmFsbGJhY2tUb05ldHdvcmssXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBCaW5kIHRoZSBpbnN0YWxsIGFuZCBhY3RpdmF0ZSBtZXRob2RzIHRvIHRoZSBpbnN0YW5jZS5cbiAgICAgICAgdGhpcy5pbnN0YWxsID0gdGhpcy5pbnN0YWxsLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuYWN0aXZhdGUgPSB0aGlzLmFjdGl2YXRlLmJpbmQodGhpcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEB0eXBlIHt3b3JrYm94LXByZWNhY2hpbmcuUHJlY2FjaGVTdHJhdGVneX0gVGhlIHN0cmF0ZWd5IGNyZWF0ZWQgYnkgdGhpcyBjb250cm9sbGVyIGFuZFxuICAgICAqIHVzZWQgdG8gY2FjaGUgYXNzZXRzIGFuZCByZXNwb25kIHRvIGZldGNoIGV2ZW50cy5cbiAgICAgKi9cbiAgICBnZXQgc3RyYXRlZ3koKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdHJhdGVneTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWRkcyBpdGVtcyB0byB0aGUgcHJlY2FjaGUgbGlzdCwgcmVtb3ZpbmcgYW55IGR1cGxpY2F0ZXMgYW5kXG4gICAgICogc3RvcmVzIHRoZSBmaWxlcyBpbiB0aGVcbiAgICAgKiB7QGxpbmsgd29ya2JveC1jb3JlLmNhY2hlTmFtZXN8XCJwcmVjYWNoZSBjYWNoZVwifSB3aGVuIHRoZSBzZXJ2aWNlXG4gICAgICogd29ya2VyIGluc3RhbGxzLlxuICAgICAqXG4gICAgICogVGhpcyBtZXRob2QgY2FuIGJlIGNhbGxlZCBtdWx0aXBsZSB0aW1lcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0fHN0cmluZz59IFtlbnRyaWVzPVtdXSBBcnJheSBvZiBlbnRyaWVzIHRvIHByZWNhY2hlLlxuICAgICAqL1xuICAgIHByZWNhY2hlKGVudHJpZXMpIHtcbiAgICAgICAgdGhpcy5hZGRUb0NhY2hlTGlzdChlbnRyaWVzKTtcbiAgICAgICAgaWYgKCF0aGlzLl9pbnN0YWxsQW5kQWN0aXZlTGlzdGVuZXJzQWRkZWQpIHtcbiAgICAgICAgICAgIHNlbGYuYWRkRXZlbnRMaXN0ZW5lcignaW5zdGFsbCcsIHRoaXMuaW5zdGFsbCk7XG4gICAgICAgICAgICBzZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ2FjdGl2YXRlJywgdGhpcy5hY3RpdmF0ZSk7XG4gICAgICAgICAgICB0aGlzLl9pbnN0YWxsQW5kQWN0aXZlTGlzdGVuZXJzQWRkZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoaXMgbWV0aG9kIHdpbGwgYWRkIGl0ZW1zIHRvIHRoZSBwcmVjYWNoZSBsaXN0LCByZW1vdmluZyBkdXBsaWNhdGVzXG4gICAgICogYW5kIGVuc3VyaW5nIHRoZSBpbmZvcm1hdGlvbiBpcyB2YWxpZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXk8d29ya2JveC1wcmVjYWNoaW5nLlByZWNhY2hlQ29udHJvbGxlci5QcmVjYWNoZUVudHJ5fHN0cmluZz59IGVudHJpZXNcbiAgICAgKiAgICAgQXJyYXkgb2YgZW50cmllcyB0byBwcmVjYWNoZS5cbiAgICAgKi9cbiAgICBhZGRUb0NhY2hlTGlzdChlbnRyaWVzKSB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICBhc3NlcnQuaXNBcnJheShlbnRyaWVzLCB7XG4gICAgICAgICAgICAgICAgbW9kdWxlTmFtZTogJ3dvcmtib3gtcHJlY2FjaGluZycsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnUHJlY2FjaGVDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBmdW5jTmFtZTogJ2FkZFRvQ2FjaGVMaXN0JyxcbiAgICAgICAgICAgICAgICBwYXJhbU5hbWU6ICdlbnRyaWVzJyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHVybHNUb1dhcm5BYm91dCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGVudHJpZXMpIHtcbiAgICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vR29vZ2xlQ2hyb21lL3dvcmtib3gvaXNzdWVzLzIyNTlcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZW50cnkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgdXJsc1RvV2FybkFib3V0LnB1c2goZW50cnkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZW50cnkgJiYgZW50cnkucmV2aXNpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHVybHNUb1dhcm5BYm91dC5wdXNoKGVudHJ5LnVybCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB7IGNhY2hlS2V5LCB1cmwgfSA9IGNyZWF0ZUNhY2hlS2V5KGVudHJ5KTtcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlTW9kZSA9IHR5cGVvZiBlbnRyeSAhPT0gJ3N0cmluZycgJiYgZW50cnkucmV2aXNpb24gPyAncmVsb2FkJyA6ICdkZWZhdWx0JztcbiAgICAgICAgICAgIGlmICh0aGlzLl91cmxzVG9DYWNoZUtleXMuaGFzKHVybCkgJiZcbiAgICAgICAgICAgICAgICB0aGlzLl91cmxzVG9DYWNoZUtleXMuZ2V0KHVybCkgIT09IGNhY2hlS2V5KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFdvcmtib3hFcnJvcignYWRkLXRvLWNhY2hlLWxpc3QtY29uZmxpY3RpbmctZW50cmllcycsIHtcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RFbnRyeTogdGhpcy5fdXJsc1RvQ2FjaGVLZXlzLmdldCh1cmwpLFxuICAgICAgICAgICAgICAgICAgICBzZWNvbmRFbnRyeTogY2FjaGVLZXksXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSAnc3RyaW5nJyAmJiBlbnRyeS5pbnRlZ3JpdHkpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY2FjaGVLZXlzVG9JbnRlZ3JpdGllcy5oYXMoY2FjaGVLZXkpICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlS2V5c1RvSW50ZWdyaXRpZXMuZ2V0KGNhY2hlS2V5KSAhPT0gZW50cnkuaW50ZWdyaXR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBXb3JrYm94RXJyb3IoJ2FkZC10by1jYWNoZS1saXN0LWNvbmZsaWN0aW5nLWludGVncml0aWVzJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FjaGVLZXlzVG9JbnRlZ3JpdGllcy5zZXQoY2FjaGVLZXksIGVudHJ5LmludGVncml0eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl91cmxzVG9DYWNoZUtleXMuc2V0KHVybCwgY2FjaGVLZXkpO1xuICAgICAgICAgICAgdGhpcy5fdXJsc1RvQ2FjaGVNb2Rlcy5zZXQodXJsLCBjYWNoZU1vZGUpO1xuICAgICAgICAgICAgaWYgKHVybHNUb1dhcm5BYm91dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgd2FybmluZ01lc3NhZ2UgPSBgV29ya2JveCBpcyBwcmVjYWNoaW5nIFVSTHMgd2l0aG91dCByZXZpc2lvbiBgICtcbiAgICAgICAgICAgICAgICAgICAgYGluZm86ICR7dXJsc1RvV2FybkFib3V0LmpvaW4oJywgJyl9XFxuVGhpcyBpcyBnZW5lcmFsbHkgTk9UIHNhZmUuIGAgK1xuICAgICAgICAgICAgICAgICAgICBgTGVhcm4gbW9yZSBhdCBodHRwczovL2JpdC5seS93Yi1wcmVjYWNoZWA7XG4gICAgICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVXNlIGNvbnNvbGUgZGlyZWN0bHkgdG8gZGlzcGxheSB0aGlzIHdhcm5pbmcgd2l0aG91dCBibG9hdGluZ1xuICAgICAgICAgICAgICAgICAgICAvLyBidW5kbGUgc2l6ZXMgYnkgcHVsbGluZyBpbiBhbGwgb2YgdGhlIGxvZ2dlciBjb2RlYmFzZSBpbiBwcm9kLlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4od2FybmluZ01lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLndhcm4od2FybmluZ01lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBQcmVjYWNoZXMgbmV3IGFuZCB1cGRhdGVkIGFzc2V0cy4gQ2FsbCB0aGlzIG1ldGhvZCBmcm9tIHRoZSBzZXJ2aWNlIHdvcmtlclxuICAgICAqIGluc3RhbGwgZXZlbnQuXG4gICAgICpcbiAgICAgKiBOb3RlOiB0aGlzIG1ldGhvZCBjYWxscyBgZXZlbnQud2FpdFVudGlsKClgIGZvciB5b3UsIHNvIHlvdSBkbyBub3QgbmVlZFxuICAgICAqIHRvIGNhbGwgaXQgeW91cnNlbGYgaW4geW91ciBldmVudCBoYW5kbGVycy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RXh0ZW5kYWJsZUV2ZW50fSBldmVudFxuICAgICAqIEByZXR1cm4ge1Byb21pc2U8d29ya2JveC1wcmVjYWNoaW5nLkluc3RhbGxSZXN1bHQ+fVxuICAgICAqL1xuICAgIGluc3RhbGwoZXZlbnQpIHtcbiAgICAgICAgLy8gd2FpdFVudGlsIHJldHVybnMgUHJvbWlzZTxhbnk+XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLXJldHVyblxuICAgICAgICByZXR1cm4gd2FpdFVudGlsKGV2ZW50LCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbnN0YWxsUmVwb3J0UGx1Z2luID0gbmV3IFByZWNhY2hlSW5zdGFsbFJlcG9ydFBsdWdpbigpO1xuICAgICAgICAgICAgdGhpcy5zdHJhdGVneS5wbHVnaW5zLnB1c2goaW5zdGFsbFJlcG9ydFBsdWdpbik7XG4gICAgICAgICAgICAvLyBDYWNoZSBlbnRyaWVzIG9uZSBhdCBhIHRpbWUuXG4gICAgICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL0dvb2dsZUNocm9tZS93b3JrYm94L2lzc3Vlcy8yNTI4XG4gICAgICAgICAgICBmb3IgKGNvbnN0IFt1cmwsIGNhY2hlS2V5XSBvZiB0aGlzLl91cmxzVG9DYWNoZUtleXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbnRlZ3JpdHkgPSB0aGlzLl9jYWNoZUtleXNUb0ludGVncml0aWVzLmdldChjYWNoZUtleSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY2FjaGVNb2RlID0gdGhpcy5fdXJsc1RvQ2FjaGVNb2Rlcy5nZXQodXJsKTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QodXJsLCB7XG4gICAgICAgICAgICAgICAgICAgIGludGVncml0eSxcbiAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGNhY2hlTW9kZSxcbiAgICAgICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwodGhpcy5zdHJhdGVneS5oYW5kbGVBbGwoe1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHsgY2FjaGVLZXkgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdCxcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgeyB1cGRhdGVkVVJMcywgbm90VXBkYXRlZFVSTHMgfSA9IGluc3RhbGxSZXBvcnRQbHVnaW47XG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgIHByaW50SW5zdGFsbERldGFpbHModXBkYXRlZFVSTHMsIG5vdFVwZGF0ZWRVUkxzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7IHVwZGF0ZWRVUkxzLCBub3RVcGRhdGVkVVJMcyB9O1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRGVsZXRlcyBhc3NldHMgdGhhdCBhcmUgbm8gbG9uZ2VyIHByZXNlbnQgaW4gdGhlIGN1cnJlbnQgcHJlY2FjaGUgbWFuaWZlc3QuXG4gICAgICogQ2FsbCB0aGlzIG1ldGhvZCBmcm9tIHRoZSBzZXJ2aWNlIHdvcmtlciBhY3RpdmF0ZSBldmVudC5cbiAgICAgKlxuICAgICAqIE5vdGU6IHRoaXMgbWV0aG9kIGNhbGxzIGBldmVudC53YWl0VW50aWwoKWAgZm9yIHlvdSwgc28geW91IGRvIG5vdCBuZWVkXG4gICAgICogdG8gY2FsbCBpdCB5b3Vyc2VsZiBpbiB5b3VyIGV2ZW50IGhhbmRsZXJzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFeHRlbmRhYmxlRXZlbnR9IGV2ZW50XG4gICAgICogQHJldHVybiB7UHJvbWlzZTx3b3JrYm94LXByZWNhY2hpbmcuQ2xlYW51cFJlc3VsdD59XG4gICAgICovXG4gICAgYWN0aXZhdGUoZXZlbnQpIHtcbiAgICAgICAgLy8gd2FpdFVudGlsIHJldHVybnMgUHJvbWlzZTxhbnk+XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLXJldHVyblxuICAgICAgICByZXR1cm4gd2FpdFVudGlsKGV2ZW50LCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjYWNoZSA9IGF3YWl0IHNlbGYuY2FjaGVzLm9wZW4odGhpcy5zdHJhdGVneS5jYWNoZU5hbWUpO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudGx5Q2FjaGVkUmVxdWVzdHMgPSBhd2FpdCBjYWNoZS5rZXlzKCk7XG4gICAgICAgICAgICBjb25zdCBleHBlY3RlZENhY2hlS2V5cyA9IG5ldyBTZXQodGhpcy5fdXJsc1RvQ2FjaGVLZXlzLnZhbHVlcygpKTtcbiAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWRVUkxzID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJlcXVlc3Qgb2YgY3VycmVudGx5Q2FjaGVkUmVxdWVzdHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWV4cGVjdGVkQ2FjaGVLZXlzLmhhcyhyZXF1ZXN0LnVybCkpIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2FjaGUuZGVsZXRlKHJlcXVlc3QpO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGVkVVJMcy5wdXNoKHJlcXVlc3QudXJsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgIHByaW50Q2xlYW51cERldGFpbHMoZGVsZXRlZFVSTHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHsgZGVsZXRlZFVSTHMgfTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBtYXBwaW5nIG9mIGEgcHJlY2FjaGVkIFVSTCB0byB0aGUgY29ycmVzcG9uZGluZyBjYWNoZSBrZXksIHRha2luZ1xuICAgICAqIGludG8gYWNjb3VudCB0aGUgcmV2aXNpb24gaW5mb3JtYXRpb24gZm9yIHRoZSBVUkwuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtNYXA8c3RyaW5nLCBzdHJpbmc+fSBBIFVSTCB0byBjYWNoZSBrZXkgbWFwcGluZy5cbiAgICAgKi9cbiAgICBnZXRVUkxzVG9DYWNoZUtleXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl91cmxzVG9DYWNoZUtleXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBsaXN0IG9mIGFsbCB0aGUgVVJMcyB0aGF0IGhhdmUgYmVlbiBwcmVjYWNoZWQgYnkgdGhlIGN1cnJlbnRcbiAgICAgKiBzZXJ2aWNlIHdvcmtlci5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0FycmF5PHN0cmluZz59IFRoZSBwcmVjYWNoZWQgVVJMcy5cbiAgICAgKi9cbiAgICBnZXRDYWNoZWRVUkxzKCkge1xuICAgICAgICByZXR1cm4gWy4uLnRoaXMuX3VybHNUb0NhY2hlS2V5cy5rZXlzKCldO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBjYWNoZSBrZXkgdXNlZCBmb3Igc3RvcmluZyBhIGdpdmVuIFVSTC4gSWYgdGhhdCBVUkwgaXNcbiAgICAgKiB1bnZlcnNpb25lZCwgbGlrZSBgL2luZGV4Lmh0bWwnLCB0aGVuIHRoZSBjYWNoZSBrZXkgd2lsbCBiZSB0aGUgb3JpZ2luYWxcbiAgICAgKiBVUkwgd2l0aCBhIHNlYXJjaCBwYXJhbWV0ZXIgYXBwZW5kZWQgdG8gaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIEEgVVJMIHdob3NlIGNhY2hlIGtleSB5b3Ugd2FudCB0byBsb29rIHVwLlxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHZlcnNpb25lZCBVUkwgdGhhdCBjb3JyZXNwb25kcyB0byBhIGNhY2hlIGtleVxuICAgICAqIGZvciB0aGUgb3JpZ2luYWwgVVJMLCBvciB1bmRlZmluZWQgaWYgdGhhdCBVUkwgaXNuJ3QgcHJlY2FjaGVkLlxuICAgICAqL1xuICAgIGdldENhY2hlS2V5Rm9yVVJMKHVybCkge1xuICAgICAgICBjb25zdCB1cmxPYmplY3QgPSBuZXcgVVJMKHVybCwgbG9jYXRpb24uaHJlZik7XG4gICAgICAgIHJldHVybiB0aGlzLl91cmxzVG9DYWNoZUtleXMuZ2V0KHVybE9iamVjdC5ocmVmKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCBBIGNhY2hlIGtleSB3aG9zZSBTUkkgeW91IHdhbnQgdG8gbG9vayB1cC5cbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBzdWJyZXNvdXJjZSBpbnRlZ3JpdHkgYXNzb2NpYXRlZCB3aXRoIHRoZSBjYWNoZSBrZXksXG4gICAgICogb3IgdW5kZWZpbmVkIGlmIGl0J3Mgbm90IHNldC5cbiAgICAgKi9cbiAgICBnZXRJbnRlZ3JpdHlGb3JDYWNoZUtleShjYWNoZUtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2FjaGVLZXlzVG9JbnRlZ3JpdGllcy5nZXQoY2FjaGVLZXkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGlzIGFjdHMgYXMgYSBkcm9wLWluIHJlcGxhY2VtZW50IGZvclxuICAgICAqIFtgY2FjaGUubWF0Y2goKWBdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9DYWNoZS9tYXRjaClcbiAgICAgKiB3aXRoIHRoZSBmb2xsb3dpbmcgZGlmZmVyZW5jZXM6XG4gICAgICpcbiAgICAgKiAtIEl0IGtub3dzIHdoYXQgdGhlIG5hbWUgb2YgdGhlIHByZWNhY2hlIGlzLCBhbmQgb25seSBjaGVja3MgaW4gdGhhdCBjYWNoZS5cbiAgICAgKiAtIEl0IGFsbG93cyB5b3UgdG8gcGFzcyBpbiBhbiBcIm9yaWdpbmFsXCIgVVJMIHdpdGhvdXQgdmVyc2lvbmluZyBwYXJhbWV0ZXJzLFxuICAgICAqIGFuZCBpdCB3aWxsIGF1dG9tYXRpY2FsbHkgbG9vayB1cCB0aGUgY29ycmVjdCBjYWNoZSBrZXkgZm9yIHRoZSBjdXJyZW50bHlcbiAgICAgKiBhY3RpdmUgcmV2aXNpb24gb2YgdGhhdCBVUkwuXG4gICAgICpcbiAgICAgKiBFLmcuLCBgbWF0Y2hQcmVjYWNoZSgnaW5kZXguaHRtbCcpYCB3aWxsIGZpbmQgdGhlIGNvcnJlY3QgcHJlY2FjaGVkXG4gICAgICogcmVzcG9uc2UgZm9yIHRoZSBjdXJyZW50bHkgYWN0aXZlIHNlcnZpY2Ugd29ya2VyLCBldmVuIGlmIHRoZSBhY3R1YWwgY2FjaGVcbiAgICAgKiBrZXkgaXMgYCcvaW5kZXguaHRtbD9fX1dCX1JFVklTSU9OX189MTIzNGFiY2QnYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfFJlcXVlc3R9IHJlcXVlc3QgVGhlIGtleSAod2l0aG91dCByZXZpc2lvbmluZyBwYXJhbWV0ZXJzKVxuICAgICAqIHRvIGxvb2sgdXAgaW4gdGhlIHByZWNhY2hlLlxuICAgICAqIEByZXR1cm4ge1Byb21pc2U8UmVzcG9uc2V8dW5kZWZpbmVkPn1cbiAgICAgKi9cbiAgICBhc3luYyBtYXRjaFByZWNhY2hlKHJlcXVlc3QpIHtcbiAgICAgICAgY29uc3QgdXJsID0gcmVxdWVzdCBpbnN0YW5jZW9mIFJlcXVlc3QgPyByZXF1ZXN0LnVybCA6IHJlcXVlc3Q7XG4gICAgICAgIGNvbnN0IGNhY2hlS2V5ID0gdGhpcy5nZXRDYWNoZUtleUZvclVSTCh1cmwpO1xuICAgICAgICBpZiAoY2FjaGVLZXkpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlID0gYXdhaXQgc2VsZi5jYWNoZXMub3Blbih0aGlzLnN0cmF0ZWd5LmNhY2hlTmFtZSk7XG4gICAgICAgICAgICByZXR1cm4gY2FjaGUubWF0Y2goY2FjaGVLZXkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGxvb2tzIHVwIGB1cmxgIGluIHRoZSBwcmVjYWNoZSAodGFraW5nIGludG9cbiAgICAgKiBhY2NvdW50IHJldmlzaW9uIGluZm9ybWF0aW9uKSwgYW5kIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgYFJlc3BvbnNlYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIHByZWNhY2hlZCBVUkwgd2hpY2ggd2lsbCBiZSB1c2VkIHRvIGxvb2t1cCB0aGVcbiAgICAgKiBgUmVzcG9uc2VgLlxuICAgICAqIEByZXR1cm4ge3dvcmtib3gtcm91dGluZ35oYW5kbGVyQ2FsbGJhY2t9XG4gICAgICovXG4gICAgY3JlYXRlSGFuZGxlckJvdW5kVG9VUkwodXJsKSB7XG4gICAgICAgIGNvbnN0IGNhY2hlS2V5ID0gdGhpcy5nZXRDYWNoZUtleUZvclVSTCh1cmwpO1xuICAgICAgICBpZiAoIWNhY2hlS2V5KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgV29ya2JveEVycm9yKCdub24tcHJlY2FjaGVkLXVybCcsIHsgdXJsIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAob3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgb3B0aW9ucy5yZXF1ZXN0ID0gbmV3IFJlcXVlc3QodXJsKTtcbiAgICAgICAgICAgIG9wdGlvbnMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7IGNhY2hlS2V5IH0sIG9wdGlvbnMucGFyYW1zKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0cmF0ZWd5LmhhbmRsZShvcHRpb25zKTtcbiAgICAgICAgfTtcbiAgICB9XG59XG5leHBvcnQgeyBQcmVjYWNoZUNvbnRyb2xsZXIgfTtcbiIsIi8qXG4gIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCB7IFByZWNhY2hlQ29udHJvbGxlciB9IGZyb20gJy4uL1ByZWNhY2hlQ29udHJvbGxlci5qcyc7XG5pbXBvcnQgJy4uL192ZXJzaW9uLmpzJztcbmxldCBwcmVjYWNoZUNvbnRyb2xsZXI7XG4vKipcbiAqIEByZXR1cm4ge1ByZWNhY2hlQ29udHJvbGxlcn1cbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRPckNyZWF0ZVByZWNhY2hlQ29udHJvbGxlciA9ICgpID0+IHtcbiAgICBpZiAoIXByZWNhY2hlQ29udHJvbGxlcikge1xuICAgICAgICBwcmVjYWNoZUNvbnRyb2xsZXIgPSBuZXcgUHJlY2FjaGVDb250cm9sbGVyKCk7XG4gICAgfVxuICAgIHJldHVybiBwcmVjYWNoZUNvbnRyb2xsZXI7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBAdHMtaWdub3JlXG50cnkge1xuICAgIHNlbGZbJ3dvcmtib3g6cm91dGluZzo2LjUuMyddICYmIF8oKTtcbn1cbmNhdGNoIChlKSB7IH1cbiIsIi8qXG4gIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCAnLi4vX3ZlcnNpb24uanMnO1xuLyoqXG4gKiBUaGUgZGVmYXVsdCBIVFRQIG1ldGhvZCwgJ0dFVCcsIHVzZWQgd2hlbiB0aGVyZSdzIG5vIHNwZWNpZmljIG1ldGhvZFxuICogY29uZmlndXJlZCBmb3IgYSByb3V0ZS5cbiAqXG4gKiBAdHlwZSB7c3RyaW5nfVxuICpcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBkZWZhdWx0TWV0aG9kID0gJ0dFVCc7XG4vKipcbiAqIFRoZSBsaXN0IG9mIHZhbGlkIEhUVFAgbWV0aG9kcyBhc3NvY2lhdGVkIHdpdGggcmVxdWVzdHMgdGhhdCBjb3VsZCBiZSByb3V0ZWQuXG4gKlxuICogQHR5cGUge0FycmF5PHN0cmluZz59XG4gKlxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IHZhbGlkTWV0aG9kcyA9IFtcbiAgICAnREVMRVRFJyxcbiAgICAnR0VUJyxcbiAgICAnSEVBRCcsXG4gICAgJ1BBVENIJyxcbiAgICAnUE9TVCcsXG4gICAgJ1BVVCcsXG5dO1xuIiwiLypcbiAgQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL2Fzc2VydC5qcyc7XG5pbXBvcnQgJy4uL192ZXJzaW9uLmpzJztcbi8qKlxuICogQHBhcmFtIHtmdW5jdGlvbigpfE9iamVjdH0gaGFuZGxlciBFaXRoZXIgYSBmdW5jdGlvbiwgb3IgYW4gb2JqZWN0IHdpdGggYVxuICogJ2hhbmRsZScgbWV0aG9kLlxuICogQHJldHVybiB7T2JqZWN0fSBBbiBvYmplY3Qgd2l0aCBhIGhhbmRsZSBtZXRob2QuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZUhhbmRsZXIgPSAoaGFuZGxlcikgPT4ge1xuICAgIGlmIChoYW5kbGVyICYmIHR5cGVvZiBoYW5kbGVyID09PSAnb2JqZWN0Jykge1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgYXNzZXJ0Lmhhc01ldGhvZChoYW5kbGVyLCAnaGFuZGxlJywge1xuICAgICAgICAgICAgICAgIG1vZHVsZU5hbWU6ICd3b3JrYm94LXJvdXRpbmcnLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ1JvdXRlJyxcbiAgICAgICAgICAgICAgICBmdW5jTmFtZTogJ2NvbnN0cnVjdG9yJyxcbiAgICAgICAgICAgICAgICBwYXJhbU5hbWU6ICdoYW5kbGVyJyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYW5kbGVyO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgIGFzc2VydC5pc1R5cGUoaGFuZGxlciwgJ2Z1bmN0aW9uJywge1xuICAgICAgICAgICAgICAgIG1vZHVsZU5hbWU6ICd3b3JrYm94LXJvdXRpbmcnLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ1JvdXRlJyxcbiAgICAgICAgICAgICAgICBmdW5jTmFtZTogJ2NvbnN0cnVjdG9yJyxcbiAgICAgICAgICAgICAgICBwYXJhbU5hbWU6ICdoYW5kbGVyJyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGhhbmRsZTogaGFuZGxlciB9O1xuICAgIH1cbn07XG4iLCIvKlxuICBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDXG5cbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvYXNzZXJ0LmpzJztcbmltcG9ydCB7IGRlZmF1bHRNZXRob2QsIHZhbGlkTWV0aG9kcyB9IGZyb20gJy4vdXRpbHMvY29uc3RhbnRzLmpzJztcbmltcG9ydCB7IG5vcm1hbGl6ZUhhbmRsZXIgfSBmcm9tICcuL3V0aWxzL25vcm1hbGl6ZUhhbmRsZXIuanMnO1xuaW1wb3J0ICcuL192ZXJzaW9uLmpzJztcbi8qKlxuICogQSBgUm91dGVgIGNvbnNpc3RzIG9mIGEgcGFpciBvZiBjYWxsYmFjayBmdW5jdGlvbnMsIFwibWF0Y2hcIiBhbmQgXCJoYW5kbGVyXCIuXG4gKiBUaGUgXCJtYXRjaFwiIGNhbGxiYWNrIGRldGVybWluZSBpZiBhIHJvdXRlIHNob3VsZCBiZSB1c2VkIHRvIFwiaGFuZGxlXCIgYVxuICogcmVxdWVzdCBieSByZXR1cm5pbmcgYSBub24tZmFsc3kgdmFsdWUgaWYgaXQgY2FuLiBUaGUgXCJoYW5kbGVyXCIgY2FsbGJhY2tcbiAqIGlzIGNhbGxlZCB3aGVuIHRoZXJlIGlzIGEgbWF0Y2ggYW5kIHNob3VsZCByZXR1cm4gYSBQcm9taXNlIHRoYXQgcmVzb2x2ZXNcbiAqIHRvIGEgYFJlc3BvbnNlYC5cbiAqXG4gKiBAbWVtYmVyb2Ygd29ya2JveC1yb3V0aW5nXG4gKi9cbmNsYXNzIFJvdXRlIHtcbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RvciBmb3IgUm91dGUgY2xhc3MuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3dvcmtib3gtcm91dGluZ35tYXRjaENhbGxiYWNrfSBtYXRjaFxuICAgICAqIEEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBkZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHJvdXRlIG1hdGNoZXMgYSBnaXZlblxuICAgICAqIGBmZXRjaGAgZXZlbnQgYnkgcmV0dXJuaW5nIGEgbm9uLWZhbHN5IHZhbHVlLlxuICAgICAqIEBwYXJhbSB7d29ya2JveC1yb3V0aW5nfmhhbmRsZXJDYWxsYmFja30gaGFuZGxlciBBIGNhbGxiYWNrXG4gICAgICogZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgUHJvbWlzZSByZXNvbHZpbmcgdG8gYSBSZXNwb25zZS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW21ldGhvZD0nR0VUJ10gVGhlIEhUVFAgbWV0aG9kIHRvIG1hdGNoIHRoZSBSb3V0ZVxuICAgICAqIGFnYWluc3QuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IobWF0Y2gsIGhhbmRsZXIsIG1ldGhvZCA9IGRlZmF1bHRNZXRob2QpIHtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgIGFzc2VydC5pc1R5cGUobWF0Y2gsICdmdW5jdGlvbicsIHtcbiAgICAgICAgICAgICAgICBtb2R1bGVOYW1lOiAnd29ya2JveC1yb3V0aW5nJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdSb3V0ZScsXG4gICAgICAgICAgICAgICAgZnVuY05hbWU6ICdjb25zdHJ1Y3RvcicsXG4gICAgICAgICAgICAgICAgcGFyYW1OYW1lOiAnbWF0Y2gnLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAobWV0aG9kKSB7XG4gICAgICAgICAgICAgICAgYXNzZXJ0LmlzT25lT2YobWV0aG9kLCB2YWxpZE1ldGhvZHMsIHsgcGFyYW1OYW1lOiAnbWV0aG9kJyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBUaGVzZSB2YWx1ZXMgYXJlIHJlZmVyZW5jZWQgZGlyZWN0bHkgYnkgUm91dGVyIHNvIGNhbm5vdCBiZVxuICAgICAgICAvLyBhbHRlcmVkIGJ5IG1pbmlmaWNhdG9uLlxuICAgICAgICB0aGlzLmhhbmRsZXIgPSBub3JtYWxpemVIYW5kbGVyKGhhbmRsZXIpO1xuICAgICAgICB0aGlzLm1hdGNoID0gbWF0Y2g7XG4gICAgICAgIHRoaXMubWV0aG9kID0gbWV0aG9kO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7d29ya2JveC1yb3V0aW5nLWhhbmRsZXJDYWxsYmFja30gaGFuZGxlciBBIGNhbGxiYWNrXG4gICAgICogZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgUHJvbWlzZSByZXNvbHZpbmcgdG8gYSBSZXNwb25zZVxuICAgICAqL1xuICAgIHNldENhdGNoSGFuZGxlcihoYW5kbGVyKSB7XG4gICAgICAgIHRoaXMuY2F0Y2hIYW5kbGVyID0gbm9ybWFsaXplSGFuZGxlcihoYW5kbGVyKTtcbiAgICB9XG59XG5leHBvcnQgeyBSb3V0ZSB9O1xuIiwiLypcbiAgQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL2Fzc2VydC5qcyc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvbG9nZ2VyLmpzJztcbmltcG9ydCB7IFJvdXRlIH0gZnJvbSAnLi9Sb3V0ZS5qcyc7XG5pbXBvcnQgJy4vX3ZlcnNpb24uanMnO1xuLyoqXG4gKiBSZWdFeHBSb3V0ZSBtYWtlcyBpdCBlYXN5IHRvIGNyZWF0ZSBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBiYXNlZFxuICoge0BsaW5rIHdvcmtib3gtcm91dGluZy5Sb3V0ZX0uXG4gKlxuICogRm9yIHNhbWUtb3JpZ2luIHJlcXVlc3RzIHRoZSBSZWdFeHAgb25seSBuZWVkcyB0byBtYXRjaCBwYXJ0IG9mIHRoZSBVUkwuIEZvclxuICogcmVxdWVzdHMgYWdhaW5zdCB0aGlyZC1wYXJ0eSBzZXJ2ZXJzLCB5b3UgbXVzdCBkZWZpbmUgYSBSZWdFeHAgdGhhdCBtYXRjaGVzXG4gKiB0aGUgc3RhcnQgb2YgdGhlIFVSTC5cbiAqXG4gKiBAbWVtYmVyb2Ygd29ya2JveC1yb3V0aW5nXG4gKiBAZXh0ZW5kcyB3b3JrYm94LXJvdXRpbmcuUm91dGVcbiAqL1xuY2xhc3MgUmVnRXhwUm91dGUgZXh0ZW5kcyBSb3V0ZSB7XG4gICAgLyoqXG4gICAgICogSWYgdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiBjb250YWluc1xuICAgICAqIFtjYXB0dXJlIGdyb3Vwc117QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvUmVnRXhwI2dyb3VwaW5nLWJhY2stcmVmZXJlbmNlc30sXG4gICAgICogdGhlIGNhcHR1cmVkIHZhbHVlcyB3aWxsIGJlIHBhc3NlZCB0byB0aGVcbiAgICAgKiB7QGxpbmsgd29ya2JveC1yb3V0aW5nfmhhbmRsZXJDYWxsYmFja30gYHBhcmFtc2BcbiAgICAgKiBhcmd1bWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVnRXhwfSByZWdFeHAgVGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBtYXRjaCBhZ2FpbnN0IFVSTHMuXG4gICAgICogQHBhcmFtIHt3b3JrYm94LXJvdXRpbmd+aGFuZGxlckNhbGxiYWNrfSBoYW5kbGVyIEEgY2FsbGJhY2tcbiAgICAgKiBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBQcm9taXNlIHJlc3VsdGluZyBpbiBhIFJlc3BvbnNlLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbbWV0aG9kPSdHRVQnXSBUaGUgSFRUUCBtZXRob2QgdG8gbWF0Y2ggdGhlIFJvdXRlXG4gICAgICogYWdhaW5zdC5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihyZWdFeHAsIGhhbmRsZXIsIG1ldGhvZCkge1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgYXNzZXJ0LmlzSW5zdGFuY2UocmVnRXhwLCBSZWdFeHAsIHtcbiAgICAgICAgICAgICAgICBtb2R1bGVOYW1lOiAnd29ya2JveC1yb3V0aW5nJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdSZWdFeHBSb3V0ZScsXG4gICAgICAgICAgICAgICAgZnVuY05hbWU6ICdjb25zdHJ1Y3RvcicsXG4gICAgICAgICAgICAgICAgcGFyYW1OYW1lOiAncGF0dGVybicsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtYXRjaCA9ICh7IHVybCB9KSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSByZWdFeHAuZXhlYyh1cmwuaHJlZik7XG4gICAgICAgICAgICAvLyBSZXR1cm4gaW1tZWRpYXRlbHkgaWYgdGhlcmUncyBubyBtYXRjaC5cbiAgICAgICAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gUmVxdWlyZSB0aGF0IHRoZSBtYXRjaCBzdGFydCBhdCB0aGUgZmlyc3QgY2hhcmFjdGVyIGluIHRoZSBVUkwgc3RyaW5nXG4gICAgICAgICAgICAvLyBpZiBpdCdzIGEgY3Jvc3Mtb3JpZ2luIHJlcXVlc3QuXG4gICAgICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL0dvb2dsZUNocm9tZS93b3JrYm94L2lzc3Vlcy8yODEgZm9yIHRoZSBjb250ZXh0XG4gICAgICAgICAgICAvLyBiZWhpbmQgdGhpcyBiZWhhdmlvci5cbiAgICAgICAgICAgIGlmICh1cmwub3JpZ2luICE9PSBsb2NhdGlvbi5vcmlnaW4gJiYgcmVzdWx0LmluZGV4ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKGBUaGUgcmVndWxhciBleHByZXNzaW9uICcke3JlZ0V4cC50b1N0cmluZygpfScgb25seSBwYXJ0aWFsbHkgbWF0Y2hlZCBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGBhZ2FpbnN0IHRoZSBjcm9zcy1vcmlnaW4gVVJMICcke3VybC50b1N0cmluZygpfScuIFJlZ0V4cFJvdXRlJ3Mgd2lsbCBvbmx5IGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYGhhbmRsZSBjcm9zcy1vcmlnaW4gcmVxdWVzdHMgaWYgdGhleSBtYXRjaCB0aGUgZW50aXJlIFVSTC5gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSWYgdGhlIHJvdXRlIG1hdGNoZXMsIGJ1dCB0aGVyZSBhcmVuJ3QgYW55IGNhcHR1cmUgZ3JvdXBzIGRlZmluZWQsIHRoZW5cbiAgICAgICAgICAgIC8vIHRoaXMgd2lsbCByZXR1cm4gW10sIHdoaWNoIGlzIHRydXRoeSBhbmQgdGhlcmVmb3JlIHN1ZmZpY2llbnQgdG9cbiAgICAgICAgICAgIC8vIGluZGljYXRlIGEgbWF0Y2guXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgY2FwdHVyZSBncm91cHMsIHRoZW4gaXQgd2lsbCByZXR1cm4gdGhlaXIgdmFsdWVzLlxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5zbGljZSgxKTtcbiAgICAgICAgfTtcbiAgICAgICAgc3VwZXIobWF0Y2gsIGhhbmRsZXIsIG1ldGhvZCk7XG4gICAgfVxufVxuZXhwb3J0IHsgUmVnRXhwUm91dGUgfTtcbiIsIi8qXG4gIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9hc3NlcnQuanMnO1xuaW1wb3J0IHsgZ2V0RnJpZW5kbHlVUkwgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvZ2V0RnJpZW5kbHlVUkwuanMnO1xuaW1wb3J0IHsgZGVmYXVsdE1ldGhvZCB9IGZyb20gJy4vdXRpbHMvY29uc3RhbnRzLmpzJztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9sb2dnZXIuanMnO1xuaW1wb3J0IHsgbm9ybWFsaXplSGFuZGxlciB9IGZyb20gJy4vdXRpbHMvbm9ybWFsaXplSGFuZGxlci5qcyc7XG5pbXBvcnQgeyBXb3JrYm94RXJyb3IgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvV29ya2JveEVycm9yLmpzJztcbmltcG9ydCAnLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIFRoZSBSb3V0ZXIgY2FuIGJlIHVzZWQgdG8gcHJvY2VzcyBhIGBGZXRjaEV2ZW50YCB1c2luZyBvbmUgb3IgbW9yZVxuICoge0BsaW5rIHdvcmtib3gtcm91dGluZy5Sb3V0ZX0sIHJlc3BvbmRpbmcgd2l0aCBhIGBSZXNwb25zZWAgaWZcbiAqIGEgbWF0Y2hpbmcgcm91dGUgZXhpc3RzLlxuICpcbiAqIElmIG5vIHJvdXRlIG1hdGNoZXMgYSBnaXZlbiBhIHJlcXVlc3QsIHRoZSBSb3V0ZXIgd2lsbCB1c2UgYSBcImRlZmF1bHRcIlxuICogaGFuZGxlciBpZiBvbmUgaXMgZGVmaW5lZC5cbiAqXG4gKiBTaG91bGQgdGhlIG1hdGNoaW5nIFJvdXRlIHRocm93IGFuIGVycm9yLCB0aGUgUm91dGVyIHdpbGwgdXNlIGEgXCJjYXRjaFwiXG4gKiBoYW5kbGVyIGlmIG9uZSBpcyBkZWZpbmVkIHRvIGdyYWNlZnVsbHkgZGVhbCB3aXRoIGlzc3VlcyBhbmQgcmVzcG9uZCB3aXRoIGFcbiAqIFJlcXVlc3QuXG4gKlxuICogSWYgYSByZXF1ZXN0IG1hdGNoZXMgbXVsdGlwbGUgcm91dGVzLCB0aGUgKiplYXJsaWVzdCoqIHJlZ2lzdGVyZWQgcm91dGUgd2lsbFxuICogYmUgdXNlZCB0byByZXNwb25kIHRvIHRoZSByZXF1ZXN0LlxuICpcbiAqIEBtZW1iZXJvZiB3b3JrYm94LXJvdXRpbmdcbiAqL1xuY2xhc3MgUm91dGVyIHtcbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyBhIG5ldyBSb3V0ZXIuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX3JvdXRlcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5fZGVmYXVsdEhhbmRsZXJNYXAgPSBuZXcgTWFwKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge01hcDxzdHJpbmcsIEFycmF5PHdvcmtib3gtcm91dGluZy5Sb3V0ZT4+fSByb3V0ZXMgQSBgTWFwYCBvZiBIVFRQXG4gICAgICogbWV0aG9kIG5hbWUgKCdHRVQnLCBldGMuKSB0byBhbiBhcnJheSBvZiBhbGwgdGhlIGNvcnJlc3BvbmRpbmcgYFJvdXRlYFxuICAgICAqIGluc3RhbmNlcyB0aGF0IGFyZSByZWdpc3RlcmVkLlxuICAgICAqL1xuICAgIGdldCByb3V0ZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yb3V0ZXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZHMgYSBmZXRjaCBldmVudCBsaXN0ZW5lciB0byByZXNwb25kIHRvIGV2ZW50cyB3aGVuIGEgcm91dGUgbWF0Y2hlc1xuICAgICAqIHRoZSBldmVudCdzIHJlcXVlc3QuXG4gICAgICovXG4gICAgYWRkRmV0Y2hMaXN0ZW5lcigpIHtcbiAgICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMjgzNTcjaXNzdWVjb21tZW50LTQzNjQ4NDcwNVxuICAgICAgICBzZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ2ZldGNoJywgKChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyByZXF1ZXN0IH0gPSBldmVudDtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlUHJvbWlzZSA9IHRoaXMuaGFuZGxlUmVxdWVzdCh7IHJlcXVlc3QsIGV2ZW50IH0pO1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnJlc3BvbmRXaXRoKHJlc3BvbnNlUHJvbWlzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWRkcyBhIG1lc3NhZ2UgZXZlbnQgbGlzdGVuZXIgZm9yIFVSTHMgdG8gY2FjaGUgZnJvbSB0aGUgd2luZG93LlxuICAgICAqIFRoaXMgaXMgdXNlZnVsIHRvIGNhY2hlIHJlc291cmNlcyBsb2FkZWQgb24gdGhlIHBhZ2UgcHJpb3IgdG8gd2hlbiB0aGVcbiAgICAgKiBzZXJ2aWNlIHdvcmtlciBzdGFydGVkIGNvbnRyb2xsaW5nIGl0LlxuICAgICAqXG4gICAgICogVGhlIGZvcm1hdCBvZiB0aGUgbWVzc2FnZSBkYXRhIHNlbnQgZnJvbSB0aGUgd2luZG93IHNob3VsZCBiZSBhcyBmb2xsb3dzLlxuICAgICAqIFdoZXJlIHRoZSBgdXJsc1RvQ2FjaGVgIGFycmF5IG1heSBjb25zaXN0IG9mIFVSTCBzdHJpbmdzIG9yIGFuIGFycmF5IG9mXG4gICAgICogVVJMIHN0cmluZyArIGByZXF1ZXN0SW5pdGAgb2JqZWN0ICh0aGUgc2FtZSBhcyB5b3UnZCBwYXNzIHRvIGBmZXRjaCgpYCkuXG4gICAgICpcbiAgICAgKiBgYGBcbiAgICAgKiB7XG4gICAgICogICB0eXBlOiAnQ0FDSEVfVVJMUycsXG4gICAgICogICBwYXlsb2FkOiB7XG4gICAgICogICAgIHVybHNUb0NhY2hlOiBbXG4gICAgICogICAgICAgJy4vc2NyaXB0MS5qcycsXG4gICAgICogICAgICAgJy4vc2NyaXB0Mi5qcycsXG4gICAgICogICAgICAgWycuL3NjcmlwdDMuanMnLCB7bW9kZTogJ25vLWNvcnMnfV0sXG4gICAgICogICAgIF0sXG4gICAgICogICB9LFxuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBhZGRDYWNoZUxpc3RlbmVyKCkge1xuICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8yODM1NyNpc3N1ZWNvbW1lbnQtNDM2NDg0NzA1XG4gICAgICAgIHNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsICgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIC8vIGV2ZW50LmRhdGEgaXMgdHlwZSAnYW55J1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtbWVtYmVyLWFjY2Vzc1xuICAgICAgICAgICAgaWYgKGV2ZW50LmRhdGEgJiYgZXZlbnQuZGF0YS50eXBlID09PSAnQ0FDSEVfVVJMUycpIHtcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVuc2FmZS1hc3NpZ25tZW50XG4gICAgICAgICAgICAgICAgY29uc3QgeyBwYXlsb2FkIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZyhgQ2FjaGluZyBVUkxzIGZyb20gdGhlIHdpbmRvd2AsIHBheWxvYWQudXJsc1RvQ2FjaGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCByZXF1ZXN0UHJvbWlzZXMgPSBQcm9taXNlLmFsbChwYXlsb2FkLnVybHNUb0NhY2hlLm1hcCgoZW50cnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlbnRyeSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudHJ5ID0gW2VudHJ5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoLi4uZW50cnkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHsgcmVxdWVzdCwgZXZlbnQgfSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE8ocGhpbGlwd2FsdG9uKTogVHlwZVNjcmlwdCBlcnJvcnMgd2l0aG91dCB0aGlzIHR5cGVjYXN0IGZvclxuICAgICAgICAgICAgICAgICAgICAvLyBzb21lIHJlYXNvbiAocHJvYmFibHkgYSBidWcpLiBUaGUgcmVhbCB0eXBlIGhlcmUgc2hvdWxkIHdvcmsgYnV0XG4gICAgICAgICAgICAgICAgICAgIC8vIGRvZXNuJ3Q6IGBBcnJheTxQcm9taXNlPFJlc3BvbnNlPiB8IHVuZGVmaW5lZD5gLlxuICAgICAgICAgICAgICAgIH0pKTsgLy8gVHlwZVNjcmlwdFxuICAgICAgICAgICAgICAgIGV2ZW50LndhaXRVbnRpbChyZXF1ZXN0UHJvbWlzZXMpO1xuICAgICAgICAgICAgICAgIC8vIElmIGEgTWVzc2FnZUNoYW5uZWwgd2FzIHVzZWQsIHJlcGx5IHRvIHRoZSBtZXNzYWdlIG9uIHN1Y2Nlc3MuXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnBvcnRzICYmIGV2ZW50LnBvcnRzWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHZvaWQgcmVxdWVzdFByb21pc2VzLnRoZW4oKCkgPT4gZXZlbnQucG9ydHNbMF0ucG9zdE1lc3NhZ2UodHJ1ZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBcHBseSB0aGUgcm91dGluZyBydWxlcyB0byBhIEZldGNoRXZlbnQgb2JqZWN0IHRvIGdldCBhIFJlc3BvbnNlIGZyb20gYW5cbiAgICAgKiBhcHByb3ByaWF0ZSBSb3V0ZSdzIGhhbmRsZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgICAqIEBwYXJhbSB7UmVxdWVzdH0gb3B0aW9ucy5yZXF1ZXN0IFRoZSByZXF1ZXN0IHRvIGhhbmRsZS5cbiAgICAgKiBAcGFyYW0ge0V4dGVuZGFibGVFdmVudH0gb3B0aW9ucy5ldmVudCBUaGUgZXZlbnQgdGhhdCB0cmlnZ2VyZWQgdGhlXG4gICAgICogICAgIHJlcXVlc3QuXG4gICAgICogQHJldHVybiB7UHJvbWlzZTxSZXNwb25zZT58dW5kZWZpbmVkfSBBIHByb21pc2UgaXMgcmV0dXJuZWQgaWYgYVxuICAgICAqICAgICByZWdpc3RlcmVkIHJvdXRlIGNhbiBoYW5kbGUgdGhlIHJlcXVlc3QuIElmIHRoZXJlIGlzIG5vIG1hdGNoaW5nXG4gICAgICogICAgIHJvdXRlIGFuZCB0aGVyZSdzIG5vIGBkZWZhdWx0SGFuZGxlcmAsIGB1bmRlZmluZWRgIGlzIHJldHVybmVkLlxuICAgICAqL1xuICAgIGhhbmRsZVJlcXVlc3QoeyByZXF1ZXN0LCBldmVudCwgfSkge1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgYXNzZXJ0LmlzSW5zdGFuY2UocmVxdWVzdCwgUmVxdWVzdCwge1xuICAgICAgICAgICAgICAgIG1vZHVsZU5hbWU6ICd3b3JrYm94LXJvdXRpbmcnLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ1JvdXRlcicsXG4gICAgICAgICAgICAgICAgZnVuY05hbWU6ICdoYW5kbGVSZXF1ZXN0JyxcbiAgICAgICAgICAgICAgICBwYXJhbU5hbWU6ICdvcHRpb25zLnJlcXVlc3QnLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTChyZXF1ZXN0LnVybCwgbG9jYXRpb24uaHJlZik7XG4gICAgICAgIGlmICghdXJsLnByb3RvY29sLnN0YXJ0c1dpdGgoJ2h0dHAnKSkge1xuICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoYFdvcmtib3ggUm91dGVyIG9ubHkgc3VwcG9ydHMgVVJMcyB0aGF0IHN0YXJ0IHdpdGggJ2h0dHAnLmApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNhbWVPcmlnaW4gPSB1cmwub3JpZ2luID09PSBsb2NhdGlvbi5vcmlnaW47XG4gICAgICAgIGNvbnN0IHsgcGFyYW1zLCByb3V0ZSB9ID0gdGhpcy5maW5kTWF0Y2hpbmdSb3V0ZSh7XG4gICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgIHJlcXVlc3QsXG4gICAgICAgICAgICBzYW1lT3JpZ2luLFxuICAgICAgICAgICAgdXJsLFxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IGhhbmRsZXIgPSByb3V0ZSAmJiByb3V0ZS5oYW5kbGVyO1xuICAgICAgICBjb25zdCBkZWJ1Z01lc3NhZ2VzID0gW107XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICBpZiAoaGFuZGxlcikge1xuICAgICAgICAgICAgICAgIGRlYnVnTWVzc2FnZXMucHVzaChbYEZvdW5kIGEgcm91dGUgdG8gaGFuZGxlIHRoaXMgcmVxdWVzdDpgLCByb3V0ZV0pO1xuICAgICAgICAgICAgICAgIGlmIChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWdNZXNzYWdlcy5wdXNoKFtcbiAgICAgICAgICAgICAgICAgICAgICAgIGBQYXNzaW5nIHRoZSBmb2xsb3dpbmcgcGFyYW1zIHRvIHRoZSByb3V0ZSdzIGhhbmRsZXI6YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIElmIHdlIGRvbid0IGhhdmUgYSBoYW5kbGVyIGJlY2F1c2UgdGhlcmUgd2FzIG5vIG1hdGNoaW5nIHJvdXRlLCB0aGVuXG4gICAgICAgIC8vIGZhbGwgYmFjayB0byBkZWZhdWx0SGFuZGxlciBpZiB0aGF0J3MgZGVmaW5lZC5cbiAgICAgICAgY29uc3QgbWV0aG9kID0gcmVxdWVzdC5tZXRob2Q7XG4gICAgICAgIGlmICghaGFuZGxlciAmJiB0aGlzLl9kZWZhdWx0SGFuZGxlck1hcC5oYXMobWV0aG9kKSkge1xuICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgICAgICBkZWJ1Z01lc3NhZ2VzLnB1c2goYEZhaWxlZCB0byBmaW5kIGEgbWF0Y2hpbmcgcm91dGUuIEZhbGxpbmcgYCArXG4gICAgICAgICAgICAgICAgICAgIGBiYWNrIHRvIHRoZSBkZWZhdWx0IGhhbmRsZXIgZm9yICR7bWV0aG9kfS5gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhhbmRsZXIgPSB0aGlzLl9kZWZhdWx0SGFuZGxlck1hcC5nZXQobWV0aG9kKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWhhbmRsZXIpIHtcbiAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgLy8gTm8gaGFuZGxlciBzbyBXb3JrYm94IHdpbGwgZG8gbm90aGluZy4gSWYgbG9ncyBpcyBzZXQgb2YgZGVidWdcbiAgICAgICAgICAgICAgICAvLyBpLmUuIHZlcmJvc2UsIHdlIHNob3VsZCBwcmludCBvdXQgdGhpcyBpbmZvcm1hdGlvbi5cbiAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoYE5vIHJvdXRlIGZvdW5kIGZvcjogJHtnZXRGcmllbmRseVVSTCh1cmwpfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICAvLyBXZSBoYXZlIGEgaGFuZGxlciwgbWVhbmluZyBXb3JrYm94IGlzIGdvaW5nIHRvIGhhbmRsZSB0aGUgcm91dGUuXG4gICAgICAgICAgICAvLyBwcmludCB0aGUgcm91dGluZyBkZXRhaWxzIHRvIHRoZSBjb25zb2xlLlxuICAgICAgICAgICAgbG9nZ2VyLmdyb3VwQ29sbGFwc2VkKGBSb3V0ZXIgaXMgcmVzcG9uZGluZyB0bzogJHtnZXRGcmllbmRseVVSTCh1cmwpfWApO1xuICAgICAgICAgICAgZGVidWdNZXNzYWdlcy5mb3JFYWNoKChtc2cpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShtc2cpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5sb2coLi4ubXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5sb2cobXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGxvZ2dlci5ncm91cEVuZCgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFdyYXAgaW4gdHJ5IGFuZCBjYXRjaCBpbiBjYXNlIHRoZSBoYW5kbGUgbWV0aG9kIHRocm93cyBhIHN5bmNocm9ub3VzXG4gICAgICAgIC8vIGVycm9yLiBJdCBzaG91bGQgc3RpbGwgY2FsbGJhY2sgdG8gdGhlIGNhdGNoIGhhbmRsZXIuXG4gICAgICAgIGxldCByZXNwb25zZVByb21pc2U7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXNwb25zZVByb21pc2UgPSBoYW5kbGVyLmhhbmRsZSh7IHVybCwgcmVxdWVzdCwgZXZlbnQsIHBhcmFtcyB9KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXNwb25zZVByb21pc2UgPSBQcm9taXNlLnJlamVjdChlcnIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEdldCByb3V0ZSdzIGNhdGNoIGhhbmRsZXIsIGlmIGl0IGV4aXN0c1xuICAgICAgICBjb25zdCBjYXRjaEhhbmRsZXIgPSByb3V0ZSAmJiByb3V0ZS5jYXRjaEhhbmRsZXI7XG4gICAgICAgIGlmIChyZXNwb25zZVByb21pc2UgaW5zdGFuY2VvZiBQcm9taXNlICYmXG4gICAgICAgICAgICAodGhpcy5fY2F0Y2hIYW5kbGVyIHx8IGNhdGNoSGFuZGxlcikpIHtcbiAgICAgICAgICAgIHJlc3BvbnNlUHJvbWlzZSA9IHJlc3BvbnNlUHJvbWlzZS5jYXRjaChhc3luYyAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUncyBhIHJvdXRlIGNhdGNoIGhhbmRsZXIsIHByb2Nlc3MgdGhhdCBmaXJzdFxuICAgICAgICAgICAgICAgIGlmIChjYXRjaEhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN0aWxsIGluY2x1ZGUgVVJMIGhlcmUgYXMgaXQgd2lsbCBiZSBhc3luYyBmcm9tIHRoZSBjb25zb2xlIGdyb3VwXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhbmQgbWF5IG5vdCBtYWtlIHNlbnNlIHdpdGhvdXQgdGhlIFVSTFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmdyb3VwQ29sbGFwc2VkKGBFcnJvciB0aHJvd24gd2hlbiByZXNwb25kaW5nIHRvOiBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgICR7Z2V0RnJpZW5kbHlVUkwodXJsKX0uIEZhbGxpbmcgYmFjayB0byByb3V0ZSdzIENhdGNoIEhhbmRsZXIuYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEVycm9yIHRocm93biBieTpgLCByb3V0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5ncm91cEVuZCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgY2F0Y2hIYW5kbGVyLmhhbmRsZSh7IHVybCwgcmVxdWVzdCwgZXZlbnQsIHBhcmFtcyB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoY2F0Y2hFcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYXRjaEVyciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyID0gY2F0Y2hFcnI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NhdGNoSGFuZGxlcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3RpbGwgaW5jbHVkZSBVUkwgaGVyZSBhcyBpdCB3aWxsIGJlIGFzeW5jIGZyb20gdGhlIGNvbnNvbGUgZ3JvdXBcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFuZCBtYXkgbm90IG1ha2Ugc2Vuc2Ugd2l0aG91dCB0aGUgVVJMXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZ3JvdXBDb2xsYXBzZWQoYEVycm9yIHRocm93biB3aGVuIHJlc3BvbmRpbmcgdG86IGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAgJHtnZXRGcmllbmRseVVSTCh1cmwpfS4gRmFsbGluZyBiYWNrIHRvIGdsb2JhbCBDYXRjaCBIYW5kbGVyLmApO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBFcnJvciB0aHJvd24gYnk6YCwgcm91dGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZ3JvdXBFbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2F0Y2hIYW5kbGVyLmhhbmRsZSh7IHVybCwgcmVxdWVzdCwgZXZlbnQgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZVByb21pc2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENoZWNrcyBhIHJlcXVlc3QgYW5kIFVSTCAoYW5kIG9wdGlvbmFsbHkgYW4gZXZlbnQpIGFnYWluc3QgdGhlIGxpc3Qgb2ZcbiAgICAgKiByZWdpc3RlcmVkIHJvdXRlcywgYW5kIGlmIHRoZXJlJ3MgYSBtYXRjaCwgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZ1xuICAgICAqIHJvdXRlIGFsb25nIHdpdGggYW55IHBhcmFtcyBnZW5lcmF0ZWQgYnkgdGhlIG1hdGNoLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgKiBAcGFyYW0ge1VSTH0gb3B0aW9ucy51cmxcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IG9wdGlvbnMuc2FtZU9yaWdpbiBUaGUgcmVzdWx0IG9mIGNvbXBhcmluZyBgdXJsLm9yaWdpbmBcbiAgICAgKiAgICAgYWdhaW5zdCB0aGUgY3VycmVudCBvcmlnaW4uXG4gICAgICogQHBhcmFtIHtSZXF1ZXN0fSBvcHRpb25zLnJlcXVlc3QgVGhlIHJlcXVlc3QgdG8gbWF0Y2guXG4gICAgICogQHBhcmFtIHtFdmVudH0gb3B0aW9ucy5ldmVudCBUaGUgY29ycmVzcG9uZGluZyBldmVudC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEFuIG9iamVjdCB3aXRoIGByb3V0ZWAgYW5kIGBwYXJhbXNgIHByb3BlcnRpZXMuXG4gICAgICogICAgIFRoZXkgYXJlIHBvcHVsYXRlZCBpZiBhIG1hdGNoaW5nIHJvdXRlIHdhcyBmb3VuZCBvciBgdW5kZWZpbmVkYFxuICAgICAqICAgICBvdGhlcndpc2UuXG4gICAgICovXG4gICAgZmluZE1hdGNoaW5nUm91dGUoeyB1cmwsIHNhbWVPcmlnaW4sIHJlcXVlc3QsIGV2ZW50LCB9KSB7XG4gICAgICAgIGNvbnN0IHJvdXRlcyA9IHRoaXMuX3JvdXRlcy5nZXQocmVxdWVzdC5tZXRob2QpIHx8IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHJvdXRlIG9mIHJvdXRlcykge1xuICAgICAgICAgICAgbGV0IHBhcmFtcztcbiAgICAgICAgICAgIC8vIHJvdXRlLm1hdGNoIHJldHVybnMgdHlwZSBhbnksIG5vdCBwb3NzaWJsZSB0byBjaGFuZ2UgcmlnaHQgbm93LlxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtYXNzaWdubWVudFxuICAgICAgICAgICAgY29uc3QgbWF0Y2hSZXN1bHQgPSByb3V0ZS5tYXRjaCh7IHVybCwgc2FtZU9yaWdpbiwgcmVxdWVzdCwgZXZlbnQgfSk7XG4gICAgICAgICAgICBpZiAobWF0Y2hSZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBXYXJuIGRldmVsb3BlcnMgdGhhdCB1c2luZyBhbiBhc3luYyBtYXRjaENhbGxiYWNrIGlzIGFsbW9zdCBhbHdheXNcbiAgICAgICAgICAgICAgICAgICAgLy8gbm90IHRoZSByaWdodCB0aGluZyB0byBkby5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoUmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLndhcm4oYFdoaWxlIHJvdXRpbmcgJHtnZXRGcmllbmRseVVSTCh1cmwpfSwgYW4gYXN5bmMgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYG1hdGNoQ2FsbGJhY2sgZnVuY3Rpb24gd2FzIHVzZWQuIFBsZWFzZSBjb252ZXJ0IHRoZSBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgZm9sbG93aW5nIHJvdXRlIHRvIHVzZSBhIHN5bmNocm9ub3VzIG1hdGNoQ2FsbGJhY2sgZnVuY3Rpb246YCwgcm91dGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vR29vZ2xlQ2hyb21lL3dvcmtib3gvaXNzdWVzLzIwNzlcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVuc2FmZS1hc3NpZ25tZW50XG4gICAgICAgICAgICAgICAgcGFyYW1zID0gbWF0Y2hSZXN1bHQ7XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1zKSAmJiBwYXJhbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEluc3RlYWQgb2YgcGFzc2luZyBhbiBlbXB0eSBhcnJheSBpbiBhcyBwYXJhbXMsIHVzZSB1bmRlZmluZWQuXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobWF0Y2hSZXN1bHQuY29uc3RydWN0b3IgPT09IE9iamVjdCAmJiAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKG1hdGNoUmVzdWx0KS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSW5zdGVhZCBvZiBwYXNzaW5nIGFuIGVtcHR5IG9iamVjdCBpbiBhcyBwYXJhbXMsIHVzZSB1bmRlZmluZWQuXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIG1hdGNoUmVzdWx0ID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRm9yIHRoZSBib29sZWFuIHZhbHVlIHRydWUgKHJhdGhlciB0aGFuIGp1c3Qgc29tZXRoaW5nIHRydXRoLXkpLFxuICAgICAgICAgICAgICAgICAgICAvLyBkb24ndCBzZXQgcGFyYW1zLlxuICAgICAgICAgICAgICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL0dvb2dsZUNocm9tZS93b3JrYm94L3B1bGwvMjEzNCNpc3N1ZWNvbW1lbnQtNTEzOTI0MzUzXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gUmV0dXJuIGVhcmx5IGlmIGhhdmUgYSBtYXRjaC5cbiAgICAgICAgICAgICAgICByZXR1cm4geyByb3V0ZSwgcGFyYW1zIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgbm8gbWF0Y2ggd2FzIGZvdW5kIGFib3ZlLCByZXR1cm4gYW5kIGVtcHR5IG9iamVjdC5cbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBEZWZpbmUgYSBkZWZhdWx0IGBoYW5kbGVyYCB0aGF0J3MgY2FsbGVkIHdoZW4gbm8gcm91dGVzIGV4cGxpY2l0bHlcbiAgICAgKiBtYXRjaCB0aGUgaW5jb21pbmcgcmVxdWVzdC5cbiAgICAgKlxuICAgICAqIEVhY2ggSFRUUCBtZXRob2QgKCdHRVQnLCAnUE9TVCcsIGV0Yy4pIGdldHMgaXRzIG93biBkZWZhdWx0IGhhbmRsZXIuXG4gICAgICpcbiAgICAgKiBXaXRob3V0IGEgZGVmYXVsdCBoYW5kbGVyLCB1bm1hdGNoZWQgcmVxdWVzdHMgd2lsbCBnbyBhZ2FpbnN0IHRoZVxuICAgICAqIG5ldHdvcmsgYXMgaWYgdGhlcmUgd2VyZSBubyBzZXJ2aWNlIHdvcmtlciBwcmVzZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHt3b3JrYm94LXJvdXRpbmd+aGFuZGxlckNhbGxiYWNrfSBoYW5kbGVyIEEgY2FsbGJhY2tcbiAgICAgKiBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBQcm9taXNlIHJlc3VsdGluZyBpbiBhIFJlc3BvbnNlLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbbWV0aG9kPSdHRVQnXSBUaGUgSFRUUCBtZXRob2QgdG8gYXNzb2NpYXRlIHdpdGggdGhpc1xuICAgICAqIGRlZmF1bHQgaGFuZGxlci4gRWFjaCBtZXRob2QgaGFzIGl0cyBvd24gZGVmYXVsdC5cbiAgICAgKi9cbiAgICBzZXREZWZhdWx0SGFuZGxlcihoYW5kbGVyLCBtZXRob2QgPSBkZWZhdWx0TWV0aG9kKSB7XG4gICAgICAgIHRoaXMuX2RlZmF1bHRIYW5kbGVyTWFwLnNldChtZXRob2QsIG5vcm1hbGl6ZUhhbmRsZXIoaGFuZGxlcikpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJZiBhIFJvdXRlIHRocm93cyBhbiBlcnJvciB3aGlsZSBoYW5kbGluZyBhIHJlcXVlc3QsIHRoaXMgYGhhbmRsZXJgXG4gICAgICogd2lsbCBiZSBjYWxsZWQgYW5kIGdpdmVuIGEgY2hhbmNlIHRvIHByb3ZpZGUgYSByZXNwb25zZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7d29ya2JveC1yb3V0aW5nfmhhbmRsZXJDYWxsYmFja30gaGFuZGxlciBBIGNhbGxiYWNrXG4gICAgICogZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgUHJvbWlzZSByZXN1bHRpbmcgaW4gYSBSZXNwb25zZS5cbiAgICAgKi9cbiAgICBzZXRDYXRjaEhhbmRsZXIoaGFuZGxlcikge1xuICAgICAgICB0aGlzLl9jYXRjaEhhbmRsZXIgPSBub3JtYWxpemVIYW5kbGVyKGhhbmRsZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlcnMgYSByb3V0ZSB3aXRoIHRoZSByb3V0ZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3dvcmtib3gtcm91dGluZy5Sb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRvIHJlZ2lzdGVyLlxuICAgICAqL1xuICAgIHJlZ2lzdGVyUm91dGUocm91dGUpIHtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgIGFzc2VydC5pc1R5cGUocm91dGUsICdvYmplY3QnLCB7XG4gICAgICAgICAgICAgICAgbW9kdWxlTmFtZTogJ3dvcmtib3gtcm91dGluZycsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnUm91dGVyJyxcbiAgICAgICAgICAgICAgICBmdW5jTmFtZTogJ3JlZ2lzdGVyUm91dGUnLFxuICAgICAgICAgICAgICAgIHBhcmFtTmFtZTogJ3JvdXRlJyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYXNzZXJ0Lmhhc01ldGhvZChyb3V0ZSwgJ21hdGNoJywge1xuICAgICAgICAgICAgICAgIG1vZHVsZU5hbWU6ICd3b3JrYm94LXJvdXRpbmcnLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ1JvdXRlcicsXG4gICAgICAgICAgICAgICAgZnVuY05hbWU6ICdyZWdpc3RlclJvdXRlJyxcbiAgICAgICAgICAgICAgICBwYXJhbU5hbWU6ICdyb3V0ZScsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGFzc2VydC5pc1R5cGUocm91dGUuaGFuZGxlciwgJ29iamVjdCcsIHtcbiAgICAgICAgICAgICAgICBtb2R1bGVOYW1lOiAnd29ya2JveC1yb3V0aW5nJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdSb3V0ZXInLFxuICAgICAgICAgICAgICAgIGZ1bmNOYW1lOiAncmVnaXN0ZXJSb3V0ZScsXG4gICAgICAgICAgICAgICAgcGFyYW1OYW1lOiAncm91dGUnLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhc3NlcnQuaGFzTWV0aG9kKHJvdXRlLmhhbmRsZXIsICdoYW5kbGUnLCB7XG4gICAgICAgICAgICAgICAgbW9kdWxlTmFtZTogJ3dvcmtib3gtcm91dGluZycsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnUm91dGVyJyxcbiAgICAgICAgICAgICAgICBmdW5jTmFtZTogJ3JlZ2lzdGVyUm91dGUnLFxuICAgICAgICAgICAgICAgIHBhcmFtTmFtZTogJ3JvdXRlLmhhbmRsZXInLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhc3NlcnQuaXNUeXBlKHJvdXRlLm1ldGhvZCwgJ3N0cmluZycsIHtcbiAgICAgICAgICAgICAgICBtb2R1bGVOYW1lOiAnd29ya2JveC1yb3V0aW5nJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdSb3V0ZXInLFxuICAgICAgICAgICAgICAgIGZ1bmNOYW1lOiAncmVnaXN0ZXJSb3V0ZScsXG4gICAgICAgICAgICAgICAgcGFyYW1OYW1lOiAncm91dGUubWV0aG9kJyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fcm91dGVzLmhhcyhyb3V0ZS5tZXRob2QpKSB7XG4gICAgICAgICAgICB0aGlzLl9yb3V0ZXMuc2V0KHJvdXRlLm1ldGhvZCwgW10pO1xuICAgICAgICB9XG4gICAgICAgIC8vIEdpdmUgcHJlY2VkZW5jZSB0byBhbGwgb2YgdGhlIGVhcmxpZXIgcm91dGVzIGJ5IGFkZGluZyB0aGlzIGFkZGl0aW9uYWxcbiAgICAgICAgLy8gcm91dGUgdG8gdGhlIGVuZCBvZiB0aGUgYXJyYXkuXG4gICAgICAgIHRoaXMuX3JvdXRlcy5nZXQocm91dGUubWV0aG9kKS5wdXNoKHJvdXRlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVW5yZWdpc3RlcnMgYSByb3V0ZSB3aXRoIHRoZSByb3V0ZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3dvcmtib3gtcm91dGluZy5Sb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRvIHVucmVnaXN0ZXIuXG4gICAgICovXG4gICAgdW5yZWdpc3RlclJvdXRlKHJvdXRlKSB7XG4gICAgICAgIGlmICghdGhpcy5fcm91dGVzLmhhcyhyb3V0ZS5tZXRob2QpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgV29ya2JveEVycm9yKCd1bnJlZ2lzdGVyLXJvdXRlLWJ1dC1ub3QtZm91bmQtd2l0aC1tZXRob2QnLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiByb3V0ZS5tZXRob2QsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByb3V0ZUluZGV4ID0gdGhpcy5fcm91dGVzLmdldChyb3V0ZS5tZXRob2QpLmluZGV4T2Yocm91dGUpO1xuICAgICAgICBpZiAocm91dGVJbmRleCA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9yb3V0ZXMuZ2V0KHJvdXRlLm1ldGhvZCkuc3BsaWNlKHJvdXRlSW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFdvcmtib3hFcnJvcigndW5yZWdpc3Rlci1yb3V0ZS1yb3V0ZS1ub3QtcmVnaXN0ZXJlZCcpO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IHsgUm91dGVyIH07XG4iLCIvKlxuICBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG5cbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICcuLi9Sb3V0ZXIuanMnO1xuaW1wb3J0ICcuLi9fdmVyc2lvbi5qcyc7XG5sZXQgZGVmYXVsdFJvdXRlcjtcbi8qKlxuICogQ3JlYXRlcyBhIG5ldywgc2luZ2xldG9uIFJvdXRlciBpbnN0YW5jZSBpZiBvbmUgZG9lcyBub3QgZXhpc3QuIElmIG9uZVxuICogZG9lcyBhbHJlYWR5IGV4aXN0LCB0aGF0IGluc3RhbmNlIGlzIHJldHVybmVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJuIHtSb3V0ZXJ9XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRPckNyZWF0ZURlZmF1bHRSb3V0ZXIgPSAoKSA9PiB7XG4gICAgaWYgKCFkZWZhdWx0Um91dGVyKSB7XG4gICAgICAgIGRlZmF1bHRSb3V0ZXIgPSBuZXcgUm91dGVyKCk7XG4gICAgICAgIC8vIFRoZSBoZWxwZXJzIHRoYXQgdXNlIHRoZSBkZWZhdWx0IFJvdXRlciBhc3N1bWUgdGhlc2UgbGlzdGVuZXJzIGV4aXN0LlxuICAgICAgICBkZWZhdWx0Um91dGVyLmFkZEZldGNoTGlzdGVuZXIoKTtcbiAgICAgICAgZGVmYXVsdFJvdXRlci5hZGRDYWNoZUxpc3RlbmVyKCk7XG4gICAgfVxuICAgIHJldHVybiBkZWZhdWx0Um91dGVyO1xufTtcbiIsIi8qXG4gIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9sb2dnZXIuanMnO1xuaW1wb3J0IHsgV29ya2JveEVycm9yIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL1dvcmtib3hFcnJvci5qcyc7XG5pbXBvcnQgeyBSb3V0ZSB9IGZyb20gJy4vUm91dGUuanMnO1xuaW1wb3J0IHsgUmVnRXhwUm91dGUgfSBmcm9tICcuL1JlZ0V4cFJvdXRlLmpzJztcbmltcG9ydCB7IGdldE9yQ3JlYXRlRGVmYXVsdFJvdXRlciB9IGZyb20gJy4vdXRpbHMvZ2V0T3JDcmVhdGVEZWZhdWx0Um91dGVyLmpzJztcbmltcG9ydCAnLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIEVhc2lseSByZWdpc3RlciBhIFJlZ0V4cCwgc3RyaW5nLCBvciBmdW5jdGlvbiB3aXRoIGEgY2FjaGluZ1xuICogc3RyYXRlZ3kgdG8gYSBzaW5nbGV0b24gUm91dGVyIGluc3RhbmNlLlxuICpcbiAqIFRoaXMgbWV0aG9kIHdpbGwgZ2VuZXJhdGUgYSBSb3V0ZSBmb3IgeW91IGlmIG5lZWRlZCBhbmRcbiAqIGNhbGwge0BsaW5rIHdvcmtib3gtcm91dGluZy5Sb3V0ZXIjcmVnaXN0ZXJSb3V0ZX0uXG4gKlxuICogQHBhcmFtIHtSZWdFeHB8c3RyaW5nfHdvcmtib3gtcm91dGluZy5Sb3V0ZX5tYXRjaENhbGxiYWNrfHdvcmtib3gtcm91dGluZy5Sb3V0ZX0gY2FwdHVyZVxuICogSWYgdGhlIGNhcHR1cmUgcGFyYW0gaXMgYSBgUm91dGVgLCBhbGwgb3RoZXIgYXJndW1lbnRzIHdpbGwgYmUgaWdub3JlZC5cbiAqIEBwYXJhbSB7d29ya2JveC1yb3V0aW5nfmhhbmRsZXJDYWxsYmFja30gW2hhbmRsZXJdIEEgY2FsbGJhY2tcbiAqIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIFByb21pc2UgcmVzdWx0aW5nIGluIGEgUmVzcG9uc2UuIFRoaXMgcGFyYW1ldGVyXG4gKiBpcyByZXF1aXJlZCBpZiBgY2FwdHVyZWAgaXMgbm90IGEgYFJvdXRlYCBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ30gW21ldGhvZD0nR0VUJ10gVGhlIEhUVFAgbWV0aG9kIHRvIG1hdGNoIHRoZSBSb3V0ZVxuICogYWdhaW5zdC5cbiAqIEByZXR1cm4ge3dvcmtib3gtcm91dGluZy5Sb3V0ZX0gVGhlIGdlbmVyYXRlZCBgUm91dGVgLlxuICpcbiAqIEBtZW1iZXJvZiB3b3JrYm94LXJvdXRpbmdcbiAqL1xuZnVuY3Rpb24gcmVnaXN0ZXJSb3V0ZShjYXB0dXJlLCBoYW5kbGVyLCBtZXRob2QpIHtcbiAgICBsZXQgcm91dGU7XG4gICAgaWYgKHR5cGVvZiBjYXB0dXJlID09PSAnc3RyaW5nJykge1xuICAgICAgICBjb25zdCBjYXB0dXJlVXJsID0gbmV3IFVSTChjYXB0dXJlLCBsb2NhdGlvbi5ocmVmKTtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgIGlmICghKGNhcHR1cmUuc3RhcnRzV2l0aCgnLycpIHx8IGNhcHR1cmUuc3RhcnRzV2l0aCgnaHR0cCcpKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBXb3JrYm94RXJyb3IoJ2ludmFsaWQtc3RyaW5nJywge1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVOYW1lOiAnd29ya2JveC1yb3V0aW5nJyxcbiAgICAgICAgICAgICAgICAgICAgZnVuY05hbWU6ICdyZWdpc3RlclJvdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1OYW1lOiAnY2FwdHVyZScsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBXZSB3YW50IHRvIGNoZWNrIGlmIEV4cHJlc3Mtc3R5bGUgd2lsZGNhcmRzIGFyZSBpbiB0aGUgcGF0aG5hbWUgb25seS5cbiAgICAgICAgICAgIC8vIFRPRE86IFJlbW92ZSB0aGlzIGxvZyBtZXNzYWdlIGluIHY0LlxuICAgICAgICAgICAgY29uc3QgdmFsdWVUb0NoZWNrID0gY2FwdHVyZS5zdGFydHNXaXRoKCdodHRwJylcbiAgICAgICAgICAgICAgICA/IGNhcHR1cmVVcmwucGF0aG5hbWVcbiAgICAgICAgICAgICAgICA6IGNhcHR1cmU7XG4gICAgICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3BpbGxhcmpzL3BhdGgtdG8tcmVnZXhwI3BhcmFtZXRlcnNcbiAgICAgICAgICAgIGNvbnN0IHdpbGRjYXJkcyA9ICdbKjo/K10nO1xuICAgICAgICAgICAgaWYgKG5ldyBSZWdFeHAoYCR7d2lsZGNhcmRzfWApLmV4ZWModmFsdWVUb0NoZWNrKSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZyhgVGhlICckY2FwdHVyZScgcGFyYW1ldGVyIGNvbnRhaW5zIGFuIEV4cHJlc3Mtc3R5bGUgd2lsZGNhcmQgYCArXG4gICAgICAgICAgICAgICAgICAgIGBjaGFyYWN0ZXIgKCR7d2lsZGNhcmRzfSkuIFN0cmluZ3MgYXJlIG5vdyBhbHdheXMgaW50ZXJwcmV0ZWQgYXMgYCArXG4gICAgICAgICAgICAgICAgICAgIGBleGFjdCBtYXRjaGVzOyB1c2UgYSBSZWdFeHAgZm9yIHBhcnRpYWwgb3Igd2lsZGNhcmQgbWF0Y2hlcy5gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtYXRjaENhbGxiYWNrID0gKHsgdXJsIH0pID0+IHtcbiAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVybC5wYXRobmFtZSA9PT0gY2FwdHVyZVVybC5wYXRobmFtZSAmJlxuICAgICAgICAgICAgICAgICAgICB1cmwub3JpZ2luICE9PSBjYXB0dXJlVXJsLm9yaWdpbikge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoYCR7Y2FwdHVyZX0gb25seSBwYXJ0aWFsbHkgbWF0Y2hlcyB0aGUgY3Jvc3Mtb3JpZ2luIFVSTCBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGAke3VybC50b1N0cmluZygpfS4gVGhpcyByb3V0ZSB3aWxsIG9ubHkgaGFuZGxlIGNyb3NzLW9yaWdpbiByZXF1ZXN0cyBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGBpZiB0aGV5IG1hdGNoIHRoZSBlbnRpcmUgVVJMLmApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB1cmwuaHJlZiA9PT0gY2FwdHVyZVVybC5ocmVmO1xuICAgICAgICB9O1xuICAgICAgICAvLyBJZiBgY2FwdHVyZWAgaXMgYSBzdHJpbmcgdGhlbiBgaGFuZGxlcmAgYW5kIGBtZXRob2RgIG11c3QgYmUgcHJlc2VudC5cbiAgICAgICAgcm91dGUgPSBuZXcgUm91dGUobWF0Y2hDYWxsYmFjaywgaGFuZGxlciwgbWV0aG9kKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoY2FwdHVyZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAvLyBJZiBgY2FwdHVyZWAgaXMgYSBgUmVnRXhwYCB0aGVuIGBoYW5kbGVyYCBhbmQgYG1ldGhvZGAgbXVzdCBiZSBwcmVzZW50LlxuICAgICAgICByb3V0ZSA9IG5ldyBSZWdFeHBSb3V0ZShjYXB0dXJlLCBoYW5kbGVyLCBtZXRob2QpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgY2FwdHVyZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBJZiBgY2FwdHVyZWAgaXMgYSBmdW5jdGlvbiB0aGVuIGBoYW5kbGVyYCBhbmQgYG1ldGhvZGAgbXVzdCBiZSBwcmVzZW50LlxuICAgICAgICByb3V0ZSA9IG5ldyBSb3V0ZShjYXB0dXJlLCBoYW5kbGVyLCBtZXRob2QpO1xuICAgIH1cbiAgICBlbHNlIGlmIChjYXB0dXJlIGluc3RhbmNlb2YgUm91dGUpIHtcbiAgICAgICAgcm91dGUgPSBjYXB0dXJlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IFdvcmtib3hFcnJvcigndW5zdXBwb3J0ZWQtcm91dGUtdHlwZScsIHtcbiAgICAgICAgICAgIG1vZHVsZU5hbWU6ICd3b3JrYm94LXJvdXRpbmcnLFxuICAgICAgICAgICAgZnVuY05hbWU6ICdyZWdpc3RlclJvdXRlJyxcbiAgICAgICAgICAgIHBhcmFtTmFtZTogJ2NhcHR1cmUnLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgY29uc3QgZGVmYXVsdFJvdXRlciA9IGdldE9yQ3JlYXRlRGVmYXVsdFJvdXRlcigpO1xuICAgIGRlZmF1bHRSb3V0ZXIucmVnaXN0ZXJSb3V0ZShyb3V0ZSk7XG4gICAgcmV0dXJuIHJvdXRlO1xufVxuZXhwb3J0IHsgcmVnaXN0ZXJSb3V0ZSB9O1xuIiwiLypcbiAgQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0ICcuLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIFJlbW92ZXMgYW55IFVSTCBzZWFyY2ggcGFyYW1ldGVycyB0aGF0IHNob3VsZCBiZSBpZ25vcmVkLlxuICpcbiAqIEBwYXJhbSB7VVJMfSB1cmxPYmplY3QgVGhlIG9yaWdpbmFsIFVSTC5cbiAqIEBwYXJhbSB7QXJyYXk8UmVnRXhwPn0gaWdub3JlVVJMUGFyYW1ldGVyc01hdGNoaW5nIFJlZ0V4cHMgdG8gdGVzdCBhZ2FpbnN0XG4gKiBlYWNoIHNlYXJjaCBwYXJhbWV0ZXIgbmFtZS4gTWF0Y2hlcyBtZWFuIHRoYXQgdGhlIHNlYXJjaCBwYXJhbWV0ZXIgc2hvdWxkIGJlXG4gKiBpZ25vcmVkLlxuICogQHJldHVybiB7VVJMfSBUaGUgVVJMIHdpdGggYW55IGlnbm9yZWQgc2VhcmNoIHBhcmFtZXRlcnMgcmVtb3ZlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG1lbWJlcm9mIHdvcmtib3gtcHJlY2FjaGluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlSWdub3JlZFNlYXJjaFBhcmFtcyh1cmxPYmplY3QsIGlnbm9yZVVSTFBhcmFtZXRlcnNNYXRjaGluZyA9IFtdKSB7XG4gICAgLy8gQ29udmVydCB0aGUgaXRlcmFibGUgaW50byBhbiBhcnJheSBhdCB0aGUgc3RhcnQgb2YgdGhlIGxvb3AgdG8gbWFrZSBzdXJlXG4gICAgLy8gZGVsZXRpb24gZG9lc24ndCBtZXNzIHVwIGl0ZXJhdGlvbi5cbiAgICBmb3IgKGNvbnN0IHBhcmFtTmFtZSBvZiBbLi4udXJsT2JqZWN0LnNlYXJjaFBhcmFtcy5rZXlzKCldKSB7XG4gICAgICAgIGlmIChpZ25vcmVVUkxQYXJhbWV0ZXJzTWF0Y2hpbmcuc29tZSgocmVnRXhwKSA9PiByZWdFeHAudGVzdChwYXJhbU5hbWUpKSkge1xuICAgICAgICAgICAgdXJsT2JqZWN0LnNlYXJjaFBhcmFtcy5kZWxldGUocGFyYW1OYW1lKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdXJsT2JqZWN0O1xufVxuIiwiLypcbiAgQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0IHsgcmVtb3ZlSWdub3JlZFNlYXJjaFBhcmFtcyB9IGZyb20gJy4vcmVtb3ZlSWdub3JlZFNlYXJjaFBhcmFtcy5qcyc7XG5pbXBvcnQgJy4uL192ZXJzaW9uLmpzJztcbi8qKlxuICogR2VuZXJhdG9yIGZ1bmN0aW9uIHRoYXQgeWllbGRzIHBvc3NpYmxlIHZhcmlhdGlvbnMgb24gdGhlIG9yaWdpbmFsIFVSTCB0b1xuICogY2hlY2ssIG9uZSBhdCBhIHRpbWUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqXG4gKiBAcHJpdmF0ZVxuICogQG1lbWJlcm9mIHdvcmtib3gtcHJlY2FjaGluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24qIGdlbmVyYXRlVVJMVmFyaWF0aW9ucyh1cmwsIHsgaWdub3JlVVJMUGFyYW1ldGVyc01hdGNoaW5nID0gWy9edXRtXy8sIC9eZmJjbGlkJC9dLCBkaXJlY3RvcnlJbmRleCA9ICdpbmRleC5odG1sJywgY2xlYW5VUkxzID0gdHJ1ZSwgdXJsTWFuaXB1bGF0aW9uLCB9ID0ge30pIHtcbiAgICBjb25zdCB1cmxPYmplY3QgPSBuZXcgVVJMKHVybCwgbG9jYXRpb24uaHJlZik7XG4gICAgdXJsT2JqZWN0Lmhhc2ggPSAnJztcbiAgICB5aWVsZCB1cmxPYmplY3QuaHJlZjtcbiAgICBjb25zdCB1cmxXaXRob3V0SWdub3JlZFBhcmFtcyA9IHJlbW92ZUlnbm9yZWRTZWFyY2hQYXJhbXModXJsT2JqZWN0LCBpZ25vcmVVUkxQYXJhbWV0ZXJzTWF0Y2hpbmcpO1xuICAgIHlpZWxkIHVybFdpdGhvdXRJZ25vcmVkUGFyYW1zLmhyZWY7XG4gICAgaWYgKGRpcmVjdG9yeUluZGV4ICYmIHVybFdpdGhvdXRJZ25vcmVkUGFyYW1zLnBhdGhuYW1lLmVuZHNXaXRoKCcvJykpIHtcbiAgICAgICAgY29uc3QgZGlyZWN0b3J5VVJMID0gbmV3IFVSTCh1cmxXaXRob3V0SWdub3JlZFBhcmFtcy5ocmVmKTtcbiAgICAgICAgZGlyZWN0b3J5VVJMLnBhdGhuYW1lICs9IGRpcmVjdG9yeUluZGV4O1xuICAgICAgICB5aWVsZCBkaXJlY3RvcnlVUkwuaHJlZjtcbiAgICB9XG4gICAgaWYgKGNsZWFuVVJMcykge1xuICAgICAgICBjb25zdCBjbGVhblVSTCA9IG5ldyBVUkwodXJsV2l0aG91dElnbm9yZWRQYXJhbXMuaHJlZik7XG4gICAgICAgIGNsZWFuVVJMLnBhdGhuYW1lICs9ICcuaHRtbCc7XG4gICAgICAgIHlpZWxkIGNsZWFuVVJMLmhyZWY7XG4gICAgfVxuICAgIGlmICh1cmxNYW5pcHVsYXRpb24pIHtcbiAgICAgICAgY29uc3QgYWRkaXRpb25hbFVSTHMgPSB1cmxNYW5pcHVsYXRpb24oeyB1cmw6IHVybE9iamVjdCB9KTtcbiAgICAgICAgZm9yIChjb25zdCB1cmxUb0F0dGVtcHQgb2YgYWRkaXRpb25hbFVSTHMpIHtcbiAgICAgICAgICAgIHlpZWxkIHVybFRvQXR0ZW1wdC5ocmVmO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLypcbiAgQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL2xvZ2dlci5qcyc7XG5pbXBvcnQgeyBnZXRGcmllbmRseVVSTCB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9nZXRGcmllbmRseVVSTC5qcyc7XG5pbXBvcnQgeyBSb3V0ZSB9IGZyb20gJ3dvcmtib3gtcm91dGluZy9Sb3V0ZS5qcyc7XG5pbXBvcnQgeyBnZW5lcmF0ZVVSTFZhcmlhdGlvbnMgfSBmcm9tICcuL3V0aWxzL2dlbmVyYXRlVVJMVmFyaWF0aW9ucy5qcyc7XG5pbXBvcnQgJy4vX3ZlcnNpb24uanMnO1xuLyoqXG4gKiBBIHN1YmNsYXNzIG9mIHtAbGluayB3b3JrYm94LXJvdXRpbmcuUm91dGV9IHRoYXQgdGFrZXMgYVxuICoge0BsaW5rIHdvcmtib3gtcHJlY2FjaGluZy5QcmVjYWNoZUNvbnRyb2xsZXJ9XG4gKiBpbnN0YW5jZSBhbmQgdXNlcyBpdCB0byBtYXRjaCBpbmNvbWluZyByZXF1ZXN0cyBhbmQgaGFuZGxlIGZldGNoaW5nXG4gKiByZXNwb25zZXMgZnJvbSB0aGUgcHJlY2FjaGUuXG4gKlxuICogQG1lbWJlcm9mIHdvcmtib3gtcHJlY2FjaGluZ1xuICogQGV4dGVuZHMgd29ya2JveC1yb3V0aW5nLlJvdXRlXG4gKi9cbmNsYXNzIFByZWNhY2hlUm91dGUgZXh0ZW5kcyBSb3V0ZSB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtQcmVjYWNoZUNvbnRyb2xsZXJ9IHByZWNhY2hlQ29udHJvbGxlciBBIGBQcmVjYWNoZUNvbnRyb2xsZXJgXG4gICAgICogaW5zdGFuY2UgdXNlZCB0byBib3RoIG1hdGNoIHJlcXVlc3RzIGFuZCByZXNwb25kIHRvIGZldGNoIGV2ZW50cy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIE9wdGlvbnMgdG8gY29udHJvbCBob3cgcmVxdWVzdHMgYXJlIG1hdGNoZWRcbiAgICAgKiBhZ2FpbnN0IHRoZSBsaXN0IG9mIHByZWNhY2hlZCBVUkxzLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5kaXJlY3RvcnlJbmRleD1pbmRleC5odG1sXSBUaGUgYGRpcmVjdG9yeUluZGV4YCB3aWxsXG4gICAgICogY2hlY2sgY2FjaGUgZW50cmllcyBmb3IgYSBVUkxzIGVuZGluZyB3aXRoICcvJyB0byBzZWUgaWYgdGhlcmUgaXMgYSBoaXQgd2hlblxuICAgICAqIGFwcGVuZGluZyB0aGUgYGRpcmVjdG9yeUluZGV4YCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge0FycmF5PFJlZ0V4cD59IFtvcHRpb25zLmlnbm9yZVVSTFBhcmFtZXRlcnNNYXRjaGluZz1bL151dG1fLywgL15mYmNsaWQkL11dIEFuXG4gICAgICogYXJyYXkgb2YgcmVnZXgncyB0byByZW1vdmUgc2VhcmNoIHBhcmFtcyB3aGVuIGxvb2tpbmcgZm9yIGEgY2FjaGUgbWF0Y2guXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5jbGVhblVSTHM9dHJ1ZV0gVGhlIGBjbGVhblVSTHNgIG9wdGlvbiB3aWxsXG4gICAgICogY2hlY2sgdGhlIGNhY2hlIGZvciB0aGUgVVJMIHdpdGggYSBgLmh0bWxgIGFkZGVkIHRvIHRoZSBlbmQgb2YgdGhlIGVuZC5cbiAgICAgKiBAcGFyYW0ge3dvcmtib3gtcHJlY2FjaGluZ351cmxNYW5pcHVsYXRpb259IFtvcHRpb25zLnVybE1hbmlwdWxhdGlvbl1cbiAgICAgKiBUaGlzIGlzIGEgZnVuY3Rpb24gdGhhdCBzaG91bGQgdGFrZSBhIFVSTCBhbmQgcmV0dXJuIGFuIGFycmF5IG9mXG4gICAgICogYWx0ZXJuYXRpdmUgVVJMcyB0aGF0IHNob3VsZCBiZSBjaGVja2VkIGZvciBwcmVjYWNoZSBtYXRjaGVzLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHByZWNhY2hlQ29udHJvbGxlciwgb3B0aW9ucykge1xuICAgICAgICBjb25zdCBtYXRjaCA9ICh7IHJlcXVlc3QsIH0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHVybHNUb0NhY2hlS2V5cyA9IHByZWNhY2hlQ29udHJvbGxlci5nZXRVUkxzVG9DYWNoZUtleXMoKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcG9zc2libGVVUkwgb2YgZ2VuZXJhdGVVUkxWYXJpYXRpb25zKHJlcXVlc3QudXJsLCBvcHRpb25zKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhY2hlS2V5ID0gdXJsc1RvQ2FjaGVLZXlzLmdldChwb3NzaWJsZVVSTCk7XG4gICAgICAgICAgICAgICAgaWYgKGNhY2hlS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGludGVncml0eSA9IHByZWNhY2hlQ29udHJvbGxlci5nZXRJbnRlZ3JpdHlGb3JDYWNoZUtleShjYWNoZUtleSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGNhY2hlS2V5LCBpbnRlZ3JpdHkgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZyhgUHJlY2FjaGluZyBkaWQgbm90IGZpbmQgYSBtYXRjaCBmb3IgYCArIGdldEZyaWVuZGx5VVJMKHJlcXVlc3QudXJsKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG4gICAgICAgIHN1cGVyKG1hdGNoLCBwcmVjYWNoZUNvbnRyb2xsZXIuc3RyYXRlZ3kpO1xuICAgIH1cbn1cbmV4cG9ydCB7IFByZWNhY2hlUm91dGUgfTtcbiIsIi8qXG4gIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgeyByZWdpc3RlclJvdXRlIH0gZnJvbSAnd29ya2JveC1yb3V0aW5nL3JlZ2lzdGVyUm91dGUuanMnO1xuaW1wb3J0IHsgZ2V0T3JDcmVhdGVQcmVjYWNoZUNvbnRyb2xsZXIgfSBmcm9tICcuL3V0aWxzL2dldE9yQ3JlYXRlUHJlY2FjaGVDb250cm9sbGVyLmpzJztcbmltcG9ydCB7IFByZWNhY2hlUm91dGUgfSBmcm9tICcuL1ByZWNhY2hlUm91dGUuanMnO1xuaW1wb3J0ICcuL192ZXJzaW9uLmpzJztcbi8qKlxuICogQWRkIGEgYGZldGNoYCBsaXN0ZW5lciB0byB0aGUgc2VydmljZSB3b3JrZXIgdGhhdCB3aWxsXG4gKiByZXNwb25kIHRvXG4gKiBbbmV0d29yayByZXF1ZXN0c117QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1NlcnZpY2VfV29ya2VyX0FQSS9Vc2luZ19TZXJ2aWNlX1dvcmtlcnMjQ3VzdG9tX3Jlc3BvbnNlc190b19yZXF1ZXN0c31cbiAqIHdpdGggcHJlY2FjaGVkIGFzc2V0cy5cbiAqXG4gKiBSZXF1ZXN0cyBmb3IgYXNzZXRzIHRoYXQgYXJlbid0IHByZWNhY2hlZCwgdGhlIGBGZXRjaEV2ZW50YCB3aWxsIG5vdCBiZVxuICogcmVzcG9uZGVkIHRvLCBhbGxvd2luZyB0aGUgZXZlbnQgdG8gZmFsbCB0aHJvdWdoIHRvIG90aGVyIGBmZXRjaGAgZXZlbnRcbiAqIGxpc3RlbmVycy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIFNlZSB0aGUge0BsaW5rIHdvcmtib3gtcHJlY2FjaGluZy5QcmVjYWNoZVJvdXRlfVxuICogb3B0aW9ucy5cbiAqXG4gKiBAbWVtYmVyb2Ygd29ya2JveC1wcmVjYWNoaW5nXG4gKi9cbmZ1bmN0aW9uIGFkZFJvdXRlKG9wdGlvbnMpIHtcbiAgICBjb25zdCBwcmVjYWNoZUNvbnRyb2xsZXIgPSBnZXRPckNyZWF0ZVByZWNhY2hlQ29udHJvbGxlcigpO1xuICAgIGNvbnN0IHByZWNhY2hlUm91dGUgPSBuZXcgUHJlY2FjaGVSb3V0ZShwcmVjYWNoZUNvbnRyb2xsZXIsIG9wdGlvbnMpO1xuICAgIHJlZ2lzdGVyUm91dGUocHJlY2FjaGVSb3V0ZSk7XG59XG5leHBvcnQgeyBhZGRSb3V0ZSB9O1xuIiwiLypcbiAgQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0IHsgZ2V0T3JDcmVhdGVQcmVjYWNoZUNvbnRyb2xsZXIgfSBmcm9tICcuL3V0aWxzL2dldE9yQ3JlYXRlUHJlY2FjaGVDb250cm9sbGVyLmpzJztcbmltcG9ydCAnLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIEFkZHMgaXRlbXMgdG8gdGhlIHByZWNhY2hlIGxpc3QsIHJlbW92aW5nIGFueSBkdXBsaWNhdGVzIGFuZFxuICogc3RvcmVzIHRoZSBmaWxlcyBpbiB0aGVcbiAqIHtAbGluayB3b3JrYm94LWNvcmUuY2FjaGVOYW1lc3xcInByZWNhY2hlIGNhY2hlXCJ9IHdoZW4gdGhlIHNlcnZpY2VcbiAqIHdvcmtlciBpbnN0YWxscy5cbiAqXG4gKiBUaGlzIG1ldGhvZCBjYW4gYmUgY2FsbGVkIG11bHRpcGxlIHRpbWVzLlxuICpcbiAqIFBsZWFzZSBub3RlOiBUaGlzIG1ldGhvZCAqKndpbGwgbm90Kiogc2VydmUgYW55IG9mIHRoZSBjYWNoZWQgZmlsZXMgZm9yIHlvdS5cbiAqIEl0IG9ubHkgcHJlY2FjaGVzIGZpbGVzLiBUbyByZXNwb25kIHRvIGEgbmV0d29yayByZXF1ZXN0IHlvdSBjYWxsXG4gKiB7QGxpbmsgd29ya2JveC1wcmVjYWNoaW5nLmFkZFJvdXRlfS5cbiAqXG4gKiBJZiB5b3UgaGF2ZSBhIHNpbmdsZSBhcnJheSBvZiBmaWxlcyB0byBwcmVjYWNoZSwgeW91IGNhbiBqdXN0IGNhbGxcbiAqIHtAbGluayB3b3JrYm94LXByZWNhY2hpbmcucHJlY2FjaGVBbmRSb3V0ZX0uXG4gKlxuICogQHBhcmFtIHtBcnJheTxPYmplY3R8c3RyaW5nPn0gW2VudHJpZXM9W11dIEFycmF5IG9mIGVudHJpZXMgdG8gcHJlY2FjaGUuXG4gKlxuICogQG1lbWJlcm9mIHdvcmtib3gtcHJlY2FjaGluZ1xuICovXG5mdW5jdGlvbiBwcmVjYWNoZShlbnRyaWVzKSB7XG4gICAgY29uc3QgcHJlY2FjaGVDb250cm9sbGVyID0gZ2V0T3JDcmVhdGVQcmVjYWNoZUNvbnRyb2xsZXIoKTtcbiAgICBwcmVjYWNoZUNvbnRyb2xsZXIucHJlY2FjaGUoZW50cmllcyk7XG59XG5leHBvcnQgeyBwcmVjYWNoZSB9O1xuIiwiLypcbiAgQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0IHsgYWRkUm91dGUgfSBmcm9tICcuL2FkZFJvdXRlLmpzJztcbmltcG9ydCB7IHByZWNhY2hlIH0gZnJvbSAnLi9wcmVjYWNoZS5qcyc7XG5pbXBvcnQgJy4vX3ZlcnNpb24uanMnO1xuLyoqXG4gKiBUaGlzIG1ldGhvZCB3aWxsIGFkZCBlbnRyaWVzIHRvIHRoZSBwcmVjYWNoZSBsaXN0IGFuZCBhZGQgYSByb3V0ZSB0b1xuICogcmVzcG9uZCB0byBmZXRjaCBldmVudHMuXG4gKlxuICogVGhpcyBpcyBhIGNvbnZlbmllbmNlIG1ldGhvZCB0aGF0IHdpbGwgY2FsbFxuICoge0BsaW5rIHdvcmtib3gtcHJlY2FjaGluZy5wcmVjYWNoZX0gYW5kXG4gKiB7QGxpbmsgd29ya2JveC1wcmVjYWNoaW5nLmFkZFJvdXRlfSBpbiBhIHNpbmdsZSBjYWxsLlxuICpcbiAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0fHN0cmluZz59IGVudHJpZXMgQXJyYXkgb2YgZW50cmllcyB0byBwcmVjYWNoZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gU2VlIHRoZVxuICoge0BsaW5rIHdvcmtib3gtcHJlY2FjaGluZy5QcmVjYWNoZVJvdXRlfSBvcHRpb25zLlxuICpcbiAqIEBtZW1iZXJvZiB3b3JrYm94LXByZWNhY2hpbmdcbiAqL1xuZnVuY3Rpb24gcHJlY2FjaGVBbmRSb3V0ZShlbnRyaWVzLCBvcHRpb25zKSB7XG4gICAgcHJlY2FjaGUoZW50cmllcyk7XG4gICAgYWRkUm91dGUob3B0aW9ucyk7XG59XG5leHBvcnQgeyBwcmVjYWNoZUFuZFJvdXRlIH07XG4iLCIvKlxuICBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG5cbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgJy4vX3ZlcnNpb24uanMnO1xuLyoqXG4gKiBDbGFpbSBhbnkgY3VycmVudGx5IGF2YWlsYWJsZSBjbGllbnRzIG9uY2UgdGhlIHNlcnZpY2Ugd29ya2VyXG4gKiBiZWNvbWVzIGFjdGl2ZS4gVGhpcyBpcyBub3JtYWxseSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggYHNraXBXYWl0aW5nKClgLlxuICpcbiAqIEBtZW1iZXJvZiB3b3JrYm94LWNvcmVcbiAqL1xuZnVuY3Rpb24gY2xpZW50c0NsYWltKCkge1xuICAgIHNlbGYuYWRkRXZlbnRMaXN0ZW5lcignYWN0aXZhdGUnLCAoKSA9PiBzZWxmLmNsaWVudHMuY2xhaW0oKSk7XG59XG5leHBvcnQgeyBjbGllbnRzQ2xhaW0gfTtcbiIsIi8vLyA8cmVmZXJlbmNlIGxpYj1cIndlYndvcmtlclwiIC8+XG5cbmltcG9ydCB7IHByZWNhY2hlQW5kUm91dGUgfSBmcm9tICd3b3JrYm94LXByZWNhY2hpbmcnO1xuaW1wb3J0IHsgY2xpZW50c0NsYWltIH0gZnJvbSAnd29ya2JveC1jb3JlJztcblxuZGVjbGFyZSBjb25zdCBzZWxmOiBTZXJ2aWNlV29ya2VyR2xvYmFsU2NvcGU7XG5cbmNvbnNvbGUuaW5mbyhgU2VydmljZSB3b3JrZXIgYnVpbGQgJHtpbXBvcnQubWV0YS5lbnYuVklURV9CVUlMRCB8fCAndW5rbm93bid9YCk7XG5cbi8qKiBNRVRIT0RTICoqL1xuXG5jb25zdCBzZW5kID0gYXN5bmMgKHR5cGU6IHN0cmluZywgbWVzc2FnZT86IHN0cmluZykgPT4ge1xuICBjb25zdCBjbGllbnRzID0gYXdhaXQgc2VsZi5jbGllbnRzLm1hdGNoQWxsKHsgaW5jbHVkZVVuY29udHJvbGxlZDogdHJ1ZSwgdHlwZTogJ3dpbmRvdycgfSk7XG5cbiAgLy8gY29uc29sZS5sb2coY2xpZW50cyk7XG5cbiAgY2xpZW50cy5mb3JFYWNoKGNsaWVudCA9PiB7XG4gICAgY2xpZW50LnBvc3RNZXNzYWdlKHtcbiAgICAgIHR5cGU6ICdMT0cnLFxuICAgICAgbWVzc2FnZVxuICAgIH0pO1xuICB9KTtcbn07XG5cbmNvbnN0IHNlbmRMb2cgPSAgKG1lc3NhZ2U6IHN0cmluZykgPT4ge1xuICBjb25zb2xlLmluZm8obWVzc2FnZSk7XG4gIHJldHVybiBzZW5kKCdMT0cnLCBtZXNzYWdlKVxufTtcblxuY29uc3Qgc2hvd0JhZGdlID0gKGNvdW50OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgaWYgKCdzZXRBcHBCYWRnZScgaW4gc2VsZi5uYXZpZ2F0b3IpIHtcbiAgICByZXR1cm4gc2VsZi5uYXZpZ2F0b3Iuc2V0QXBwQmFkZ2UoY291bnQpLnRoZW4oKCkgPT4gc2VuZExvZygnQmFkZ2UgZGlzcGxheWVkJykpO1xuICB9XG4gIHNlbmRMb2coJ0JhZGdlIEFQSSBpcyBub3QgYXZhaWxhYmxlJyk7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbn07XG5cbmNvbnN0IHJlZ2lzdGVyUHVzaFN1YnNjcmlwdGlvbiA9IGFzeW5jICgpOiBQcm9taXNlPFB1c2hTdWJzY3JpcHRpb24gfCBudWxsPiA9PiB7XG4gIGlmICgncHVzaE1hbmFnZXInIGluIHNlbGYucmVnaXN0cmF0aW9uICYmIHR5cGVvZiBzZWxmLnJlZ2lzdHJhdGlvbi5wdXNoTWFuYWdlci5zdWJzY3JpYmUgPT09ICdmdW5jdGlvbicpIHtcbiAgICBhd2FpdCBzZW5kTG9nKCdSZWdpc3RlcmluZyBhIHB1c2ggc3Vic2NyaXB0aW9uJyk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IGF3YWl0IHNlbGYucmVnaXN0cmF0aW9uLnB1c2hNYW5hZ2VyLnN1YnNjcmliZSh7XG4gICAgICAgIHVzZXJWaXNpYmxlT25seTogdHJ1ZSxcbiAgICAgICAgYXBwbGljYXRpb25TZXJ2ZXJLZXk6IGltcG9ydC5tZXRhLmVudi5WSVRFX1ZBUElEX0tFWVxuICAgICAgfSk7XG4gICAgICBhd2FpdCBzZW5kTG9nKGBTdWJzY3JpYmVkIHN1Y2Nlc3NmdWxseWApO1xuICAgICAgYXdhaXQgc2VuZCgnU1VCJyk7XG4gICAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGF3YWl0IHNlbmRMb2coYFVuYWJsZSB0byBzdWJzY3JpYmUuICR7ZX1gKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5jb25zdCBzaG93Tm90aWZpY2F0aW9uID0gYXN5bmMgKCkgPT4ge1xuICBpZiAoTm90aWZpY2F0aW9uLnBlcm1pc3Npb24gIT09ICdncmFudGVkJykge1xuICAgIHNlbmRMb2coJ05vIHBlcm1pc3Npb24gdG8gc2hvdyBub3RpZmljYXRpb25zJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBhd2FpdCBzZWxmLnJlZ2lzdHJhdGlvbi5zaG93Tm90aWZpY2F0aW9uKCdMb2NhbCBOb3RpZmljYXRpb24nLCB7XG4gICAgICBib2R5OiAnVGhpcyB3YXMgc2VudCBmcm9tIHNlcnZpY2Ugd29ya2VyLCB3aXRob3V0IHVzaW5nIFB1c2ggQVBJJyxcbiAgICAgIGljb246ICcuL2ljb24tMTkyLnBuZycsXG4gICAgfSk7XG4gICAgc2VuZExvZygnTG9jYWwgbm90aWZpY2F0aW9uIGlzIHNlbnQgc3VjY2Vzc2Z1bGx5Jyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBzZW5kTG9nKGBFcnJvciBzZW5kaW5nIGxvY2FsIG5vdGlmaWNhdGlvbjogJHtlfWApO1xuICB9XG59O1xuXG5jb25zdCByZXF1ZXN0UHVzaCA9IGFzeW5jIChzdWJzY3JpcHRpb246IFB1c2hTdWJzY3JpcHRpb24pID0+IHtcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vcm9ja3N0YXItcHVzaC5nbGl0Y2gubWUvc2VuZC1wdXNoJywge1xuICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHN1YnNjcmlwdGlvbiwgbnVsbCwgMiksXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgIH1cbiAgfSk7XG4gIGNvbnN0IG1lc3NhZ2UgPSBhd2FpdCByZXN1bHQudGV4dCgpO1xuICBhd2FpdCBzZW5kTG9nKGBQdXNoIHJlcXVlc3QgcmVzdWx0OiAke21lc3NhZ2V9YCk7XG59O1xuXG4vKiogSU5TVEFMTEFUSU9OICoqL1xuXG5zZWxmLnNraXBXYWl0aW5nKCk7XG5jbGllbnRzQ2xhaW0oKTtcbnByZWNhY2hlQW5kUm91dGUoc2VsZi5fX1dCX01BTklGRVNUKTtcblxuLyoqIFZBUklBQkxFUyAqKi9cblxubGV0IHN1YnNjcmlwdGlvbjogUHVzaFN1YnNjcmlwdGlvbiB8IG51bGwgPSBudWxsO1xuXG4vKiogU1RBUlRVUCAqKi9cblxuKGFzeW5jICgpID0+IHtcbiAgc2VuZExvZygnU2VydmljZSB3b3JrZXIgaXMgcnVubmluZycpO1xuICBzdWJzY3JpcHRpb24gPSBhd2FpdCByZWdpc3RlclB1c2hTdWJzY3JpcHRpb24oKTtcbn0pKCk7XG5cbi8qKiBFVkVOVCBIQU5ETEVSUyAqKi9cblxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgKGV2ZW50KSA9PiB7XG4gIGlmIChldmVudC5kYXRhPy50eXBlID09PSAnU0VORF9OT1RJRklDQVRJT04nKSB7XG4gICAgY29uc3QgcHJvbWlzZXM6IFByb21pc2U8dW5rbm93bj5bXSA9IFtdO1xuXG4gICAgcHJvbWlzZXMucHVzaChzaG93Tm90aWZpY2F0aW9uKCkpO1xuXG4gICAgaWYgKCdzZXRBcHBCYWRnZScgaW4gc2VsZi5uYXZpZ2F0b3IpIHtcbiAgICAgIHByb21pc2VzLnB1c2goc2VsZi5uYXZpZ2F0b3Iuc2V0QXBwQmFkZ2UoMSkpO1xuICAgIH1cblxuICAgIGV2ZW50LndhaXRVbnRpbChQcm9taXNlLmFsbChwcm9taXNlcykpO1xuICB9XG5cbiAgaWYgKGV2ZW50LmRhdGE/LnR5cGUgPT09ICdSRVFVRVNUX1BVU0gnKSB7XG4gICAgaWYgKHN1YnNjcmlwdGlvbikge1xuICAgICAgZXZlbnQud2FpdFVudGlsKHJlcXVlc3RQdXNoKHN1YnNjcmlwdGlvbikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBldmVudC53YWl0VW50aWwoc2VuZExvZygnVW5hYmxlIHRvIHJlcXVlc3QgYSBwdXNoOiBubyBzdWJzY3JpcHRpb24nKSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGV2ZW50LmRhdGE/LnR5cGUgPT09ICdBUFBfT1BFTicpIHtcbiAgICBpZiAoJ2NsZWFyQXBwQmFkZ2UnIGluIHNlbGYubmF2aWdhdG9yKSB7XG4gICAgICBldmVudC53YWl0VW50aWwoc2VsZi5uYXZpZ2F0b3IuY2xlYXJBcHBCYWRnZSgpKTtcbiAgICB9XG4gIH1cbn0pO1xuXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ3B1c2gnLCAoZXZlbnQpID0+IHtcbiAgc2VuZExvZygnUmVjZWl2ZWQgYSBwdXNoIG1lc3NhZ2UnKTtcblxuICBjb25zdCBwcm9taXNlczogUHJvbWlzZTx1bmtub3duPltdID0gW107XG5cbiAgY29uc3QgYmFkZ2VQcm9taXNlID0gc2hvd0JhZGdlKDEpO1xuICBwcm9taXNlcy5wdXNoKGJhZGdlUHJvbWlzZSk7XG5cbiAgY29uc3QgeyB0aXRsZSA9ICdFbXB0eSBtZXNzYWdlJywgYm9keSA9ICdFbXB0eSBtZXNzYWdlJyB9ID0gZXZlbnQuZGF0YT8uanNvbigpIHx8IHt9O1xuICBjb25zdCBub3RpZmljYXRpb25Qcm9taXNlID0gc2VsZi5yZWdpc3RyYXRpb24uc2hvd05vdGlmaWNhdGlvbih0aXRsZSwgeyBib2R5IH0pO1xuICBwcm9taXNlcy5wdXNoKG5vdGlmaWNhdGlvblByb21pc2UpO1xuXG4gIGNvbnN0IGFsbCA9IFByb21pc2UuYWxsKHByb21pc2VzKS5jYXRjaChlID0+IHNlbmRMb2coYFB1c2ggcHJvY2Vzc2luZyBmYWlsZWQuICR7ZX1gKSk7XG5cbiAgZXZlbnQud2FpdFVudGlsKGFsbCk7XG59KTtcblxuIl0sIm5hbWVzIjpbImZhbGxiYWNrIiwiY29kZSIsImFyZ3MiLCJtc2ciLCJtZXNzYWdlR2VuZXJhdG9yIiwiV29ya2JveEVycm9yIiwiZXJyb3JDb2RlIiwiZGV0YWlscyIsIm1lc3NhZ2UiLCJfY2FjaGVOYW1lRGV0YWlscyIsIl9jcmVhdGVDYWNoZU5hbWUiLCJjYWNoZU5hbWUiLCJ2YWx1ZSIsImVhY2hDYWNoZU5hbWVEZXRhaWwiLCJmbiIsImtleSIsImNhY2hlTmFtZXMiLCJ1c2VyQ2FjaGVOYW1lIiwid2FpdFVudGlsIiwiZXZlbnQiLCJhc3luY0ZuIiwicmV0dXJuUHJvbWlzZSIsIlJFVklTSU9OX1NFQVJDSF9QQVJBTSIsImNyZWF0ZUNhY2hlS2V5IiwiZW50cnkiLCJ1cmxPYmplY3QiLCJyZXZpc2lvbiIsInVybCIsImNhY2hlS2V5VVJMIiwib3JpZ2luYWxVUkwiLCJQcmVjYWNoZUluc3RhbGxSZXBvcnRQbHVnaW4iLCJyZXF1ZXN0Iiwic3RhdGUiLCJjYWNoZWRSZXNwb25zZSIsIlByZWNhY2hlQ2FjaGVLZXlQbHVnaW4iLCJwcmVjYWNoZUNvbnRyb2xsZXIiLCJwYXJhbXMiLCJjYWNoZUtleSIsInN1cHBvcnRTdGF0dXMiLCJjYW5Db25zdHJ1Y3RSZXNwb25zZUZyb21Cb2R5U3RyZWFtIiwidGVzdFJlc3BvbnNlIiwiY29weVJlc3BvbnNlIiwicmVzcG9uc2UiLCJtb2RpZmllciIsIm9yaWdpbiIsImNsb25lZFJlc3BvbnNlIiwicmVzcG9uc2VJbml0IiwibW9kaWZpZWRSZXNwb25zZUluaXQiLCJib2R5IiwiZ2V0RnJpZW5kbHlVUkwiLCJzdHJpcFBhcmFtcyIsImZ1bGxVUkwiLCJpZ25vcmVQYXJhbXMiLCJzdHJpcHBlZFVSTCIsInBhcmFtIiwiY2FjaGVNYXRjaElnbm9yZVBhcmFtcyIsImNhY2hlIiwibWF0Y2hPcHRpb25zIiwic3RyaXBwZWRSZXF1ZXN0VVJMIiwia2V5c09wdGlvbnMiLCJjYWNoZUtleXMiLCJzdHJpcHBlZENhY2hlS2V5VVJMIiwiRGVmZXJyZWQiLCJyZXNvbHZlIiwicmVqZWN0IiwicXVvdGFFcnJvckNhbGxiYWNrcyIsImV4ZWN1dGVRdW90YUVycm9yQ2FsbGJhY2tzIiwiY2FsbGJhY2siLCJ0aW1lb3V0IiwibXMiLCJ0b1JlcXVlc3QiLCJpbnB1dCIsIlN0cmF0ZWd5SGFuZGxlciIsInN0cmF0ZWd5Iiwib3B0aW9ucyIsInBsdWdpbiIsInBvc3NpYmxlUHJlbG9hZFJlc3BvbnNlIiwib3JpZ2luYWxSZXF1ZXN0IiwiY2IiLCJlcnIiLCJwbHVnaW5GaWx0ZXJlZFJlcXVlc3QiLCJmZXRjaFJlc3BvbnNlIiwiZXJyb3IiLCJyZXNwb25zZUNsb25lIiwiZWZmZWN0aXZlUmVxdWVzdCIsIm11bHRpTWF0Y2hPcHRpb25zIiwicmVzcG9uc2VUb0NhY2hlIiwiaGFzQ2FjaGVVcGRhdGVDYWxsYmFjayIsIm9sZFJlc3BvbnNlIiwibW9kZSIsIm5hbWUiLCJzdGF0ZWZ1bFBhcmFtIiwicHJvbWlzZSIsInBsdWdpbnNVc2VkIiwiU3RyYXRlZ3kiLCJyZXNwb25zZURvbmUiLCJoYW5kbGVyIiwiaGFuZGxlckRvbmUiLCJ3YWl0VW50aWxFcnJvciIsIlByZWNhY2hlU3RyYXRlZ3kiLCJpbnRlZ3JpdHlJbk1hbmlmZXN0IiwiaW50ZWdyaXR5SW5SZXF1ZXN0Iiwibm9JbnRlZ3JpdHlDb25mbGljdCIsImRlZmF1bHRQbHVnaW5JbmRleCIsImNhY2hlV2lsbFVwZGF0ZVBsdWdpbkNvdW50IiwiaW5kZXgiLCJQcmVjYWNoZUNvbnRyb2xsZXIiLCJwbHVnaW5zIiwiZmFsbGJhY2tUb05ldHdvcmsiLCJlbnRyaWVzIiwidXJsc1RvV2FybkFib3V0IiwiY2FjaGVNb2RlIiwid2FybmluZ01lc3NhZ2UiLCJpbnN0YWxsUmVwb3J0UGx1Z2luIiwiaW50ZWdyaXR5IiwidXBkYXRlZFVSTHMiLCJub3RVcGRhdGVkVVJMcyIsImN1cnJlbnRseUNhY2hlZFJlcXVlc3RzIiwiZXhwZWN0ZWRDYWNoZUtleXMiLCJkZWxldGVkVVJMcyIsImdldE9yQ3JlYXRlUHJlY2FjaGVDb250cm9sbGVyIiwiZGVmYXVsdE1ldGhvZCIsIm5vcm1hbGl6ZUhhbmRsZXIiLCJSb3V0ZSIsIm1hdGNoIiwibWV0aG9kIiwiUmVnRXhwUm91dGUiLCJyZWdFeHAiLCJyZXN1bHQiLCJSb3V0ZXIiLCJyZXNwb25zZVByb21pc2UiLCJwYXlsb2FkIiwicmVxdWVzdFByb21pc2VzIiwic2FtZU9yaWdpbiIsInJvdXRlIiwiY2F0Y2hIYW5kbGVyIiwiY2F0Y2hFcnIiLCJyb3V0ZXMiLCJtYXRjaFJlc3VsdCIsInJvdXRlSW5kZXgiLCJkZWZhdWx0Um91dGVyIiwiZ2V0T3JDcmVhdGVEZWZhdWx0Um91dGVyIiwicmVnaXN0ZXJSb3V0ZSIsImNhcHR1cmUiLCJjYXB0dXJlVXJsIiwibWF0Y2hDYWxsYmFjayIsInJlbW92ZUlnbm9yZWRTZWFyY2hQYXJhbXMiLCJpZ25vcmVVUkxQYXJhbWV0ZXJzTWF0Y2hpbmciLCJwYXJhbU5hbWUiLCJnZW5lcmF0ZVVSTFZhcmlhdGlvbnMiLCJkaXJlY3RvcnlJbmRleCIsImNsZWFuVVJMcyIsInVybE1hbmlwdWxhdGlvbiIsInVybFdpdGhvdXRJZ25vcmVkUGFyYW1zIiwiZGlyZWN0b3J5VVJMIiwiY2xlYW5VUkwiLCJhZGRpdGlvbmFsVVJMcyIsInVybFRvQXR0ZW1wdCIsIlByZWNhY2hlUm91dGUiLCJ1cmxzVG9DYWNoZUtleXMiLCJwb3NzaWJsZVVSTCIsImFkZFJvdXRlIiwicHJlY2FjaGVSb3V0ZSIsInByZWNhY2hlIiwicHJlY2FjaGVBbmRSb3V0ZSIsImNsaWVudHNDbGFpbSIsInNlbmQiLCJ0eXBlIiwiY2xpZW50Iiwic2VuZExvZyIsInNob3dCYWRnZSIsImNvdW50IiwicmVnaXN0ZXJQdXNoU3Vic2NyaXB0aW9uIiwic3Vic2NyaXB0aW9uIiwiZSIsInNob3dOb3RpZmljYXRpb24iLCJyZXF1ZXN0UHVzaCIsIl9hIiwiX2IiLCJfYyIsInByb21pc2VzIiwiYmFkZ2VQcm9taXNlIiwidGl0bGUiLCJub3RpZmljYXRpb25Qcm9taXNlIiwiYWxsIl0sIm1hcHBpbmdzIjoiQUFFQSxJQUFJO0FBQ0EsT0FBSyxvQkFBb0IsS0FBSztBQUNsQyxRQUNBO0FBQVU7QUNJVixNQUFNQSxJQUFXLENBQUNDLE1BQVNDLE1BQVM7QUFDaEMsTUFBSUMsSUFBTUY7QUFDVixTQUFJQyxFQUFLLFNBQVMsTUFDZEMsS0FBTyxPQUFPLEtBQUssVUFBVUQsQ0FBSSxNQUU5QkM7QUFDWCxHQVFhQyxJQUEyREo7QUNMeEUsTUFBTUssVUFBcUIsTUFBTTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQVM3QixZQUFZQyxHQUFXQyxHQUFTO0FBQzVCLFVBQU1DLElBQVVKLEVBQWlCRSxHQUFXQyxDQUFPO0FBQ25ELFVBQU1DLENBQU8sR0FDYixLQUFLLE9BQU9GLEdBQ1osS0FBSyxVQUFVQztBQUFBLEVBQ2xCO0FBQ0w7QUN6QkEsTUFBTUUsSUFBb0I7QUFB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QUF3QmpLLEdBQVM7QUFDakQ7QUFJQSxLQUFLLFlBQVk7QUFDakI2SjtBQUNBRCxHQUFpQixLQUFLLGFBQWE7QUFJbkMsSUFBSVMsSUFBd0M7QUFBQSxDQUkzQyxhQUNDSixFQUFRLDJCQUEyQixHQUNuQ0ksSUFBZSxNQUFNRDtBQUt2QixLQUFLLGlCQUFpQixXQUFXLENBQUN6SixNQUFVO0F0Q3RHNUMsTUFBQThKLEdBQUFDLEdBQUFDO0FzQ3VHTSxRQUFBRixJQUFBOUosRUFBTSxTQUFOLGdCQUFBOEosRUFBWSxVQUFTLHFCQUFxQjtBQUM1QyxVQUFNRyxJQUErQixDQUFBO0FBRTVCLElBQUFBLEVBQUEsS0FBS0wsSUFBa0IsR0FFNUIsaUJBQWlCLEtBQUssYUFDeEJLLEVBQVMsS0FBSyxLQUFLLFVBQVUsWUFBWSxDQUFDLENBQUMsR0FHN0NqSyxFQUFNLFVBQVUsUUFBUSxJQUFJaUssQ0FBUSxDQUFDO0FBQUE7QUFHbkMsSUFBQUYsSUFBQS9KLEVBQU0sU0FBTixnQkFBQStKLEVBQVksVUFBUyxtQkFDbkJMLElBQ0kxSixFQUFBLFVBQVU2SixHQUFZSCxDQUFZLENBQUMsSUFFbkMxSixFQUFBLFVBQVVzSixFQUFRLDJDQUEyQyxDQUFDLE1BSXBFVSxJQUFBaEssRUFBTSxTQUFOLGdCQUFBZ0ssRUFBWSxVQUFTLGNBQ25CLG1CQUFtQixLQUFLLGFBQzFCaEssRUFBTSxVQUFVLEtBQUssVUFBVSxjQUFlLENBQUE7QUFHcEQsQ0FBQztBQUVELEtBQUssaUJBQWlCLFFBQVEsQ0FBQ0EsTUFBVTtBdENsSXpDLE1BQUE4SjtBc0NtSUUsRUFBQVIsRUFBUSx5QkFBeUI7QUFFakMsUUFBTVcsSUFBK0IsQ0FBQSxHQUUvQkMsSUFBZVgsR0FBVSxDQUFDO0FBQ2hDLEVBQUFVLEVBQVMsS0FBS0MsQ0FBWTtBQUVwQixRQUFBLEVBQUUsT0FBQUMsSUFBUSxpQkFBaUIsTUFBQXRJLElBQU8sc0JBQW9CaUksSUFBQTlKLEVBQU0sU0FBTixnQkFBQThKLEVBQVksV0FBVSxJQUM1RU0sSUFBc0IsS0FBSyxhQUFhLGlCQUFpQkQsR0FBTyxFQUFFLE1BQUF0SSxHQUFNO0FBQzlFLEVBQUFvSSxFQUFTLEtBQUtHLENBQW1CO0FBRTNCLFFBQUFDLElBQU0sUUFBUSxJQUFJSixDQUFRLEVBQUUsTUFBTSxDQUFLTixNQUFBTCxFQUFRLDJCQUEyQkssR0FBRyxDQUFDO0FBRXBGLEVBQUEzSixFQUFNLFVBQVVxSyxDQUFHO0FBQ3JCLENBQUM7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzAsMSwyLDMsNCw1LDYsNyw4LDksMTAsMTEsMTIsMTMsMTQsMTUsMTYsMTcsMTgsMTksMjAsMjEsMjIsMjMsMjQsMjUsMjYsMjcsMjgsMjksMzAsMzEsMzIsMzMsMzQsMzUsMzYsMzddfQ==
