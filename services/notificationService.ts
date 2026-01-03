import { RahuTime } from '../types';

let scheduledTimeoutId: number | undefined;

export function checkNotificationSupport(): boolean {
  return 'Notification' in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!checkNotificationSupport()) return 'denied';
  return await Notification.requestPermission();
}

export function scheduleNotification(rahu: RahuTime, alertOffsetMinutes: number = 15): void {
  if (Notification.permission !== 'granted') return;

  // Clear any previously scheduled notification to avoid duplicates
  if (scheduledTimeoutId) {
    clearTimeout(scheduledTimeoutId);
    scheduledTimeoutId = undefined;
  }

  const now = new Date().getTime();
  const startTime = rahu.start.getTime();
  const alertTime = startTime - (alertOffsetMinutes * 60 * 1000);

  // Only schedule if the alert time is in the future
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

    // Schedule the notification
    scheduledTimeoutId = window.setTimeout(() => {
      new Notification(title, {
        body: body,
        icon: 'https://cdn-icons-png.flaticon.com/512/2693/2693507.png',
        tag: 'rahu-alert' // unique tag replaces previous notification with same tag
      });
    }, timeUntilAlert);

    console.log(`Notification scheduled for ${new Date(alertTime).toLocaleTimeString()} (Offset: ${alertOffsetMinutes}m)`);
  }
}

export function sendTestNotification() {
    if (Notification.permission === 'granted') {
        new Notification('Test Alert', {
            body: 'This is how your Rahu Kaal alerts will look.',
            icon: 'https://cdn-icons-png.flaticon.com/512/2693/2693507.png',
        });
    }
}