function getProjectNavHeight(): number {
  const nav = document.querySelector<HTMLElement>('.project-nav');

  if (!nav) {
    return 0;
  }

  return Math.ceil(nav.getBoundingClientRect().height);
}

export function initProjectPosterModal(): void {
  const triggers = Array.from(document.querySelectorAll<HTMLElement>('[data-open-modal]'));

  if (triggers.length === 0) {
    return;
  }

  const navCloseLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.project-nav a[href="/"]'));
  let activeModal: HTMLElement | null = null;

  const updateModalOffset = (): void => {
    document.documentElement.style.setProperty('--project-modal-top-offset', `${getProjectNavHeight()}px`);
  };

  const closeModal = (): void => {
    if (!activeModal) {
      return;
    }

    activeModal.classList.remove('is-open');
    activeModal = null;
    document.body.classList.remove('poster-modal-open');
  };

  const openModal = (modal: HTMLElement): void => {
    closeModal();
    updateModalOffset();
    activeModal = modal;
    modal.classList.add('is-open');
    document.body.classList.add('poster-modal-open');
  };

  triggers.forEach((trigger) => {
    const selector = trigger.dataset.openModal;

    if (!selector) {
      return;
    }

    const modal = document.querySelector<HTMLElement>(selector);

    if (!modal) {
      return;
    }

    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openModal(modal);
    });

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  });

  navCloseLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!activeModal) {
        return;
      }

      event.preventDefault();
      closeModal();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });

  window.addEventListener('resize', updateModalOffset);
  updateModalOffset();
}
