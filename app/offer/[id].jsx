import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert, Image as RNImage } from 'react-native';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../../src/api/client';
import { Tag, DollarSign, Star, CheckCircle, ArrowLeft } from 'lucide-react-native';

const CATEGORY_MAP = {
  FASHION: 'Мода',
  FOOD: 'Еда',
  TECH: 'Техно',
  BEAUTY: 'Красота',
  FITNESS: 'Фитнес',
  TRAVEL: 'Путешествия',
  GAMING: 'Гейминг',
  LIFESTYLE: 'Стиль жизни',
};

const CATEGORY_COLORS = {
  fashion: '#F472B6', food: '#FBBF24', tech: '#60A5FA',
  beauty: '#A78BFA', fitness: '#34D399', travel: '#FB923C',
};

export default function OfferDetailScreen() {
  const { id } = useLocalSearchParams();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    api.get(`/offers/${id}`).then(r => setOffer(r.data)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.post(`/deals/apply/${id}`);
      Alert.alert('Заявка отправлена! 🎉', 'Бренд рассмотрит ваш профиль и свяжется с вами.', [
        { text: 'Мои сделки', onPress: () => router.push('/(blogger)/deals') },
        { text: 'ОК' },
      ]);
    } catch (e) {
      Alert.alert('Ошибка', e.response?.data?.message || 'Не удалось отправить заявку');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <View style={{ flex: 1, backgroundColor: '#0A061E', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color="#A78BFA" size="large" /></View>;
  }
  if (!offer) {
    return <View style={{ flex: 1, backgroundColor: '#0A061E', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#fff' }}>Предложение не найдено</Text></View>;
  }

  const catColor = CATEGORY_COLORS[offer.category?.toLowerCase()] || '#A78BFA';
  const catDisplay = CATEGORY_MAP[offer.category?.toUpperCase()] || offer.category;

  return (
    <View style={{ flex: 1, backgroundColor: '#0A061E' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={{ position: 'relative', height: offer.image_url ? 280 : 160 }}>
          {offer.image_url ? (
            <Image source={{ uri: offer.image_url }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          ) : (
            <View style={{ flex: 1, backgroundColor: `${catColor}18`, alignItems: 'center', justifyContent: 'center' }}>
              <Tag size={48} color={catColor} />
            </View>
          )}
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,6,30,0.4)' }} />
          <Pressable onPress={() => router.back()} style={{ position: 'absolute', top: 52, left: 20, width: 40, height: 40, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={20} color="#fff" />
          </Pressable>

          {/* Category Badge */}
          <View style={{ position: 'absolute', bottom: 16, left: 20, backgroundColor: `${catColor}33`, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: `${catColor}55` }}>
            <Text style={{ color: catColor, fontWeight: '700', fontSize: 12, textTransform: 'uppercase' }}>{catDisplay}</Text>
          </View>
        </View>

        <View style={{ padding: 24, gap: 20 }}>
          {/* Title & Value */}
          <View style={{ gap: 8 }}>
            <Text style={{ color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: -0.5 }}>{offer.title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <DollarSign size={16} color="#34D399" />
              <Text style={{ color: '#34D399', fontSize: 18, fontWeight: '800' }}>
                {offer.product_value ? `Ценность: $${offer.product_value}` : 'Бартерный обмен'}
              </Text>
            </View>
          </View>

          {/* Brand Card */}
          <BlurView tint="dark" intensity={40} style={{ borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(124,58,237,0.25)', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 22 }}>🏢</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>@{offer.brand?.ig_username}</Text>
              {offer.brand?.rating && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <Star size={12} color="#FBBF24" fill="#FBBF24" />
                  <Text style={{ color: '#FBBF24', fontSize: 12, fontWeight: '600' }}>{offer.brand.rating}</Text>
                </View>
              )}
            </View>
          </BlurView>

          {/* Description */}
          <View style={{ gap: 8 }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' }}>О предложении</Text>
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, lineHeight: 24 }}>{offer.description}</Text>
          </View>

          {/* Requirements */}
          {offer.requirements && (
            <View style={{ gap: 8 }}>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' }}>Требования</Text>
              {offer.requirements.split('\n').filter(Boolean).map((req, i) => (
                <View key={i} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                  <CheckCircle size={16} color="#A78BFA" style={{ marginTop: 2 }} />
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, flex: 1, lineHeight: 20 }}>{req}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Apply Button */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 34, paddingHorizontal: 24, paddingTop: 16 }}>
        <BlurView tint="dark" intensity={80} style={{ borderRadius: 24, overflow: 'hidden', borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
          <Pressable
            onPress={handleApply}
            disabled={applying}
            style={({ pressed }) => ({
              backgroundColor: applying ? 'rgba(124,58,237,0.5)' : pressed ? 'rgba(124,58,237,0.85)' : '#7C3AED',
              borderRadius: 20, paddingVertical: 16, alignItems: 'center', margin: 12,
            })}
          >
            {applying ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>Подать заявку</Text>}
          </Pressable>
        </BlurView>
      </View>
    </View>
  );
}
