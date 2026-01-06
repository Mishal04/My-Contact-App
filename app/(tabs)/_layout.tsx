import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Expo built-in icons

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4CAF50', // active tab color
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: {
          backgroundColor: '#1f1f1f',
          borderTopColor: '#333',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
