import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert, Image as RNImage } from 'react-native';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useAuth } from '../../src/context/AuthContext';
import api from '../../src/api/client';
import { useRouter } from 'expo-router';
import { User, Star, Shield, LogOut, Settings, Bell, ChevronRight, Users, Activity, Eye, BarChart2 } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api.get('/auth/me').then(r => setProfile(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    Alert.alert('Выход', 'Вы уверены, что хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Выйти', style: 'destructive', onPress: async () => { await logout(); router.replace('/(auth)/login'); } },
    ]);
  };

  if (loading) {
    return <View style={{ flex: 1, backgroundColor: '#0A061E', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color="#A78BFA" size="large" /></View>;
  }

  const data = profile || user;

  return (
    <View style={{ flex: 1, backgroundColor: '#0A061E' }}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <BlurView tint="dark" intensity={30} style={{ paddingTop: 100, paddingBottom: 30, alignItems: 'center', gap: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' }}>
          <View style={{ width: 90, height: 90, borderRadius: 30, backgroundColor: 'rgba(124,58,237,0.25)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(167,139,250,0.5)' }}>
            {data?.avatar_url ? (
              <Image source={{ uri: data.avatar_url }} style={{ width: '100%', height: '100%', borderRadius: 28 }} contentFit="cover" />
            ) : (
              <User size={42} color="#A78BFA" />
            )}
          </View>
          <View style={{ alignItems: 'center', gap: 6 }}>
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800' }}>@{data?.ig_username || 'user'}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(52,211,153,0.15)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 }}>
              <Shield size={12} color="#34D399" />
              <Text style={{ color: '#34D399', fontSize: 12, fontWeight: '700' }}>
                {data?.role === 'BLOGGER' ? 'Верифицированный блогер' : 'Аккаунт бренда'}
              </Text>
            </View>
          </View>

          {/* Stats Row */}
          <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', paddingTop: 20, width: '100%', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Star size={14} color="#FBBF24" fill="#FBBF24" />
                <Text style={{ color: '#FBBF24', fontSize: 18, fontWeight: '800' }}>{data?.rating || '—'}</Text>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 2 }}>Рейтинг</Text>
            </View>
            <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.06)' }} />
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>{data?.email?.split('@')[0] || '—'}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 2 }}>Email</Text>
            </View>
          </View>
        </BlurView>

        <View style={{ padding: 20, gap: 20 }}>
          {/* Instagram Stats */}
          {data?.role === 'BLOGGER' && (
            <View style={{ gap: 8 }}>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginLeft: 4 }}>Instagram Статистика</Text>
              <BlurView tint="dark" intensity={40} style={{ borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', padding: 16, gap: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(96,165,250,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={18} color="#60A5FA" />
                    </View>
                    <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>Подписчики</Text>
                  </View>
                  <Text style={{ color: '#60A5FA', fontSize: 16, fontWeight: '700' }}>{data?.followers_count?.toLocaleString?.() || data?.followers_count || '0'}</Text>
                </View>
                <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)' }} />
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(167,139,250,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                      <Eye size={18} color="#A78BFA" />
                    </View>
                    <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>Охват</Text>
                  </View>
                  <Text style={{ color: '#A78BFA', fontSize: 16, fontWeight: '700' }}>{data?.reach?.toLocaleString?.() || data?.reach || '0'}</Text>
                </View>
                <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)' }} />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(52,211,153,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                      <Activity size={18} color="#34D399" />
                    </View>
                    <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>Вовлеченность</Text>
                  </View>
                  <Text style={{ color: '#34D399', fontSize: 16, fontWeight: '700' }}>{data?.engagement_rate || '0'}%</Text>
                </View>
              </BlurView>
            </View>
          )}

          {/* Account Settings */}
          <View style={{ gap: 8 }}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginLeft: 4 }}>Аккаунт</Text>
            <BlurView tint="dark" intensity={40} style={{ borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
              {[
                { label: 'Редактировать профиль', icon: Settings, color: '#60A5FA', onPress: () => router.push('/edit-profile') },
                { label: 'Уведомления', icon: Bell, color: '#FBBF24' },
              ].map((item, i, arr) => (
                <View key={i}>
                  <Pressable 
                    onPress={item.onPress}
                    style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14, opacity: pressed ? 0.7 : 1 })}
                  >
                    <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: `${item.color}22`, alignItems: 'center', justifyContent: 'center' }}>
                      <item.icon size={18} color={item.color} />
                    </View>
                    <Text style={{ flex: 1, color: '#fff', fontSize: 15, fontWeight: '600' }}>{item.label}</Text>
                    <ChevronRight size={16} color="rgba(255,255,255,0.25)" />
                  </Pressable>
                  {i < arr.length - 1 && <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginLeft: 66 }} />}
                </View>
              ))}
            </BlurView>
          </View>

          {/* Logout */}
          <BlurView tint="dark" intensity={40} style={{ borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' }}>
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14, opacity: pressed ? 0.7 : 1 })}
            >
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(239,68,68,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                <LogOut size={18} color="#EF4444" />
              </View>
              <Text style={{ flex: 1, color: '#EF4444', fontSize: 15, fontWeight: '700' }}>Выйти из аккаунта</Text>
            </Pressable>
          </BlurView>
        </View>
      </ScrollView>
    </View>
  );
}
