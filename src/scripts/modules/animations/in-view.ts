import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initInViewAnimation(): void {
	const elements = gsap.utils.toArray<HTMLElement>('.in-view-animation');
	const elementsDesktopOnly = gsap.utils.toArray<HTMLElement>('.in-view-animation-dekstop');

	if (!elements.length) {
		return;
	}

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		elements.forEach((element) => {
			gsap.set(element, { opacity: 1, y: 0 });
		});
		return;
	}

	gsap.registerPlugin(ScrollTrigger);

	elements.forEach((element) => {
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
					start: 'top 85%',
					once: true
				}
			}
		);
	});

	if(window.matchMedia('(min-width: 1024px)').matches && elementsDesktopOnly.length) {
		elementsDesktopOnly.forEach((element) => {
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
						start: 'top 85%',
						once: true
					}
				}
			);
		});

	}

}