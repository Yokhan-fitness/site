(() => {
  const page = document.body;
  const root = document.documentElement;
  const selectedProfile = document.querySelector(
    ".buffit-design-profile[data-buffit-design-style]",
  );
  const designStyle =
    root.dataset.buffitDesignStyle ||
    page.dataset.buffitDesignStyle ||
    selectedProfile?.dataset.buffitDesignStyle ||
    "logik";
  const designMode =
    root.dataset.buffitMode ||
    page.dataset.buffitMode ||
    selectedProfile?.dataset.buffitMode ||
    "light";

  root.dataset.buffitDesignStyle = designStyle;
  root.dataset.buffitMode = designMode;

  const hero = document.querySelector(".buffit-landing-public-hero, .hero__stage");

  if (!hero) {
    return;
  }

  const getCssLengthPixels = (value) => {
    const length = value.trim();
    const numericValue = Number.parseFloat(length);

    if (!Number.isFinite(numericValue)) {
      return 0;
    }

    if (length.endsWith("rem")) {
      const rootFontSize = Number.parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );
      return Number.isFinite(rootFontSize) ? numericValue * rootFontSize : 0;
    }

    return numericValue;
  };

  const updateNavState = () => {
    const navSolidOffset = getCssLengthPixels(
      getComputedStyle(page).getPropertyValue("--nav-solid-offset"),
    );
    const solidThreshold = Math.max(0, hero.offsetHeight - navSolidOffset);
    page.classList.toggle("is-nav-solid", window.scrollY > solidThreshold);
  };

  window.addEventListener("scroll", updateNavState, { passive: true });
  window.addEventListener("resize", updateNavState);
  updateNavState();
})();
