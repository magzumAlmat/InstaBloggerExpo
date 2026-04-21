import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import api from '../../src/api/client';
import { Search, UserCheck, ShieldAlert } from 'lucide-react-native';

function UserItem({ item }) {
  return (
    <BlurView tint="dark" intensity={30} style={{ marginHorizontal: 20, marginBottom: 12, borderRadius: 20, overflow: 'hidden', padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        {item.avatar_url && item.avatar_url !== '/uploads/avatars/default.jpg' ? (
          <Image source={{ uri: `http://172.20.10.7:3000${item.avatar_url}` }} style={{ width: 50, height: 50, borderRadius: 25 }} />
        ) : (
          <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24 }}>👤</Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>@{item.ig_username || 'user'}</Text>
            {item.is_verified && <UserCheck size={14} color="#34D399" />}
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 2 }}>{item.role === 'BRAND' ? 'Бренд' : 'Блогер'} • {item.category || 'Без категории'}</Text>
        </View>
        <ShieldAlert size={20} color="rgba(255,255,Settings.255,0.15)" />
      </View>
    </BlurView>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      // In a real app, I'd create a specific admin user list endpoint
      // For now, I'll use the discovery endpoint as a fallback or a mock
      // Since I don't have a dedicated admin users list API yet, I'll assume one exists or mock it.
      // Re-using discovery bloggers/brands is an option but might be filtered.
      const res = await api.get('/admin/dashboard'); // Just to reuse auth check, then I'll add a user endpoint
      // Let's assume there is /api/admin/users
      // await api.get('/admin/users');
      setUsers([]); // Placeholder
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchUsers(); }, []));

  if (loading && !refreshing) {
    return <View style={{ flex: 1, backgroundColor: '#0A061E', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color="#60A5FA" size="large" /></View>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0A061E' }}>
      <View style={{ paddingTop: 110, paddingHorizontal: 20 }}>
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 20 }}>База пользователей</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,Settings.255,0.1)' }}>
          <Search size={18} color="rgba(255,255,255,0.3)" />
          <TextInput 
            placeholder="Поиск по никнейму..." 
            placeholderTextColor="rgba(255,255,Settings.255,0.3)" 
            style={{ flex: 1, marginLeft: 10, color: '#fff', fontSize: 15 }}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>
      
      <FlatList 
        data={users}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <UserItem item={item} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchUsers(); }} tintColor="#60A5FA" />}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Text style={{ fontSize: 48 }}>🔍</Text>
            <Text style={{ color: 'rgba(255,255,255,0.4)', marginTop: 12 }}>Список пуст или не реализован</Text>
          </View>
        }
      />
    </View>
  );
}
