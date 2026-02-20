// Navigation module
import { log } from '../utils/logger';

export function initNavigation(): void {
  log('Initializing navigation...');
  
  const navLinks = document.querySelectorAll('.header__link');
  
  navLinks.forEach((link) => {
    link.addEventListener('click', handleNavClick);
  });
}

function handleNavClick(event: Event): void {
  const target = event.currentTarget as HTMLElement;
  log(`Navigation clicked: ${target.textContent}`);
  
  // Add active state
  document.querySelectorAll('.header__link').forEach((link) => {
    link.classList.remove('active');
  });
  target.classList.add('active');
}
