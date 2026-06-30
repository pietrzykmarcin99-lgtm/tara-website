import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

export function initPrototypeWithMobileScreens(): void {
 const animateMobileScreensInBox = () => {
  const borders = document.querySelectorAll<SVGSVGElement>('.prototype-with-mobile-screens__mobile-screens-in-box-border');
  const mobileScreens = document.querySelectorAll<HTMLElement>('.prototype-with-mobile-screens__mobile-screens-in-box-img');
  const texts = document.querySelectorAll<HTMLElement>('.prototype-with-mobile-screens__mobile-screens-in-box h3, .prototype-with-mobile-screens__mobile-screens-in-box-list li');
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

  if (!borders.length) {
    return;
  }
  borders.forEach((border) => {
    const maskLine = border.querySelector<SVGPathElement>('mask path');
  
    if (!maskLine) {
      return;
    }
  
  
    gsap.set([maskLine], { drawSVG: '0% 0%' });
  
    gsap.timeline({
      scrollTrigger: {
        trigger: border,
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


  mobileScreens.forEach((screen, index) => {
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
        scale: 0.9,
        opacity: 0,
        rotate: -15,
        duration: 1,
        ease: 'none',
        delay: index * 0.2 // Stagger the animations for each screen
      })
  });

  texts.forEach((text, index) => {
    gsap.timeline({
        scrollTrigger: {
          trigger: text,
          start: 'bottom bottom',
          end: 'top 70%',
          scrub: 1,
          invalidateOnRefresh: true
        }
      })
      .from(text, {
        scale: 0.9,
        opacity: 0,
        duration: 0.1,
        ease: 'none',
        delay: index * 0.2 // Stagger the animations for each screen
      })
  });

  }



 animateMobileScreensInBox();
}