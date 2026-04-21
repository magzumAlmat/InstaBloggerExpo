import React, { useCallback, useState } from 'react';
import { View, Text, ActivityIndicator, RefreshControl, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { useFocusEffect, useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  FadeInDown,
  Layout
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import api from '../../src/api/client';
import { CheckCircle, Clock, Send, XCircle, MessageCircle } from 'lucide-react-native';

const STATUS_META = {
  REQUESTED: { label: 'Заявка', color: '#FBBF24', icon: Clock },
  ACCEPTED:  { label: 'Принято', color: '#34D399', icon: CheckCircle },
  REPORTED:  { label: 'Отчет отправлен', color: '#60A5FA', icon: Send },
  COMPLETED: { label: 'Завершено', color: '#A78BFA', icon: CheckCircle },
  REJECTED:  { label: 'Отклонено', color: '#EF4444', icon: XCircle },
};

function DealCard({ deal, onSubmitReport, router, index }) {
  const meta = STATUS_META[deal.status] || STATUS_META.REQUESTED;
  const Icon = meta.icon;

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 10, stiffness: 100 });
    Haptics.selectionAsync();
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
  };

  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).springify()}
      layout={Layout.springify()}
      style={[{ marginHorizontal: 20, marginBottom: 14 }, animatedStyle]}
    >
      <BlurView tint="dark" intensity={45} style={{ borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' }}>
        <View style={{ padding: 18, gap: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text style={{ color: '#fff', fontSize: 17, fontWeight: '800', flex: 1, marginRight: 10 }} numberOfLines={1}>
              {deal.offer?.title}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: `${meta.color}22`, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 }}>
              <Icon size={12} color={meta.color} />
              <Text style={{ color: meta.color, fontSize: 11, fontWeight: '700' }}>{meta.label}</Text>
            </View>
          </View>

          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
            Бренд: @{deal.offer?.brand?.ig_username || 'неизвестно'}
          </Text>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
            {deal.status === 'ACCEPTED' && (
              <Pressable
                onPress={() => onSubmitReport(deal)}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={({ pressed }) => ({
                  flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                  gap: 8, paddingVertical: 12, borderRadius: 16,
                  backgroundColor: pressed ? 'rgba(96,165,250,0.3)' : 'rgba(96,165,250,0.15)',
                  borderWidth: 1, borderColor: 'rgba(96,165,250,0.3)',
                })}
              >
                <Send size={16} color="#60A5FA" />
                <Text style={{ color: '#60A5FA', fontWeight: '800', fontSize: 14 }}>Отправить отчет</Text>
              </Pressable>
            )}
            <Pressable
              onPress={() => router.push(`/messages/${deal.id}`)}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={({ pressed }) => ({
                flex: deal.status === 'ACCEPTED' ? 0 : 1, paddingHorizontal: 20,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                gap: 8, paddingVertical: 12, borderRadius: 16,
                backgroundColor: pressed ? 'rgba(167,139,250,0.3)' : 'rgba(167,139,250,0.12)',
                borderWidth: 1, borderColor: 'rgba(167,139,250,0.25)',
              })}
            >
              <MessageCircle size={17} color="#A78BFA" />
              <Text style={{ color: '#A78BFA', fontWeight: '800', fontSize: 14 }}>{deal.status === 'ACCEPTED' ? '' : 'Открыть чат'}</Text>
            </Pressable>
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );
}

export default function DealsScreen() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchDeals = async () => {
    try {
      const res = await api.get('/deals/my');
      setDeals(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchDeals(); }, []));

  const handleSubmitReport = (deal) => {
    router.push(`/report/${deal.id}`);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A061E', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#A78BFA" size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0A061E' }}>
      <Animated.FlatList
        data={deals}
        keyExtractor={(item) => String(item.id)}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingTop: 100, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        itemLayoutAnimation={Layout.springify()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchDeals(); }} tintColor="#A78BFA" />}
        ListEmptyComponent={
          <Animated.View entering={FadeInDown} style={{ alignItems: 'center', padding: 40 }}>
            <Text style={{ fontSize: 42 }}>📋</Text>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 12 }}>У вас пока нет сделок</Text>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 6, textAlign: 'center' }}>
              Подавайте заявки на предложения, чтобы начать сотрудничество с брендами.
            </Text>
            <Animated.View entering={FadeInDown.delay(300)}>
              <Pressable 
                onPress={() => router.push('/(blogger)/offers')} 
                style={({ pressed }) => ({ 
                  marginTop: 20, 
                  backgroundColor: pressed ? 'rgba(124,58,237,0.5)' : 'rgba(124,58,237,0.3)', 
                  paddingHorizontal: 24, 
                  paddingVertical: 14, 
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: 'rgba(124,58,237,0.4)'
                })}
              >
                <Text style={{ color: '#C4B5FD', fontWeight: '800' }}>Просмотреть предложения →</Text>
              </Pressable>
            </Animated.View>
          </Animated.View>
        }
        renderItem={({ item, index }) => (
          <DealCard deal={item} index={index} onSubmitReport={handleSubmitReport} router={router} />
        )}
      />
    </View>
  );
}
