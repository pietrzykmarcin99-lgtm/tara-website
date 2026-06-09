// Main TypeScript entry point
import { initNavigation } from './modules/navigation';
import { initAnimations } from './modules/animations';
import { initSlider } from './modules/slider';
import { initVideo } from './modules/video';
import { initScrollableMobileImage } from './modules/scrollable-mobile-image';
import { initScrollTo } from './modules/scroll-to';
import { initMobileFullscreenImage } from './modules/mobile-fullscreen-image';
import { initRobotBackgroundWidth } from './modules/robot-background-width';
import { initTabletSlider } from './modules/tablet-slider.ts';
import { log } from './utils/logger';
import { initProjectPageAnimations } from './modules/animations/project-page';
import { initSmartFridgeAnimations } from './modules/animations/smart-fridge';
// Initialize the application
function init(): void {
  document.documentElement.classList.remove('js-loading');
  document.documentElement.classList.add('js-ready');

  log('Initializing portfolio website...');
  
  // Initialize modules
  initNavigation();
  initSlider();
  initAnimations();
  initVideo();
  initScrollableMobileImage();
  initMobileFullscreenImage();
  initRobotBackgroundWidth();
  initTabletSlider();
  initScrollTo();
  initProjectPageAnimations();
  initSmartFridgeAnimations();
  
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
