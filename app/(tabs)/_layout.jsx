import React from 'react';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LayoutDashboard, Settings as SettingsIcon } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTransparent: true,
        headerBackground: () => (
          <BlurView tint="dark" intensity={80} style={{ flex: 1 }} />
        ),
        headerTitleStyle: {
          color: '#fff',
          fontWeight: '700',
          fontSize: 17,
        },
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'transparent',
          height: 88,
        },
        tabBarBackground: () => (
          <BlurView
            tint="dark"
            intensity={80}
            style={{
              flex: 1,
              borderTopWidth: 1,
              borderTopColor: 'rgba(255,255,255,0.08)',
            }}
          />
        ),
        tabBarActiveTintColor: '#A78BFA',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.35)',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 8,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => <SettingsIcon size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
