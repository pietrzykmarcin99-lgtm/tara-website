/**
 * Handles smooth scrolling to elements with optional offset
 * Usage: Add data-scroll-to and scroll-to class to trigger elements
 * Example: <button class="scroll-to" data-scroll-to="#target" data-scroll-to-offset="100">Scroll</button>
 * 
 * Responsive scrolling:
 * - data-scroll-to-desktop="#target" - scroll only on desktop (>= 1024px)
 * - data-scroll-to-mobile="#target" - scroll only on mobile (< 1024px)
 */

const MOBILE_BREAKPOINT = 1024;

function isMobile(): boolean {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

function getTargetSelector(trigger: HTMLElement): string | null {
  const isMobileViewport = isMobile();

  // Check for resolution-specific attributes
  const desktopSelector = trigger.getAttribute('data-scroll-to-desktop');
  const mobileSelector = trigger.getAttribute('data-scroll-to-mobile');

  if (isMobileViewport && mobileSelector) {
    return mobileSelector;
  }

  if (!isMobileViewport && desktopSelector) {
    return desktopSelector;
  }

  // Fallback to generic data-scroll-to if no resolution-specific attribute matches
  return trigger.getAttribute('data-scroll-to');
}

export function initScrollTo(): void {
  const scrollTriggers = document.querySelectorAll<HTMLElement>(
    '.scroll-to[data-scroll-to], .scroll-to[data-scroll-to-desktop], .scroll-to[data-scroll-to-mobile]'
  );

  scrollTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();

      const targetSelector = getTargetSelector(trigger);
      const offsetStr = trigger.getAttribute('data-scroll-to-offset');
      const offset = offsetStr ? parseInt(offsetStr, 10) : 0;

      if (!targetSelector) return;

      const targetElement = document.querySelector<HTMLElement>(targetSelector);

      if (!targetElement) {
        console.warn(`[scroll-to] Target element not found: ${targetSelector}`);
        return;
      }

      // Get the target position
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;

      // Smooth scroll to the target
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });
}
