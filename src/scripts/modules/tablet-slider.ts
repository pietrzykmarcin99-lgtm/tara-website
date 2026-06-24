import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

export function initTabletSlider(): void {
  gsap.registerPlugin(DrawSVGPlugin);

  const sliders = Array.from(document.querySelectorAll<HTMLElement>('[data-tablet-slider]'));

  if (sliders.length === 0) {
    return;
  }

  sliders.forEach((slider) => {
    if (slider.dataset.initialized === 'true') {
      return;
    }

    const items = Array.from(slider.querySelectorAll<HTMLElement>('[data-tablet-slider-item]'));
    const prevButton = slider.querySelector<HTMLButtonElement>('[data-tablet-slider-prev]');
    const nextButton = slider.querySelector<HTMLButtonElement>('[data-tablet-slider-next]');
    const dots = Array.from(slider.querySelectorAll<HTMLButtonElement>('[data-tablet-slider-dot]'));
    const video = slider.querySelector<HTMLVideoElement>('[data-tablet-slider-video]');
    const callToAction = slider.querySelector<HTMLElement>('.tablet-slider__video-call-to-action-arrow');
    const callToActionText = callToAction?.querySelector<HTMLElement>('p');
    const callToActionMaskPaths = Array.from(
      callToAction?.querySelectorAll<SVGPathElement>('mask path') ?? []
    );

    if (items.length === 0) {
      return;
    }

    slider.dataset.initialized = 'true';

    let currentIndex = Math.max(
      0,
      items.findIndex((item) => item.classList.contains('is-active'))
    );
    const videoSlideIndex = 8;
    let hasVideoStarted = false;
    let isCallToActionVisible = false;
    let callToActionTimeline: gsap.core.Timeline | null = null;
    let lastRenderedIndex = currentIndex;
    let shouldResumeVideoOnReturn = false;
    let isSlideChangePausingVideo = false;

    const hideCallToAction = (animate = false): void => {
      if (!callToAction) {
        return;
      }

      callToActionTimeline?.kill();
      callToActionTimeline = null;

      if (animate) {
        const hideTimeline = gsap.timeline({
          defaults: {
            ease: 'power2.in'
          },
          onComplete: () => {
            if (callToActionText) {
              gsap.set(callToActionText, {
                autoAlpha: 0,
                scale: 0.92,
                transformOrigin: '50% 50%'
              });
            }

            if (callToActionMaskPaths.length > 0) {
              gsap.set(callToActionMaskPaths, { drawSVG: '0% 0%' });
            }

            gsap.set(callToAction, { autoAlpha: 0 });
          }
        });

        if (callToActionMaskPaths.length > 0) {
          hideTimeline.to(callToActionMaskPaths, {
            drawSVG: '0% 0%',
            duration: 0.2,
            ease: 'none',
            stagger: {
              each: 0.04,
              from: 'end'
            }
          });
        }

        if (callToActionText) {
          hideTimeline.to(
            callToActionText,
            {
              autoAlpha: 0,
              scale: 0.92,
              duration: 0.2
            },
            callToActionMaskPaths.length > 0 ? '-=0.02' : 0
          );
        }

        return;
      }

      gsap.killTweensOf(callToAction);

      if (callToActionText) {
        gsap.killTweensOf(callToActionText);
        gsap.set(callToActionText, {
          autoAlpha: 0,
          scale: 0.92,
          transformOrigin: '50% 50%'
        });
      }

      if (callToActionMaskPaths.length > 0) {
        gsap.killTweensOf(callToActionMaskPaths);
        gsap.set(callToActionMaskPaths, { drawSVG: '0% 0%' });
      }

      gsap.set(callToAction, { autoAlpha: 0 });
    };

    const showCallToAction = (): void => {
      if (!callToAction) {
        return;
      }

      callToActionTimeline?.kill();
      callToActionTimeline = gsap.timeline({
        defaults: {
          ease: 'power2.out'
        }
      });

      gsap.set(callToAction, { autoAlpha: 1 });

      if (callToActionText) {
        gsap.set(callToActionText, {
          autoAlpha: 0,
          scale: 0.92,
          transformOrigin: '50% 50%'
        });

        callToActionTimeline.to(callToActionText, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.2
        });
      }

      if (callToActionMaskPaths.length > 0) {
        gsap.set(callToActionMaskPaths, { drawSVG: '0% 0%' });
        callToActionTimeline.to(
          callToActionMaskPaths,
          {
            drawSVG: '0% 100%',
            duration: 0.2,
            ease: 'none',
            stagger: 0.04
          },
          callToActionText ? '-=0.05' : 0
        );
      }
    };

    const syncCallToAction = (): void => {
      const shouldShowCallToAction = currentIndex === videoSlideIndex && !hasVideoStarted && !!video && !!callToAction;

      if (shouldShowCallToAction) {
        if (!isCallToActionVisible) {
          showCallToAction();
          isCallToActionVisible = true;
        }

        return;
      }

      if (isCallToActionVisible || callToAction) {
        hideCallToAction(isCallToActionVisible);
      }

      isCallToActionVisible = false;
    };

    const syncVideoPlayback = (): void => {
      if (!video) {
        return;
      }

      const isVideoSlideActive = currentIndex === videoSlideIndex;
      const wasVideoSlideActive = lastRenderedIndex === videoSlideIndex;

      if (!isVideoSlideActive && wasVideoSlideActive && !video.paused) {
        shouldResumeVideoOnReturn = true;
        isSlideChangePausingVideo = true;
        video.pause();
        return;
      }

      if (isVideoSlideActive && !wasVideoSlideActive && shouldResumeVideoOnReturn) {
        void video.play();
      }
    };

    const render = (): void => {
      items.forEach((item, index) => {
        item.classList.toggle('is-active', index === currentIndex);
      });

      dots.forEach((dot, index) => {
        const isActive = index === currentIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });

      syncVideoPlayback();
      syncCallToAction();
      lastRenderedIndex = currentIndex;
    };

    const move = (delta: number): void => {
      currentIndex = (currentIndex + delta + items.length) % items.length;
      render();
    };

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        move(-1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        move(1);
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentIndex = index;
        render();
      });
    });

    if (video) {
      const handleVideoStart = (): void => {
        hasVideoStarted = true;
        shouldResumeVideoOnReturn = true;
        isCallToActionVisible = false;
        hideCallToAction(true);
      };

      const handleVideoPause = (): void => {
        if (isSlideChangePausingVideo) {
          isSlideChangePausingVideo = false;
          return;
        }

        if (currentIndex === videoSlideIndex) {
          shouldResumeVideoOnReturn = false;
        }
      };

      video.addEventListener('play', handleVideoStart, { once: true });
      video.addEventListener('click', handleVideoStart, { once: true });
      video.addEventListener('pause', handleVideoPause);
    }

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50;

    slider.addEventListener('touchstart', (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) >= swipeThreshold) {
        move(diff > 0 ? 1 : -1);
      }
    }, { passive: true });

    hideCallToAction();
    render();
  });
}
