import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { log } from '../utils/logger';

const navLinkSelector = '.header__link[data-nav]';
const headerSelector = '.header';
const selectedClass = 'header__link--selected';
const headerOffsetGap = 0;
const minDownActivationExtra = 36;
const maxDownActivationExtra = 120;
const downActivationViewportRatio = 0.14;
const minUpActivationExtra = 0;
const maxUpActivationExtra = 24;
const upActivationViewportRatio = 0.03;

type NavigationEntry = {
  link: HTMLAnchorElement;
  target: HTMLElement;
  selector: string;
};

export function initSectionNavigation(): void {
  resetInitialScrollPosition();

  const entries = getNavigationEntries();

  if (!entries.length) {
    return;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lockedSelectedLink: HTMLAnchorElement | null = null;
  let selectionLockTimeoutId: number | null = null;

  gsap.registerPlugin(ScrollTrigger);

  const clearSelectionLock = (): void => {
    if (selectionLockTimeoutId !== null) {
      window.clearTimeout(selectionLockTimeoutId);
      selectionLockTimeoutId = null;
    }

    lockedSelectedLink = null;
  };

  const lockSelection = (link: HTMLAnchorElement): void => {
    clearSelectionLock();
    lockedSelectedLink = link;

    selectionLockTimeoutId = window.setTimeout(() => {
      clearSelectionLock();
      syncSelectedLink(entries, setSelectedLink);
    }, reduceMotion ? 120 : 950);
  };

  const setSelectedLink = (nextLink: HTMLAnchorElement): void => {
    if (lockedSelectedLink && nextLink !== lockedSelectedLink) {
      return;
    }

    if (nextLink.classList.contains(selectedClass) && entries.every(({ link }) => link === nextLink || !link.classList.contains(selectedClass))) {
      return;
    }

    entries.forEach(({ link }) => {
      link.classList.toggle(selectedClass, link === nextLink);
    });
  };

  entries.forEach((entry) => {
    entry.link.addEventListener('pointerdown', () => {
      setSelectedLink(entry.link);
      lockSelection(entry.link);
    }, { passive: true });

    entry.link.addEventListener('click', (event) => {
      handleNavClick(event, entry, setSelectedLink, lockSelection, reduceMotion);
    });
  });

  entries.forEach((entry, index) => {
    const nextEntry = entries[index + 1];
    const activationOffsets = getActivationOffsets();

    ScrollTrigger.create({
      trigger: entry.target,
      start: () => `top top+=${activationOffsets.down + 1}`,
      endTrigger: nextEntry?.target,
      end: nextEntry
        ? () => `top top+=${activationOffsets.down + 1}`
        : () => `bottom top+=${activationOffsets.down + 1}`,
      invalidateOnRefresh: true,
      onEnter: () => setSelectedLink(entry.link)
    });

    ScrollTrigger.create({
      trigger: entry.target,
      start: () => `top top+=${activationOffsets.up + 1}`,
      endTrigger: nextEntry?.target,
      end: nextEntry
        ? () => `top top+=${activationOffsets.up + 1}`
        : () => `bottom top+=${activationOffsets.up + 1}`,
      invalidateOnRefresh: true,
      onEnterBack: () => setSelectedLink(entry.link)
    });
  });

  syncSelectedLink(entries, setSelectedLink);
  ScrollTrigger.refresh();
}

function resetInitialScrollPosition(): void {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  if (window.location.hash) {
    return;
  }

  requestAnimationFrame(() => {
    if (window.scrollY <= 0) {
      return;
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
  });
}

function getNavigationEntries(): NavigationEntry[] {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(navLinkSelector));

  return links.flatMap((link) => {
    const selector = link.dataset.nav?.trim();

    if (!selector) {
      return [];
    }

    const target = document.querySelector<HTMLElement>(selector);

    if (!target) {
      log(`Navigation target not found for selector: ${selector}`);
      return [];
    }

    return [{
      link,
      target,
      selector
    }];
  });
}

function handleNavClick(
  event: Event,
  entry: NavigationEntry,
  setSelectedLink: (link: HTMLAnchorElement) => void,
  lockSelection: (link: HTMLAnchorElement) => void,
  reduceMotion: boolean
): void {
  event.preventDefault();

  const label = entry.link.textContent?.trim() || entry.selector;
  log(`Navigation clicked: ${label}`);

  setSelectedLink(entry.link);
  lockSelection(entry.link);

  const targetY = Math.max(0, entry.target.getBoundingClientRect().top + window.scrollY - getScrollAnchorOffset());

  window.scrollTo({
    top: targetY,
    left: 0,
    behavior: reduceMotion ? 'auto' : 'smooth'
  });
}

function syncSelectedLink(
  entries: NavigationEntry[],
  setSelectedLink: (link: HTMLAnchorElement) => void
): void {
  const activeThreshold = getScrollAnchorOffset() + 1;
  const currentEntry = [...entries].reverse().find(({ target }) => target.getBoundingClientRect().top <= activeThreshold);

  setSelectedLink(currentEntry?.link ?? entries[0].link);
}

function getScrollAnchorOffset(): number {
  return getHeaderOffset();
}

function getActivationOffsets(): { down: number; up: number } {
  const headerOffset = getHeaderOffset();
  const availableViewport = Math.max(0, window.innerHeight - headerOffset);

  const downExtra = Math.min(
    maxDownActivationExtra,
    Math.max(minDownActivationExtra, availableViewport * downActivationViewportRatio)
  );

  const upExtra = Math.min(
    maxUpActivationExtra,
    Math.max(minUpActivationExtra, availableViewport * upActivationViewportRatio)
  );

  return {
    down: headerOffset + downExtra,
    up: headerOffset + upExtra
  };
}

function getHeaderOffset(): number {
  const header = document.querySelector<HTMLElement>(headerSelector);

  if (!header) {
    return 0;
  }

  return header.getBoundingClientRect().height + headerOffsetGap;
}
