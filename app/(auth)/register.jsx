import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, Alert,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { Mail, Lock, AtSign, User, Briefcase } from 'lucide-react-native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [igUsername, setIgUsername] = useState('');
  const [role, setRole] = useState('BLOGGER'); // 'BLOGGER' | 'BRAND'
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !igUsername) return Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
    setLoading(true);
    try {
      await register(email.trim(), password, role, igUsername.trim());
      Alert.alert('Успех! 🎉', 'Аккаунт создан. Пожалуйста, войдите.', [
        { text: 'ОК', onPress: () => router.replace('/(auth)/login') },
      ]);
    } catch (e) {
      Alert.alert('Ошибка', e.response?.data?.message || 'Регистрация не удалась');
    } finally {
      setLoading(false);
    }
  };

  const RoleTab = ({ value, label, icon: Icon }) => (
    <Pressable
      onPress={() => setRole(value)}
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: role === value ? 'rgba(124,58,237,0.8)' : 'transparent',
      }}
    >
      <Icon size={16} color={role === value ? '#fff' : 'rgba(255,255,255,0.4)'} />
      <Text style={{ color: role === value ? '#fff' : 'rgba(255,255,255,0.4)', fontWeight: '700', fontSize: 14 }}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require('../../assets/images/background.png')}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        contentFit="cover"
      />
      <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(10,6,30,0.65)' }} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
          <Text style={{ color: '#A78BFA', fontSize: 13, fontWeight: '700', letterSpacing: 3, textTransform: 'uppercase', textAlign: 'center', marginBottom: 8 }}>
            InstaBlogger
          </Text>
          <Text style={{ color: '#fff', fontSize: 30, fontWeight: '800', textAlign: 'center', letterSpacing: -0.5, marginBottom: 8 }}>
            Создать аккаунт
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, textAlign: 'center', marginBottom: 36 }}>
            Присоединяйтесь к рынку инфлюенсеров
          </Text>

          <BlurView tint="dark" intensity={50} style={{ borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', padding: 24, gap: 16 }}>
            {/* Role Selector */}
            <View>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 8 }}>Я —</Text>
              <View style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 16, padding: 4 }}>
                <RoleTab value="BLOGGER" label="Блогер" icon={User} />
                <RoleTab value="BRAND" label="Бренд" icon={Briefcase} />
              </View>
            </View>

            {/* IG Username */}
            <View>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 8 }}>
                {role === 'BLOGGER' ? 'INSTAGRAM USERNAME' : 'НАЗВАНИЕ БРЕНДА'}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 14 }}>
                <AtSign size={18} color="rgba(255,255,255,0.3)" />
                <TextInput
                  style={{ flex: 1, color: '#fff', fontSize: 15, paddingVertical: 14, paddingLeft: 10 }}
                  placeholder={role === 'BLOGGER' ? 'ваш_никнейм' : 'ВашБренд'}
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  value={igUsername}
                  onChangeText={setIgUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Email */}
            <View>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 8 }}>EMAIL</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 14 }}>
                <Mail size={18} color="rgba(255,255,255,0.3)" />
                <TextInput
                  style={{ flex: 1, color: '#fff', fontSize: 15, paddingVertical: 14, paddingLeft: 10 }}
                  placeholder="вы@пример.com"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password */}
            <View>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 8 }}>ПАРОЛЬ</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 14 }}>
                <Lock size={18} color="rgba(255,255,255,0.3)" />
                <TextInput
                  style={{ flex: 1, color: '#fff', fontSize: 15, paddingVertical: 14, paddingLeft: 10 }}
                  placeholder="Мин. 6 символов"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <Pressable
              onPress={handleRegister}
              disabled={loading}
              style={({ pressed }) => ({
                backgroundColor: loading ? 'rgba(124,58,237,0.5)' : pressed ? 'rgba(124,58,237,0.85)' : 'rgba(124,58,237,1)',
                borderRadius: 18,
                paddingVertical: 16,
                alignItems: 'center',
                marginTop: 4,
              })}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>Создать аккаунт</Text>}
            </Pressable>
          </BlurView>

          <Pressable onPress={() => router.back()} style={{ marginTop: 24, alignItems: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>
              Уже есть аккаунт? <Text style={{ color: '#A78BFA', fontWeight: '700' }}>Войти</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
