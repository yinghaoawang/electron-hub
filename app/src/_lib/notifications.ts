import errorSound from '../_assets/error-sound.ogg';

export function sendNotification(
  title: string,
  body: string,
  type: 'error' | 'default' = 'default'
) {
  window.notifications.send(title, body);
  if (type === 'error') {
    const audio = new Audio(errorSound);
    audio.play();
  }
}
