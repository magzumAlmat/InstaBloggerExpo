import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { useFocusEffect } from 'expo-router';
import api from '../../src/api/client';
import { Users, Handshake, Briefcase, TrendingUp, DollarSign } from 'lucide-react-native';

const { width } = Dimensions.get('window');

function StatCard({ title, value, subtext, icon: Icon, color }) {
  return (
    <BlurView tint="dark" intensity={40} style={{ width: (width - 50) / 2, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', padding: 20, marginBottom: 10 }}>
      <View style={{ backgroundColor: `${color}15`, width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Icon size={20} color={color} />
      </View>
      <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '600' }}>{title}</Text>
      <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 4 }}>{value}</Text>
      {subtext && <Text style={{ color: color, fontSize: 11, fontWeight: '700', marginTop: 4 }}>{subtext}</Text>}
    </BlurView>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchStats(); }, []));

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading && !refreshing) {
    return <View style={{ flex: 1, backgroundColor: '#0A061E', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color="#60A5FA" size="large" /></View>;
  }

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#0A061E' }} 
      contentContainerStyle={{ paddingTop: 110, paddingHorizontal: 20, paddingBottom: 100 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#60A5FA" />}
    >
      <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 24 }}>Аналитика платформы</Text>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <StatCard 
          title="Пользователи" 
          value={data?.users?.total || 0} 
          subtext={`${data?.users?.bloggers || 0} блогеров`} 
          icon={Users} 
          color="#60A5FA" 
        />
        <StatCard 
          title="Авторизации" 
          value={data?.connections?.authorized || 0} 
          subtext={`${data?.connections?.total || 0} всего свайпов`} 
          icon={Handshake} 
          color="#34D399" 
        />
        <StatCard 
          title="Сделки" 
          value={data?.deals?.total || 0} 
          subtext={`${data?.deals?.completed || 0} завершено`} 
          icon={Briefcase} 
          color="#A78BFA" 
        />
        <StatCard 
          title="Офферы" 
          value={data?.offers?.active || 0} 
          subtext={`Всего ${data?.offers?.total || 0}`} 
          icon={TrendingUp} 
          color="#FBBF24" 
        />
      </View>

      <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 24, marginBottom: 16 }}>Распределение по категориям</Text>
      
      <BlurView tint="dark" intensity={40} style={{ borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', padding: 24 }}>
        <View style={{ height: 200, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', gap: 8 }}>
          {data?.categories?.map((cat, index) => {
            const heightPerc = (cat.count / (Math.max(...data.categories.map(c => c.count)) || 1)) * 100;
            return (
              <View key={index} style={{ alignItems: 'center', flex: 1 }}>
                <View style={{ 
                  width: '100%', 
                  height: `${heightPerc}%`, 
                  backgroundColor: index % 2 === 0 ? '#60A5FA' : '#A78BFA', 
                  borderRadius: 8,
                  shadowColor: index % 2 === 0 ? '#60A5FA' : '#A78BFA',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                }} />
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '700', marginTop: 8, textTransform: 'uppercase' }} numberOfLines={1}>
                  {cat.category.substring(0, 3)}
                </Text>
              </View>
            );
          })}
        </View>
      </BlurView>

      <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 32, marginBottom: 16 }}>Активность за неделю</Text>
      <BlurView tint="dark" intensity={40} style={{ borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', padding: 24 }}>
        <View style={{ height: 120, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          {[30, 45, 35, 60, 55, 80, 95].map((h, i) => (
            <View key={i} style={{ width: 30, height: `${h}%`, backgroundColor: i === 6 ? '#34D399' : 'rgba(255,255,255,0.1)', borderRadius: 6 }} />
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d, i) => (
            <Text key={i} style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: '600' }}>{d}</Text>
          ))}
        </View>
      </BlurView>
    </ScrollView>
  );
}
