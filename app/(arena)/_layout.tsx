import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ArenaTabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#15A01A', 
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#e5e5e5',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline'; 
          } else if (route.name === 'quadras') {
            iconName = focused ? 'business' : 'business-outline'; 
          } else if (route.name === 'agendamentos') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'perfil') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'alert-circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Aba 1: Início (Dashboard da Arena) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
        }}
      />

      {/* Aba 2: Gestão de Quadras */}
      <Tabs.Screen
        name="quadras"
        options={{
          title: 'Minhas Quadras',
        }}
      />

      {/* Aba 3: Agenda da Arena */}
      <Tabs.Screen
        name="agendamentos" 
        options={{
          title: 'Agenda', 
        }}
      />

      {/* Aba 4: Perfil da Arena */}
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
        }}
      />
    </Tabs>
  );
}