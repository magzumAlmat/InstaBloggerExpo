import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import api from '../../src/api/client';
import { useRouter } from 'expo-router';
import { Tag, DollarSign, FileText, CheckSquare, Image as ImageIcon } from 'lucide-react-native';

const CATEGORIES = ['Мода', 'Еда', 'Техно', 'Красота', 'Фитнес', 'Путешествия', 'Гейминг', 'Стиль жизни'];
const CATEGORY_MAP_REVERSE = {
  'Мода': 'FASHION',
  'Еда': 'FOOD',
  'Техно': 'TECH',
  'Красота': 'BEAUTY',
  'Фитнес': 'FITNESS',
  'Путешествия': 'TRAVEL',
  'Гейминг': 'GAMING',
  'Стиль жизни': 'LIFESTYLE',
};

function FormField({ label, children }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' }}>{label}</Text>
      {children}
    </View>
  );
}

const inputStyle = {
  backgroundColor: 'rgba(255,255,255,0.07)',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.1)',
  color: '#fff',
  fontSize: 15,
  paddingHorizontal: 16,
  paddingVertical: 14,
};

export default function CreateOfferScreen() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    product_value: '',
    requirements: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const set = (key) => (val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleCreate = async () => {
    if (!form.title || !form.description || !form.category) {
      return Alert.alert('Заполните все поля', 'Заголовок, описание и категория обязательны.');
    }
    setLoading(true);
    try {
      await api.post('/offers', {
        ...form,
        product_value: form.product_value ? Number(form.product_value) : null,
      });
      Alert.alert('Предложение создано! 🎉', 'Блогеры теперь могут находить и подавать заявки на ваш оффер.', [
        { text: 'К сделкам', onPress: () => router.push('/(brand)/deals') },
        { text: 'Создать еще', onPress: () => setForm({ title: '', description: '', category: '', product_value: '', requirements: '', image_url: '' }) },
      ]);
    } catch (e) {
      Alert.alert('Ошибка', e.response?.data?.message || 'Не удалось создать предложение');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#0A061E' }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingTop: 100, paddingHorizontal: 24, paddingBottom: 120, gap: 24 }} showsVerticalScrollIndicator={false}>
        <FormField label="Заголовок оффера *">
          <TextInput style={inputStyle} placeholder="напр. Коллаборация в стиле Fashion" placeholderTextColor="rgba(255,255,255,0.2)" value={form.title} onChangeText={set('title')} />
        </FormField>

        <FormField label="Категория *">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {CATEGORIES.map(cat => (
              <Pressable
                key={cat}
                onPress={() => set('category')(CATEGORY_MAP_REVERSE[cat])}
                style={{
                  paddingHorizontal: 16, paddingVertical: 9, borderRadius: 14,
                  backgroundColor: form.category === CATEGORY_MAP_REVERSE[cat] ? 'rgba(96,165,250,0.35)' : 'rgba(255,255,255,0.07)',
                  borderWidth: 1,
                  borderColor: form.category === CATEGORY_MAP_REVERSE[cat] ? 'rgba(96,165,250,0.6)' : 'rgba(255,255,255,0.1)',
                }}
              >
                <Text style={{ color: form.category === CATEGORY_MAP_REVERSE[cat] ? '#60A5FA' : 'rgba(255,255,255,0.5)', fontWeight: '700', fontSize: 13 }}>{cat}</Text>
              </Pressable>
            ))}
          </View>
        </FormField>

        <FormField label="Описание *">
          <TextInput
            style={[inputStyle, { minHeight: 100, textAlignVertical: 'top' }]}
            placeholder="Опишите, что включает в себя сотрудничество..."
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={form.description}
            onChangeText={set('description')}
            multiline
          />
        </FormField>

        <FormField label="Ценность продукта (USD)">
          <TextInput
            style={inputStyle}
            placeholder="напр. 150"
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={form.product_value}
            onChangeText={set('product_value')}
            keyboardType="numeric"
          />
        </FormField>

        <FormField label="Требования">
          <TextInput
            style={[inputStyle, { minHeight: 80, textAlignVertical: 'top' }]}
            placeholder="Одно требование на строку..."
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={form.requirements}
            onChangeText={set('requirements')}
            multiline
          />
        </FormField>

        <FormField label="URL обложки (опционально)">
          <TextInput
            style={inputStyle}
            placeholder="https://..."
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={form.image_url}
            onChangeText={set('image_url')}
            autoCapitalize="none"
            keyboardType="url"
          />
        </FormField>

        <Pressable
          onPress={handleCreate}
          disabled={loading}
          style={({ pressed }) => ({
            backgroundColor: loading ? 'rgba(96,165,250,0.4)' : pressed ? 'rgba(37,99,235,0.85)' : '#2563EB',
            borderRadius: 20, paddingVertical: 16, alignItems: 'center',
          })}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>Опубликовать предложение</Text>}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
