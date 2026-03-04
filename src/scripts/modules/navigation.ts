// Navigation module
import { initMiniMenuAnimation } from './animations/minimenu';
import { log } from '../utils/logger';

export function initNavigation(): void {
  log('Initializing navigation...');
  
  const navLinks = document.querySelectorAll('.header__link');
  
  navLinks.forEach((link) => {
    link.addEventListener('click', handleNavClick);
  });

  initMiniMenuAnimation();
}

function handleNavClick(event: Event): void {
  const target = event.currentTarget as HTMLElement;
  log(`Navigation clicked: ${target.textContent}`);
  
  // Add selected state
  document.querySelectorAll('.header__link').forEach((link) => {
    link.classList.remove('header__link--selected');
  });
  target.classList.add('header__link--selected');
}

