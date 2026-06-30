import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

export function initScreenIterations(): void {
  const animateScreens = () => {
    const screens = document.querySelectorAll<HTMLElement>('.screen-iterations__screen-img');
    const arrows = document.querySelectorAll<HTMLElement>('.screen-iterations__screen-arrow-after');
    const lists = document.querySelectorAll<HTMLElement>('.screen-iterations__screen-list');

    gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

    screens.forEach((screen, index) => {
      gsap.timeline({
        scrollTrigger: {
          trigger: screen,
          start: 'bottom bottom',
          end: 'top 50%',
          scrub: 1,
          invalidateOnRefresh: true
        }
      })
      .from(screen, {
        scale: 0.95,
        opacity: 0,
        rotate: 3 * (index % 2 === 0 ? 1 : -1), // Alternate rotation direction for each screen
        duration: 1,
        ease: 'none',
        delay:  0.2 * index
      })
    });

    lists.forEach((list, index) => {
      gsap.timeline({
        scrollTrigger: {
          trigger: list,
          start: 'bottom 80%',
          end: 'top 50%',
          scrub: 1,
          invalidateOnRefresh: true
        }
      })
      .from(list, {
        scale: 0.95,
        opacity: 0,
        duration: 1,
        ease: 'none',
        delay: 0.2 * index
      })
    });

    arrows.forEach((arrow) => {
      const maskLine = arrow.querySelector<SVGPathElement>('mask path');
    
      if (!maskLine) {
        return;
      }
    
    
      gsap.set([maskLine], { drawSVG: '0% 0%' });
    
      gsap.timeline({
        scrollTrigger: {
          trigger: arrow,
          start: 'bottom bottom',
          end: 'top 50%',
          scrub: 1,
          invalidateOnRefresh: true
        }
      })
      .to(maskLine, {
        drawSVG: '0% 100%',
        duration: 1,
        ease: 'none'
      })
    });
  };

  animateScreens();
};