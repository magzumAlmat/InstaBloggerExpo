import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, ActivityIndicator, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../src/context/AuthContext';
import api from '../src/api/client';
import { useRouter } from 'expo-router';
import { Camera, User, X, Check, Image as ImageIcon, Video, Trash2 } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

export default function EditProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    ig_username: user?.ig_username || '',
    bio: user?.bio || '',
    avatar_url: user?.avatar_url || '',
    followers_count: user?.followers_count ? String(user.followers_count) : '',
    stories_views_percent: user?.stories_views_percent ? String(user.stories_views_percent) : '',
    reels_views_percent: user?.reels_views_percent ? String(user.reels_views_percent) : '',
    likes_percent: user?.likes_percent ? String(user.likes_percent) : '',
    reach: user?.reach ? String(user.reach) : '',
    impressions: user?.impressions ? String(user.impressions) : '',
    engagement_rate: user?.engagement_rate ? String(user.engagement_rate) : '',
  });
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchPortfolio();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      setProfile({
        ig_username: res.data.ig_username || '',
        bio: res.data.bio || '',
        avatar_url: res.data.avatar_url || '',
        followers_count: res.data.followers_count ? String(res.data.followers_count) : '',
        stories_views_percent: res.data.stories_views_percent ? String(res.data.stories_views_percent) : '',
        reels_views_percent: res.data.reels_views_percent ? String(res.data.reels_views_percent) : '',
        likes_percent: res.data.likes_percent ? String(res.data.likes_percent) : '',
        reach: res.data.reach ? String(res.data.reach) : '',
        impressions: res.data.impressions ? String(res.data.impressions) : '',
        engagement_rate: res.data.engagement_rate ? String(res.data.engagement_rate) : '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchPortfolio = async () => {
    if (user?.role !== 'BLOGGER') return;
    try {
      const res = await api.get('/portfolio/me');
      setPortfolio(res.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      uploadAvatar(result.assets[0].uri);
    }
  };

  const uploadAvatar = async (uri) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('avatar', {
      uri,
      name: 'avatar.jpg',
      type: 'image/jpeg',
    });

    try {
      const res = await api.post('/auth/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile({ ...profile, avatar_url: res.data.avatar_url });
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить аватар');
    } finally {
      setLoading(false);
    }
  };

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      uploadPortfolioMedia(result.assets[0]);
    }
  };

  const uploadPortfolioMedia = async (asset) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('media', {
      uri: asset.uri,
      name: asset.fileName || (asset.type === 'video' ? 'video.mp4' : 'image.jpg'),
      type: asset.type === 'video' ? 'video/mp4' : 'image/jpeg',
    });

    try {
      await api.post('/portfolio/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchPortfolio();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить медиа');
    } finally {
      setLoading(false);
    }
  };

  const deletePortfolioMedia = async (id) => {
    try {
      await api.delete(`/portfolio/${id}`);
      setPortfolio(portfolio.filter(item => item.id !== id));
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить медиа');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        ig_username: profile.ig_username,
        bio: profile.bio,
      };
      if (user?.role === 'BLOGGER') {
        Object.assign(payload, {
          followers_count: profile.followers_count ? Number(profile.followers_count) : undefined,
          stories_views_percent: profile.stories_views_percent ? Number(profile.stories_views_percent) : undefined,
          reels_views_percent: profile.reels_views_percent ? Number(profile.reels_views_percent) : undefined,
          likes_percent: profile.likes_percent ? Number(profile.likes_percent) : undefined,
          reach: profile.reach ? Number(profile.reach) : undefined,
          impressions: profile.impressions ? Number(profile.impressions) : undefined,
          engagement_rate: profile.engagement_rate ? Number(profile.engagement_rate) : undefined,
        });
      }
      await api.patch('/auth/profile', payload);
      router.back();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось обновить профиль');
    } finally {
      setLoading(false);
    }
  };

  const getFullUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `http://172.20.10.7:3000${url}`;
  };

  return (
    <View style={styles.container}>
      <BlurView tint="dark" intensity={90} style={StyleSheet.absoluteFill} />
      
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Редактирование</Text>
            <Pressable onPress={() => router.back()} style={styles.closeButton}>
              <X size={24} color="#fff" />
            </Pressable>
          </View>

          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <Pressable onPress={pickAvatar} style={styles.avatarContainer}>
              {profile.avatar_url ? (
                <Image source={{ uri: getFullUrl(profile.avatar_url) }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <User size={50} color="rgba(255,255,255,0.3)" />
                </View>
              )}
              <View style={styles.cameraIconContainer}>
                <Camera size={16} color="#fff" />
              </View>
            </Pressable>
            <Text style={styles.avatarLabel}>Нажмите, чтобы изменить фото</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Instagram Username</Text>
              <TextInput
                style={styles.input}
                value={profile.ig_username}
                onChangeText={(text) => setProfile({ ...profile, ig_username: text })}
                placeholder="@username"
                placeholderTextColor="rgba(255,255,255,0.3)"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>О себе (Bio)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={profile.bio}
                onChangeText={(text) => setProfile({ ...profile, bio: text })}
                placeholder="Расскажите о себе..."
                placeholderTextColor="rgba(255,255,255,0.3)"
                multiline
                numberOfLines={4}
              />
            </View>

            {user?.role === 'BLOGGER' && (
              <>
                <Text style={[styles.title, { fontSize: 20, marginTop: 10 }]}>Метрики Instagram</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Подписчики</Text>
                  <TextInput style={styles.input} value={profile.followers_count} onChangeText={(t) => setProfile({ ...profile, followers_count: t })} placeholder="Например: 150000" placeholderTextColor="rgba(255,255,255,0.3)" keyboardType="numeric" />
                </View>
                
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Сторис (%)</Text>
                    <TextInput style={styles.input} value={profile.stories_views_percent} onChangeText={(t) => setProfile({ ...profile, stories_views_percent: t })} placeholder="12.5" placeholderTextColor="rgba(255,255,255,0.3)" keyboardType="numeric" />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Рилс (%)</Text>
                    <TextInput style={styles.input} value={profile.reels_views_percent} onChangeText={(t) => setProfile({ ...profile, reels_views_percent: t })} placeholder="38.0" placeholderTextColor="rgba(255,255,255,0.3)" keyboardType="numeric" />
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Лайки (%)</Text>
                    <TextInput style={styles.input} value={profile.likes_percent} onChangeText={(t) => setProfile({ ...profile, likes_percent: t })} placeholder="8.5" placeholderTextColor="rgba(255,255,255,0.3)" keyboardType="numeric" />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Вовлеченность (%)</Text>
                    <TextInput style={styles.input} value={profile.engagement_rate} onChangeText={(t) => setProfile({ ...profile, engagement_rate: t })} placeholder="5.2" placeholderTextColor="rgba(255,255,255,0.3)" keyboardType="numeric" />
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Охват</Text>
                    <TextInput style={styles.input} value={profile.reach} onChangeText={(t) => setProfile({ ...profile, reach: t })} placeholder="18750" placeholderTextColor="rgba(255,255,255,0.3)" keyboardType="numeric" />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Просмотры</Text>
                    <TextInput style={styles.input} value={profile.impressions} onChangeText={(t) => setProfile({ ...profile, impressions: t })} placeholder="28125" placeholderTextColor="rgba(255,255,255,0.3)" keyboardType="numeric" />
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Portfolio Section (Only for Bloggers) */}
          {user?.role === 'BLOGGER' && (
            <View style={styles.portfolioSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Портфолио (Фото/Видео)</Text>
                <Pressable onPress={pickMedia} style={styles.addButton}>
                  <ImageIcon size={18} color="#A78BFA" />
                  <Text style={styles.addButtonText}>Добавить</Text>
                </Pressable>
              </View>

              <View style={styles.mediaGrid}>
                {portfolio.map((item) => (
                  <View key={item.id} style={styles.mediaItem}>
                    <Image source={{ uri: getFullUrl(item.media_url) }} style={styles.media} />
                    {item.media_type === 'VIDEO' && (
                      <View style={styles.videoBadge}>
                        <Video size={12} color="#fff" />
                      </View>
                    )}
                    <Pressable
                      onPress={() => deletePortfolioMedia(item.id)}
                      style={styles.deleteMediaButton}
                    >
                      <Trash2 size={14} color="#EF4444" />
                    </Pressable>
                  </View>
                ))}
                {portfolio.length === 0 && (
                  <View style={styles.emptyPortfolio}>
                    <Text style={styles.emptyText}>Добавьте ваши лучшие работы</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer Action */}
        <View style={styles.footer}>
          <Pressable
            onPress={handleSave}
            disabled={loading}
            style={({ pressed }) => [
              styles.saveButton,
              pressed && { opacity: 0.8 },
              loading && { backgroundColor: 'rgba(167,139,250,0.5)' }
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Check size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Сохранить изменения</Text>
              </>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A061E',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  closeButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#A78BFA',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(167,139,250,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#A78BFA',
    padding: 8,
    borderTopLeftRadius: 15,
  },
  avatarLabel: {
    marginTop: 12,
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
  },
  form: {
    gap: 20,
    marginBottom: 40,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  portfolioSection: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(167,139,250,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#A78BFA',
    fontSize: 14,
    fontWeight: '600',
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mediaItem: {
    width: (Platform.OS === 'web' ? 100 : 100), // Should adjust for screen width
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  videoBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 4,
    borderRadius: 6,
  },
  deleteMediaButton: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(239,68,68,0.2)',
    padding: 6,
    borderRadius: 8,
  },
  emptyPortfolio: {
    width: '100%',
    padding: 30,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: 'rgba(10,6,30,0.8)',
  },
  saveButton: {
    backgroundColor: '#7C3AED',
    height: 56,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
