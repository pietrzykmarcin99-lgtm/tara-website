import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

export function initDecors(): void {
  const svg = document.querySelector<SVGSVGElement>('.me__decor-arrow-desktop');

  if (!svg) {
    return;
  }

  const maskLine = svg.querySelector<SVGPathElement>('#maskLine');
  const maskLine2 = svg.querySelector<SVGPathElement>('#maskLine2');
  const maskLine3 = svg.querySelector<SVGPathElement>('#maskLine3');

  if (!maskLine || !maskLine2 || !maskLine3) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

  gsap.set([maskLine, maskLine2, maskLine3], { drawSVG: '0% 0%' });

  gsap.timeline({
    scrollTrigger: {
      trigger: svg,
      start: 'bottom 100%',
      once: true
    }
  })
  .to(maskLine, {
    drawSVG: '0% 100%',
    duration: 1,
    ease: 'power1.inOut'
  })
  .to(maskLine2, {
    drawSVG: '0% 100%',
    duration: 0.1,
    ease: 'power1.inOut'
  })
  .to(maskLine3, {
    drawSVG: '0% 100%',
    duration: 0.1,
    ease: 'power1.inOut'
  });

  // window.addEventListener('scroll', createScrollAnimation, { once: true, passive: true });

}