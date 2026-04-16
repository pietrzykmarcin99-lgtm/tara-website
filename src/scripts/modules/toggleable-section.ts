
export function initToggleableSectionAnimation(): void {
  const transitionHandlers = new WeakMap<HTMLElement, (event: TransitionEvent) => void>();

  const toggleButtons = document.querySelectorAll('.toggleable-section__header');

  toggleButtons.forEach((button) => {
    const section = button.closest('.toggleable-section');
    const content = section?.querySelector('.toggleable-section__content') as HTMLElement;

    if (!section || !content) return;

    // Initialize state to avoid first-paint jumps and ensure smooth future toggles.
    if (section.classList.contains('toggleable-section--opened')) {
      content.style.height = 'auto';
      content.style.overflow = 'hidden';
      content.style.opacity = '1';
      content.style.visibility = 'visible';
      setState(content, 'open');
    } else {
      content.style.height = '0px';
      content.style.overflow = 'hidden';
      content.style.opacity = '0';
      content.style.visibility = 'hidden';
      setState(content, 'closed');
    }

    // Handle click
    button.addEventListener('click', () => {
      const state = getState(content);

      if (state === 'open' || state === 'opening') {
        closeSection(section, content, transitionHandlers);
      } else {
        openSection(section, content, transitionHandlers);
      }
    });
  });
}

function openSection(
  section: Element,
  content: HTMLElement,
  transitionHandlers: WeakMap<HTMLElement, (event: TransitionEvent) => void>
): void {
  cancelRunningTransition(content, transitionHandlers);

  const currentHeight = content.getBoundingClientRect().height;
  const targetHeight = getActualHeight(content);

  // Make content available before animating from collapsed state.
  content.style.visibility = 'visible';
  content.style.opacity = '1';
  content.style.height = `${Math.max(currentHeight, 0)}px`;
  content.style.overflow = 'hidden';
  setState(content, 'opening');
  section.classList.add('toggleable-section--opened');

  // Force a frame so the browser commits the start height before transitioning.
  void content.offsetHeight;

  content.style.transition = 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease';
  content.style.height = `${targetHeight}px`;

  const onTransitionEnd = (event: TransitionEvent) => {
    if (event.propertyName !== 'height') return;

    // Let content grow naturally after expansion.
    content.style.height = 'auto';
    content.style.transition = '';
    setState(content, 'open');
    content.removeEventListener('transitionend', onTransitionEnd);
    transitionHandlers.delete(content);
  };

  transitionHandlers.set(content, onTransitionEnd);
  content.addEventListener('transitionend', onTransitionEnd);
}

function closeSection(
  section: Element,
  content: HTMLElement,
  transitionHandlers: WeakMap<HTMLElement, (event: TransitionEvent) => void>
): void {
  cancelRunningTransition(content, transitionHandlers);

  const renderedHeight = content.getBoundingClientRect().height;
  const measuredHeight = getActualHeight(content);
  const startHeight = Math.max(renderedHeight, measuredHeight, 0);

  // Lock to pixel height first so we can animate to 0 consistently.
  content.style.visibility = 'visible';
  content.style.height = `${startHeight}px`;
  content.style.overflow = 'hidden';
  setState(content, 'closing');
  section.classList.remove('toggleable-section--opened');

  // Force reflow so transition starts from the locked pixel height.
  void content.offsetHeight;

  content.style.transition = 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease';
  content.style.height = '0px';
  content.style.opacity = '0';

  const onTransitionEnd = (event: TransitionEvent) => {
    if (event.propertyName !== 'height') return;

    // Keep collapsed state without display:none to avoid flicker/pop.
    content.style.visibility = 'hidden';
    content.style.transition = '';
    setState(content, 'closed');
    content.removeEventListener('transitionend', onTransitionEnd);
    transitionHandlers.delete(content);
  };

  transitionHandlers.set(content, onTransitionEnd);
  content.addEventListener('transitionend', onTransitionEnd);
}

function getActualHeight(element: HTMLElement): number {
  // Temporarily reveal enough to measure natural content height.
  const originalHeight = element.style.height;
  const originalVisibility = element.style.visibility;
  const originalOpacity = element.style.opacity;
  const originalOverflow = element.style.overflow;

  element.style.visibility = 'hidden';
  element.style.opacity = '0';
  element.style.height = 'auto';
  element.style.overflow = 'hidden';

  const height = element.scrollHeight;

  // Restore original styles.
  element.style.height = originalHeight;
  element.style.visibility = originalVisibility;
  element.style.opacity = originalOpacity;
  element.style.overflow = originalOverflow;

  return height;
}

function cancelRunningTransition(
  content: HTMLElement,
  transitionHandlers: WeakMap<HTMLElement, (event: TransitionEvent) => void>
): void {
  const existingHandler = transitionHandlers.get(content);

  if (existingHandler) {
    content.removeEventListener('transitionend', existingHandler);
    transitionHandlers.delete(content);
  }

  // Keep current visual frame as baseline for the next transition.
  const currentHeight = content.getBoundingClientRect().height;
  content.style.transition = 'none';
  content.style.height = `${Math.max(currentHeight, 0)}px`;
  void content.offsetHeight;
  content.style.transition = '';
}

function getState(content: HTMLElement): 'open' | 'closed' | 'opening' | 'closing' {
  const state = content.dataset.toggleState;

  if (state === 'open' || state === 'closed' || state === 'opening' || state === 'closing') {
    return state;
  }

  return content.style.height === '0px' ? 'closed' : 'open';
}

function setState(content: HTMLElement, state: 'open' | 'closed' | 'opening' | 'closing'): void {
  content.dataset.toggleState = state;
}
