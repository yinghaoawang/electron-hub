import errorSound from '../_assets/error-sound.ogg';
import logoutSound from '../_assets/logout-sound.ogg';

export function sendNotification(
  title: string,
  body: string,
  type: 'error' | 'ok' | 'default' = 'default'
) {
  window.notifications.send(title, body);
  if (type === 'error') {
    const audio = new Audio(errorSound);
    audio.play();
  } else if (type === 'ok') {
    const audio = new Audio(logoutSound);
    audio.play();
  }
}
