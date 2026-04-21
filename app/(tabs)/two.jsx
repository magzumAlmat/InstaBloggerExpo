import React from 'react';
import { ScrollView, Pressable, View, Text, useWindowDimensions, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import {
  Bell, Shield, Star, LogOut, ChevronRight,
  User, Settings, CreditCard, HelpCircle,
} from 'lucide-react-native';

const GlassCard = ({ children, style }) => (
  <BlurView
    tint="dark"
    intensity={40}
    style={[{
      borderRadius: 24,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.12)',
    }, style]}
  >
    {children}
  </BlurView>
);

const MenuRow = ({ icon: Icon, label, color = '#A78BFA', onPress, destructive }) => {
  const tap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };
  return (
    <Pressable onPress={tap} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 18, gap: 14 }}>
        <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: destructive ? 'rgba(239,68,68,0.15)' : `${color}22`, alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={destructive ? '#EF4444' : color} />
        </View>
        <Text style={{ flex: 1, color: destructive ? '#EF4444' : '#fff', fontSize: 15, fontWeight: '600' }}>{label}</Text>
        {!destructive && <ChevronRight size={16} color="rgba(255,255,255,0.25)" />}
      </View>
    </Pressable>
  );
};

export default function TabTwoScreen() {
  const tap = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    Alert.alert('Выход', 'Вы уверены, что хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Выйти', style: 'destructive', onPress: async () => { 
        await logout(); 
        router.replace('/(auth)/login'); 
      }},
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require('../../assets/images/background.png')}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        contentFit="cover"
      />
      <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(10,6,30,0.55)' }} />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 20, paddingTop: 68, paddingBottom: 120, gap: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800', letterSpacing: -0.5 }}>Settings</Text>

        {/* Profile Card */}
        <Pressable onPress={tap} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
          <GlassCard>
            <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <View style={{ width: 64, height: 64, borderRadius: 22, backgroundColor: 'rgba(124,58,237,0.25)', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.4)' }}>
                <User size={30} color="#A78BFA" />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>@{user?.ig_username || 'username'}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Shield size={12} color="#34D399" />
                  <Text style={{ color: '#34D399', fontSize: 12, fontWeight: '600' }}>
                    {user?.role === 'BLOGGER' ? 'Верифицированный блогер' : 'Аккаунт бренда'}
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color="rgba(255,255,255,0.25)" />
            </View>
            <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginHorizontal: 18 }} />
            <View style={{ flexDirection: 'row', paddingVertical: 16 }}>
              {[
                { label: 'Rating', value: '4.9', color: '#FBBF24' },
                { label: 'Deals', value: '38', color: '#60A5FA' },
                { label: 'Earned', value: '$12K', color: '#34D399' },
              ].map((s, i) => (
                <View key={i} style={{ flex: 1, alignItems: 'center', gap: 2 }}>
                  <Text style={{ color: s.color, fontSize: 17, fontWeight: '800', fontVariant: ['tabular-nums'] }}>{s.value}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '600' }}>{s.label}</Text>
                </View>
              ))}
            </View>
          </GlassCard>
        </Pressable>

        {/* Account Section */}
        <View style={{ gap: 8 }}>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginLeft: 4 }}>Account</Text>
          <GlassCard>
            <MenuRow icon={Settings} label="Account Settings" color="#60A5FA" />
            <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginLeft: 68 }} />
            <MenuRow icon={Bell} label="Notifications" color="#FBBF24" />
            <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginLeft: 68 }} />
            <MenuRow icon={CreditCard} label="Payments & Billing" color="#34D399" />
          </GlassCard>
        </View>

        {/* Support Section */}
        <View style={{ gap: 8 }}>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginLeft: 4 }}>Support</Text>
          <GlassCard>
            <MenuRow icon={Star} label="Rate App" color="#F472B6" />
            <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginLeft: 68 }} />
            <MenuRow icon={HelpCircle} label="Help & FAQ" color="#A78BFA" />
          </GlassCard>
        </View>

        {/* Logout */}
        <GlassCard>
          <MenuRow icon={LogOut} label="Log Out" destructive onPress={handleLogout} />
        </GlassCard>
      </ScrollView>
    </View>
  );
}
