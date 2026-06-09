/**
 * Mobile Fullscreen Image Module
 * Adds click-to-expand fullscreen functionality for images on mobile devices (≤1024px)
 */

export function initMobileFullscreenImage(): void {
  const mediaQuery = window.matchMedia('(max-width: 1024px)');
  
  // Get all images with the mobile-fullscreen-when-clicked class
  const fullscreenImages = document.querySelectorAll<HTMLImageElement>('.mobile-fullscreen-when-clicked');

  if (fullscreenImages.length === 0) {
    return;
  }

  // Apply listeners only on mobile devices
  if (mediaQuery.matches) {
    fullscreenImages.forEach((img) => {
      img.addEventListener('click', () => openFullscreen(img));
    });
  }

  // Handle window resize to add/remove listeners
  mediaQuery.addEventListener('change', (e) => {
    fullscreenImages.forEach((img) => {
      if (e.matches) {
        img.addEventListener('click', () => openFullscreen(img));
        img.style.cursor = 'pointer';
      } else {
        img.removeEventListener('click', () => openFullscreen(img));
        img.style.cursor = 'auto';
      }
    });
  });

  // Set initial cursor style for mobile
  if (mediaQuery.matches) {
    fullscreenImages.forEach((img) => {
      img.style.cursor = 'pointer';
    });
  }
}

/**
 * Opens an image in fullscreen overlay
 */
function openFullscreen(img: HTMLImageElement): void {
  // Create overlay container
  const overlay = document.createElement('div');
  overlay.className = 'mobile-fullscreen-overlay';

  // Create container for the image
  const container = document.createElement('div');
  container.className = 'mobile-fullscreen-container';

  // Clone the image
  const fullscreenImg = img.cloneNode(true) as HTMLImageElement;
  fullscreenImg.className = 'mobile-fullscreen-image';

  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'mobile-fullscreen-close';
  closeBtn.setAttribute('aria-label', 'Close fullscreen');
  
  // Create X icon
  closeBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  // Assemble the fullscreen view
  container.appendChild(fullscreenImg);
  overlay.appendChild(container);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  // Trigger animation
  setTimeout(() => {
    overlay.classList.add('active');
  }, 10);

  // Close function
  const closeFullscreen = (): void => {
    overlay.classList.remove('active');
    setTimeout(() => {
      overlay.remove();
    }, 300);
  };

  // Close button listener
  closeBtn.addEventListener('click', closeFullscreen);

  // Close on overlay click (outside image)
  overlay.addEventListener('click', (e: Event) => {
    if (e.target === overlay) {
      closeFullscreen();
    }
  });

  // Close on escape key
  const escapeListener = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      closeFullscreen();
      document.removeEventListener('keydown', escapeListener);
    }
  };
  document.addEventListener('keydown', escapeListener);

  // Prevent body scroll when fullscreen is open
  document.body.style.overflow = 'hidden';
  
  // Restore scroll on close
  const restoreScroll = (): void => {
    document.body.style.overflow = '';
  };
  overlay.addEventListener('transitionend', () => {
    if (!overlay.classList.contains('active')) {
      restoreScroll();
    }
  });
}
