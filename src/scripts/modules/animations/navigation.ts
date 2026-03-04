import { initMobileSmileAnimation } from './navigation-mobile';
import { initDesktopNavigationDecorations } from './navigation-desktop';

export function initHeaderHiNavigationAnimation(): void {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initMobileSmileAnimation(reduceMotion);
  initDesktopNavigationDecorations(reduceMotion);
}
