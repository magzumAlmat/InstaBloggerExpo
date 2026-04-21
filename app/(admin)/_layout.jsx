import React from 'react';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { BarChart3, Users, Settings, LogOut } from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';

export default function AdminLayout() {
  const { logout } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerTransparent: true,
        headerBackground: () => <BlurView tint="dark" intensity={80} style={{ flex: 1 }} />,
        headerTitleStyle: { color: '#fff', fontWeight: '700' },
        headerTintColor: '#60A5FA',
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
        tabBarActiveTintColor: '#60A5FA',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.35)',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 8 },
        tabBarIconStyle: { marginTop: 4 },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Статистика',
          tabBarLabel: 'Аналитика',
          tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Пользователи',
          tabBarLabel: 'База',
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Настройки',
          tabBarLabel: 'Выход',
          tabBarIcon: ({ color, size }) => <LogOut size={size} color={color} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            logout();
          },
        }}
      />
    </Tabs>
  );
}
