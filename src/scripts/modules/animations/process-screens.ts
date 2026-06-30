import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

export function initProcessScreensAnimations(): void {
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    handleReducedMotion();
    return;
  }

  animateProcessScreensSequence();
}

/**
 * Animate process screens in sequential order:
 * 1. Screen appears
 * 2. Description with SVG and text animates
 * 3. Arrow animates
 * 4. Next screen appears (repeat)
 * 
 * Animations play when visible, reverse when scrolling back up
 */
function animateProcessScreensSequence(): void {
  const container = document.querySelector<HTMLElement>('.process-screens');
  if (!container) return;

  const screens = gsap.utils.toArray<HTMLElement>('.process-screens__screen');
  if (!screens.length) return;

  let timelinePosition = 0;

  // First pass: calculate total animation duration
  screens.forEach(() => {
    timelinePosition += 0.2; // screen
    timelinePosition += 0.1; // svg
    timelinePosition += 0.1; // arrow
  });

  const totalDuration = timelinePosition;
  timelinePosition = 0; // Reset for actual animation building

  // Create ONE master timeline for all screens
  const masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 80%',
      end: `top 30%`,
      scrub: 1,
      invalidateOnRefresh: true
    }
  });

  screens.forEach((screen, index) => {
    const screenImg = screen.querySelector<HTMLElement>('.process-screens__screen-img');
    const description = screen.querySelector<HTMLElement>('.process-screens__screen-description');
    const descriptionItems = description?.querySelectorAll<HTMLElement>('ul li') || [];
    const svgPaths = description?.querySelectorAll<SVGPathElement>('svg path') || [];
    const arrow = screen.querySelector<HTMLElement>('.process-screens__screen-description-arrow-next');

    // 1. Screen image appears
    if (screenImg) {
      masterTimeline.fromTo(
        screenImg,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' },
        timelinePosition
      );
      timelinePosition += 0.2;
    }

    // 2. Description items and SVG animate
    if (description) {
      // SVG animation
      svgPaths.forEach((svgPath) => {
        gsap.set(svgPath, { drawSVG: '0% 0%' });
        masterTimeline.to(
          svgPath,
          { drawSVG: '0% 100%', duration: 0.3, ease: 'power2.out' },
          timelinePosition
        );
      });

      // Description list items
      descriptionItems.forEach((item, itemIndex) => {
        masterTimeline.fromTo(
          item,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' },
          timelinePosition + itemIndex * 0.08
        );
      });
      timelinePosition += 0.1;
    }

    // 3. Arrow animates (if not the last screen)
    if (arrow && index < screens.length - 1) {
      masterTimeline.fromTo(
        arrow,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' },
        timelinePosition
      );
      timelinePosition += 0.1;
    }
  });
}

/**
 * Handle animations for users with reduced motion preference
 */
function handleReducedMotion(): void {
  const allAnimatedElements = gsap.utils.toArray<HTMLElement>(
    '.process-screens__screen-img, .process-screens__screen-description ul li, .process-screens__screen-description-arrow-next'
  );

  allAnimatedElements.forEach((element) => {
    gsap.set(element, { opacity: 1, scale: 1, x: 0, drawSVG: '0% 100%' });
  });
}
