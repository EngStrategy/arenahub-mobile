import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
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
      screenOptions={{
      tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      // Disable the static render of the header on web
      // to prevent a hydration error in React Navigation v6.
      headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
      name="index"
      options={{
        title: 'Editar dados',
        tabBarIcon: ({ color }) => <TabBarIcon name="lock" color={color} />,
        href:
        role === ' ARENA'
          ? '/editar-arena'
          : role === 'ATLETA'
          ? '/editar-atleta'
          : '/editar-arena',
      }}
      />
      <Tabs.Screen
      name="two"
      options={{
        title: 'Alterar senha',
        tabBarIcon: ({ color }) => <TabBarIcon name="check" color={color} />,
        href: '/alterar-senha',
      }}
      />
      <Tabs.Screen
      name="three"
      options={{
        title: 'Resetar senha',
        tabBarIcon: ({ color }) => <TabBarIcon name="lock" color={color} />,
        href: '/forgot-password/reset-password'
      }}
      />
    </Tabs>
  );
}
