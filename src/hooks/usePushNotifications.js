import { useEffect } from 'react';
// import * as Notifications from 'expo-notifications'; // Commented out to prevent crash if not installed
import { Platform } from 'react-native';
import api from '../api/client';

export const usePushNotifications = (user) => {
  useEffect(() => {
    if (!user) return;

    console.log('Push Notifications Hook: Active (Mock Mode)');
    /* 
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        api.post('/auth/push-token', { token }).catch(e => console.error('Failed to save push token:', e));
      }
    });

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification clicked:', response);
    });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
    */
  }, [user]);
};

async function registerForPushNotificationsAsync() {
  console.log('Please run "npx expo install expo-notifications" to enable real push tokens.');
  return null;
}
