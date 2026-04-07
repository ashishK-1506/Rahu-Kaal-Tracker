import { RahuTime } from '../types';

let scheduledTimeoutId: number | undefined;

export function checkNotificationSupport(): boolean {
  return 'Notification' in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!checkNotificationSupport()) return 'denied';
  return await Notification.requestPermission();
}

export async function scheduleNotification(rahu: RahuTime, alertOffsetMinutes: number = 15, notifyOnEnd: boolean = false): Promise<void> {
  if (Notification.permission !== 'granted') return;

  // Clear any previously scheduled notification to avoid duplicates
  if (scheduledTimeoutId) {
    clearTimeout(scheduledTimeoutId);
    scheduledTimeoutId = undefined;
  }

  const now = new Date().getTime();
  const startTime = rahu.start.getTime();
  const endTime = rahu.end.getTime();
  const alertTime = startTime - (alertOffsetMinutes * 60 * 1000);

  const showNotification = async (title: string, body: string, tag: string) => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      registration.showNotification(title, {
        body,
        icon: '/rahu-coin.png',
        badge: '/rahu-coin.png',
        tag,
        vibrate: [200, 100, 200]
      });
    } else {
      new Notification(title, {
        body,
        icon: '/rahu-coin.png',
        tag
      });
    }
  };

  // Schedule start alert
  if (alertTime > now) {
    const timeUntilAlert = alertTime - now;
    const timeStr = rahu.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const endTimeStr = rahu.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    let title = 'Rahu Kaal Alert';
    let body = `Rahu Kaal starts in ${alertOffsetMinutes} minutes at ${timeStr}.`;

    if (alertOffsetMinutes === 0) {
        title = 'Rahu Kaal Started';
        body = `Rahu Kaal has started. It ends at ${endTimeStr}.`;
    }

    scheduledTimeoutId = window.setTimeout(() => {
      showNotification(title, body, 'rahu-start-alert');
    }, timeUntilAlert);

    console.log(`Start notification scheduled for ${new Date(alertTime).toLocaleTimeString()} (Offset: ${alertOffsetMinutes}m)`);
  }

  // Schedule end alert
  if (notifyOnEnd && endTime > now) {
    const timeUntilEnd = endTime - now;
    window.setTimeout(() => {
      showNotification('Rahu Kaal Ended', 'The inauspicious period has passed. It is now safe to start new ventures.', 'rahu-end-alert');
    }, timeUntilEnd);
    console.log(`End notification scheduled for ${new Date(endTime).toLocaleTimeString()}`);
  }
}

export async function sendTestNotification() {
    if (Notification.permission === 'granted') {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            registration.showNotification('Test Alert', {
                body: 'This is how your Rahu Kaal alerts will look.',
                icon: '/rahu-coin.png',
                badge: '/rahu-coin.png',
                vibrate: [200, 100, 200]
            });
        } else {
            new Notification('Test Alert', {
                body: 'This is how your Rahu Kaal alerts will look.',
                icon: '/rahu-coin.png',
            });
        }
    }
}