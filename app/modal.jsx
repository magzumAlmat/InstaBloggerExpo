import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { Link } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function ModalScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(10,6,30,0.85)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <BlurView
        tint="dark"
        intensity={60}
        style={{
          width: '100%',
          borderRadius: 32,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.12)',
        }}
      >
        <View style={{ padding: 28, gap: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff', letterSpacing: -0.5 }}>О приложении</Text>
          <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.08)' }} />
          <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 24 }}>
            Это ваше приложение InstaBlogger — премиальная платформа для инфлюенсеров, позволяющая управлять сделками, отслеживать доходы и развивать свой бренд.
          </Text>
          <View style={{ marginTop: 8 }}>
            {['Expo SDK 53', 'expo-router v3', 'expo-blur', 'JavaScript'].map((tech, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#A78BFA' }} />
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: '500' }}>{tech}</Text>
              </View>
            ))}
          </View>
          <Link href="/" asChild>
            <Pressable style={{ marginTop: 8, backgroundColor: 'rgba(124,58,237,0.3)', borderRadius: 16, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(167,139,250,0.4)' }}>
              <Text style={{ color: '#C4B5FD', fontWeight: '700', fontSize: 15 }}>← На главную</Text>
            </Pressable>
          </Link>
        </View>
      </BlurView>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}
