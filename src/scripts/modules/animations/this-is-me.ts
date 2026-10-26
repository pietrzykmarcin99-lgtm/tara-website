import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

type ThisIsMeOption = {
  index: number;
  delay: number;
  imageMaskDurations: number[];
};

type ThisIsMeElements = {
  trigger: HTMLElement;
  arrowMasks: SVGPathElement[];
  imageMasks: SVGPathElement[];
};

const OPTIONS: ThisIsMeOption[] = [
  {
    index: 2,
    delay: 0,
    imageMaskDurations: [0.3, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.1]
  },
  {
    index: 1,
    delay: 0.2,
    imageMaskDurations: [0.3, 0.2, 0.1]
  },
  {
    index: 3,
    delay: 0.1,
    imageMaskDurations: [0.3, 0.2, 0.1]
  },
  {
    index: 4,
    delay: 0.4,
    imageMaskDurations: [0.4, 0.1, 0.1]
  }
];

const MOBILE_BREAKPOINT_QUERY = '(max-width: 1024px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const MOBILE_ARROW_SPLIT_PERCENT = 47;

function getSvgMasks(svg: SVGSVGElement | null): SVGPathElement[] {
  if (!svg) {
    return [];
  }

  return Array.from(svg.querySelectorAll<SVGPathElement>('mask path'));
}

function getOptionElements({ index }: ThisIsMeOption): ThisIsMeElements | null {
  const option = document.querySelector<HTMLElement>(`.this-is-me__mind-map-option:nth-child(${index})`);

  if (!option) {
    return null;
  }
  const isMobile = window.matchMedia('(max-width: 1024px)').matches;
  const arrowSvg = option.querySelector<SVGSVGElement>(`.this-is-me__svg-arrow${isMobile ? '.mobile-only' : '.desktop-only'}`);
  const imageSvg = option.querySelector<SVGSVGElement>('.this-is-me__svg-image');
  const arrowMasks = getSvgMasks(arrowSvg);
  const imageMasks = getSvgMasks(imageSvg);

  if (arrowMasks.length === 0) {
    return null;
  }

  return {
    trigger: arrowSvg as unknown as HTMLElement,
    arrowMasks,
    imageMasks
  };
}

function animateOption(
  trigger: gsap.DOMTarget,
  arrowMasks: gsap.TweenTarget[],
  imageMasks: gsap.TweenTarget[],
  imageMaskDurations: number[],
  delay = 0
): void {
  const timeline = gsap.timeline({
    delay,
    scrollTrigger: {
      trigger,
      start: 'bottom 100%',
      once: true
    }
  });

  arrowMasks.forEach((mask, index) => {
    timeline.to(mask, {
      drawSVG: '0% 100%',
      duration: index === 0 ? 0.4 : 0.1,
      ease: 'power1.inOut'
    });
  });

  imageMasks.forEach((mask, index) => {
    timeline.to(mask, {
      drawSVG: '0% 100%',
      duration: imageMaskDurations[index] ?? imageMaskDurations[imageMaskDurations.length - 1] ?? 0.1,
      ease: 'power1.inOut'
    });
  });
}

export function initThisIsMeAnimations(): void {
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

  OPTIONS.forEach((option) => {
    const elements = getOptionElements(option);

    if (!elements) {
      return;
    }

    gsap.set([...elements.arrowMasks, ...elements.imageMasks], { drawSVG: '0% 0%' });
    animateOption(
      elements.trigger,
      elements.arrowMasks,
      elements.imageMasks,
      option.imageMaskDurations,
      option.delay
    );
  });
}

function closeAllModals(): void {
  const openModals = document.querySelectorAll<HTMLElement>('.this-is-me__modal.is-open');
  openModals.forEach((modal) => modal.classList.remove('is-open'));
  document.body.classList.remove('this-is-me-modal-open');
}

function openModal(modal: HTMLElement): void {
  closeAllModals();
  modal.classList.add('is-open');
  document.body.classList.add('this-is-me-modal-open');
}

