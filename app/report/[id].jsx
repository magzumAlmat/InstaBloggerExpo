import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api, { API_URL } from '../../src/api/client';
import * as SecureStore from 'expo-secure-store';
import { Link2, Camera, CheckCircle, ArrowLeft } from 'lucide-react-native';

export default function ReportScreen() {
  const { id } = useLocalSearchParams();
  const [link, setLink] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) setImage(result.assets[0]);
  };

  const handleSubmit = async () => {
    if (!link) return Alert.alert('Внимание', 'Пожалуйста, добавьте ссылку на контент');
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('token');
      const formData = new FormData();
      formData.append('report_link', link);
      if (image) {
        const uri = image.uri;
        const name = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(name);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        formData.append('screenshot', { uri, name, type });
      }

      await fetch(`${API_URL}/deals/${id}/report`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      Alert.alert('Отправлено! ✅', 'Ваш отчет был отправлен бренду на проверку.', [
        { text: 'К сделкам', onPress: () => router.replace('/(blogger)/deals') },
      ]);
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось отправить отчет. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0A061E' }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <ArrowLeft size={20} color="rgba(255,255,255,0.6)" />
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15 }}>Назад к сделкам</Text>
        </Pressable>

        <Text style={{ color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: -0.5, marginBottom: 6 }}>Отправить отчет</Text>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: 32 }}>
          Подтвердите выполнение работы для завершения сделки
        </Text>

        <BlurView tint="dark" intensity={40} style={{ borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', padding: 20, gap: 20 }}>
          {/* Link input */}
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>
              Ссылка на контент *
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 14 }}>
              <Link2 size={18} color="rgba(255,255,255,0.3)" />
              <TextInput
                style={{ flex: 1, color: '#fff', fontSize: 15, paddingVertical: 14, paddingLeft: 10 }}
                placeholder="https://instagram.com/p/..."
                placeholderTextColor="rgba(255,255,255,0.2)"
                value={link}
                onChangeText={setLink}
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>
          </View>

          {/* Screenshot picker */}
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>
              Скриншот (опционально)
            </Text>
            <Pressable
              onPress={pickImage}
              style={({ pressed }) => ({
                borderRadius: 18, borderWidth: 2, borderColor: image ? '#A78BFA' : 'rgba(255,255,255,0.1)',
                borderStyle: image ? 'solid' : 'dashed', overflow: 'hidden',
                height: 200, alignItems: 'center', justifyContent: 'center',
                opacity: pressed ? 0.8 : 1,
              })}
            >
              {image ? (
                <Image source={{ uri: image.uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
              ) : (
                <View style={{ alignItems: 'center', gap: 10 }}>
                  <Camera size={36} color="rgba(255,255,255,0.25)" />
                  <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Нажмите, чтобы загрузить скриншот</Text>
                </View>
              )}
            </Pressable>
          </View>
        </BlurView>
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24 }}>
        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          style={({ pressed }) => ({
            backgroundColor: loading ? 'rgba(124,58,237,0.5)' : pressed ? 'rgba(124,58,237,0.85)' : '#7C3AED',
            borderRadius: 20, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8,
          })}
        >
          {loading ? <ActivityIndicator color="#fff" /> : (
            <>
              <CheckCircle size={20} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>Отправить отчет</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}
