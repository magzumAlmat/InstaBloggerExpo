import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, Pressable, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { BlurView } from 'expo-blur';
import { useFocusEffect, useRouter } from 'expo-router';
import api from '../../src/api/client';
import { CheckCircle, Clock, Send, XCircle, MessageCircle, User } from 'lucide-react-native';

const STATUS_META = {
  REQUESTED: { label: 'Ожидает', color: '#FBBF24', icon: Clock },
  ACCEPTED:  { label: 'В процессе', color: '#34D399', icon: CheckCircle },
  REPORTED:  { label: 'Нужен обзор', color: '#60A5FA', icon: Send },
  COMPLETED: { label: 'Завершено', color: '#A78BFA', icon: CheckCircle },
};

function DealCard({ deal, onAccept, onComplete, router }) {
  const meta = STATUS_META[deal.status] || STATUS_META.REQUESTED;
  const Icon = meta.icon;

  return (
    <BlurView tint="dark" intensity={40} style={{ borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginHorizontal: 20, marginBottom: 14 }}>
      <View style={{ padding: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800', flex: 1, marginRight: 10 }} numberOfLines={2}>
            {deal.offer?.title}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: `${meta.color}22`, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 }}>
            <Icon size={13} color={meta.color} />
            <Text style={{ color: meta.color, fontSize: 11, fontWeight: '700' }}>{meta.label}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <User size={13} color="rgba(255,255,255,0.4)" />
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
            @{deal.blogger?.ig_username || deal.blogger_id}
          </Text>
        </View>

        {deal.report_link && (
          <View style={{ backgroundColor: 'rgba(96,165,250,0.1)', borderRadius: 12, padding: 10, borderWidth: 1, borderColor: 'rgba(96,165,250,0.2)' }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 2 }}>Ссылка на контент</Text>
            <Text style={{ color: '#60A5FA', fontSize: 13, fontWeight: '600' }} numberOfLines={1}>{deal.report_link}</Text>
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 10 }}>
          {deal.status === 'REQUESTED' && (
            <Pressable
              onPress={() => onAccept(deal)}
              style={({ pressed }) => ({
                flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                gap: 6, paddingVertical: 11, borderRadius: 14,
                backgroundColor: pressed ? 'rgba(52,211,153,0.3)' : 'rgba(52,211,153,0.2)',
                borderWidth: 1, borderColor: 'rgba(52,211,153,0.4)',
              })}
            >
              <CheckCircle size={16} color="#34D399" />
              <Text style={{ color: '#34D399', fontWeight: '700', fontSize: 14 }}>Принять</Text>
            </Pressable>
          )}
          {deal.status === 'REPORTED' && (
            <Pressable
              onPress={() => onComplete(deal)}
              style={({ pressed }) => ({
                flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                gap: 6, paddingVertical: 11, borderRadius: 14,
                backgroundColor: pressed ? 'rgba(167,139,250,0.3)' : 'rgba(167,139,250,0.2)',
                borderWidth: 1, borderColor: 'rgba(167,139,250,0.4)',
              })}
            >
              <CheckCircle size={16} color="#A78BFA" />
              <Text style={{ color: '#A78BFA', fontWeight: '700', fontSize: 14 }}>Завершить</Text>
            </Pressable>
          )}
          <Pressable
            onPress={() => router.push(`/messages/${deal.id}`)}
            style={({ pressed }) => ({
              paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
              gap: 6, paddingVertical: 11, borderRadius: 14,
              backgroundColor: pressed ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)',
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
            })}
          >
            <MessageCircle size={16} color="rgba(255,255,255,0.6)" />
          </Pressable>
        </View>
      </View>
    </BlurView>
  );
}

export default function BrandDealsScreen() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchDeals = async () => {
    try {
      const res = await api.get('/deals/brand');
      setDeals(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchDeals(); }, []));

  const handleAccept = async (deal) => {
    try {
      await api.patch(`/deals/${deal.id}/accept`);
      fetchDeals();
    } catch (e) {
      Alert.alert('Ошибка', e.response?.data?.message || 'Не удалось принять');
    }
  };

  const handleComplete = (deal) => {
    Alert.alert('Завершить сделку', 'Вы удовлетворены отчетом? Это пометит сделку как завершенную.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Завершить',
        onPress: async () => {
          try {
            await api.patch(`/deals/${deal.id}/complete`);
            fetchDeals();
          } catch (e) {
            Alert.alert('Ошибка', 'Не удалось завершить сделку');
          }
        }
      },
    ]);
  };

  if (loading) {
    return <View style={{ flex: 1, backgroundColor: '#0A061E', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color="#60A5FA" size="large" /></View>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0A061E' }}>
      <FlatList
        data={deals}
        keyExtractor={(item) => String(item.id)}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingTop: 100, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchDeals(); }} tintColor="#60A5FA" />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', padding: 40 }}>
            <Text style={{ fontSize: 42 }}>📋</Text>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 12 }}>Нет активных сделок</Text>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 6, textAlign: 'center' }}>
              Создайте предложение, и блогеры подадут заявки.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <DealCard deal={item} onAccept={handleAccept} onComplete={handleComplete} router={router} />
        )}
      />
    </View>
  );
}
