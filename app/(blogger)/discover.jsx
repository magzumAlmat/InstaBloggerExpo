import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import api from '../../src/api/client';
import * as Haptics from 'expo-haptics';
import { Handshake, X, Star, Briefcase } from 'lucide-react-native';

const { width } = Dimensions.get('window');

function BrandCard({ brand }) {
  const router = useRouter();

  return (
    <View style={{ flex: 1, borderRadius: 32, overflow: 'hidden', backgroundColor: '#1A1030' }}>
      {brand?.avatar_url && brand.avatar_url !== '/uploads/avatars/default.jpg' ? (
        <Image source={{ uri: `http://172.20.10.7:3000${brand.avatar_url}` }} style={{ position: 'absolute', width: '100%', height: '100%' }} contentFit="cover" />
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1A1030' }}>
          <Text style={{ fontSize: 64 }}>🏢</Text>
        </View>
      )}

      {/* Glassmorphic overlay */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%' }}>
        <BlurView intensity={80} tint="dark" style={{ flex: 1, justifyContent: 'flex-end', padding: 24, gap: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' }}>
          <Text style={{ color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: -0.5 }}>
            @{brand.ig_username}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
            {brand.rating && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(251,191,36,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                <Star size={14} color="#FBBF24" fill="#FBBF24" />
                <Text style={{ color: '#FBBF24', fontSize: 13, fontWeight: '700' }}>{brand.rating}</Text>
              </View>
            )}
            {brand.category && (
              <View style={{ backgroundColor: 'rgba(96,165,250,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                <Text style={{ color: '#60A5FA', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' }}>
                  {brand.category === 'FASHION' ? 'Мода' : 
                   brand.category === 'FOOD' ? 'Еда' : 
                   brand.category === 'TECH' ? 'Техно' : 
                   brand.category === 'BEAUTY' ? 'Красота' : 
                   brand.category === 'FITNESS' ? 'Фитнес' : 
                   brand.category === 'TRAVEL' ? 'Путешествия' : 
                   brand.category === 'GAMING' ? 'Игры' : 'Лайфстайл'}
                </Text>
              </View>
            )}
          </View>
            
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 20, marginTop: 4 }} numberOfLines={3}>
            {brand.bio || "Бренд еще не добавил описание о себе."}
          </Text>

          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 12, paddingVertical: 14, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
            <Briefcase size={20} color="rgba(255,255,255,0.4)" />
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '700', marginTop: 4 }}>Партнерство</Text>
          </View>
        </BlurView>
      </View>
    </View>
  );
}

export default function DiscoverBrandScreen() {
  const CATEGORIES = [
    { id: 'ALL', label: 'Все' },
    { id: 'FASHION', label: 'Мода' },
    { id: 'FOOD', label: 'Еда' },
    { id: 'TECH', label: 'Техно' },
    { id: 'BEAUTY', label: 'Красота' },
    { id: 'FITNESS', label: 'Фитнес' },
    { id: 'TRAVEL', label: 'Путеш.' },
    { id: 'GAMING', label: 'Игры' },
    { id: 'LIFESTYLE', label: 'Лайфстайл' }
  ];

  const [stack, setStack] = useState([]);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');

  const fetchStack = async (category = activeCategory) => {
    try {
      setLoading(true);
      const res = await api.get(`/discovery/brands?category=${category}`);
      setStack(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchStack(activeCategory); }, []));

  const handleCategoryPress = (catId) => {
    setActiveCategory(catId);
    fetchStack(catId);
  };

  const swipe = async (direction) => {
    if (stack.length === 0 || swiping) return;
    setSwiping(true);
    const brand = stack[0];
    Haptics.impactAsync(direction === 'LIKE' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light);
    try {
      await api.post('/discovery/swipe', { targetId: brand.id, direction, role: 'BLOGGER' });
      setStack(prev => prev.slice(1));
    } catch (e) {
      console.error(e);
    } finally {
      setSwiping(false);
    }
  };

  const FilterUI = () => (
    <View style={{ marginBottom: 16 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
        {CATEGORIES.map(cat => (
          <Pressable
            key={cat.id}
            onPress={() => handleCategoryPress(cat.id)}
            style={{
              paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
              backgroundColor: activeCategory === cat.id ? 'rgba(96,165,250,0.35)' : 'rgba(255,255,255,0.07)',
              borderWidth: 1, borderColor: activeCategory === cat.id ? 'rgba(96,165,250,0.6)' : 'rgba(255,255,255,0.1)'
            }}
          >
            <Text style={{ color: activeCategory === cat.id ? '#60A5FA' : 'rgba(255,255,255,0.5)', fontWeight: '700', fontSize: 13 }}>
              {cat.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A061E', paddingTop: 100 }}>
        <FilterUI />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#60A5FA" size="large" />
        </View>
      </View>
    );
  }

  if (stack.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A061E', paddingTop: 100 }}>
        <FilterUI />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Text style={{ fontSize: 56 }}>🏢</Text>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center', marginTop: 20 }}>Больше никого!</Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, textAlign: 'center', marginTop: 8, lineHeight: 22 }}>
            Вы просмотрели все доступные бренды в этой категории. Заходите позже.
          </Text>
          <Pressable onPress={() => fetchStack(activeCategory)} style={{ marginTop: 24, backgroundColor: 'rgba(96,165,250,0.25)', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(96,165,250,0.4)' }}>
            <Text style={{ color: '#60A5FA', fontWeight: '700', fontSize: 15 }}>Обновить →</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const current = stack[0];

  return (
    <View style={{ flex: 1, backgroundColor: '#0A061E', paddingTop: 100, paddingBottom: 120 }}>
      <FilterUI />
      
      <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: '600', textAlign: 'center', marginBottom: 16, paddingHorizontal: 20 }}>
        {stack.length} брендов для просмотра
      </Text>
      
      {/* Card Stack */}
      <View style={{ flex: 1, position: 'relative', paddingHorizontal: 20 }}>
        {stack[1] && (
          <View style={{ position: 'absolute', top: 8, left: 28, right: 28, bottom: 0, borderRadius: 32, overflow: 'hidden', opacity: 0.5, transform: [{ scale: 0.95 }] }}>
            <BrandCard brand={stack[1]} />
          </View>
        )}
        <View style={{ position: 'absolute', top: 50, right: 40, opacity: 0, transform: [{ rotate: '15deg' }], zIndex: 10 }}>
          <View style={{ borderWidth: 4, borderColor: '#34D399', borderRadius: 12, padding: 8 }}>
            <Text style={{ color: '#34D399', fontSize: 32, fontWeight: '800', textTransform: 'uppercase' }}>MATCH</Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <BrandCard brand={current} />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24, paddingTop: 20 }}>
        <Pressable
          onPress={() => swipe('DISLIKE')}
          style={({ pressed }) => ({
            width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center',
            backgroundColor: pressed ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.15)',
            borderWidth: 1.5, borderColor: 'rgba(239,68,68,0.4)',
          })}
        >
          <X size={30} color="#EF4444" />
        </Pressable>
        <Pressable
          onPress={() => swipe('LIKE')}
          style={({ pressed }) => ({
            width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center',
            backgroundColor: pressed ? 'rgba(52,211,153,0.3)' : 'rgba(52,211,153,0.15)',
            borderWidth: 1.5, borderColor: 'rgba(52,211,153,0.4)',
          })}
        >
          <Handshake size={30} color="#34D399" />
        </Pressable>
      </View>
    </View>
  );
}
