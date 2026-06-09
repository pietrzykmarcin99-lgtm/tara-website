export function initVideo(): void {
  const videos = document.querySelectorAll<HTMLVideoElement>(
    '.prototype-with-mobile-screens__video, .video-section-mobile__video'
  );
  
  videos.forEach(video => {
    video.addEventListener('click', (event: Event) => {
      event.preventDefault();
      
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  });
}
