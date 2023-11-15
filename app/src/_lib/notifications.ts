import thud from '../_assets/thud.mp3';

export function sendNotification(title: string, body: string) {
  window.notifications.send(title, body);
  new Audio(thud).play();
}
