import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

 export function initRobotAnimations(): void {
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

  const animationsClickToExplore = () => {
    const container = document.querySelector<HTMLElement>('.tablet-slider__decor');
    const prototypeWithMobileScreensText = document.querySelector<HTMLElement>('.tablet-slider__decor p');
    const prototypeWithMobileScreensArrowSvg = document.querySelector<HTMLElement>('.tablet-slider__decor svg');
    const maskPaths = Array.from(prototypeWithMobileScreensArrowSvg?.querySelectorAll<SVGPathElement>('mask path') ?? []);
  
    gsap.set(maskPaths, { drawSVG: '0% 0%' });
    gsap.set(prototypeWithMobileScreensText, { scale: 0.8, opacity: 0 });
  
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        end: 'top 50%',
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

    const revealTimeline = gsap.timeline({ paused: true });

    ScrollTrigger.create({
      trigger: container,
      start: 'top 50%',
      once: true,
      invalidateOnRefresh: true,
      onEnter: () => revealTimeline.play()
    });
  
    timeline
    .to(
      prototypeWithMobileScreensText,
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: 'none'
      }
    )
    .to(maskPaths, {
      drawSVG: '0% 100%',
      duration: 0.4,
      ease: 'none'
    });
  }
  
  animationsClickToExplore();
 }