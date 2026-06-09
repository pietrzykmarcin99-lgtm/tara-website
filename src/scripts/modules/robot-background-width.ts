const SELECTOR = '.project-timeline__image--robot-background';
const MAX_IMAGE_WIDTH = 1500;

function updateImageWidth(img: HTMLImageElement): void {
  // Use clientWidth (not innerWidth) to avoid including scrollbar width.
  const viewportWidth = document.documentElement.clientWidth;
  const targetWidth = Math.min(viewportWidth, MAX_IMAGE_WIDTH);
  const offsetParent = img.offsetParent as HTMLElement | null;

  if (!offsetParent) {
    img.style.width = `${targetWidth}px`;

    if (viewportWidth > targetWidth) {
      img.style.left = `${(viewportWidth - targetWidth) / 2}px`;
    }

    return;
  }

  // Align to viewport edges on smaller screens; cap and center on larger screens.
  const offsetParentLeft = offsetParent.getBoundingClientRect().left;
  const targetViewportLeft = (viewportWidth - targetWidth) / 2;
  const positionedLeft = targetViewportLeft - offsetParentLeft;

  img.style.left = `${positionedLeft}px`;
  img.style.width = `${targetWidth}px`;
}

export function initRobotBackgroundWidth(): void {
  const image = document.querySelector<HTMLImageElement>(SELECTOR);

  if (!image) {
    return;
  }

  let rafId: number | null = null;

  const scheduleUpdate = (): void => {
    if (rafId !== null) {
      return;
    }

    rafId = window.requestAnimationFrame(() => {
      rafId = null;
      updateImageWidth(image);
    });
  };

  // Initial update on start.
  scheduleUpdate();

  // Re-run once the image is fully loaded if needed.
  if (!image.complete) {
    image.addEventListener('load', scheduleUpdate, { once: true });
  }

  window.addEventListener('resize', scheduleUpdate, { passive: true });
  window.addEventListener('orientationchange', scheduleUpdate, { passive: true });
}