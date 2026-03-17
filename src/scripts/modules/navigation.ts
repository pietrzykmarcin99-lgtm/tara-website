// Navigation module
import { initMiniMenuAnimation } from './animations/minimenu';
import { initSectionNavigation } from './navigation-scroll';
import { log } from '../utils/logger';

export function initNavigation(): void {
  log('Initializing navigation...');

  initSectionNavigation();

  initMiniMenuAnimation();
}

