import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, Alert,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      if (user.role === 'ADMIN') router.replace('/(admin)/dashboard');
      else if (user.role === 'BLOGGER') router.replace('/(blogger)/offers');
      else router.replace('/(brand)/discover');
    } catch (e) {
      Alert.alert('Ошибка входа', e.response?.data?.message || 'Проверьте данные и попробуйте снова');
    } finally {
      setLoading(false);
    }
  };

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
            С возвращением
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, textAlign: 'center', marginBottom: 40 }}>
            Войдите в свой аккаунт
          </Text>

          <BlurView tint="dark" intensity={50} style={{ borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', padding: 24, gap: 16 }}>
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
                  autoComplete="email"
                />
              </View>
            </View>

            <View>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 8 }}>ПАРОЛЬ</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 14 }}>
                <Lock size={18} color="rgba(255,255,255,0.3)" />
                <TextInput
                  style={{ flex: 1, color: '#fff', fontSize: 15, paddingVertical: 14, paddingLeft: 10 }}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPass}
                  autoComplete="password"
                />
                <Pressable onPress={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={18} color="rgba(255,255,255,0.3)" /> : <Eye size={18} color="rgba(255,255,255,0.3)" />}
                </Pressable>
              </View>
            </View>

            <Pressable
              onPress={handleLogin}
              disabled={loading}
              style={({ pressed }) => ({
                backgroundColor: loading ? 'rgba(124,58,237,0.5)' : pressed ? 'rgba(124,58,237,0.85)' : 'rgba(124,58,237,1)',
                borderRadius: 18, paddingVertical: 16, alignItems: 'center', marginTop: 4,
              })}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>Войти</Text>}
            </Pressable>
          </BlurView>

          <Pressable onPress={() => router.push('/(auth)/register')} style={{ marginTop: 24, alignItems: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>
              Нет аккаунта? <Text style={{ color: '#A78BFA', fontWeight: '700' }}>Зарегистрироваться</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
