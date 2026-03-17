import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { log } from '../utils/logger';

const navLinkSelector = '.header__link[data-nav]';
const headerSelector = '.header';
const selectedClass = 'header__link--selected';
const headerOffsetGap = 0;

type NavigationEntry = {
  link: HTMLAnchorElement;
  target: HTMLElement;
  selector: string;
};

export function initSectionNavigation(): void {
  const entries = getNavigationEntries();

  if (!entries.length) {
    return;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gsap.registerPlugin(ScrollTrigger);

  const setSelectedLink = (nextLink: HTMLAnchorElement): void => {
    if (nextLink.classList.contains(selectedClass) && entries.every(({ link }) => link === nextLink || !link.classList.contains(selectedClass))) {
      return;
    }

    entries.forEach(({ link }) => {
      link.classList.toggle(selectedClass, link === nextLink);
    });
  };

  entries.forEach((entry) => {
    entry.link.addEventListener('click', (event) => {
      handleNavClick(event, entry, setSelectedLink, reduceMotion);
    });
  });

  entries.forEach((entry, index) => {
    const nextEntry = entries[index + 1];

    ScrollTrigger.create({
      trigger: entry.target,
      start: () => `top top+=${getScrollAnchorOffset() + 1}`,
      endTrigger: nextEntry?.target,
      end: nextEntry
        ? () => `top top+=${getScrollAnchorOffset() + 1}`
        : () => `bottom top+=${getScrollAnchorOffset() + 1}`,
      invalidateOnRefresh: true,
      onEnter: () => setSelectedLink(entry.link),
      onEnterBack: () => setSelectedLink(entry.link)
    });
  });

  syncSelectedLink(entries, setSelectedLink);
  ScrollTrigger.refresh();
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
  reduceMotion: boolean
): void {
  event.preventDefault();

  const label = entry.link.textContent?.trim() || entry.selector;
  log(`Navigation clicked: ${label}`);

  setSelectedLink(entry.link);

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

function getHeaderOffset(): number {
  const header = document.querySelector<HTMLElement>(headerSelector);

  if (!header) {
    return 0;
  }

  return header.getBoundingClientRect().height + headerOffsetGap;
}
