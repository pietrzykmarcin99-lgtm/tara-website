import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

 export function initSmartFridgeAnimations(): void {
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

  const aniamtionClickSeePrototype = () => {
    const container = document.querySelector<HTMLElement>('.prototype-with-mobile-screens__floating-text');
    const prototypeWithMobileScreensText = document.querySelector<HTMLElement>('.prototype-with-mobile-screens__floating-text p');
    const prototypeWithMobileScreensArrowSvg = document.querySelector<HTMLElement>('.prototype-with-mobile-screens__arrow svg');
    const maskPaths = Array.from(prototypeWithMobileScreensArrowSvg?.querySelectorAll<SVGPathElement>('mask path') ?? []);
    const video = document.querySelector<HTMLVideoElement>('.prototype-with-mobile-screens__video');
    const decor1 = document.querySelector<HTMLVideoElement>('.prototype-with-mobile-screens__decor-1');
    const decor2 = document.querySelector<HTMLVideoElement>('.prototype-with-mobile-screens__decor-2');
  
    gsap.set(maskPaths, { drawSVG: '0% 0%' });
    gsap.set(prototypeWithMobileScreensText, { scale: 0.8, opacity: 0 });
    gsap.set(video, { opacity: 0, scale: 1});
    gsap.set(decor1, { opacity: 0, scale: 0.9});
    gsap.set(decor2, { opacity: 0, scale: 0.9});
  
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        end: 'top 30%',
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

    const revealTimeline = gsap.timeline({ paused: true });

    ScrollTrigger.create({
      trigger: container,
      start: 'top 30%',
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

    revealTimeline
    .to(video, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      ease: 'none'
    })
    .to(decor1, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      ease: 'none'
    })
    .to(decor2, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      ease: 'none'
    })
  }
  

  const animationPhonesAndArrows = () => {
    const phones = gsap.utils.toArray<HTMLElement>(document.querySelectorAll<HTMLElement>('.prototype-with-mobile-screens__mobile-screen img'));
    const texts = gsap.utils.toArray<HTMLElement>(document.querySelectorAll<HTMLElement>('.prototype-with-mobile-screens__mobile-screen p'));
    
    const arrows1 = gsap.utils.toArray<HTMLElement>(document.querySelectorAll<HTMLElement>('.prototype-with-mobile-screens__mobile-screen:nth-child(1) svg'));
    const arrows1mask = gsap.utils.toArray<HTMLElement>(document.querySelectorAll<HTMLElement>('.prototype-with-mobile-screens__mobile-screen:nth-child(1) svg mask path'));
    gsap.set(arrows1mask, { drawSVG: '0% 0%' });

    const arrows2 = gsap.utils.toArray<HTMLElement>(document.querySelectorAll<HTMLElement>('.prototype-with-mobile-screens__mobile-screen:nth-child(2) svg'));
    const arrows2mask = gsap.utils.toArray<HTMLElement>(document.querySelectorAll<HTMLElement>('.prototype-with-mobile-screens__mobile-screen:nth-child(2) svg mask path'));
    gsap.set(arrows2mask, { drawSVG: '0% 0%' });

    const arrows3 = gsap.utils.toArray<HTMLElement>(document.querySelectorAll<HTMLElement>('.prototype-with-mobile-screens__mobile-screen:nth-child(3) svg'));
    const arrows3mask = gsap.utils.toArray<HTMLElement>(document.querySelectorAll<HTMLElement>('.prototype-with-mobile-screens__mobile-screen:nth-child(3) svg mask path'));
    gsap.set(arrows3mask, { drawSVG: '0% 0%' });


    const timelineSvgArrow1 = gsap.timeline({
      scrollTrigger: {
        trigger: arrows1,
        start: 'top 80%',
        end: 'top 75%',
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

    timelineSvgArrow1
      .to(arrows1mask, {
        drawSVG: '0% 100%',
        duration: 0.4,
        ease: 'none'
      });

    const timelineSvgArrow2 = gsap.timeline({
      scrollTrigger: {
        trigger: arrows2,
        start: 'top 80%',
        end: 'top 75%',
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

     timelineSvgArrow2
      .to(arrows2mask, {
        drawSVG: '0% 100%',
        duration: 0.4,
        ease: 'none'
      });

    const timelineSvgArrow3 = gsap.timeline({
      scrollTrigger: {
        trigger: arrows3,
        start: 'top 80%',
        end: 'top 75%',
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

    timelineSvgArrow3
      .to(arrows3mask, {
        drawSVG: '0% 100%',
        duration: 0.4,
        ease: 'none'
      });



    phones.forEach((element) => {
      gsap.set(element, { opacity: 0, scale: 0.95 });
    });

    texts.forEach((element, index) => {
      if(index%2 === 0) {
        gsap.set(element, { opacity: 0, x: -10 });
      } else {
        gsap.set(element, { opacity: 0, x: 10 });
      }
    });

    [...phones, ...texts].forEach((element) => {
      gsap.to(
        element,
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            end: 'top 75%',

          }
        }
      );
    });
  }


  aniamtionClickSeePrototype();
  animationPhonesAndArrows();
 }