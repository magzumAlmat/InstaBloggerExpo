import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import api from '../../src/api/client';
import { MessageCircle, Star } from 'lucide-react-native';

function ConnectionCard({ connection, router }) {
  const blogger = connection.blogger;
  if (!blogger) return null;

  return (
    <Pressable
      onPress={() => router.push(`/messages/${connection.id}?type=CONNECTION`)}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
        marginBottom: 14,
        marginHorizontal: 20
      })}
    >
      <BlurView tint="dark" intensity={40} style={{ borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          {blogger.avatar_url && blogger.avatar_url !== '/uploads/avatars/default.jpg' ? (
            <Image source={{ uri: `http://172.20.10.7:3000${blogger.avatar_url}` }} style={{ width: 56, height: 56, borderRadius: 28 }} />
          ) : (
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#2d2d2d', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 24 }}>✨</Text>
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>@{blogger.ig_username}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 2 }}>{blogger.category}</Text>
          </View>

          <View style={{ backgroundColor: 'rgba(52,211,153,0.15)', width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}>
            <MessageCircle size={20} color="#34D399" />
          </View>
        </View>
      </BlurView>
    </Pressable>
  );
}

export default function ConnectionsScreen() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchConnections = async () => {
    try {
      const res = await api.get('/connections');
      setConnections(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { setLoading(true); fetchConnections(); }, []));

  const onRefresh = () => { setRefreshing(true); fetchConnections(); };

  if (loading && !refreshing) {
    return <View style={{ flex: 1, backgroundColor: '#0A061E', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color="#60A5FA" size="large" /></View>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0A061E', paddingTop: 100 }}>
      {connections.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Text style={{ fontSize: 56 }}>💬</Text>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800', textAlign: 'center', marginTop: 20, lineHeight: 28 }}>Нет авторизованных партнеров</Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, textAlign: 'center', marginTop: 8, lineHeight: 22 }}>Взаимные свайпы появятся здесь, и вы сможете начать чат.</Text>
        </View>
      ) : (
        <FlatList
          data={connections}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <ConnectionCard connection={item} router={router} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#60A5FA" />}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
