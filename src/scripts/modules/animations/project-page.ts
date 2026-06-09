import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initProjectPageAnimations(): void {
  const timelineElements = gsap.utils.toArray<HTMLElement>(
    `.project-timeline__icon, 
    .project-timeline__content h2, 
    .project-timeline__content > p, 
    .project-timeline__content > img, 
    .project-timeline__target-group-item, 
    .project-timeline__personas img, 
    .project-timeline__content-row,
    .design-frames__row,
    .design-frames__popup,
    .screens-and-text-under__col img,
    .screens-and-text-under__texts,
    .desktop-only .project-timeline__plus-list li,
    .project-timeline__text-row svg,
    .toggleable-section,
    .video-section-mobile h2,
    .video-section-mobile p,
    .video-section-mobile video,
    .my-role-mobile-box
    `);

	if (!timelineElements.length) {
		return;
	}

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		timelineElements.forEach((element) => {
			gsap.set(element, { opacity: 1, y: 0 });
		});
		return;
	}

	gsap.registerPlugin(ScrollTrigger);

	timelineElements.forEach((element) => {
		gsap.fromTo(
			element,
			{ opacity: 0, y: 24 },
			{
				opacity: 1,
				y: 0,
				duration: 1,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: element,
					start: 'top 90%',
					once: true
				}
			}
		);
	});

  //Circle steps animation:
  const circleSteps = gsap.utils.toArray<HTMLElement>('.circle-steps li');

  if (!circleSteps.length) {
    return;
  }

  gsap.fromTo(
    circleSteps,
		{ opacity: 0, y: 24 },
		{
			opacity: 1,
			y: 0,
			duration: 1,
      delay: 0.2,
			ease: 'power2.out',
			stagger: 0.2,
			scrollTrigger: {
				trigger: circleSteps[0],
				start: 'top 85%',
				once: true
			}
		}
	);
} 