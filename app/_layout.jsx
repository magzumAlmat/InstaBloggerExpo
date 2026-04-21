import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

import { usePushNotifications } from '../src/hooks/usePushNotifications';

SplashScreen.preventAutoHideAsync();

function RootNavigation() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  usePushNotifications(user);

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
      if (!user) {
        router.replace('/(auth)/login');
      } else if (user.role === 'ADMIN') {
        router.replace('/(admin)/dashboard');
      } else if (user.role === 'BLOGGER') {
        router.replace('/(blogger)/offers');
      } else if (user.role === 'BRAND') {
        router.replace('/(brand)/discover');
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A061E', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#A78BFA" size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(blogger)" />
      <Stack.Screen name="(brand)" />
      <Stack.Screen name="(admin)" />
      <Stack.Screen
        name="portfolio-modal"
        options={{
          presentation: 'modal',
          headerShown: false,
          contentStyle: { backgroundColor: '#0A061E' },
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.9],
          sheetGrabberVisible: true,
          headerShown: false,
          contentStyle: { backgroundColor: '#0A061E' },
        }}
      />
      <Stack.Screen
        name="offer/[id]"
        options={{ headerShown: false, presentation: 'card' }}
      />
      <Stack.Screen
        name="messages/[id]"
        options={{
          headerShown: true,
          headerTitle: 'Чат',
          headerStyle: { backgroundColor: '#0A061E' },
          headerTintColor: '#fff',
          headerTransparent: false,
        }}
      />
      <Stack.Screen
        name="report/[id]"
        options={{
          headerShown: true,
          headerTitle: 'Отправить отчет',
          headerStyle: { backgroundColor: '#0A061E' },
          headerTintColor: '#fff',
          headerTransparent: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}
