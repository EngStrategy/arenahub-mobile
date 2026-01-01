import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'jogos-abertos') {
            iconName = focused ? 'globe' : 'globe-outline'; 
          } else if (route.name === 'agendamentos') {
            iconName = focused ? 'calendar' : 'calendar-outline'; 
          } else if (route.name === 'perfil') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'alert-circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#15A01A',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerShown: false,
      })}
    >
      {/* Aba 1: Início */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
        }}
      />

      {/* Aba 2: Jogos Abertos */}
      <Tabs.Screen
        name="jogos-abertos"
        options={{
          title: 'Jogos Abertos',
        }}
      />

      {/* Aba 3: Agendamentos de atleta */}
      <Tabs.Screen
        name="agendamentos" 
        options={{
          title: 'Agendamentos', 
        }}
      />

      {/* Aba 4: Perfil de atleta */}
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil'
        }}
      />
    </Tabs>
  );
}