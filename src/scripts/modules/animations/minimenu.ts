import { gsap } from 'gsap';

const mobileMenuToggleSelector = '.header__left-mobile-open-minimenu';
const mobileHeaderContainerSelector = '.header__left.mobile-only';
const mobileMiniMenuSelector = '.header__left-mobile-minimenu';
const mobileHeaderOpenClass = 'header__left--open';
const mobileMainMenuToggleSelector = '.header__open-menu.mobile-only';
const mobileNavSelector = '.header__nav';
const mobileMainMenuToggleOpenClass = 'header__open-menu--open';
const mobileMainMenuBreakpoint = '(max-width: 1024px)';

type MobileMiniMenuState = {
  isOpen: boolean;
  miniMenu: HTMLElement;
  mobileHeaderContainer: HTMLElement;
  toggleButton: HTMLElement;
};

type MobileMainMenuState = {
  isOpen: boolean;
  nav: HTMLElement;
  toggleButton: HTMLElement;
};

export function initMiniMenuAnimation(): void {
  const mobileMenuToggleButton = document.querySelector<HTMLElement>(mobileMenuToggleSelector);

  if (mobileMenuToggleButton) {
    const miniMenuState = initializeMobileMiniMenu(mobileMenuToggleButton);

    mobileMenuToggleButton.addEventListener('click', (event) => {
      handleMobileMenuToggle(event, miniMenuState);
    });
  }

  const mobileMainMenuToggleButton = document.querySelector<HTMLElement>(mobileMainMenuToggleSelector);

  if (!mobileMainMenuToggleButton) {
    return;
  }

  const mainMenuState = initializeMobileMainMenu(mobileMainMenuToggleButton);

  mobileMainMenuToggleButton.addEventListener('click', (event) => {
    handleMobileMainMenuToggle(event, mainMenuState);
  });

  const mainMenuViewportWatcher = window.matchMedia(mobileMainMenuBreakpoint);

  mainMenuViewportWatcher.addEventListener('change', (mediaQueryEvent) => {
    const nav = document.querySelector<HTMLElement>(mobileNavSelector);

    if (!nav) {
      return;
    }

    if (!mediaQueryEvent.matches) {
      resetDesktopMainMenuState(nav, mobileMainMenuToggleButton);

      if (mainMenuState) {
        mainMenuState.isOpen = false;
      }

      return;
    }

    applyMobileMainMenuBaseStyles(nav);
    mobileMainMenuToggleButton.classList.remove(mobileMainMenuToggleOpenClass);
    mobileMainMenuToggleButton.setAttribute('aria-expanded', 'false');

    if (mainMenuState) {
      mainMenuState.isOpen = false;
    }
  });
}

function initializeMobileMainMenu(toggleButton: HTMLElement): MobileMainMenuState | null {
  const nav = document.querySelector<HTMLElement>(mobileNavSelector);

  if (!nav) {
    return null;
  }

  if (!isMobileMainMenuViewport()) {
    resetDesktopMainMenuState(nav, toggleButton);
    return null;
  }

  applyMobileMainMenuBaseStyles(nav);

  toggleButton.classList.remove(mobileMainMenuToggleOpenClass);
  toggleButton.setAttribute('aria-expanded', 'false');

  return {
    isOpen: false,
    nav,
    toggleButton
  };
}

function initializeMobileMiniMenu(toggleButton: HTMLElement): MobileMiniMenuState | null {
  const mobileHeaderContainer = toggleButton.closest<HTMLElement>(mobileHeaderContainerSelector);
  const miniMenu = mobileHeaderContainer?.querySelector<HTMLElement>(mobileMiniMenuSelector);

  if (!mobileHeaderContainer || !miniMenu) {
    return null;
  }

  mobileHeaderContainer.classList.remove(mobileHeaderOpenClass);

  gsap.killTweensOf(miniMenu);
  gsap.set(miniMenu, {
    autoAlpha: 0,
    y: -8,
    scaleY: 0.92,
    transformOrigin: 'top center',
    pointerEvents: 'none'
  });

  toggleButton.setAttribute('aria-expanded', 'false');

  return {
    isOpen: false,
    miniMenu,
    mobileHeaderContainer,
    toggleButton
  };
}

function handleMobileMenuToggle(event: Event, miniMenuState: MobileMiniMenuState | null): void {
  const toggleButton = event.currentTarget as HTMLElement;
  const state = miniMenuState ?? initializeMobileMiniMenu(toggleButton);

  if (!state) {
    return;
  }

  state.isOpen = !state.isOpen;
  state.mobileHeaderContainer.classList.toggle(mobileHeaderOpenClass, state.isOpen);
  state.toggleButton.setAttribute('aria-expanded', String(state.isOpen));

  gsap.killTweensOf(state.miniMenu);

  if (state.isOpen) {
    gsap.to(state.miniMenu, {
      autoAlpha: 1,
      y: 0,
      scaleY: 1,
      duration: 0.34,
      ease: 'power3.out',
      pointerEvents: 'auto'
    });
    return;
  }

  gsap.to(state.miniMenu, {
    autoAlpha: 0,
    y: -8,
    scaleY: 0.92,
    duration: 0.26,
    ease: 'power2.in',
    pointerEvents: 'none'
  });
}

function handleMobileMainMenuToggle(event: Event, mainMenuState: MobileMainMenuState | null): void {
  const toggleButton = event.currentTarget as HTMLElement;
  const state = mainMenuState ?? initializeMobileMainMenu(toggleButton);

  if (!state) {
    return;
  }

  if (!isMobileMainMenuViewport()) {
    resetDesktopMainMenuState(state.nav, state.toggleButton);
    return;
  }

  state.isOpen = !state.isOpen;
  state.toggleButton.classList.toggle(mobileMainMenuToggleOpenClass, state.isOpen);
  state.toggleButton.setAttribute('aria-expanded', String(state.isOpen));

  gsap.killTweensOf(state.nav);

  if (state.isOpen) {
    state.nav.style.setProperty('display', 'flex', 'important');

    gsap.to(state.nav, {
      height: 'auto',
      autoAlpha: 1,
      y: 0,
      scaleY: 1,
      duration: 0.34,
      ease: 'power3.out',
      pointerEvents: 'auto'
    });

    return;
  }

  gsap.to(state.nav, {
    height: 0,
    autoAlpha: 0,
    y: -8,
    scaleY: 0.96,
    duration: 0.26,
    ease: 'power2.in',
    pointerEvents: 'none',
    onComplete: () => {
      state.nav.style.setProperty('display', 'none', 'important');
    }
  });
}

function isMobileMainMenuViewport(): boolean {
  return window.matchMedia(mobileMainMenuBreakpoint).matches;
}

function applyMobileMainMenuBaseStyles(nav: HTMLElement): void {
  nav.style.setProperty('display', 'none', 'important');

  gsap.set(nav, {
    height: 0,
    autoAlpha: 0,
    y: -8,
    scaleY: 0.96,
    marginTop: 0,
    paddingTop: 0,
    paddingBottom: 0,
    transformOrigin: 'top center',
    pointerEvents: 'none'
  });
}

function resetDesktopMainMenuState(nav: HTMLElement, toggleButton: HTMLElement): void {
  gsap.killTweensOf(nav);
  nav.removeAttribute('style');
  toggleButton.classList.remove(mobileMainMenuToggleOpenClass);
  toggleButton.setAttribute('aria-expanded', 'false');
}