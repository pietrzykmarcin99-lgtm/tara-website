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

    if (!prevButton || !nextButton || items.length === 0) {
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

    prevButton.addEventListener('click', () => {
      move(-1);
    });

    nextButton.addEventListener('click', () => {
      move(1);
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentIndex = index;
        render();
      });
    });

    render();
  });
}
