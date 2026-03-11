
import gsap from 'gsap';

export function initButtonDecors(): void {
	const buttons = document.querySelectorAll<HTMLButtonElement>('.slider__modal button');
console.log('Initializing button decor animations for', buttons.length, 'buttons');
	buttons.forEach((button) => {
		if (button.dataset.decorAnimationInitialized === 'true') {
			return;
		}

		const decors = button.querySelectorAll<SVGSVGElement>('svg.threelines');
		const leftDecor = decors[0];
		const rightDecor = decors[1];

		if (!leftDecor || !rightDecor) {
			return;
		}

		button.dataset.decorAnimationInitialized = 'true';

    const commonAnimationLeaveProps = {
      duration: 0.3,
      ease: 'power2.out',
      opacity: 0,
      scale: 0.1
    };

    const commonAnimationEnterProps = {
      duration: 0.3,
      ease: 'power2.out',
      opacity: 1,
      scale: 1
    };
    
    gsap.set(leftDecor, {...commonAnimationLeaveProps, left: 20 });
    gsap.set(rightDecor, {...commonAnimationLeaveProps, right: 20 });

    let svgAnimationLeft = gsap.to(leftDecor, {
      ...commonAnimationEnterProps,
      paused: true,
      left: -20
    });

    let svgAnimationRight = gsap.to(rightDecor, {
      ...commonAnimationEnterProps,
      paused: true,
      right: -20
    });

		button.addEventListener('mouseenter', () => {
      console.log('Mouse entered button, playing animations');
			svgAnimationLeft.play();
      svgAnimationRight.play();
		});

		button.addEventListener('mouseleave', () => {
			svgAnimationLeft.reverse();
      svgAnimationRight.reverse();
		});
	});
}