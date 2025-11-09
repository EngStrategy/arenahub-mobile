import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 
export default function TabLayout() {
  // -----------------------------------------------------------------
  // Mude esta variável para testar os dois modos!
  const isLogged = true;
  // -----------------------------------------------------------------

  return (
    <Tabs
      screenOptions={({ route }) => ({
        // Função para definir o ícone de cada aba
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline'; // Início
          } else if (route.name === 'jogos') {
            iconName = focused ? 'globe' : 'globe-outline'; // Jogos Abertos
          } else if (route.name === 'agendamentos') {
            iconName = focused ? 'calendar' : 'calendar-outline'; // Agendamentos
          } else if (route.name === 'perfil') {
            iconName = focused ? 'person' : 'person-outline'; // Perfil
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
        name="jogos"
        options={{
          title: 'Jogos Abertos',
        }}
      />

      {/* --- ABA CONDICIONAL --- */}
      {/* Sempre renderizamos a configuração da aba, 
        mas usamos 'href: null' para escondê-la dinamicamente.
      */}
      <Tabs.Screen
        name="agendamentos"
        options={{
          title: 'Agendamentos',
          href: isLogged ? undefined : null,
        }}
      />

      {/* Aba 3/4: Perfil */}
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
        }}
      />
    </Tabs>
  );
}