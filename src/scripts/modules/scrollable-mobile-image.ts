type ScrollableState = {
  pointerId: number | null;
  touchId: number | null;
  isDragging: boolean;
  dragStartX: number;
  startScrollLeft: number;
};

const SCROLL_EDGE_THRESHOLD = 1;

function getScrollDistance(viewport: HTMLElement): number {
  return Math.max(220, Math.min(420, viewport.clientWidth * 0.85));
}

function updateArrowVisibility(
  viewport: HTMLElement,
  leftArrow: HTMLButtonElement,
  rightArrow: HTMLButtonElement,
): void {
  const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;

  if (maxScrollLeft <= SCROLL_EDGE_THRESHOLD) {
    leftArrow.hidden = true;
    rightArrow.hidden = true;
    return;
  }

  const atStart = viewport.scrollLeft <= SCROLL_EDGE_THRESHOLD;
  const atEnd = viewport.scrollLeft >= maxScrollLeft - SCROLL_EDGE_THRESHOLD;

  leftArrow.hidden = atStart;
  rightArrow.hidden = atEnd;
}

function getTouchById(touchList: TouchList, touchId: number): Touch | null {
  for (let index = 0; index < touchList.length; index += 1) {
    const touch = touchList.item(index);
    if (touch && touch.identifier === touchId) {
      return touch;
    }
  }

  return null;
}

function setupScrollableImage(root: HTMLElement): void {
  const viewport = root.querySelector<HTMLElement>('.scrollable-mobile-image__viewport');
  const leftArrow = root.querySelector<HTMLButtonElement>('.scrollable-mobile-image__arrow--left');
  const rightArrow = root.querySelector<HTMLButtonElement>('.scrollable-mobile-image__arrow--right');

  if (!viewport || !leftArrow || !rightArrow) {
    return;
  }

  if (root.dataset.scrollableImageInitialized === 'true') {
    return;
  }

  root.dataset.scrollableImageInitialized = 'true';

  const state: ScrollableState = {
    pointerId: null,
    touchId: null,
    isDragging: false,
    dragStartX: 0,
    startScrollLeft: 0,
  };

  const update = (): void => {
    updateArrowVisibility(viewport, leftArrow, rightArrow);
  };

  leftArrow.addEventListener('click', () => {
    viewport.scrollBy({ left: -getScrollDistance(viewport), behavior: 'smooth' });
  });

  rightArrow.addEventListener('click', () => {
    viewport.scrollBy({ left: getScrollDistance(viewport), behavior: 'smooth' });
  });

  viewport.addEventListener('scroll', update);

  // Prevent browser native drag behavior from taking over image drag-to-scroll.
  viewport.addEventListener('dragstart', (event) => {
    event.preventDefault();
  });

  const startDrag = (clientX: number): void => {
    state.isDragging = true;
    state.dragStartX = clientX;
    state.startScrollLeft = viewport.scrollLeft;
    root.classList.add('scrollable-mobile-image--dragging');
  };

  const updateDrag = (clientX: number): void => {
    const deltaX = clientX - state.dragStartX;
    viewport.scrollLeft = state.startScrollLeft - deltaX;
  };

  const endDrag = (): void => {
    if (!state.isDragging) {
      return;
    }

    state.pointerId = null;
    state.touchId = null;
    state.isDragging = false;
    root.classList.remove('scrollable-mobile-image--dragging');
  };

  viewport.addEventListener('pointerdown', (event: PointerEvent) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;
    if (maxScrollLeft <= SCROLL_EDGE_THRESHOLD) {
      return;
    }

    state.pointerId = event.pointerId;
    startDrag(event.clientX);

    event.preventDefault();
    viewport.setPointerCapture(event.pointerId);
  });

  viewport.addEventListener('pointermove', (event: PointerEvent) => {
    if (!state.isDragging || state.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();
    updateDrag(event.clientX);
  });

  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);

  viewport.addEventListener('touchstart', (event: TouchEvent) => {
    if (state.isDragging || event.touches.length !== 1) {
      return;
    }

    const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;
    if (maxScrollLeft <= SCROLL_EDGE_THRESHOLD) {
      return;
    }

    const touch = event.touches.item(0);
    if (!touch) {
      return;
    }

    state.touchId = touch.identifier;
    startDrag(touch.clientX);
  }, { passive: true });

  viewport.addEventListener('touchmove', (event: TouchEvent) => {
    if (!state.isDragging || state.touchId === null) {
      return;
    }

    const touch = getTouchById(event.touches, state.touchId);
    if (!touch) {
      return;
    }

    event.preventDefault();
    updateDrag(touch.clientX);
  }, { passive: false });

  viewport.addEventListener('touchend', (event: TouchEvent) => {
    if (state.touchId === null || getTouchById(event.touches, state.touchId)) {
      return;
    }

    endDrag();
  });

  viewport.addEventListener('touchcancel', endDrag);


  const resizeObserver = new ResizeObserver(update);
  resizeObserver.observe(viewport);

  const images = viewport.querySelectorAll('img');
  images.forEach((img) => {
    img.draggable = false;
    img.addEventListener('dragstart', (event) => {
      event.preventDefault();
    });

    if (!img.complete) {
      img.addEventListener('load', update, { once: true });
    }
  });

  update();
}

export function initScrollableMobileImage(): void {
  const roots = document.querySelectorAll<HTMLElement>('.scrollable-mobile-image');
  roots.forEach(setupScrollableImage);
}
