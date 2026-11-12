(() => {
  const root = document.documentElement;
  const keys = { style: 'buffit-public-design-style', mode: 'buffit-public-mode' };
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch { /* The choice still works for this page. */ } };
  const apply = (style, mode) => {
    root.dataset.buffitDesignStyle = style === 'estet' ? 'estet' : 'logik';
    root.dataset.buffitMode = mode === 'dark' ? 'dark' : 'light';
    root.style.colorScheme = root.dataset.buffitMode;
    document.querySelectorAll('[data-public-profile-select]').forEach(select => {
      select.value = select.dataset.publicProfileSelect === 'style' ? root.dataset.buffitDesignStyle : root.dataset.buffitMode;
    });
    window.dispatchEvent(new Event('buffit:public-profile-change'));
  };
  const restore = () => apply(read(keys.style), read(keys.mode));
  restore();
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
