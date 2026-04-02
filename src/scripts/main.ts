// Main TypeScript entry point
import { initNavigation } from './modules/navigation';
import { initAnimations } from './modules/animations';
import { initSlider } from './modules/slider';
import { log } from './utils/logger';

// Initialize the application
function init(): void {
  document.documentElement.classList.remove('js-loading');
  document.documentElement.classList.add('js-ready');

  log('Initializing portfolio website...');
  
  // Initialize modules
  initNavigation();
  initSlider();
  initAnimations();
  
  log('Portfolio website initialized successfully!');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for potential use in other scripts
export { init };
