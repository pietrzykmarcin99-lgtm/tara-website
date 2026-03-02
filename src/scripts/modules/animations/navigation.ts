import { gsap } from 'gsap';

const selectedClass = 'header__link--selected';
const hiLinkSelector = '.header__link--hi';
const workLinkSelector = '.header__link--work';
const aboutLinkSelector = '.header__link--about';
const contactLinkSelector = '.header__link--contact';

export function initHeaderHiNavigationAnimation(): void {
  const hiLinks = Array.from(document.querySelectorAll<HTMLElement>(hiLinkSelector));
  const workLinks = Array.from(document.querySelectorAll<HTMLElement>(workLinkSelector));
  const aboutLinks = Array.from(document.querySelectorAll<HTMLElement>(aboutLinkSelector));
  const contactLinks = Array.from(document.querySelectorAll<HTMLElement>(contactLinkSelector));

  if (hiLinks.length === 0 && workLinks.length === 0 && aboutLinks.length === 0 && contactLinks.length === 0) {
    return;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const toggleStaggeredDecoration = (
    link: HTMLElement,
    isSelected: boolean,
    timings: {
      showStaggerEach: number;
      hideStaggerEach: number;
    }
  ): void => {
    const svgElement = link.querySelector<SVGSVGElement>('svg');
    const pathElements = svgElement ? Array.from(svgElement.querySelectorAll<SVGPathElement>('path')) : [];

    if (!svgElement || pathElements.length === 0) {
      return;
    }

    gsap.killTweensOf(svgElement);
    gsap.killTweensOf(pathElements);

    if (reduceMotion) {
      if (isSelected) {
        gsap.set(svgElement, { autoAlpha: 1, scale: 1 });
        gsap.set(pathElements, { autoAlpha: 1, scale: 1, y: 0 });
      } else {
        gsap.set(pathElements, { autoAlpha: 0, scale: 0.9, y: 3 });
        gsap.set(svgElement, { autoAlpha: 0, scale: 0.92 });
      }
      return;
    }

    if (isSelected) {
      gsap.set(svgElement, {
        autoAlpha: 1,
        scale: 0.92,
        transformOrigin: '50% 50%'
      });

      gsap.set(pathElements, {
        autoAlpha: 0,
        scale: 0.9,
        y: 3,
        transformOrigin: '50% 50%'
      });

      const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });

      timeline.to(svgElement, {
        scale: 1,
        duration: 0.55
      });

      timeline.to(pathElements, {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        duration: 0.38,
        stagger: timings.showStaggerEach
      }, 0.08);

      return;
    }

    const timeline = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

    timeline.to(pathElements, {
      autoAlpha: 0,
      scale: 0.9,
      y: 3,
      duration: 0.28,
      stagger: {
        each: timings.hideStaggerEach,
        from: 'end'
      }
    });

    timeline.to(svgElement, {
      autoAlpha: 0,
      scale: 0.92,
      duration: 0.55
    }, 0.1);
  };

  const toggleHiDecoration = (link: HTMLElement, isSelected: boolean): void => {
    toggleStaggeredDecoration(link, isSelected, {
      showStaggerEach: 0.06,
      hideStaggerEach: 0.05
    });
  };

  const toggleAboutDecoration = (link: HTMLElement, isSelected: boolean): void => {
    toggleStaggeredDecoration(link, isSelected, {
      showStaggerEach: 0.11,
      hideStaggerEach: 0.09
    });
  };

  const toggleWorkDecoration = (link: HTMLElement, isSelected: boolean): void => {
    const svgElement = link.querySelector<SVGSVGElement>('svg');
    const pathElement = svgElement?.querySelector<SVGPathElement>('path');

    if (!svgElement || !pathElement) {
      return;
    }

    gsap.killTweensOf(svgElement);
    gsap.killTweensOf(pathElement);
    svgElement.querySelectorAll('path[data-work-tracer="true"]').forEach((tracerPath) => {
      gsap.killTweensOf(tracerPath);
      tracerPath.remove();
    });

    if (reduceMotion) {
      if (isSelected) {
        gsap.set(svgElement, { autoAlpha: 1, scale: 1 });
        gsap.set(pathElement, { autoAlpha: 1, scale: 1, filter: 'blur(0px)' });
      } else {
        gsap.set(pathElement, { autoAlpha: 0, scale: 1, filter: 'blur(0px)' });
        gsap.set(svgElement, { autoAlpha: 0, scale: 1 });
      }
      return;
    }

    if (isSelected) {
      gsap.set(svgElement, {
        autoAlpha: 1,
        scale: 1,
        transformOrigin: '50% 50%'
      });

      gsap.set(pathElement, {
        autoAlpha: 0,
        scale: 0.98,
        filter: 'blur(1.4px)',
        transformOrigin: '50% 50%'
      });

      gsap.to(pathElement, {
        autoAlpha: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.55,
        ease: 'power1.out'
      });

      return;
    }

    gsap.to(pathElement, {
      autoAlpha: 0,
      scale: 0.98,
      filter: 'blur(1.2px)',
      duration: 0.24,
      ease: 'power1.in'
    });

    gsap.to(svgElement, {
      autoAlpha: 0,
      duration: 0.2,
      delay: 0.08,
      ease: 'power1.inOut'
    });
  };

  const toggleContactDecoration = (link: HTMLElement, isSelected: boolean): void => {
    const svgElement = link.querySelector<SVGSVGElement>('svg');
    const pathElements = svgElement ? Array.from(svgElement.querySelectorAll<SVGPathElement>('path')) : [];

    if (!svgElement || pathElements.length === 0) {
      return;
    }

    gsap.killTweensOf(svgElement);
    gsap.killTweensOf(pathElements);

    if (reduceMotion) {
      if (isSelected) {
        gsap.set(svgElement, { autoAlpha: 1, scale: 1.05 });
        gsap.set(pathElements, { autoAlpha: 1, scale: 1, filter: 'blur(0px)' });
      } else {
        gsap.set(pathElements, { autoAlpha: 0, scale: 1, filter: 'blur(0px)' });
        gsap.set(svgElement, { autoAlpha: 0, scale: 1 });
      }
      return;
    }

    if (isSelected) {
      gsap.set(svgElement, {
        autoAlpha: 1,
        scale: 1,
        transformOrigin: '50% 50%'
      });

      gsap.set(pathElements, {
        autoAlpha: 0,
        scale: 0.98,
        filter: 'blur(1.4px)',
        transformOrigin: '50% 50%'
      });

      gsap.to(pathElements, {
        autoAlpha: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.55,
        ease: 'power1.out'
      });

      gsap.to(svgElement, {
        scale: 1.05,
        duration: 0.55,
        ease: 'power1.out'
      });

      return;
    }

    gsap.to(pathElements, {
      autoAlpha: 0,
      scale: 0.98,
      filter: 'blur(1.2px)',
      duration: 0.24,
      ease: 'power1.in'
    });

    gsap.to(svgElement, {
      autoAlpha: 0,
      scale: 1,
      duration: 0.2,
      delay: 0.08,
      ease: 'power1.inOut'
    });
  };

  hiLinks.forEach((link) => {
    toggleHiDecoration(link, link.classList.contains(selectedClass));
  });

  workLinks.forEach((link) => {
    toggleWorkDecoration(link, link.classList.contains(selectedClass));
  });

  aboutLinks.forEach((link) => {
    toggleAboutDecoration(link, link.classList.contains(selectedClass));
  });

  contactLinks.forEach((link) => {
    toggleContactDecoration(link, link.classList.contains(selectedClass));
  });

  const classObserver = new MutationObserver((mutationList) => {
    mutationList.forEach((mutation) => {
      if (mutation.type !== 'attributes') {
        return;
      }

      const target = mutation.target as HTMLElement;
      if (!target.matches(hiLinkSelector)) {
        if (!target.matches(workLinkSelector)) {
          if (!target.matches(aboutLinkSelector)) {
            if (!target.matches(contactLinkSelector)) {
              return;
            }

            toggleContactDecoration(target, target.classList.contains(selectedClass));
            return;
          }

          toggleAboutDecoration(target, target.classList.contains(selectedClass));
          return;
        }

        toggleWorkDecoration(target, target.classList.contains(selectedClass));
        return;
      }

      toggleHiDecoration(target, target.classList.contains(selectedClass));
    });
  });

  hiLinks.forEach((link) => {
    classObserver.observe(link, {
      attributes: true,
      attributeFilter: ['class']
    });
  });

  workLinks.forEach((link) => {
    classObserver.observe(link, {
      attributes: true,
      attributeFilter: ['class']
    });
  });

  aboutLinks.forEach((link) => {
    classObserver.observe(link, {
      attributes: true,
      attributeFilter: ['class']
    });
  });

  contactLinks.forEach((link) => {
    classObserver.observe(link, {
      attributes: true,
      attributeFilter: ['class']
    });
  });
}
