import React from 'react';
import { Tabs } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
export default function TabLayout() {
  // -----------------------------------------------------------------
  // Mude esta variável para testar os dois modos!
  const isLogged = true;
  // -----------------------------------------------------------------

  const [role, setRole] = React.useState<string | null>(null);

  const getUserRole = async () => {
    const userDataString = await AsyncStorage.getItem('userData');
    if (!userDataString) throw new Error('Usuário não encontrado');
    const userData = JSON.parse(userDataString);
    return userData.role;
  };

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await getUserRole();
        if (mounted) setRole(r);
      } catch {
        if (mounted) setRole(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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
          title: 'Quadras',
          href: "/cadastrar-quadra",
        }}
      />

      {/* Aba 3/4: Perfil */}
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          // href: '/editar-arena',
          href:
            role === ' ARENA'
              ? '/editar-arena'
              : role === 'ATLETA'
                ? '/editar-atleta'
                : '/editar-arena',
        }}
      />
    </Tabs>
  );
}