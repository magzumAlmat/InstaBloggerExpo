import React, { useCallback, useState } from 'react';
import { View, Text, ActivityIndicator, RefreshControl, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
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
import { Tag, DollarSign, ChevronRight } from 'lucide-react-native';

const CATEGORY_COLORS = {
  fashion: '#F472B6',
  food: '#FBBF24',
  tech: '#60A5FA',
  beauty: '#A78BFA',
  fitness: '#34D399',
  travel: '#FB923C',
};

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

function OfferCard({ offer, onPress, index }) {
  const catColor = CATEGORY_COLORS[offer.category?.toLowerCase()] || '#A78BFA';
  const catDisplay = CATEGORY_MAP[offer.category?.toUpperCase()] || offer.category;
  
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 10, stiffness: 100 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
      <Pressable 
        onPress={onPress} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <BlurView tint="dark" intensity={45} style={{ borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' }}>
          {offer.image_url ? (
            <Image source={{ uri: offer.image_url }} style={{ width: '100%', height: 160 }} contentFit="cover" />
          ) : (
            <View style={{ width: '100%', height: 80, backgroundColor: `${catColor}18`, alignItems: 'center', justifyContent: 'center' }}>
              <Tag size={28} color={catColor} />
            </View>
          )}
          <View style={{ padding: 18, gap: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Text style={{ color: '#fff', fontSize: 17, fontWeight: '800', flex: 1, marginRight: 8 }} numberOfLines={1}>{offer.title}</Text>
              <View style={{ backgroundColor: `${catColor}22`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }}>
                <Text style={{ color: catColor, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>{catDisplay}</Text>
              </View>
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 20 }} numberOfLines={2}>{offer.description}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', padding: 6, borderRadius: 8 }}>
                  <DollarSign size={14} color="#34D399" />
                </View>
                <Text style={{ color: '#34D399', fontWeight: '800', fontSize: 16 }}>
                  {offer.product_value ? `$${offer.product_value}` : 'Бартер'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>@{offer.brand?.ig_username}</Text>
                <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
              </View>
            </View>
          </View>
        </BlurView>
      </Pressable>
    </Animated.View>
  );
}

export default function OffersScreen() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchOffers = async () => {
    try {
      const res = await api.get('/offers');
      setOffers(res.data.rows || res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchOffers(); }, []));

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
        data={offers}
        keyExtractor={(item) => String(item.id)}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingTop: 100, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        itemLayoutAnimation={Layout.springify()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchOffers(); }} tintColor="#A78BFA" />}
        ListEmptyComponent={
          <Animated.View entering={FadeInDown} style={{ alignItems: 'center', padding: 40 }}>
            <Text style={{ fontSize: 42 }}>🔍</Text>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 12 }}>Нет предложений</Text>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 6, textAlign: 'center' }}>
              Заходите позже — бренды добавляют новые офферы.
            </Text>
          </Animated.View>
        }
        renderItem={({ item, index }) => (
          <OfferCard
            offer={item}
            index={index}
            onPress={() => router.push(`/offer/${item.id}`)}
          />
        )}
      />
    </View>
  );
}
