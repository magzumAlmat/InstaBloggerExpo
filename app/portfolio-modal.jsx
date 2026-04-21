import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { Video, ResizeMode } from 'expo-av';
import api from '../src/api/client';
import { X, User, Star, Users, Activity, Eye, Play } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function PortfolioModalScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [blogger, setBlogger] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/discovery/blogger/${id}`)
        .then(res => setBlogger(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const getFullUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `http://172.20.10.7:3000${url}`;
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A061E', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#A78BFA" size="large" />
      </View>
    );
  }

  if (!blogger) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A061E', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 18 }}>Блогер не найден</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 20, padding: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 }}>
          <Text style={{ color: '#fff' }}>Закрыть</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0A061E' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: Platform.OS === 'ios' ? 60 : 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' }}>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>@{blogger.ig_username}</Text>
        <Pressable onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}>
          <X size={24} color="#fff" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <BlurView tint="dark" intensity={40} style={{ borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', padding: 20, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <View style={{ width: 70, height: 70, borderRadius: 25, backgroundColor: 'rgba(167,139,250,0.2)', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 2, borderColor: '#A78BFA' }}>
              {blogger.avatar_url ? (
                <Image source={{ uri: getFullUrl(blogger.avatar_url) }} style={{ width: '100%', height: '100%' }} />
              ) : (
                <User size={30} color="#A78BFA" />
              )}
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              {blogger.rating && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Star size={14} color="#FBBF24" fill="#FBBF24" />
                  <Text style={{ color: '#FBBF24', fontSize: 16, fontWeight: '800' }}>{blogger.rating}</Text>
                </View>
              )}
              {blogger.bio && (
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 18 }} numberOfLines={4}>
                  {blogger.bio}
                </Text>
              )}
            </View>
          </View>

          {/* Metrics */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {blogger.followers_count && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(96,165,250,0.15)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 }}>
                <Users size={16} color="#60A5FA" />
                <Text style={{ color: '#60A5FA', fontSize: 14, fontWeight: '700' }}>{blogger.followers_count >= 1000 ? (blogger.followers_count/1000).toFixed(1)+'k' : blogger.followers_count}</Text>
              </View>
            )}
            {blogger.engagement_rate && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(52,211,153,0.15)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 }}>
                <Activity size={16} color="#34D399" />
                <Text style={{ color: '#34D399', fontSize: 14, fontWeight: '700' }}>{blogger.engagement_rate}% ER</Text>
              </View>
            )}
            {blogger.reach && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(167,139,250,0.15)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 }}>
                <Eye size={16} color="#A78BFA" />
                <Text style={{ color: '#A78BFA', fontSize: 14, fontWeight: '700' }}>~{blogger.reach >= 1000 ? (blogger.reach/1000).toFixed(1)+'k' : blogger.reach} охват</Text>
              </View>
            )}
          </View>
        </BlurView>

        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 16 }}>Портфолио</Text>

        {blogger.portfolio && blogger.portfolio.length > 0 ? (
          <View style={{ gap: 24 }}>
            {blogger.portfolio.map((project, idx) => (
              <BlurView key={project.id || idx} tint="dark" intensity={30} style={{ borderRadius: 32, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                {project.title && (
                  <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 8, letterSpacing: -0.3 }}>{project.title}</Text>
                )}
                {project.description && (
                  <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 22, marginBottom: 20 }}>
                    {project.description}
                  </Text>
                )}

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
                  {project.attachments && project.attachments.map((att, aIdx) => (
                    <View key={aIdx} style={{ width: 220, height: 280, borderRadius: 16, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                      {att.media_type === 'VIDEO' ? (
                        <View style={{ flex: 1 }}>
                          <Video
                            source={{ uri: getFullUrl(att.media_url) }}
                            style={{ flex: 1 }}
                            useNativeControls={false}
                            resizeMode={ResizeMode.COVER}
                            shouldPlay
                            isLooping
                            isMuted
                          />
                          <View style={{ position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.5)', padding: 6, borderRadius: 10 }}>
                            <Play size={14} color="#fff" />
                          </View>
                        </View>
                      ) : (
                        <Image source={{ uri: getFullUrl(att.media_url) }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                      )}
                    </View>
                  ))}
                </ScrollView>
              </BlurView>
            ))}
          </View>
        ) : (
          <View style={{ padding: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 24 }}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>Нет работ в портфолио</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
