(() => {
  'use strict';
  const APP_ORIGIN = 'https://fitness.yokhan.xyz';
  const SITE_LOGIN_HREF = `${APP_ORIGIN}/auth?mode=login&returnTo=%2Fhome`;
  const REQUEST_TYPE = 'buffit:account-status:request';
  const RESPONSE_TYPE = 'buffit:account-status:response';
  const MIN_CHECK_INTERVAL = 15000;
  const MAX_RETRY_INTERVAL = 60000;
  const RESPONSE_TIMEOUT = 22000;
  const originalEntries = new WeakMap();
  let currentStatus = { status: 'unknown' };
  let frame;
  let frameReady = false;
  let activeRequest = null;
  // Keep correlation for authoritative storage pushes until a new request or iframe document replaces it.
  let latestRequestId = null;
  // Unknown and timeout close authenticated replies for this correlation, while anonymous pushes remain valid.
  let authenticatedResponseEligible = false;
  let timeout;
  let scheduledCheck;
  let retryTimer;
  let retryInterval = MIN_CHECK_INTERVAL;
  let lastCheck = -Infinity;
  let updateQueued = false;

  function isAppLink(anchor) {
    try { return new URL(anchor.getAttribute('href'), window.location.href).origin === APP_ORIGIN; }
    catch { return false; }
  }

  function isHeaderReady(anchor) {
    const root = anchor.closest('[data-landing-home-root], [data-landing-services-root]');
    if (!root) return true;
    const nav = anchor.closest('.nav') || root.querySelector('.nav');
    return nav?.getAttribute('data-buffit-header-ready') === 'true';
  }

  function setAttribute(element, name, value) {
    if (value === null) {
      if (element.hasAttribute(name)) element.removeAttribute(name);
    } else if (element.getAttribute(name) !== value) element.setAttribute(name, value);
  }

  function cleanName(value) {
    if (typeof value !== 'string' || value.includes('@')) return '';
    return value.replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80);
  }

  function updateEntries() {
    updateQueued = false;
    document.querySelectorAll('.nav__actions a.nav__login, a[data-buffit-account-entry]').forEach(anchor => {
      if (!isHeaderReady(anchor)) return;
      if (!originalEntries.has(anchor)) {
        if (!isAppLink(anchor)) return;
        originalEntries.set(anchor, {
          label: anchor.textContent,
          href: anchor.getAttribute('href'),
          title: anchor.getAttribute('title'),
          ariaLabel: anchor.getAttribute('aria-label'),
        });
        setAttribute(anchor, 'data-buffit-account-entry', '');
      }
      const original = originalEntries.get(anchor);
      const authenticated = currentStatus.status === 'authenticated';
      const anonymous = currentStatus.status === 'anonymous';
      const pending = !authenticated && !anonymous;
      const name = authenticated ? cleanName(currentStatus.displayName) : '';
      const label = authenticated ? (name || 'Профиль') : pending ? 'Аккаунт' : original.label;
      const labelNode = anchor.querySelector?.('.nav__action-label') || anchor;
      if (labelNode.textContent !== label) labelNode.textContent = label;
      setAttribute(anchor, 'href', authenticated ? `${APP_ORIGIN}/profile` : SITE_LOGIN_HREF);
      setAttribute(anchor, 'title', authenticated && name ? `Аккаунт: ${name}` : pending ? 'Аккаунт' : original.title);
      setAttribute(anchor, 'aria-label', authenticated ? (name ? `Аккаунт: ${name}` : 'Аккаунт') : pending ? 'Аккаунт' : original.ariaLabel);
      setAttribute(anchor, 'data-buffit-account-status', currentStatus.status);
      setAttribute(anchor, 'aria-busy', currentStatus.checking ? 'true' : null);
      setAttribute(anchor, 'data-buffit-account-checking', currentStatus.checking ? 'true' : null);
    });
    document.querySelectorAll('a[href]').forEach(anchor => {
      if (!isHeaderReady(anchor)) return;
      if (!isAppLink(anchor)) return;
      const isSiteLogin = anchor.hasAttribute('data-buffit-account-entry') && currentStatus.status !== 'authenticated';
      setAttribute(anchor, 'target', isSiteLogin ? null : '_blank');
      const relations = new Set((anchor.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      relations.add('noopener');
      relations.add('noreferrer');
      setAttribute(anchor, 'rel', [...relations].join(' '));
    });
  }

  function queueUpdate() {
    if (updateQueued) return;
    updateQueued = true;
    queueMicrotask(updateEntries);
  }

  function markChecking() {
    currentStatus = currentStatus.status === 'authenticated'
      ? { ...currentStatus, checking: true }
      : { status: 'unknown', checking: true };
    updateEntries();
  }

  function clearRetry() {
    if (retryTimer !== undefined) clearTimeout(retryTimer);
    retryTimer = undefined;
    retryInterval = MIN_CHECK_INTERVAL;
  }

  function scheduleRetry() {
    if (retryTimer !== undefined || document.visibilityState === 'hidden') return;
    const delay = retryInterval;
    retryInterval = Math.min(MAX_RETRY_INTERVAL, retryInterval * 2);
    retryTimer = setTimeout(() => {
      retryTimer = undefined;
      if (document.visibilityState === 'visible') requestStatus();
    }, delay);
  }

  function finishUnknown(requestId) {
    if (activeRequest !== requestId) return;
    activeRequest = null;
    authenticatedResponseEligible = false;
    clearTimeout(timeout);
    markChecking();
    scheduleRetry();
  }

  function requestStatus() {
    scheduledCheck = undefined;
    if (!frameReady || activeRequest || document.visibilityState === 'hidden') return;
    const remaining = MIN_CHECK_INTERVAL - (Date.now() - lastCheck);
    if (remaining > 0) {
      scheduledCheck = setTimeout(requestStatus, remaining);
      return;
    }
    let requestId;
    try { requestId = window.crypto.randomUUID(); }
    catch { return; }
    lastCheck = Date.now();
    activeRequest = requestId;
    latestRequestId = requestId;
    authenticatedResponseEligible = true;
    markChecking();
    timeout = setTimeout(() => finishUnknown(requestId), RESPONSE_TIMEOUT);
    frame.contentWindow.postMessage({ type: REQUEST_TYPE, version: 1, requestId }, APP_ORIGIN);
  }

  function refreshStatus() {
    // Keep the current request valid until its replacement is actually sent.
    if (scheduledCheck !== undefined || retryTimer !== undefined) return;
    requestStatus();
  }

  function onStatusMessage(event) {
    if (!frame || event.origin !== APP_ORIGIN || event.source !== frame.contentWindow) return;
    const data = event.data;
    if (!data || typeof data !== 'object' || data.type !== RESPONSE_TYPE || data.version !== 1 ||
        !latestRequestId || data.requestId !== latestRequestId ||
        !['authenticated', 'anonymous', 'unknown'].includes(data.status) ||
        (data.displayName !== undefined && typeof data.displayName !== 'string') ||
        (data.status === 'authenticated' && !authenticatedResponseEligible)) return;
    activeRequest = null;
    clearTimeout(timeout);
    if (data.status === 'unknown') {
      activeRequest = null;
      authenticatedResponseEligible = false;
      markChecking();
      scheduleRetry();
      return;
    }
    currentStatus = {
      status: data.status,
      ...(data.status === 'authenticated' ? { displayName: cleanName(data.displayName) } : {}),
    };
    clearRetry();
    updateEntries();
  }

  function start() {
    updateEntries();
    // The homepage hydrates its shared header; reapply consumer auth/navigation
    // metadata when React replaces a link or its content. Equality checks avoid loops.
    new MutationObserver(queueUpdate).observe(document.body, {
      subtree: true, childList: true, attributes: true, attributeFilter: ['href', 'data-buffit-header-ready'],
    });
    window.addEventListener('message', onStatusMessage);
    window.addEventListener('focus', refreshStatus);
    window.addEventListener('pageshow', refreshStatus);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') refreshStatus();
    });
    frame = document.createElement('iframe');
    frame.hidden = true;
    frame.tabIndex = -1;
    frame.title = 'Состояние аккаунта BUFF IT';
    frame.setAttribute('aria-hidden', 'true');
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.addEventListener('load', () => {
      frameReady = true;
      // Discard replies from any earlier document of the iframe.
      activeRequest = null;
      latestRequestId = null;
      authenticatedResponseEligible = false;
      clearTimeout(timeout);
      refreshStatus();
    });
    frame.addEventListener('error', () => {
      frameReady = false;
      activeRequest = null;
      latestRequestId = null;
      authenticatedResponseEligible = false;
      clearTimeout(timeout);
      markChecking();
    });
    frame.src = `${APP_ORIGIN}/account-status.html`;
    document.body.append(frame);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
