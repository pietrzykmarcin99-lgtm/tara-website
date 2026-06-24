export function initTabletSlider(): void {
  const sliders = Array.from(document.querySelectorAll<HTMLElement>('[data-tablet-slider]'));

  if (sliders.length === 0) {
    return;
  }

  sliders.forEach((slider) => {
    if (slider.dataset.initialized === 'true') {
      return;
    }

    const items = Array.from(slider.querySelectorAll<HTMLElement>('[data-tablet-slider-item]'));
    const prevButton = slider.querySelector<HTMLButtonElement>('[data-tablet-slider-prev]');
    const nextButton = slider.querySelector<HTMLButtonElement>('[data-tablet-slider-next]');
    const dots = Array.from(slider.querySelectorAll<HTMLButtonElement>('[data-tablet-slider-dot]'));

    if (items.length === 0) {
      return;
    }

    slider.dataset.initialized = 'true';

    let currentIndex = Math.max(
      0,
      items.findIndex((item) => item.classList.contains('is-active'))
    );

    const render = (): void => {
      items.forEach((item, index) => {
        item.classList.toggle('is-active', index === currentIndex);
      });

      dots.forEach((dot, index) => {
        const isActive = index === currentIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    };

    const move = (delta: number): void => {
      currentIndex = (currentIndex + delta + items.length) % items.length;
      render();
    };

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        move(-1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        move(1);
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentIndex = index;
        render();
      });
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50;

    slider.addEventListener('touchstart', (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) >= swipeThreshold) {
        move(diff > 0 ? 1 : -1);
      }
    }, { passive: true });

    render();
  });
}
