import { RahuTime } from '../types';

export function checkNotificationSupport(): boolean {
  return 'Notification' in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!checkNotificationSupport()) return 'denied';
  return await Notification.requestPermission();
}

export function scheduleNotification(rahu: RahuTime): void {
  if (Notification.permission !== 'granted') return;

  const now = new Date().getTime();
  const startTime = rahu.start.getTime();
  // 15 minutes before
  const alertTime = startTime - (15 * 60 * 1000); 

  if (alertTime > now) {
    const timeUntilAlert = alertTime - now;
    
    // We use setTimeout for the active tab context. 
    // For a robust PWA, this would ideally use the Push API with a backend,
    // or Periodic Sync (which is limited). This is a best-effort frontend solution.
    setTimeout(() => {
      new Notification('Rahu Kaal Warning', {
        body: `Rahu Kaal starts in 15 minutes at ${rahu.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}. Avoid beginning important tasks.`,
        icon: 'https://cdn-icons-png.flaticon.com/512/2693/2693507.png', // Placeholder astrological icon
        tag: 'rahu-alert-15'
      });
    }, timeUntilAlert);

    console.log(`Notification scheduled for ${new Date(alertTime).toLocaleTimeString()}`);
  }
  
  // Also schedule immediate start alert
  if (startTime > now) {
      setTimeout(() => {
          new Notification('Rahu Kaal Started', {
              body: `Rahu Kaal has started. It ends at ${rahu.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}.`,
              tag: 'rahu-start'
          });
      }, startTime - now);
  }
}

export function sendTestNotification() {
    if (Notification.permission === 'granted') {
        new Notification('Test Alert', {
            body: 'This is how your Rahu Kaal alerts will look.',
        });
    }
}