import { iOS } from '@helpers';

async function isLowPowerMode() {
  if (iOS()) {
    let video = document.createElement('video');
    video.setAttribute('playsinline', 'playsinline');
    video.setAttribute('aria-hidden', true);
    video.setAttribute('src', '');
    try {
      await video.play();
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        return true;
      }
    } finally {
      video = null;
    }
  }
  return false;
}

export default isLowPowerMode;