export function initThisIsMeModals(): void {
  const mindMapOptions = document.querySelectorAll<HTMLElement>('.this-is-me__mind-map-option');
  const mainOption = document.querySelectorAll<HTMLElement>('.this-is-me__me');

  [...mindMapOptions, ...mainOption].forEach((option) => {
    const button = option.querySelector<HTMLButtonElement>('button');
    const modal = option.querySelector<HTMLElement>('.this-is-me__modal');
    const closeButton = modal?.querySelector<HTMLElement>('.this-is-me__modal-close');

    if (!button || !modal || !closeButton) {
      return;
    }

    // Open modal on button click
    button.addEventListener('click', () => {
      openModal(modal);
    });

    // Close modal on close button click
    closeButton.addEventListener('click', (event) => {
      event.stopPropagation();
      closeAllModals();
    });

    // Close modal on background click
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeAllModals();
      }
    });
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAllModals();
    }
  });
}

export function initThisIsMeArtPortfolioAnimations(): void {
  const artModal = document.querySelector<HTMLElement>('.this-is-me__modal.animation-art-items');
  const artModalOpenTrigger = document.querySelector<HTMLButtonElement>(
    '.this-is-me__mind-map-option:nth-child(2) > button'
  );
  const isMobile = window.matchMedia('(max-width: 1024px)').matches;

  const artItemLinks = Array.from(
    artModal?.querySelectorAll<HTMLAnchorElement>(`.this-is-me__modal-content-col${isMobile ? '.mobile-only' : '.desktop-only'} > a`) ?? []
  );

  if (!artModal || !artModalOpenTrigger) {
    return;
  }

  const restingScale = 1;
  const artItems = Array.from(
    artModal.querySelectorAll<HTMLElement>(`.this-is-me__modal-content-col${isMobile ? '.mobile-only' : '.desktop-only'} > a > img`)
  );

  if (artItems.length === 0) {
    return;
  }

  const throwFromDeckValues = [
    { x: -10, y: 80, rotation: -20, duration: 0.6  },
    { x: 15, y: 80, rotation: 20, duration: 0.65 },
    { x: -15, y: 80, rotation: -20, duration: 0.58 },

    { x: -10, y: 80, rotation: -20, duration: 0.62 },
    { x: 15, y: 80, rotation: 20, duration: 0.67 },
    { x: -15, y: 80, rotation: -20, duration: 0.72 },
    { x: 15, y: 80, rotation: 20, duration: 0.77 },

    // { x: -110, y: -6, rotation: -10, duration: 0.6 },
    // { x: -130, y: 8, rotation: -28, duration: 0.65 },
    // { x: 90, y: -16, rotation: 16, duration: 0.58 },
    // { x: 112, y: -8, rotation: 10, duration: 0.62 },
    // { x: 128, y: 6, rotation: 24, duration: 0.67 },
    // { x: 148, y: 14, rotation: 30, duration: 0.72 }
  ];

  let currentTimeline: gsap.core.Timeline | null = null;

  artItemLinks.forEach((link) => {
    const linkImages = Array.from(link.querySelectorAll<HTMLImageElement>('img'));

    if (linkImages.length === 0) {
      return;
    }

    link.addEventListener('mouseenter', () => {
      gsap.to(linkImages, {
        duration: 0.3,
        scale: 1.1,
        rotation: (index: number) => (index % 2 === 0 ? -5 : 5),
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    link.addEventListener('mouseleave', () => {
      gsap.to(linkImages, {
        duration: 0.3,
        scale: restingScale,
        rotation: 0,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  });

  const playArtItemsAnimation = (): void => {
    currentTimeline?.kill();

    gsap.set(artItems, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      rotation: 0,
      scale: restingScale,
      transformOrigin: '50% 50%'
    });

    const timeline = gsap.timeline({ defaults: { ease: 'back.out(1.45)' } });

    artItems.forEach((item, index) => {
      const values = throwFromDeckValues[index] ?? throwFromDeckValues[throwFromDeckValues.length - 1];

      timeline.from(
        item,
        {
          autoAlpha: 0,
          x: values.x,
          y: values.y,
          rotation: values.rotation,
          scale: 1,
          duration: values.duration
        },
        index === 0 ? 0.35 : '<+=0.1'
      );
    });

    currentTimeline = timeline;
  };

  artModalOpenTrigger.addEventListener('click', playArtItemsAnimation);

  
}

export function initArrowMobileThisIsMeScrollAnimation() {
  const mobileMedia = window.matchMedia(MOBILE_BREAKPOINT_QUERY);

  const initAnimation = (): void => {
    if (!mobileMedia.matches) {
      return;
    }

    const container = document.querySelector<HTMLElement>('.this-is-me__arrow-mobile');
    const svg = container?.querySelector<SVGSVGElement>('svg');
    // const button = container?.querySelector<HTMLElement>('.this-is-me__mobile-arrow-btn');
    const maskPaths = Array.from(svg?.querySelectorAll<SVGPathElement>('mask path') ?? []);

    const nextHeading = document.querySelector('.lets-connect h2.mobile-only')

    if (!container || maskPaths.length === 0) {
      return;
    }

    if (container.dataset.arrowMobileAnimationInitialized === 'true') {
      return;
    }

    container.dataset.arrowMobileAnimationInitialized = 'true';

    gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

    // In this SVG, the last mask path is the long arrow line.
    // The earlier mask paths are the short arrowhead details.
    const mainMask = maskPaths[maskPaths.length - 1];
    const arrowHeadMasks = maskPaths.slice(0, -1);

    if (!mainMask) {
      return;
    }

    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      gsap.set(mainMask, { drawSVG: '0% 100%' });
      if (arrowHeadMasks.length > 0) {
        gsap.set(arrowHeadMasks, { drawSVG: '0% 100%' });
      }
      // gsap.set(button, { '--this-is-me-mobile-btn-fill': 1 } as gsap.TweenVars);
      return;
    }

    gsap.set(mainMask, { drawSVG: '0% 0%' });
    if (arrowHeadMasks.length > 0) {
      gsap.set(arrowHeadMasks, { drawSVG: '0% 0%' });
    }
    // gsap.set(button, { '--this-is-me-mobile-btn-fill': 0 } as gsap.TweenVars);

    gsap.set(nextHeading, { scale: 0.8, opacity: 0 });
    // Scroll progress is split into four clear steps:
    // 1. Draw the main line until it reaches the button.
    // 2. Fill the button background from left to right.
    // 3. Finish drawing the main line.
    // 4. Draw the arrowhead details last.
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        end: 'bottom 70%',
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

    timeline
      .to(mainMask, {
        drawSVG: '0% 100%',
        duration: 1,
        ease: 'none'
      });

    // timeline
    //   .to(mainMask, {
    //     drawSVG: `0% ${MOBILE_ARROW_SPLIT_PERCENT}%`,
    //     duration: 1,
    //     ease: 'none'
    //   })
    //   .to(
    //     button,
    //     {
    //       '--this-is-me-mobile-btn-fill': 1,
    //       duration: 0.45,
    //       ease: 'none'
    //     } as gsap.TweenVars
    //   )
    //   .to(mainMask, {
    //     drawSVG: '0% 100%',
    //     duration: 1,
    //     ease: 'none'
    //   });

    if (arrowHeadMasks.length > 0) {
      timeline.to(arrowHeadMasks, {
        drawSVG: '0% 100%',
        duration: 0.25,
        ease: 'none'
      });
    }

    timeline.to(nextHeading, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
    })
  };

  initAnimation();

  mobileMedia.addEventListener('change', (event) => {
    if (event.matches) {
      initAnimation();
      ScrollTrigger.refresh();
    }
  });
}
