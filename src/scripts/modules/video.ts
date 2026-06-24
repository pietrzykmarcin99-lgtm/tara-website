export function initVideo(): void {
  const videos = document.querySelectorAll<HTMLVideoElement>(
    '.prototype-with-mobile-screens__video, .video-section-mobile__video, .tablet-slider__video'
  );

  videos.forEach(video => {
    if (video.controls || video.hasAttribute('controls')) {
      return;
    }

    video.addEventListener('click', (event: Event) => {
      event.preventDefault();

      video.controls = true;
      video.setAttribute('controls', '');

      if (video.paused) {
        void video.play();
      }
    }, { once: true });
  });
}
