import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';

const source = fs.readFileSync(new URL('../js/public-account.js', import.meta.url), 'utf8');
const APP = 'https://fitness.yokhan.xyz';
const SITE_LOGIN = `${APP}/auth?mode=login&returnTo=%2Fhome`;

function browser() {
  let now = 100000;
  let sequence = 0;
  let mutation;
  let observerOptions;
  const timers = new Map();
  const microtasks = [];
  const windowEvents = new Map();
  const documentEvents = new Map();
  class Element {
    constructor(href, label = '', account = false) {
      this.attrs = new Map(href ? [['href', href]] : []);
      this._textContent = label;
      this.account = account;
      this.events = new Map();
    }
    get textContent() { return this.labelNode?.textContent ?? this._textContent; }
    set textContent(value) {
      this._textContent = String(value);
      this.labelNode = null;
    }
    getAttribute(name) { return this.attrs.get(name) ?? null; }
    setAttribute(name, value) { this.attrs.set(name, String(value)); }
    hasAttribute(name) { return this.attrs.has(name); }
    removeAttribute(name) { this.attrs.delete(name); }
    addEventListener(name, fn) { this.events.set(name, fn); }
    querySelector(selector) { return selector === '.nav__action-label' ? this.labelNode ?? null : null; }
    closest(selector) {
      if (selector === '.nav') return this.nav ?? null;
      if (selector.includes('[data-landing-home-root]') || selector.includes('[data-landing-services-root]')) return this.hydrationRoot ?? null;
      return null;
    }
  }
  const entry = new Element(`${APP}/auth?mode=login&returnTo=%2Fhome`, 'Войти', true);
  const trial = new Element(`${APP}/train/guest`, 'Попробовать');
  const external = new Element('https://calls.yokhan.xyz/', 'CALLS');
  const disguised = new Element('https://fitness.yokhan.xyz.evil.test/home', 'Other');
  const relative = new Element('/programs.html', 'Программы');
  const anchors = [entry, trial, external, disguised, relative];
  const requests = [];
  let frame;
  const document = {
    readyState: 'complete', visibilityState: 'visible',
    querySelectorAll(selector) {
      return selector === 'a[href]' ? anchors.filter(item => item.hasAttribute('href'))
        : anchors.filter(item => item.account || item.hasAttribute('data-buffit-account-entry'));
    },
    addEventListener(name, fn) { documentEvents.set(name, fn); },
    body: { append(element) { frame = element; } },
    createElement(name) {
      assert.equal(name, 'iframe');
      const element = new Element();
      element.contentWindow = { postMessage(data, origin) { requests.push({ data, origin }); } };
      return element;
    },
  };
  const window = {
    location: { href: 'https://yokhan.xyz/' },
    crypto: { randomUUID: () => `request-${++sequence}` },
    addEventListener(name, fn) { windowEvents.set(name, fn); },
  };
  const context = {
    document, window, URL,
    Date: { now: () => now },
    WeakMap, Set,
    MutationObserver: class { constructor(fn) { mutation = fn; } observe(_target, options) { observerOptions = options; } },
    queueMicrotask(fn) { microtasks.push(fn); },
    setTimeout(fn, delay) { const id = ++sequence; timers.set(id, { fn, at: now + delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
  };
  vm.runInNewContext(source, context);
  function flushMutations() { mutation(); while (microtasks.length) microtasks.shift()(); }
  function advance(ms) {
    now += ms;
    let pending;
    while ((pending = [...timers].find(([, item]) => item.at <= now))) {
      timers.delete(pending[0]); pending[1].fn();
    }
  }
  function reply(data = {}, options = {}) {
    const last = requests.at(-1)?.data;
    windowEvents.get('message')({
      origin: options.origin ?? APP, source: options.source ?? frame.contentWindow,
      data: { type: 'buffit:account-status:response', version: 1, requestId: last?.requestId, status: 'authenticated', displayName: 'Игорь', ...data },
    });
  }
  return {
    entry, trial, external, disguised, relative, anchors, requests, document,
    get frame() { return frame; },
    get observerOptions() { return observerOptions; },
    load: () => frame.events.get('load')(),
    focus: () => windowEvents.get('focus')(),
    pageshow: () => windowEvents.get('pageshow')(),
    visible() { document.visibilityState = 'visible'; documentEvents.get('visibilitychange')(); },
    hidden() { document.visibilityState = 'hidden'; documentEvents.get('visibilitychange')(); },
    reply, advance, flushMutations, Element,
  };
}

test('site login stays in the same tab while APP product links open protected tabs', () => {
  const b = browser();
  assert.equal(b.entry.getAttribute('target'), null);
  assert.equal(b.entry.getAttribute('href'), SITE_LOGIN);
  for (const anchor of [b.trial]) {
    assert.equal(anchor.getAttribute('target'), '_blank');
    assert.equal(anchor.getAttribute('rel'), 'noopener noreferrer');
  }
  for (const anchor of [b.external, b.disguised, b.relative]) assert.equal(anchor.getAttribute('target'), null);
  assert.equal(b.frame.src, `${APP}/account-status.html`);
  assert.equal(b.frame.getAttribute('sandbox'), 'allow-scripts allow-same-origin');
  assert.equal(b.frame.hidden, true);
});

test('hydrated roots remain untouched until the header-ready marker', () => {
  const b = browser();
  const loginHref = `${APP}/auth?mode=login&returnTo=%2Fhome`;
  const nav = new b.Element();
  const root = { querySelector: selector => selector === '.nav' ? nav : null };
  const headerEntry = new b.Element(loginHref, 'Войти', true);
  headerEntry.nav = nav;
  headerEntry.hydrationRoot = root;
  const appAction = new b.Element(`${APP}/train/guest`, 'Попробовать');
  appAction.hydrationRoot = root;
  b.anchors.push(headerEntry, appAction);
  b.flushMutations();
  b.load(); b.reply();

  assert.equal(headerEntry.textContent, 'Войти');
  assert.deepEqual([...headerEntry.attrs.entries()], [['href', loginHref]]);
  assert.equal(appAction.getAttribute('target'), null);
  assert.equal(appAction.getAttribute('rel'), null);
  assert.ok(b.observerOptions.attributeFilter.includes('data-buffit-header-ready'));

  nav.setAttribute('data-buffit-header-ready', 'true');
  b.flushMutations();
  assert.equal(headerEntry.textContent, 'Игорь');
  assert.equal(headerEntry.getAttribute('href'), `${APP}/profile`);
  assert.equal(headerEntry.getAttribute('target'), '_blank');
  assert.equal(headerEntry.getAttribute('rel'), 'noopener noreferrer');
  assert.equal(appAction.getAttribute('target'), '_blank');
  assert.equal(appAction.getAttribute('rel'), 'noopener noreferrer');
});

test('initial and pending account state uses the site login return, never fitness home', () => {
  const b = browser();
  assert.equal(b.entry.textContent, 'Аккаунт');
  assert.equal(b.entry.getAttribute('href'), SITE_LOGIN);
  assert.equal(b.entry.getAttribute('aria-label'), 'Аккаунт');
  b.load();
  assert.equal(b.entry.textContent, 'Аккаунт');
  assert.equal(b.entry.getAttribute('href'), SITE_LOGIN);
});

test('rejects wrong origin, source, request id, version and invalid payload', () => {
  const b = browser(); b.load();
  b.reply({}, { origin: 'https://evil.test' });
  b.reply({}, { source: {} });
  b.reply({ requestId: 'stale' });
  b.reply({ version: 2 });
  b.reply({ status: 'signed-in' });
  b.reply({ displayName: {} });
  assert.equal(b.entry.textContent, 'Аккаунт');
  assert.equal(b.entry.getAttribute('href'), SITE_LOGIN);
  b.reply();
  assert.equal(b.entry.textContent, 'Игорь');
  assert.equal(b.entry.getAttribute('href'), `${APP}/profile`);
  assert.equal(b.entry.getAttribute('aria-label'), 'Аккаунт: Игорь');
});

test('unknown retires authentication but keeps same-request anonymous storage updates', () => {
  const b = browser(); b.load(); b.reply();
  b.advance(15000); b.focus();
  const requestId = b.requests.at(-1).data.requestId;
  b.reply({ status: 'unknown' });
  assert.equal(b.entry.textContent, 'Игорь');
  assert.equal(b.entry.getAttribute('href'), `${APP}/profile`);
  assert.equal(b.entry.getAttribute('aria-busy'), 'true');
  assert.equal(b.entry.getAttribute('data-buffit-account-checking'), 'true');
  assert.equal(b.entry.getAttribute('data-buffit-account-status'), 'authenticated');
  b.reply({ requestId, status: 'authenticated', displayName: 'Позднее имя' });
  assert.equal(b.entry.textContent, 'Игорь', 'unknown closes authenticated replies for this request');

  b.reply({ requestId, status: 'anonymous' });
  assert.equal(b.entry.textContent, 'Войти');
  assert.equal(b.entry.getAttribute('href'), SITE_LOGIN);
  assert.equal(b.entry.getAttribute('aria-busy'), null);
  assert.equal(b.entry.getAttribute('data-buffit-account-checking'), null);

  b.advance(15000); b.focus();
  const replacementId = b.requests.at(-1).data.requestId;
  b.reply({ requestId, status: 'authenticated', displayName: 'Устаревшее имя' });
  assert.equal(b.entry.textContent, 'Аккаунт', 'previous request is stale after its replacement is sent');
  assert.equal(b.entry.getAttribute('href'), SITE_LOGIN);
  b.reply({ requestId: replacementId, status: 'authenticated', displayName: 'Новый профиль' });
  assert.equal(b.entry.textContent, 'Новый профиль');
});

test('timeout retains checking identity, rejects late authentication, and accepts anonymous push', () => {
  const b = browser(); b.load(); b.reply();
  b.advance(15000); b.focus();
  const requestId = b.requests.at(-1).data.requestId;
  b.advance(22000);
  assert.equal(b.entry.textContent, 'Игорь');
  assert.equal(b.entry.getAttribute('href'), `${APP}/profile`);
  assert.equal(b.entry.getAttribute('aria-busy'), 'true');
  assert.equal(b.entry.getAttribute('data-buffit-account-checking'), 'true');
  assert.equal(b.entry.getAttribute('data-buffit-account-status'), 'authenticated');
  b.reply({ requestId, status: 'authenticated', displayName: 'Позднее имя' });
  assert.equal(b.entry.textContent, 'Игорь', 'timeout rejects late authenticated restoration');
  b.reply({ requestId, status: 'anonymous' });
  assert.equal(b.entry.textContent, 'Войти');
  assert.equal(b.entry.getAttribute('href'), SITE_LOGIN);
  assert.equal(b.entry.getAttribute('aria-busy'), null);
  assert.equal(b.entry.getAttribute('data-buffit-account-checking'), null);
});

test('initial unknown retries while visible and can recover to authenticated', () => {
  const b = browser(); b.load();
  b.reply({ status: 'unknown' });
  assert.equal(b.entry.getAttribute('data-buffit-account-status'), 'unknown');
  assert.equal(b.entry.getAttribute('aria-busy'), 'true');
  assert.equal(b.requests.length, 1);

  b.advance(14999);
  assert.equal(b.requests.length, 1, 'retry waits at least 15 seconds');
  b.advance(1);
  assert.equal(b.requests.length, 2);
  b.reply({ displayName: 'Восстановленный профиль' });
  assert.equal(b.entry.textContent, 'Восстановленный профиль');
  assert.equal(b.entry.getAttribute('data-buffit-account-status'), 'authenticated');
  assert.equal(b.entry.getAttribute('aria-busy'), null);

  b.advance(60000);
  assert.equal(b.requests.length, 2, 'success clears automatic retry');
});

test('repeated transient failures use increasing retry delays capped at 60 seconds', () => {
  const b = browser(); b.load();
  b.advance(22000); // first request times out; next retry is 15 seconds
  b.advance(15000);
  assert.equal(b.requests.length, 2);
  b.advance(22000); // next retry grows to 30 seconds
  b.advance(29999);
  assert.equal(b.requests.length, 2);
  b.advance(1);
  assert.equal(b.requests.length, 3);
  b.advance(22000); // later retries cap at 60 seconds
  b.advance(59999);
  assert.equal(b.requests.length, 3);
  b.advance(1);
  assert.equal(b.requests.length, 4);
});

test('unknown and timeout retry without duplicate requests; anonymous clears retries', () => {
  const b = browser(); b.load();
  b.advance(22000);
  assert.equal(b.entry.getAttribute('data-buffit-account-status'), 'unknown');
  b.advance(14999);
  assert.equal(b.requests.length, 1);
  b.advance(1);
  assert.equal(b.requests.length, 2);
  b.focus(); b.pageshow(); b.visible();
  assert.equal(b.requests.length, 2, 'lifecycle events do not duplicate active request');
  b.reply({ status: 'anonymous' });
  assert.equal(b.entry.getAttribute('data-buffit-account-status'), 'anonymous');
  assert.equal(b.entry.getAttribute('aria-busy'), null);
  b.advance(60000);
  assert.equal(b.requests.length, 2, 'authoritative anonymous response clears retry');
});

test('automatic retry waits for visibility and resumes on visible lifecycle event', () => {
  const b = browser(); b.load(); b.reply({ status: 'unknown' });
  b.hidden();
  b.advance(15000);
  assert.equal(b.requests.length, 1, 'hidden document does not start automatic request');
  b.visible();
  assert.equal(b.requests.length, 2);
});

test('repeated lifecycle checks preserve identity and reject stale replies', () => {
  const b = browser(); b.load();
  b.reply();
  const firstId = b.requests[0].data.requestId;
  b.advance(10000); b.pageshow(); b.focus(); b.visible();
  assert.equal(b.requests.length, 1);
  assert.equal(b.entry.textContent, 'Игорь');
  assert.equal(b.entry.getAttribute('href'), `${APP}/profile`);
  b.advance(5000);
  assert.equal(b.requests.length, 2);
  assert.equal(b.entry.textContent, 'Игорь');
  b.reply({ requestId: firstId });
  assert.equal(b.entry.textContent, 'Игорь', 'stale reply cannot change confirmed identity');
  b.reply({ displayName: 'Новое имя' }); assert.equal(b.entry.textContent, 'Новое имя');
});

test('hydrated replacement and rerendered header keep the current state and APP target', () => {
  const b = browser(); b.load(); b.reply();
  b.entry.textContent = 'Войти';
  b.entry.setAttribute('href', `${APP}/auth?mode=login`);
  const replacement = new b.Element(`${APP}/auth?mode=login`, 'Войти', true);
  b.anchors.push(replacement);
  b.flushMutations();
  for (const anchor of [b.entry, replacement]) {
    assert.equal(anchor.textContent, 'Игорь');
    assert.equal(anchor.getAttribute('href'), `${APP}/profile`);
    assert.equal(anchor.getAttribute('target'), '_blank');
  }
  b.focus();
  assert.equal(b.entry.textContent, 'Игорь');
  assert.equal(b.entry.getAttribute('href'), `${APP}/profile`);
  assert.equal(replacement.textContent, 'Игорь');
  assert.equal(replacement.getAttribute('href'), `${APP}/profile`);
});

test('scheduled lifecycle recheck accepts current reply until its replacement is sent', () => {
  const b = browser(); b.load(); b.reply();
  const firstId = b.requests[0].data.requestId;
  b.reply({ status: 'anonymous' });
  assert.equal(b.entry.textContent, 'Войти');
  assert.match(b.entry.getAttribute('href'), /mode=login/);
  b.reply({ status: 'authenticated', displayName: 'Таня' });
  assert.equal(b.entry.textContent, 'Таня');
  b.focus();
  b.pageshow();
  b.reply({ requestId: firstId, displayName: 'Обновлённое имя' });
  assert.equal(b.entry.textContent, 'Обновлённое имя', 'the current request remains valid until the replacement is sent');
  assert.equal(b.entry.getAttribute('href'), `${APP}/profile`);
  b.advance(15000);
  assert.equal(b.requests.length, 2);
  b.reply({ requestId: firstId, displayName: 'Старое имя' });
  assert.equal(b.entry.textContent, 'Обновлённое имя', 'a prior request is stale after a replacement is sent');
  b.reply({ displayName: 'Игорь' });
  assert.equal(b.entry.textContent, 'Игорь');
});

test('names are text only, bounded, and never show email as a header identity', () => {
  for (const displayName of ['person@example.com', '']) {
    const b = browser(); b.load(); b.reply({ displayName });
    assert.equal(b.entry.textContent, 'Профиль');
    assert.doesNotMatch(b.entry.getAttribute('title') ?? '', /@/);
  }
  const b = browser(); b.load(); b.reply({ displayName: '<img src=x>' });
  assert.equal(b.entry.textContent, '<img src=x>');
  assert.equal(b.entry.getAttribute('aria-label'), 'Аккаунт: <img src=x>');
});

test('long known names remain names; layout, not a generic label, truncates them', () => {
  const b = browser(); b.load();
  const name = 'Очень длинное имя пользователя';
  b.reply({ displayName: name });
  assert.equal(b.entry.textContent, name);
  assert.equal(b.entry.getAttribute('aria-label'), `Аккаунт: ${name}`);
  assert.equal(b.entry.getAttribute('title'), `Аккаунт: ${name}`);
});

test('account updates retain the shared header label element for CSS ellipsis', () => {
  const b = browser();
  const labelNode = new b.Element(null, 'Войти');
  labelNode.setAttribute('data-testid', 'nav-action-label');
  b.entry.labelNode = labelNode;
  b.load(); b.reply({ displayName: 'Александр Константинопольский' });
  assert.equal(b.entry.labelNode, labelNode);
  assert.equal(labelNode.textContent, 'Александр Константинопольский');
  assert.equal(labelNode.getAttribute('data-testid'), 'nav-action-label');
  assert.equal(b.entry.textContent, 'Александр Константинопольский');
  assert.equal(b.entry.getAttribute('target'), '_blank');
  b.focus();
  assert.equal(b.entry.getAttribute('target'), '_blank');
  assert.equal(b.entry.getAttribute('href'), `${APP}/profile`);
});
