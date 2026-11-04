(() => {
  const DEFAULT_MOTION_DURATION_MS = 0;
  const nav = document.querySelector(".nav");

  if (!nav) {
    return;
  }

  const groups = Array.from(nav.querySelectorAll(".nav__group"));
  const mobileToggle = nav.querySelector(".nav__mobile-toggle");
  const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  let closeMotionTimerId;
  let closeTimerId;
  let switchTimerId;
  let openedByPointer = null;

  const getTrigger = (group) => group.querySelector(".nav__trigger");

  const hasOpenGroup = () => groups.some((group) => group.classList.contains("is-open"));

  const syncMenuState = () => {
    document.body.classList.toggle("is-nav-menu-open", hasOpenGroup());
  };

  const getDurationMilliseconds = (value, fallback) => {
    const duration = value.trim();
    const amount = Number.parseFloat(duration);

    if (!Number.isFinite(amount)) {
      return fallback;
    }

    if (duration.endsWith("ms")) {
      return amount;
    }

    if (duration.endsWith("s")) {
      return amount * 1000;
    }

    return amount;
  };

  const getMotionDuration = (tokenName) => getDurationMilliseconds(
    getComputedStyle(document.documentElement).getPropertyValue(tokenName),
    DEFAULT_MOTION_DURATION_MS,
  );

  const clearCloseMotionTimer = () => {
    window.clearTimeout(closeMotionTimerId);
  };

  const clearCloseTimer = () => {
    window.clearTimeout(closeTimerId);
  };

  const clearSwitchTimer = () => {
    window.clearTimeout(switchTimerId);
  };

  const setClosingState = (isClosing) => {
    clearCloseMotionTimer();
    document.body.classList.toggle("is-nav-menu-closing", isClosing);

    if (!isClosing) {
      return;
    }

    closeMotionTimerId = window.setTimeout(() => {
      document.body.classList.remove("is-nav-menu-closing");
    }, getMotionDuration("--motion-nav-surface"));
  };

  const setSwitchState = (isSwitching) => {
    clearSwitchTimer();
    document.body.classList.toggle("is-nav-switching", isSwitching);

    if (!isSwitching) {
      return;
    }

    switchTimerId = window.setTimeout(() => {
      document.body.classList.remove("is-nav-switching");
    }, getMotionDuration("--motion-nav-switch"));
  };

  const setMobileState = (isOpen) => {
    document.body.classList.toggle("is-nav-mobile-open", isOpen);

    if (mobileToggle) {
      mobileToggle.setAttribute("aria-expanded", String(isOpen));
      mobileToggle.setAttribute("aria-label", isOpen ? "Закрыть основное меню" : "Открыть основное меню");
      const label = mobileToggle.querySelector(".nav__mobile-label");
      if (label) label.textContent = isOpen ? "Закрыть" : "Меню";
    }
  };

  const focusFirstMobileControl = () => {
    const firstTrigger = groups.map(getTrigger).find(Boolean);
    firstTrigger?.focus({ preventScroll: true });
  };

  const setControlId = (group, index) => {
    const trigger = getTrigger(group);
    const dropdown = group.querySelector(".nav__dropdown");

    if (!trigger || !dropdown) {
      return;
    }

    dropdown.id = dropdown.id || `nav-dropdown-${index + 1}`;
    trigger.setAttribute("aria-controls", dropdown.id);
  };

  const closeGroup = (group) => {
    const trigger = getTrigger(group);
    group.classList.remove("is-open");

    if (trigger) {
      trigger.setAttribute("aria-expanded", "false");
    }
  };

  const closeGroups = () => {
    openedByPointer = null;
    const shouldHoldClosingContext =
      hasOpenGroup() && !document.body.classList.contains("is-nav-mobile-open");

    setSwitchState(false);
    groups.forEach(closeGroup);
    syncMenuState();
    setClosingState(shouldHoldClosingContext);
  };

  const openGroup = (group) => {
    const isSwitching = groups.some(
      (item) => item !== group && item.classList.contains("is-open"),
    );

    clearCloseTimer();
    setClosingState(false);
    setSwitchState(isSwitching);
    groups.filter((item) => item !== group).forEach(closeGroup);
    group.classList.add("is-open");

    const trigger = getTrigger(group);

    if (trigger) {
      trigger.setAttribute("aria-expanded", "true");
    }

    syncMenuState();
  };

  const toggleGroup = (group) => {
    if (group.classList.contains("is-open")) {
      closeGroups();
      return;
    }

    openGroup(group);
  };

  const closeFromOutside = (event) => {
    const target = event.target;

    if (!(target instanceof Node) || nav.contains(target)) {
      return;
    }

    closeGroups();
    setMobileState(false);
  };

  const closeFromEscape = (event) => {
    if (event.key !== "Escape") {
      return;
    }

    const wasMobileOpen = document.body.classList.contains("is-nav-mobile-open");
    const openGroupItem = groups.find((group) => group.classList.contains("is-open"));
    const trigger = openGroupItem ? getTrigger(openGroupItem) : null;

    closeGroups();
    setMobileState(false);

    if (wasMobileOpen && mobileToggle) {
      mobileToggle.focus({ preventScroll: true });
    } else if (trigger) {
      trigger.focus();
    }
  };

  groups.forEach((group) => {
    const trigger = getTrigger(group);

    if (!trigger) {
      return;
    }

    trigger.setAttribute("aria-expanded", "false");

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      // A mouse can enter (and open) the group immediately before its click.
      // Keep that first click open; keyboard and subsequent clicks toggle it.
      if (openedByPointer === group && event.detail > 0) {
        openedByPointer = null;
        openGroup(group);
      } else {
        toggleGroup(group);
      }
    });

    group.addEventListener("pointerenter", () => {
      if (hoverQuery.matches) {
        if (!group.classList.contains("is-open")) openedByPointer = group;
        openGroup(group);
      }
    });
  });

  nav.addEventListener("pointerenter", () => {
    if (hoverQuery.matches) {
      clearCloseTimer();
    }
  });

  nav.addEventListener("pointerleave", () => {
    if (hoverQuery.matches) {
      clearCloseTimer();
      closeTimerId = window.setTimeout(
        closeGroups,
        getMotionDuration("--motion-nav-close-delay"),
      );
    }
  });

  nav.addEventListener("focusout", (event) => {
    const nextTarget = event.relatedTarget;

    if (!(nextTarget instanceof Node) || !nav.contains(nextTarget)) {
      closeGroups();
    }
  });

  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      const shouldOpen = !document.body.classList.contains("is-nav-mobile-open");
      setMobileState(shouldOpen);

      if (shouldOpen) {
        window.requestAnimationFrame(focusFirstMobileControl);
      } else {
        closeGroups();
      }
    });
  }

  groups.forEach(setControlId);

  document.addEventListener("click", closeFromOutside);
  document.addEventListener("keydown", closeFromEscape);
})();
