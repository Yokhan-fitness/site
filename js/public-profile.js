(() => {
  const root = document.documentElement;
  const keys = { style: 'buffit-public-design-style', mode: 'buffit-public-mode' };
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch { /* The choice still works for this page. */ } };
  const apply = (style, mode) => {
    const resolvedStyle = style === 'estet' ? 'estet' : 'logik';
    const resolvedMode = mode === 'dark' ? 'dark' : 'light';
    root.dataset.buffitDesignStyle = resolvedStyle;
    root.dataset.buffitMode = resolvedMode;
    root.style.colorScheme = resolvedMode;
    document.querySelectorAll('.buffit-design-profile').forEach(el => {
      el.dataset.buffitDesignStyle = resolvedStyle;
      el.dataset.buffitMode = resolvedMode;
    });
    document.querySelectorAll('.buffit-screen-root').forEach(el => {
      el.dataset.buffitDesignStyle = resolvedStyle;
      el.dataset.buffitMode = resolvedMode;
      el.dataset.buffitTheme = resolvedMode;
    });
    document.querySelectorAll('[data-public-profile-select]').forEach(select => {
      select.value = select.dataset.publicProfileSelect === 'style' ? resolvedStyle : resolvedMode;
    });
    window.dispatchEvent(new Event('buffit:public-profile-change'));
  };
  const desktopQuery = typeof window.matchMedia === 'function' ? window.matchMedia('(min-width: 64rem)') : null;
  const syncHeaderLayout = () => {
    const layout = desktopQuery ? (desktopQuery.matches ? 'desktop' : 'compact') : 'desktop';
    document.querySelectorAll('.nav[data-buffit-header-responsive]').forEach(nav => {
      nav.dataset.buffitHeaderLayout = layout;
    });
  };
  const restore = () => {
    apply(read(keys.style), read(keys.mode));
    syncHeaderLayout();
  };
  restore();
  if (desktopQuery) {
    if (typeof desktopQuery.addEventListener === 'function') desktopQuery.addEventListener('change', syncHeaderLayout);
    else if (typeof desktopQuery.addListener === 'function') desktopQuery.addListener(syncHeaderLayout);
  }
  document.addEventListener('DOMContentLoaded', () => {
    restore();
    document.querySelectorAll('[data-public-profile-select]').forEach(select => {
      select.addEventListener('change', () => {
        const type = select.dataset.publicProfileSelect;
        save(keys[type], select.value);
        apply(type === 'style' ? select.value : root.dataset.buffitDesignStyle,
          type === 'mode' ? select.value : root.dataset.buffitMode);
      });
    });
  }, { once: true });
  window.addEventListener('storage', event => {
    if (event.key === null || Object.values(keys).includes(event.key)) restore();
  });
})();
