import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams } from 'expo-router';
import api from '../../src/api/client';
import { useAuth } from '../../src/context/AuthContext';
import { Send } from 'lucide-react-native';

function MessageBubble({ msg, isMe }) {
  return (
    <View style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '78%', marginBottom: 12 }}>
      {!isMe && (
        <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginBottom: 4, marginLeft: 4 }}>
          @{msg.sender?.ig_username}
        </Text>
      )}
      <View style={{
        backgroundColor: isMe ? '#7C3AED' : 'rgba(255,255,255,0.08)',
        borderRadius: 18,
        borderBottomRightRadius: isMe ? 4 : 18,
        borderBottomLeftRadius: isMe ? 18 : 4,
        paddingHorizontal: 16, paddingVertical: 11,
        borderWidth: 1,
        borderColor: isMe ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.08)',
      }}>
        <Text style={{ color: '#fff', fontSize: 15, lineHeight: 22 }}>{msg.content}</Text>
      </View>
      <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, marginTop: 4, alignSelf: isMe ? 'flex-end' : 'flex-start', marginRight: 4, marginLeft: 4 }}>
        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
}

export default function MessagesScreen() {
  const { id: targetId, type } = useLocalSearchParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const endpoint = type === 'CONNECTION' 
        ? `/messages/connection/${targetId}` 
        : `/messages/deal/${targetId}`;
      const res = await api.get(endpoint);
      setMessages(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [targetId, type]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    const content = text.trim();
    setText('');
    setSending(true);
    try {
      await api.post('/messages', { 
        targetId, 
        targetType: type === 'CONNECTION' ? 'CONNECTION' : 'DEAL', 
        content 
      });
      fetchMessages();
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <View style={{ flex: 1, backgroundColor: '#0A061E', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color="#A78BFA" size="large" /></View>;
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#0A061E' }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => String(m.id)}
        contentContainerStyle={{ padding: 20, paddingBottom: 10 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => <MessageBubble msg={item} isMe={item.sender_id === user?.id} />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Text style={{ fontSize: 38 }}>💬</Text>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, marginTop: 12 }}>Начните диалог</Text>
          </View>
        }
      />

      {/* Input Bar */}
      <BlurView tint="dark" intensity={80} style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, paddingBottom: Platform.OS === 'ios' ? 28 : 12, gap: 12 }}>
          <TextInput
            style={{
              flex: 1, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 20, paddingHorizontal: 16,
              paddingVertical: 12, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
            }}
            placeholder="Введите сообщение..."
            placeholderTextColor="rgba(255,255,255,0.25)"
            value={text}
            onChangeText={setText}
            multiline
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <Pressable
            onPress={handleSend}
            disabled={sending || !text.trim()}
            style={({ pressed }) => ({
              width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
              backgroundColor: text.trim() ? '#7C3AED' : 'rgba(124,58,237,0.25)',
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Send size={20} color={text.trim() ? '#fff' : 'rgba(255,255,255,0.3)'} />
          </Pressable>
        </View>
      </BlurView>
    </KeyboardAvoidingView>
  );
}
