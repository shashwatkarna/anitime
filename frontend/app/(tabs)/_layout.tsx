import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = Colors.dark.primary;
  const inactiveColor = '#666';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: 'rgba(20,20,20,0.95)',
            borderTopWidth: 0,
            bottom: 20,
            left: 20,
            right: 20,
            borderRadius: 30,
            height: 60,
            paddingBottom: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
          },
          default: {
            backgroundColor: '#161616',
            borderTopWidth: 0,
            height: 60,
            paddingBottom: 10,
            paddingTop: 10,
            elevation: 0,
          },
        }),
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: Platform.OS === 'ios' ? 10 : 0 }}>
              <IconSymbol size={28} name={focused ? "house.fill" : "house"} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: Platform.OS === 'ios' ? 10 : 0 }}>
              <IconSymbol size={28} name={focused ? "paperplane.fill" : "paperplane"} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
