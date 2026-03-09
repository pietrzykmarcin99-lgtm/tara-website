export function initSlider() {
	const slider = document.querySelector<HTMLElement>('.slider.desktop-only');

	if (!slider) {
		return;
	}

	const track = slider.querySelector<HTMLElement>('.slider__track');
	const items = Array.from(slider.querySelectorAll<HTMLElement>('.slider__item'));
	const prevButton = slider.querySelector<HTMLButtonElement>('.slider__arrow-container--left');
	const nextButton = slider.querySelector<HTMLButtonElement>('.slider__arrow-container--right');

	if (!track || !prevButton || !nextButton || items.length === 0) {
		return;
	}

	if (track.dataset.sliderInitialized === 'true') {
		return;
	}

	track.dataset.sliderInitialized = 'true';

	const visibleCount = Math.min(3, items.length);
	const cloneCount = visibleCount;

	const prependClones = items.slice(-cloneCount).map((item) => item.cloneNode(true) as HTMLElement);
	const appendClones = items.slice(0, cloneCount).map((item) => item.cloneNode(true) as HTMLElement);

	prependClones.reverse().forEach((clone) => {
		track.insertBefore(clone, track.firstChild);
	});

	appendClones.forEach((clone) => {
		track.appendChild(clone);
	});

	const sliderItems = Array.from(track.querySelectorAll<HTMLElement>('.slider__item'));
	const originalItemCount = items.length;
	const initialOriginalIndex = items.findIndex((item) => {
		const title = item.querySelector('h3')?.textContent?.trim().toLowerCase();
		return title === 'e-learning course';
	});

	let currentIndex = cloneCount + (initialOriginalIndex >= 0 ? initialOriginalIndex : 0);
	let isAnimating = false;

	const getTranslateOffset = (): number => {
		const activeItem = sliderItems[currentIndex];
		if (!activeItem) {
			return 0;
		}

		const sliderStyles = window.getComputedStyle(slider);
		const horizontalPadding =
			parseFloat(sliderStyles.paddingLeft || '0') + parseFloat(sliderStyles.paddingRight || '0');
		const viewportWidth = slider.clientWidth - horizontalPadding;
		const itemCenter = activeItem.offsetLeft + activeItem.offsetWidth / 2;

		return Math.max(0, itemCenter - viewportWidth / 2);
	};

	const updateSliderPosition = (withTransition = true): void => {
		track.style.transition = withTransition ? 'transform 0.35s ease' : 'none';
		track.style.transform = `translateX(-${getTranslateOffset()}px)`;
	};

	prevButton.addEventListener('click', () => {
		if (isAnimating) {
			return;
		}

		isAnimating = true;
		currentIndex -= 1;
		updateSliderPosition();
	});

	nextButton.addEventListener('click', () => {
		if (isAnimating) {
			return;
		}

		isAnimating = true;
		currentIndex += 1;
		updateSliderPosition();
	});

	track.addEventListener('transitionend', () => {
		if (currentIndex < cloneCount) {
			currentIndex += originalItemCount;
			updateSliderPosition(false);
		}

		if (currentIndex >= originalItemCount + cloneCount) {
			currentIndex -= originalItemCount;
			updateSliderPosition(false);
		}

		isAnimating = false;
	});

	window.addEventListener('resize', () => {
		updateSliderPosition(false);
	});


	const closeOpenModals = (): void => {
		const openModals = document.querySelectorAll<HTMLElement>('.slider__modal.is-open');
		openModals.forEach((modal) => modal.classList.remove('is-open'));
		document.body.classList.remove('slider-modal-open');
	};

	sliderItems.forEach((item) => {
		const previewImage = item.firstElementChild instanceof HTMLImageElement ? item.firstElementChild : null;
		const modal = item.querySelector<HTMLElement>('.slider__modal');

		if (!previewImage || !modal) {
			return;
		}

		if (!modal.dataset.portaled) {
			modal.dataset.portaled = 'true';
			document.body.appendChild(modal);
		}

    modal.querySelectorAll('.slider__modal-close')?.forEach((closeButton) => {
      closeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        closeOpenModals();
      });
    });

		previewImage.addEventListener('click', () => {
			closeOpenModals();
			modal.classList.add('is-open');
			document.body.classList.add('slider-modal-open');
		});

		modal.addEventListener('click', (event) => {
			if (event.target === modal) {
				closeOpenModals();
			}
		});
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			closeOpenModals();
		}
	});

	updateSliderPosition(false);
}