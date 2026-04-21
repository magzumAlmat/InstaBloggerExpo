import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import api from '../../src/api/client';
import { CheckCircle, XCircle } from 'lucide-react-native';

function RequestCard({ connection, onAccept, router }) {
  const blogger = connection.blogger;
  if (!blogger) return null;

  return (
    <BlurView tint="dark" intensity={40} style={{ borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', padding: 16, marginHorizontal: 20, marginBottom: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        {blogger.avatar_url && blogger.avatar_url !== '/uploads/avatars/default.jpg' ? (
          <Image source={{ uri: `http://172.20.10.7:3000${blogger.avatar_url}` }} style={{ width: 56, height: 56, borderRadius: 28 }} />
        ) : (
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#2d2d2d', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 24 }}>✨</Text></View>
        )}

        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>@{blogger.ig_username}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 2 }}>{blogger.category}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
        <Pressable
          // Pass direction 'DISLIKE' or ignore in a real app
          style={({ pressed }) => ({
            flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 14,
            backgroundColor: pressed ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.15)',
            borderWidth: 1, borderColor: 'rgba(239,68,68,0.4)',
          })}
        >
          <XCircle size={16} color="#EF4444" />
          <Text style={{ color: '#EF4444', fontWeight: '700', fontSize: 14 }}>Отклонить</Text>
        </Pressable>
        <Pressable
          onPress={() => onAccept(connection.id)}
          style={({ pressed }) => ({
            flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 14,
            backgroundColor: pressed ? 'rgba(52,211,153,0.3)' : 'rgba(52,211,153,0.2)',
            borderWidth: 1, borderColor: 'rgba(52,211,153,0.4)',
          })}
        >
          <CheckCircle size={16} color="#34D399" />
          <Text style={{ color: '#34D399', fontWeight: '700', fontSize: 14 }}>Авторизовать</Text>
        </Pressable>
      </View>
    </BlurView>
  );
}

export default function NotificationsScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchRequests = async () => {
    try {
      const res = await api.get('/connections/requests');
      setRequests(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { setLoading(true); fetchRequests(); }, []));

  const acceptRequest = async (id) => {
    try {
      await api.post(`/connections/${id}/accept`);
      setRequests(prev => prev.filter(r => r.id !== id));
      // Optionally route to connections or open chat
      router.push('/connections');
    } catch (e) {
      console.error(e);
    }
  };

  const onRefresh = () => { setRefreshing(true); fetchRequests(); };

  if (loading && !refreshing) {
    return <View style={{ flex: 1, backgroundColor: '#0A061E', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color="#60A5FA" size="large" /></View>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0A061E', paddingTop: 100 }}>
      {requests.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Text style={{ fontSize: 56 }}>🔔</Text>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800', textAlign: 'center', marginTop: 20, lineHeight: 28 }}>Нет новых запросов</Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, textAlign: 'center', marginTop: 8, lineHeight: 22 }}>Когда блогеры запросят авторизацию, они появятся здесь.</Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <RequestCard connection={item} onAccept={acceptRequest} router={router} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#60A5FA" />}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
