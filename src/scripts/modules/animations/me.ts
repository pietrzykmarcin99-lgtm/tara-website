

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initializeMeAnimations() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return;
	}

	const img = document.querySelector<HTMLElement>('.me__img');
	const h1 = document.querySelector<HTMLElement>('.me__texts h1');
	const p = document.querySelector<HTMLElement>('.me__texts p');
	const arrow = document.querySelector<HTMLElement>('.me__decor-arrow-mobile');

	const elements = [img, h1, p, arrow].filter((el): el is HTMLElement => el !== null);

	if (!elements.length) {
		return;
	}

	gsap.registerPlugin(ScrollTrigger);

	gsap.set(elements, { opacity: 0, y: 24 });

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
					start: 'bottom 100%',
					once: true
				}
			}
		);
	});
}