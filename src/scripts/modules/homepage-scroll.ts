const positionKey = 'portfolio:homepage-scroll';
const returnKey = 'portfolio:return-to-homepage';
const sliderTargetKey = 'portfolio:homepage-slider-target';

let pendingSliderTarget: string | null = null;

function isHomepage(url: URL): boolean {
  return url.origin === window.location.origin &&
    (url.pathname === '/' || url.pathname === '/index.html');
}

// Consumed once by the slider module during its own init, right after this module resolves it.
export function consumeHomepageSliderTarget(): string | null {
  const target = pendingSliderTarget;
  pendingSliderTarget = null;
  return target;
}

export function initHomepageScrollRestoration(): boolean {
  const onHomepage = isHomepage(new URL(window.location.href));

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
      event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const link = event.target instanceof Element
      ? event.target.closest<HTMLAnchorElement>('a[href]')
      : null;

    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) {
      return;
    }

    const destination = new URL(link.href);
    if (destination.origin !== window.location.origin) {
      return;
    }

    try {
      if (onHomepage && !isHomepage(destination) && destination.pathname.endsWith('.html')) {
        sessionStorage.setItem(positionKey, String(window.scrollY));
        sessionStorage.setItem(sliderTargetKey, destination.pathname);
        sessionStorage.removeItem(returnKey);
      } else if (!onHomepage && document.body.classList.contains('project-page') &&
        isHomepage(destination) && !destination.hash) {
        sessionStorage.setItem(returnKey, 'true');
      }
    } catch {
      return;
    }
  });

  if (!onHomepage) {
    return false;
  }

  const takePosition = (historyReturn = false): number | null => {
    try {
      const storedPosition = sessionStorage.getItem(positionKey);
      const storedSliderTarget = sessionStorage.getItem(sliderTargetKey);
      const shouldRestore = sessionStorage.getItem(returnKey) === 'true' || historyReturn;
      sessionStorage.removeItem(positionKey);
      sessionStorage.removeItem(returnKey);
      sessionStorage.removeItem(sliderTargetKey);

      if (shouldRestore && !window.location.hash) {
        pendingSliderTarget = storedSliderTarget;
      }

      const position = Number(storedPosition);
      return shouldRestore && !window.location.hash && storedPosition !== null &&
        Number.isFinite(position) && position >= 0 ? position : null;
    } catch {
      return null;
    }
  };

  const restorePosition = (position: number): void => {
    window.scrollTo({ top: position, left: 0, behavior: 'instant' });
  };

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      const position = takePosition(true);
      if (position !== null) {
        requestAnimationFrame(() => restorePosition(position));
      }
    }
  });

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  const position = takePosition(navigation?.type === 'back_forward');
  if (position === null) {
    return false;
  }

  let interrupted = false;
  const interrupt = (): void => { interrupted = true; };
  const inputEvents = ['pointerdown', 'wheel', 'touchstart', 'keydown'] as const;
  inputEvents.forEach((type) => window.addEventListener(type, interrupt, { once: true, passive: true }));

  const restore = (): void => {
    if (!interrupted) {
      restorePosition(position);
    }
  };

  requestAnimationFrame(restore);
  const finishRestoring = (): void => {
    void document.fonts.ready.then(() => {
      requestAnimationFrame(() => {
        restore();
        inputEvents.forEach((type) => window.removeEventListener(type, interrupt));
      });
    });
  };

  if (document.readyState === 'complete') {
    finishRestoring();
  } else {
    window.addEventListener('load', finishRestoring, { once: true });
  }

  return true;
}