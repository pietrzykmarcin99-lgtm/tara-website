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

  const arrowSvg = option.querySelector<SVGSVGElement>('.this-is-me__svg-arrow');
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