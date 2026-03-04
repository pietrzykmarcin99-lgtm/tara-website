import { gsap } from 'gsap';

const mobileHeaderSelector = '.header__left.mobile-only';
const mobileToggleButtonSelector = '.header__left-mobile-open-minimenu';
const mobileClosedSmileSelector = 'svg.smile-closed';
const mobileOpenSmileSelector = 'svg.smile-open';

const mobileOpenRevealStartIndex = 3;
const mobileOpenRevealEndIndex = 13;

export function initMobileSmileAnimation(reduceMotion: boolean): void {
  const mobileHeaders = Array.from(document.querySelectorAll<HTMLElement>(mobileHeaderSelector));

  if (mobileHeaders.length === 0) {
    return;
  }

  const applyMobileState = (
    openSmilePaths: SVGPathElement[],
    closedSmile: SVGSVGElement,
    openSmile: SVGSVGElement,
    isOpen: boolean,
    animate: boolean
  ): void => {
    if (openSmilePaths.length === 0) {
      return;
    }

    gsap.killTweensOf(openSmilePaths);
    gsap.killTweensOf(closedSmile);
    gsap.killTweensOf(openSmile);

    if (reduceMotion || !animate) {
      gsap.set(closedSmile, { opacity: isOpen ? 0 : 1, visibility: 'visible' });
      gsap.set(openSmile, { opacity: isOpen ? 1 : 0, visibility: 'visible' });
      gsap.set(openSmilePaths, {
        autoAlpha: isOpen ? 1 : 0,
        y: 0
      });
      return;
    }

    if (isOpen) {
      gsap.set(closedSmile, { opacity: 1, visibility: 'visible' });
      gsap.set(openSmile, { opacity: 0, visibility: 'visible' });

      gsap.set(openSmilePaths, {
        autoAlpha: 0,
        y: 1
      });

      const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });

      timeline.to(openSmile, {
        opacity: 1,
        duration: 0.14,
        ease: 'power1.out'
      }, 0);

      timeline.to(closedSmile, {
        opacity: 0,
        duration: 0.14,
        ease: 'power1.out'
      }, 0);

      timeline.to(openSmilePaths, {
        autoAlpha: 1,
        y: 0,
        duration: 0.26,
        ease: 'power1.out',
        stagger: 0.05
      }, 0.03);

      return;
    }

    gsap.set(openSmile, { opacity: 1, visibility: 'visible' });
    gsap.set(closedSmile, { opacity: 0, visibility: 'visible' });

    const hidePathDuration = 0.2;
    const hideStaggerEach = 0.05;
    const hideCrossfadeDuration = 0.1;
    const hideTotalDuration = hidePathDuration + (Math.max(openSmilePaths.length - 1, 0) * hideStaggerEach);
    const hideCrossfadeStart = Math.max(0, hideTotalDuration - hideCrossfadeDuration - 0.01);

    const timeline = gsap.timeline({ defaults: { ease: 'power1.inOut' } });

    timeline.to(openSmilePaths, {
      autoAlpha: 0,
      y: 1,
      duration: hidePathDuration,
      ease: 'power1.in',
      stagger: {
        each: hideStaggerEach,
        from: 'end'
      }
    }, 0);

    timeline.to(openSmile, {
      opacity: 0,
      duration: hideCrossfadeDuration,
      ease: 'none'
    }, hideCrossfadeStart);

    timeline.to(closedSmile, {
      opacity: 1,
      duration: hideCrossfadeDuration,
      ease: 'none'
    }, hideCrossfadeStart);
  };

  mobileHeaders.forEach((header) => {
    const toggleButton = header.querySelector<HTMLElement>(mobileToggleButtonSelector);
    const closedSmile = toggleButton?.querySelector<SVGSVGElement>(mobileClosedSmileSelector);
    const openSmile = toggleButton?.querySelector<SVGSVGElement>(mobileOpenSmileSelector);

    if (!toggleButton || !closedSmile || !openSmile) {
      return;
    }

    let smileContainer = toggleButton.querySelector<HTMLElement>('.header__left-mobile-smiles');

    if (!smileContainer) {
      smileContainer = document.createElement('span');
      smileContainer.className = 'header__left-mobile-smiles';
      toggleButton.prepend(smileContainer);
      smileContainer.append(closedSmile, openSmile);
    }

    const openSmilePaths = Array.from(openSmile.querySelectorAll<SVGPathElement>('path')).slice(
      mobileOpenRevealStartIndex,
      mobileOpenRevealEndIndex
    );

    const isOpen = header.classList.contains('header__left--open');
    applyMobileState(openSmilePaths, closedSmile, openSmile, isOpen, false);

    const observer = new MutationObserver((mutationList) => {
      mutationList.forEach((mutation) => {
        if (mutation.type !== 'attributes') {
          return;
        }

        applyMobileState(
          openSmilePaths,
          closedSmile,
          openSmile,
          header.classList.contains('header__left--open'),
          true
        );
      });
    });

    observer.observe(header, {
      attributes: true,
      attributeFilter: ['class']
    });
  });
}
