import { Link, Stack } from 'expo-router';
import { View, Text, Pressable } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Не найдено', headerStyle: { backgroundColor: '#0A061E' }, headerTintColor: '#fff' }} />
      <View style={{ flex: 1, backgroundColor: '#0A061E', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 20 }}>
        <Text style={{ fontSize: 72, fontWeight: '800' }}>🌌</Text>
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800', textAlign: 'center', letterSpacing: -0.5 }}>
          Страница не найдена
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, textAlign: 'center', lineHeight: 24 }}>
          Страница, которую вы ищете, не существует или была перемещена.
        </Text>
        <Link href="/" asChild>
          <Pressable style={{ backgroundColor: 'rgba(124,58,237,0.3)', borderRadius: 18, paddingVertical: 14, paddingHorizontal: 32, borderWidth: 1, borderColor: 'rgba(167,139,250,0.4)' }}>
            <Text style={{ color: '#C4B5FD', fontWeight: '700', fontSize: 16 }}>На главную</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}
