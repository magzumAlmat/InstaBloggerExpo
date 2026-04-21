import React from 'react';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LayoutGrid, Briefcase, User } from 'lucide-react-native';

export default function BloggerLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTransparent: true,
        headerBackground: () => <BlurView tint="dark" intensity={80} style={{ flex: 1 }} />,
        headerTitleStyle: { color: '#fff', fontWeight: '700' },
        headerTintColor: '#A78BFA',
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'transparent',
          height: 88,
        },
        tabBarBackground: () => (
          <BlurView tint="dark" intensity={80} style={{ flex: 1, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' }} />
        ),
        tabBarActiveTintColor: '#A78BFA',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.35)',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 8 },
        tabBarIconStyle: { marginTop: 4 },
      }}
    >
      <Tabs.Screen
        name="offers"
        options={{
          title: 'Предложения',
          tabBarLabel: 'Офферы',
          tabBarIcon: ({ color, size }) => <LayoutGrid size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="deals"
        options={{
          title: 'Мои сделки',
          tabBarLabel: 'Сделки',
          tabBarIcon: ({ color, size }) => <Briefcase size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarLabel: 'Профиль',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
