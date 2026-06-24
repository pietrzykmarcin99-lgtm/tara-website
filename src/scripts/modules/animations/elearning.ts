import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

 export function initElearningAnimations(): void {
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

  const animationsBoxesGraph = () => {

    const numberOfBoxes = 4; // Total number of boxes in the graph

    
    const elements = Array.from({ length: numberOfBoxes }, (_, index) => {
      const boxNumber = index + 1;

      return {
        containerSelector: `.boxes-graph__item--${boxNumber}`,
        maskSelectors: [
          `#boxes-graph__item-svg-arrow-${boxNumber}-mask1`,
          `#boxes-graph__item-svg-arrow-${boxNumber}-mask2`,
          `#boxes-graph__item-svg-arrow-${boxNumber}-mask3`
        ]
      };
    });

    const lastBox = {
      containerSelector: `.boxes-graph__item--${5}`,
      maskSelectors: [
          `#boxes-graph__item-svg-arrow-5-mask1`,
          `#boxes-graph__item-svg-arrow-5-mask2`,
        ]
    }


    const animateElement = (containerSelector: string, maskSelectors: string[], index: number) => {
      const container = document.querySelector<HTMLElement>(containerSelector);
      const maskPaths = maskSelectors.map(
        sel => container?.querySelectorAll<SVGPathElement>(sel)
      );

      if (!container || maskPaths.some(m => !m)) return;

      const [maskPath1, maskPath2, maskPath3] = maskPaths as NodeListOf<SVGPathElement>[];

      gsap.set([maskPath1, maskPath2, maskPath3], { drawSVG: '0% 0%' });
      gsap.set(container, { opacity: 0, scale: 0.8, transformOrigin: 'center center' });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: `top ${85 - index * 6}%`,
          end: `top ${70 - index * 6}%`,
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
        .to(container, { opacity: 1, duration: 0.4, ease: 'none', scale: 1 })
        .to([maskPath1, maskPath2], { drawSVG: '0% 100%', duration: 0.4, ease: 'none' })
        .to([maskPath3], { drawSVG: '0% 100%', duration: 0.4, ease: 'none' });
    };



    elements.forEach(({ containerSelector, maskSelectors }, index) => {
      animateElement(containerSelector, maskSelectors, index);
    });

    animateElement(lastBox.containerSelector, lastBox.maskSelectors, 2);
  }
  
  animationsBoxesGraph();
 }