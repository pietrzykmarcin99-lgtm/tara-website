import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initRecentWorkAnimation(): void {
  const tiles = document.querySelectorAll<HTMLElement>('.recent-work__tile');

  gsap.registerPlugin(ScrollTrigger);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		tiles.forEach((tile) => {
			gsap.set(tile, { opacity: 1, y: 0 });
		});
		return;
	}

  tiles.forEach((tile) => {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: tile,
				start: 'bottom 110%',
				// toggleActions: 'play reverse play reverse'
			}
		});

		tl.fromTo(
			tile,
			{ opacity: 0, y: 24 },
			{ opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
		);

		// const h3 = tile.querySelector('h3');
		// if (h3) {
		// 	tl.fromTo(
		// 		h3,
		// 		{ opacity: 0 },
		// 		{ opacity: 1, duration: 0.5, ease: 'power2.out' },
		// 		'-=0.7'
		// 	);
		// }

		// const p = tile.querySelector('p');
		// if (p) {
		// 	tl.fromTo(
		// 		p,
		// 		{ opacity: 0 },
		// 		{ opacity: 1, duration: 0.5, ease: 'power2.out' },
		// 		'-=0.7'
		// 	);
		// }

		// const svg = tile.querySelector('svg');
		// if (svg) {
		// 	tl.fromTo(
		// 		svg,
		// 		{ opacity: 0 },
		// 		{ opacity: 1, duration: 0.5, ease: 'power2.out' },
		// 		'-=0.3'
		// 	);
		// }
	});
}