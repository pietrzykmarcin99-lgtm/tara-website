// Animations module
import { initHeaderHiNavigationAnimation } from './animations/navigation';
import { log } from '../utils/logger';
import { initInViewAnimation } from './animations/in-view';
import { initDecors } from './animations/decors';
import { initButtonDecors } from './animations/btn-decors';
import { initThisIsMeAnimations, initThisIsMeModals, initThisIsMeArtPortfolioAnimations } from './animations/this-is-me';
import { initRecentWorkAnimation } from './animations/recent-work';

export function initAnimations(): void {
  log('Initializing animations...');
  
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all elements with animate class
  const animatedElements = document.querySelectorAll('.animate');
  animatedElements.forEach((el) => observer.observe(el));

  initHeaderHiNavigationAnimation();
  initInViewAnimation();
  initDecors();
  initButtonDecors();
  initThisIsMeAnimations();
  initThisIsMeModals();
  initThisIsMeArtPortfolioAnimations();
  initRecentWorkAnimation();
}
