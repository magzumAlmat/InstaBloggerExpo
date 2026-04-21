import React from 'react';
import { ScrollView, Pressable, useWindowDimensions, View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Plus, Star, Wallet, Bell, Briefcase, Zap, TrendingUp, ArrowUpRight } from 'lucide-react-native';

const PURPLE = '#7C3AED';
const BLUE = '#2563EB';
const PINK = '#DB2777';

const GlassCard = ({ children, style }) => (
  <BlurView
    tint="dark"
    intensity={40}
    style={[
      {
        borderRadius: 28,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
      },
      style,
    ]}
  >
    {children}
  </BlurView>
);

export default function TabOneScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 52) / 2;

  const tap = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  const actions = [
    { label: 'New Post', icon: Plus, color: '#A78BFA', bg: 'rgba(167,139,250,0.18)' },
    { label: 'Deals', icon: Briefcase, color: '#60A5FA', bg: 'rgba(96,165,250,0.18)' },
    { label: 'Stats', icon: TrendingUp, color: '#FBBF24', bg: 'rgba(251,191,36,0.18)' },
    { label: 'Reviews', icon: Star, color: '#F472B6', bg: 'rgba(244,114,182,0.18)' },
  ];

  const activities = [
    { title: 'Deal accepted', sub: 'Nike — Sponsored Post', time: '2m ago', icon: Zap, color: '#A78BFA' },
    { title: 'New Invitation', sub: 'Apple Watch Campaign', time: '1h ago', icon: Bell, color: '#60A5FA' },
    { title: 'Payment Received', sub: '$320 from Adidas', time: '3h ago', icon: Wallet, color: '#34D399' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require('../../assets/images/background.png')}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        contentFit="cover"
      />
      {/* Dark overlay for better readability */}
      <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(10,6,30,0.55)' }} />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 20, paddingTop: 68, paddingBottom: 120, gap: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, fontWeight: '500', letterSpacing: 0.5 }}>
              Good morning 👋
            </Text>
            <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginTop: 4 }}>
              Dashboard
            </Text>
          </View>
          <Pressable onPress={tap}>
            <BlurView tint="dark" intensity={50} style={{ borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' }}>
              <View style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={20} color="#fff" />
              </View>
            </BlurView>
          </Pressable>
        </View>

        {/* Main Earnings Card */}
        <GlassCard>
          <View style={{ padding: 24, gap: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ gap: 6 }}>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                  Total Earnings
                </Text>
                <Text style={{ color: '#fff', fontSize: 38, fontWeight: '800', letterSpacing: -1, fontVariant: ['tabular-nums'] }}>
                  $4,280.50
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <ArrowUpRight size={14} color="#34D399" />
                  <Text style={{ color: '#34D399', fontSize: 13, fontWeight: '600' }}>+12.4% this month</Text>
                </View>
              </View>
              <View style={{ backgroundColor: 'rgba(124,58,237,0.25)', width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(167,139,250,0.3)' }}>
                <Wallet size={24} color="#A78BFA" />
              </View>
            </View>

            <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.08)' }} />

            <View style={{ flexDirection: 'row' }}>
              {[
                { label: 'Engagement', value: '8.4%', color: '#60A5FA' },
                { label: 'Active Deals', value: '12', color: '#FBBF24' },
                { label: 'Followers', value: '24.5K', color: '#F472B6' },
              ].map((stat, i) => (
                <View key={i} style={{ flex: 1, alignItems: i === 1 ? 'center' : i === 2 ? 'flex-end' : 'flex-start' }}>
                  <Text style={{ color: stat.color, fontSize: 18, fontWeight: '800', fontVariant: ['tabular-nums'] }}>{stat.value}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '600', marginTop: 2 }}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </GlassCard>

        {/* Quick Actions */}
        <View>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
            Quick Actions
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {actions.map((action, i) => (
              <Pressable
                key={i}
                onPress={tap}
                style={({ pressed }) => ([{ width: cardWidth, opacity: pressed ? 0.75 : 1 }])}
              >
                <GlassCard style={{ height: 110 }}>
                  <View style={{ flex: 1, padding: 18, justifyContent: 'space-between' }}>
                    <View style={{ width: 44, height: 44, borderRadius: 15, backgroundColor: action.bg, alignItems: 'center', justifyContent: 'center' }}>
                      <action.icon size={22} color={action.color} />
                    </View>
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>{action.label}</Text>
                  </View>
                </GlassCard>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' }}>
              Recent Activity
            </Text>
            <Pressable onPress={tap}>
              <Text style={{ color: '#A78BFA', fontSize: 13, fontWeight: '700' }}>View All</Text>
            </Pressable>
          </View>

          {activities.map((item, i) => (
            <Pressable key={i} onPress={tap} style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}>
              <GlassCard>
                <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <View style={{ width: 46, height: 46, borderRadius: 16, backgroundColor: `${item.color}22`, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: `${item.color}44` }}>
                    <item.icon size={20} color={item.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>{item.title}</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>{item.sub}</Text>
                  </View>
                  <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: '600' }}>{item.time}</Text>
                </View>
              </GlassCard>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
